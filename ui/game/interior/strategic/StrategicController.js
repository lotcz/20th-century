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
import ScannerPanelController from "./right/scanner/ScannerPanelController";
import ResearchPanelController from "./left/research/ResearchPanelController";
import CruisePanelController from "./right/cruise/CruisePanelController";
import InfoPanelController from "./left/info/InfoPanelController";

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
				this.model.strategic.selectedPanelLeft,
				{
					'info': () => new InfoPanelController(this.game, this.model),
					'research': () => new ResearchPanelController(this.game, this.model)
				}
			)
		);

		this.addChild(
			new SwitchController(
				this.game,
				this.model,
				this.model.strategic.selectedPanelRight,
				{
					'cruise': () => new CruisePanelController(this.game, this.model),
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
			this.model.globe.cities,
			'change',
			() => this.changeTargetCity(),
			true
		);

		this.addAutoEvent(
			this.model.globe.cursorAtCity,
			'change',
			() => this.cursorCityChanged(),
			true
		);

		this.addAutoEvent(
			this.model.strategic.cameraFollowing,
			'change',
			() => this.updateCameraFollowing(),
			true
		);

		this.addAutoEvent(
			this.model.globe.ufo.ufoCoordinates,
			'change',
			() => this.followCoordinates()
		);

		this.addAutoEvent(
			this.model.globe.ufo.ufoAltitude,
			'change',
			() => this.followAltitude()
		);

		this.addAutoEvent(
			this.model.globe,
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
		const exploreMenu = this.model.strategic.cruisePanel.cruiseExploreMenu;
		exploreMenu.items.reset();
		exploreMenu.items.add(new MenuItemModel('NORTH', () => this.moveBy(new Vector2(0, 0.1))));
		exploreMenu.items.add(new MenuItemModel('SOUTH', () => this.moveBy(new Vector2(0, -0.1))));
		exploreMenu.items.add(new MenuItemModel('EAST', () => this.moveBy(new Vector2(0.1, 0))));
		exploreMenu.items.add(new MenuItemModel('WEST', () => this.moveBy(new Vector2(-0.1, 0))));

		const altMenu = this.model.strategic.cruisePanel.cruiseAltitudeMenu;
		altMenu.items.reset();
		altMenu.items.add(new MenuItemModel('UP', () => this.changeAltitude(0.5)));
		altMenu.items.add(new MenuItemModel('DOWN', () => this.changeAltitude(-0.5)));
		this.followMenuItem = altMenu.items.add(new MenuItemModel('Follow', () => this.triggerFollow()));

		const cityMenu = this.model.strategic.cruisePanel.cruiseCityMenu;
		cityMenu.items.reset();


	}

	triggerFollow() {
		this.model.strategic.cameraFollowing.invert();
	}

	updateCameraFollowing() {
		const following = this.model.strategic.cameraFollowing.get();
		this.followMenuItem.isActive.set(following);
		this.updateCameraFollowingCoordinates(following);
		this.updateCameraFollowingAltitude(following);
	}

	followCoordinates() {
		if (this.model.strategic.cameraFollowing.get() && this.coordinatesBound) {
			this.model.globe.cameraCoordinates.set(this.model.globe.ufo.ufoCoordinates);
		}
	}

	updateCameraFollowingCoordinates(following) {
		if (this.cameraAnimation) this.cameraAnimation.removeMyself();

		if (!following) {
			this.coordinatesBound = false;
			return;
		}

		const target = this.model.globe.ufo.ufoCoordinates;
		const distance = this.model.globe.cameraCoordinates.subtract(target).size();

		if (distance <= 0.02 || this.coordinatesBound) {
			this.coordinatesBound = true;
			return;
		}

		const SPEED = distance < 0.5 ? 1 : 2;
		const duration = distance / SPEED;
		this.cameraAnimation = this.addChild(
			new AnimationRotationVector2Controller(
				this.game,
				this.model.globe.cameraCoordinates,
				target,
				duration * 1000
			).onFinished(() => {
				this.updateCameraFollowing();
				this.cameraAnimation = null;
			})
		);
	}

	findRandomCity() {
		const len = this.model.globe.cities.count();
		if (len === 0) return null;
		return this.model.globe.cities.get(ArrayHelper.randomIndex(len));
	}

	changeTargetCity() {
		const city = this.findRandomCity();
		if (city) {
			const menu = this.model.strategic.cruisePanel.cruiseCityMenu;
			if (this.cityMenuItem) {
				menu.items.remove(this.cityMenuItem);
			}
			this.cityMenuItem = menu.items.add(new MenuItemModel(city.name.get(), () => this.cruiseToCity(city)));
		}
	}

	moveBy(diff) {
		this.cruiseTo(this.model.globe.ufo.ufoCoordinates.add(diff));
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
		const distance = this.model.globe.ufo.ufoCoordinates.subtract(target).size();
		if (distance <= 0) return;
		const duration = distance / SPEED;
		this.cruisingAnimation = this.addChild(
			new AnimationRotationVector2Controller(
				this.game,
				this.model.globe.ufo.ufoCoordinates,
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
		this.altitudeTo(this.model.globe.ufo.ufoAltitude.get() + diff);
	}

	altitudeTo(target) {
		if (this.altitudeAnimation && this.altitudeAnimation.isActivated) {
			this.removeChild(this.altitudeAnimation);
		}
		target = Math.max(WorldConstants.UFO_MIN_ALTITUDE, target);
		const SPEED = 1;
		const distance = Math.abs(this.model.globe.ufo.ufoAltitude.get() - target);
		if (distance <= 0) return;
		const duration = distance / SPEED;
		this.altitudeAnimation = this.addChild(
			new AnimationFloatController(
				this.game,
				this.model.globe.ufo.ufoAltitude,
				target,
				duration * 1000
			).onFinished(() => this.altitudeAnimation = null)
		);

	}

	getCameraAltitude() {
		return this.model.globe.ufo.ufoAltitude.get() + WorldConstants.UFO_CAMERA_DISTANCE;
	}

	followAltitude() {
		if (this.model.strategic.cameraFollowing.get() && this.altitudeBound) {
			this.model.globe.cameraDistance.set(this.getCameraAltitude());
		}
	}

	updateCameraFollowingAltitude(following) {
		if (this.altitudeAnimation) this.altitudeAnimation.removeMyself();

		if (!following) {
			this.altitudeBound = false;
			return;
		}

		const target = this.getCameraAltitude();
		const distance = Math.abs(this.model.globe.cameraDistance.get() - target);

		if (distance <= 0.02 || this.altitudeBound) {
			this.altitudeBound = true;
			return;
		}

		const SPEED = distance < 1 ? 1 : 2;
		const duration = distance / SPEED;
		this.altitudeAnimation = this.addChild(
			new AnimationFloatController(
				this.game,
				this.model.globe.cameraDistance,
				target,
				duration * 1000
			).onFinished(() => {
				this.updateCameraFollowing();
				this.altitudeAnimation = null;
			})
		);
	}

	onZoom(z) {
		this.model.strategic.cameraFollowing.set(false);
		this.model.globe.cameraDistance.increase(z > 0 ? 1 : -1);
		this.model.globe.cameraDistance.set(
			NumberHelper.between(
				WorldConstants.MIN_DISTANCE_RADIUS,
				WorldConstants.MAX_DISTANCE_RADIUS,
				this.model.globe.cameraDistance.get()
			)
		);
	}

	onMouseMove() {
		if (this.game.controls.mouseDownLeft.get()) {
			if (this.lastMouseCoordinates) {
				this.model.strategic.cameraFollowing.set(false);
				const ROTATION_SPEED = 0.002;
				const mouseDiff = this.game.controls.mouseCoordinates.subtract(this.lastMouseCoordinates);
				const rotationDiff = mouseDiff.multiply(ROTATION_SPEED);
				rotationDiff.set(-rotationDiff.x, rotationDiff.y);
				const rotation = this.model.globe.cameraCoordinates.add(rotationDiff);
				this.model.globe.cameraCoordinates.set(
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
			this.model.strategic.cruisePanel.cruiseCityMenu.items.remove(this.cursorCityMenuItem);
		}
		if (this.model.globe.cursorAtCity.isSet()) {
			const city = this.model.globe.cursorAtCity.get();
			this.cursorCityMenuItem = this.model.strategic.cruisePanel.cruiseCityMenu.items.add(
				new MenuItemModel(city.name.get(), () => this.cruiseToCity(city))
			)
		}
	}

	onClick() {
		if (this.model.globe.cursorAtCity.isSet()) {
			this.cruiseToCity(this.model.globe.cursorAtCity.get());
			return;
		}
		if (this.model.globe.cursorAtGlobe.isSet()) {
			this.cruiseTo(this.model.globe.cursorAtGlobe.get());
		}
	}
}
