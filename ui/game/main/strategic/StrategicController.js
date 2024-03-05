import ControllerBase from "wgge/core/controller/ControllerBase";
import MenuItemModel from "wgge/game/menu/item/MenuItemModel";
import Vector2 from "wgge/core/model/vector/Vector2";
import AnimationRotationVector2Controller from "wgge/core/controller/AnimationRotationVector2Controller";
import ArrayHelper from "wgge/core/helper/ArrayHelper";
import Rotation from "wgge/core/model/vector/Rotation";
import AnimationFloatController from "wgge/core/controller/AnimationFloatController";
import WorldConstants from "../../util/WorldConstants";
import NumberHelper from "wgge/core/helper/NumberHelper";
import {EVENT_LEFT_CLICK} from "wgge/game/controls/ControlsModel";
import SwitchController from "wgge/core/renderer/generic/SwitchController";
import ScannerPanelController from "./scanner/ScannerPanelController";
import {INTERIOR_TYPE_RESEARCH} from "../MainModel";

export default class StrategicController extends ControllerBase {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.cruisingAnimation = null;
		this.altitudeAnimation = null;
		this.cameraAnimation = null;
		this.cityMenuItem = null;

		this.coordinatesBound = false;
		this.altitudeBound = false;

		this.lastMouseCoordinates = null;

		this.addChild(
			new SwitchController(
				this.game,
				this.model,
				this.model.main.strategic.selectedStrategicPanel,
				{
					'scanner': () => new ScannerPanelController(this.game, this.model)
				}
			)
		);

		this.addAutoEvent(
			this.game.controls,
			'zoom',
			(z) => this.onZoom(z)
		);

		this.addAutoEvent(
			this.game.controls.mouseCoordinates,
			'change',
			() => this.onMouseMove()
		);

		this.addAutoEvent(
			this.game.controls.mouseDownLeft,
			'change',
			() => this.onMouseLeft()
		);

		this.addAutoEvent(
			this.model.main.globe.cities,
			'change',
			() => this.changeTargetCity(),
			true
		);

		this.addAutoEvent(
			this.model.main.globe.cursorAtCity,
			'change',
			() => this.cursorCityChanged(),
			true
		);

		this.addAutoEvent(
			this.model.main.strategic.cameraFollowing,
			'change',
			() => this.updateCameraFollowing(),
			true
		);

		this.addAutoEvent(
			this.model.main.globe.ufo.ufoCoordinates,
			'change',
			() => this.followCoordinates()
		);

		this.addAutoEvent(
			this.model.main.globe.ufo.ufoAltitude,
			'change',
			() => this.followAltitude()
		);

		this.addAutoEvent(
			this.model.main.globe,
			'change',
			() => this.followAltitude()
		);

		this.addAutoEvent(
			this.game.controls,
			EVENT_LEFT_CLICK,
			() => this.onClick()
		);

	}

	activateInternal() {
		this.model.main.mainInfoPanel.menu.items.reset();
		this.model.main.mainInfoPanel.menu.items.add(new MenuItemModel('Research', () => this.model.main.interiorType.set(INTERIOR_TYPE_RESEARCH)));

		const exploreMenu = this.model.main.strategic.cruiseExploreMenu;
		exploreMenu.items.reset();
		exploreMenu.items.add(new MenuItemModel('NORTH', () => this.moveBy(new Vector2(0, 0.1))));
		exploreMenu.items.add(new MenuItemModel('SOUTH', () => this.moveBy(new Vector2(0, -0.1))));
		exploreMenu.items.add(new MenuItemModel('EAST', () => this.moveBy(new Vector2(0.1, 0))));
		exploreMenu.items.add(new MenuItemModel('WEST', () => this.moveBy(new Vector2(-0.1, 0))));

		const altMenu = this.model.main.strategic.cruiseAltitudeMenu;
		altMenu.items.reset();
		altMenu.items.add(new MenuItemModel('UP', () => this.changeAltitude(0.5)));
		altMenu.items.add(new MenuItemModel('DOWN', () => this.changeAltitude(-0.5)));
		this.followMenuItem = altMenu.items.add(new MenuItemModel('Follow', () => this.triggerFollow()));

		const cityMenu = this.model.main.strategic.cruiseCityMenu;
		cityMenu.items.reset();

		const scannerMenu = this.model.main.strategic.toggleScannerMenu;
		scannerMenu.items.reset();
		scannerMenu.items.add(new MenuItemModel('Scanner', () => {
			this.model.main.strategic.selectedStrategicPanel.set(
				this.model.main.strategic.selectedStrategicPanel.equalsTo('scanner') ? 'none' : 'scanner')
		}));
	}

	triggerFollow() {
		this.model.main.strategic.cameraFollowing.invert();
	}

	updateCameraFollowing() {
		const following = this.model.main.strategic.cameraFollowing.get();
		this.followMenuItem.isActive.set(following);
		this.updateCameraFollowingCoordinates(following);
		this.updateCameraFollowingAltitude(following);
	}

	followCoordinates() {
		if (this.model.main.strategic.cameraFollowing.get() && this.coordinatesBound) {
			this.model.main.globe.cameraCoordinates.set(this.model.main.globe.ufo.ufoCoordinates);
		}
	}

	updateCameraFollowingCoordinates(following) {
		if (this.cameraAnimation) this.cameraAnimation.removeMyself();

		if (!following) {
			this.coordinatesBound = false;
			return;
		}

		const target = this.model.main.globe.ufo.ufoCoordinates;
		const distance = this.model.main.globe.cameraCoordinates.subtract(target).size();

		if (distance <= 0.02 || this.coordinatesBound) {
			this.coordinatesBound = true;
			return;
		}

		const SPEED = distance < 0.5 ? 1 : 2;
		const duration = distance / SPEED;
		this.cameraAnimation = this.addChild(
			new AnimationRotationVector2Controller(
				this.game,
				this.model.main.globe.cameraCoordinates,
				target,
				duration * 1000
			).onFinished(() => {
				this.updateCameraFollowing();
				this.cameraAnimation = null;
			})
		);
	}

	findRandomCity() {
		const len = this.model.main.globe.cities.count();
		if (len === 0) return null;
		return this.model.main.globe.cities.get(ArrayHelper.randomIndex(len));
	}

	changeTargetCity() {
		const city = this.findRandomCity();
		if (city) {
			const menu = this.model.main.strategic.cruiseCityMenu;
			if (this.cityMenuItem) {
				menu.items.remove(this.cityMenuItem);
			}
			this.cityMenuItem = menu.items.add(new MenuItemModel(city.name.get(), () => this.cruiseToCity(city)));
		}
	}

	moveBy(diff) {
		this.cruiseTo(this.model.main.globe.ufo.ufoCoordinates.add(diff));
	}

	cruiseToCity(city) {
		this.cruiseTo(
			new Vector2(
				Rotation.degToRad(city.coordinates.x),
				Rotation.degToRad(city.coordinates.y)
			)
		);
	}

	cruiseTo(target) {
		if (this.cruisingAnimation && this.cruisingAnimation.isActivated) {
			this.removeChild(this.cruisingAnimation);
		}
		const SPEED = 0.1;
		const distance = this.model.main.globe.ufo.ufoCoordinates.subtract(target).size();
		if (distance <= 0) return;
		const duration = distance / SPEED;
		this.cruisingAnimation = this.addChild(
			new AnimationRotationVector2Controller(
				this.game,
				this.model.main.globe.ufo.ufoCoordinates,
				target,
				duration * 1000
			).onFinished(() => {
				this.cruisingAnimation = null;
				this.changeTargetCity();
			})
		);
		this.updateCameraFollowing();
	}

	changeAltitude(diff) {
		this.altitudeTo(this.model.main.globe.ufo.ufoAltitude.get() + diff);
	}

	altitudeTo(target) {
		if (this.altitudeAnimation && this.altitudeAnimation.isActivated) {
			this.removeChild(this.altitudeAnimation);
		}
		target = Math.max(WorldConstants.UFO_MIN_ALTITUDE, target);
		const SPEED = 1;
		const distance = Math.abs(this.model.main.globe.ufo.ufoAltitude.get() - target);
		if (distance <= 0) return;
		const duration = distance / SPEED;
		this.altitudeAnimation = this.addChild(
			new AnimationFloatController(
				this.game,
				this.model.main.globe.ufo.ufoAltitude,
				target,
				duration * 1000
			).onFinished(() => this.altitudeAnimation = null)
		);

	}

	getCameraAltitude() {
		return this.model.main.globe.ufo.ufoAltitude.get() + WorldConstants.UFO_CAMERA_DISTANCE;
	}

	followAltitude() {
		if (this.model.main.strategic.cameraFollowing.get() && this.altitudeBound) {
			this.model.main.globe.cameraDistance.set(this.getCameraAltitude());
		}
	}

	updateCameraFollowingAltitude(following) {
		if (this.altitudeAnimation) this.altitudeAnimation.removeMyself();

		if (!following) {
			this.altitudeBound = false;
			return;
		}

		const target = this.getCameraAltitude();
		const distance = Math.abs(this.model.main.globe.cameraDistance.get() - target);

		if (distance <= 0.02 || this.altitudeBound) {
			this.altitudeBound = true;
			return;
		}

		const SPEED = distance < 1 ? 1 : 2;
		const duration = distance / SPEED;
		this.altitudeAnimation = this.addChild(
			new AnimationFloatController(
				this.game,
				this.model.main.globe.cameraDistance,
				target,
				duration * 1000
			).onFinished(() => {
				this.updateCameraFollowing();
				this.altitudeAnimation = null;
			})
		);
	}

	onZoom(z) {
		this.model.main.strategic.cameraFollowing.set(false);
		this.model.main.globe.cameraDistance.increase(z > 0 ? 1 : -1);
		this.model.main.globe.cameraDistance.set(
			NumberHelper.between(
				WorldConstants.MIN_DISTANCE_RADIUS,
				WorldConstants.MAX_DISTANCE_RADIUS,
				this.model.main.globe.cameraDistance.get()
			)
		);
	}

	onMouseMove() {
		if (this.game.controls.mouseDownLeft.get()) {
			if (this.lastMouseCoordinates) {
				this.model.main.strategic.cameraFollowing.set(false);
				const ROTATION_SPEED = 0.002;
				const mouseDiff = this.game.controls.mouseCoordinates.subtract(this.lastMouseCoordinates);
				const rotationDiff = mouseDiff.multiply(ROTATION_SPEED);
				rotationDiff.set(-rotationDiff.x, rotationDiff.y);
				const rotation = this.model.main.globe.cameraCoordinates.add(rotationDiff);
				this.model.main.globe.cameraCoordinates.set(
					new Rotation(rotation.x).get(),
					NumberHelper.between(-Math.PI / 2, Math.PI / 2, rotation.y)
				);
			}
			this.lastMouseCoordinates = this.game.controls.mouseCoordinates.clone();
		}
	}

	onMouseLeft() {
		if (this.game.controls.mouseDownLeft.get()) {
			this.lastMouseCoordinates = this.game.controls.mouseCoordinates;
		} else {
			this.lastMouseCoordinates = null;
		}
	}

	cursorCityChanged() {
		if (this.cursorCityMenuItem) {
			this.model.main.strategic.cruiseCityMenu.items.remove(this.cursorCityMenuItem);
		}
		if (this.model.main.globe.cursorAtCity.isSet()) {
			const city = this.model.main.globe.cursorAtCity.get();
			this.cursorCityMenuItem = this.model.main.strategic.cruiseCityMenu.items.add(
				new MenuItemModel(city.name.get(), () => this.cruiseToCity(city))
			)
		}
	}

	onClick() {
		if (this.model.main.globe.cursorAtCity.isSet()) {
			this.cruiseToCity(this.model.main.globe.cursorAtCity.get());
			return;
		}
		if (this.model.main.globe.cursorAtGlobe.isSet()) {
			this.cruiseTo(this.model.main.globe.cursorAtGlobe.get());
		}
	}
}
