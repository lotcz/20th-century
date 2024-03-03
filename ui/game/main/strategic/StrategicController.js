import ControllerBase from "wgge/core/controller/ControllerBase";
import MenuItemModel from "wgge/game/menu/item/MenuItemModel";
import Vector2 from "wgge/core/model/vector/Vector2";
import AnimationRotationVector2Controller from "wgge/core/controller/AnimationRotationVector2Controller";
import ArrayHelper from "wgge/core/helper/ArrayHelper";
import Rotation from "wgge/core/model/vector/Rotation";
import AnimationFloatController from "wgge/core/controller/AnimationFloatController";
import WorldConstants from "../../util/WorldConstants";
import {INTERIOR_TYPE_SCANNER} from "../MainModel";

export default class StrategicController extends ControllerBase {

	/**
	 * @type MainModel
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

		this.addAutoEvent(
			this.model.globe.cities,
			'change',
			() => this.changeTargetCity(),
			true
		);

		this.addAutoEvent(
			this.model.strategic.cameraFollowing,
			'change',
			() => this.updateCameraFollowing(),
			true
		);

		this.addAutoEvent(
			this.model.globe.ufoCoordinates,
			'change',
			() => this.followCoordinates()
		);

		this.addAutoEvent(
			this.model.globe.ufoAltitude,
			'change',
			() => this.followAltitude()
		);

		this.addAutoEvent(
			this.model.globe,
			'change',
			() => this.followAltitude()
		);

		this.addAutoEvent(
			this.model.scanner.scannerPanel.size,
			'change',
			() => {
				const borders = WorldConstants.PANEL_PADDING.multiply(2);
				const space = new Vector2(0, 50);
				const size = this.model.strategic.strategicPanel.size.subtract(borders).subtract(space);
				this.model.scanner.scannerViewSize.set(size);
			},
			true
		);

	}

	activateInternal() {
		const exploreMenu = this.model.strategic.cruiseExploreMenu;
		exploreMenu.items.reset();
		exploreMenu.items.add(new MenuItemModel('NORTH', () => this.moveBy(new Vector2(0, 0.1))));
		exploreMenu.items.add(new MenuItemModel('SOUTH', () => this.moveBy(new Vector2(0, -0.1))));
		exploreMenu.items.add(new MenuItemModel('EAST', () => this.moveBy(new Vector2(0.1, 0))));
		exploreMenu.items.add(new MenuItemModel('WEST', () => this.moveBy(new Vector2(-0.1, 0))));


		const altMenu = this.model.strategic.cruiseAltitudeMenu;
		altMenu.items.reset();
		altMenu.items.add(new MenuItemModel('UP', () => this.changeAltitude(0.5)));
		altMenu.items.add(new MenuItemModel('DOWN', () => this.changeAltitude(-0.5)));
		this.followMenuItem = altMenu.items.add(new MenuItemModel('Follow', () => this.triggerFollow()));

		const cityMenu = this.model.strategic.cruiseCityMenu;
		cityMenu.items.reset();

		const scannerMenu = this.model.strategic.scannerMenu;
		scannerMenu.items.reset();
		scannerMenu.items.add(new MenuItemModel('Scanner', () => this.model.interiorType.set(INTERIOR_TYPE_SCANNER)));
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
			this.model.globe.cameraCoordinates.set(this.model.globe.ufoCoordinates);
		}
	}

	updateCameraFollowingCoordinates(following) {
		if (this.cameraAnimation) this.cameraAnimation.removeMyself();

		if (!following) {
			this.coordinatesBound = false;
			return;
		}

		const target = this.model.globe.ufoCoordinates;
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
			const menu = this.model.strategic.cruiseCityMenu;
			if (this.cityMenuItem) {
				menu.items.remove(this.cityMenuItem);
			}
			this.cityMenuItem = menu.items.add(new MenuItemModel(city.name.get(), () => this.cruiseToCity(city)));
		}
	}

	moveBy(diff) {
		this.cruiseTo(this.model.globe.ufoCoordinates.add(diff));
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
		const distance = this.model.globe.ufoCoordinates.subtract(target).size();
		if (distance <= 0) return;
		this.model.globe.ufoExhaust.on.set(true);
		const duration = distance / SPEED;
		this.cruisingAnimation = this.addChild(
			new AnimationRotationVector2Controller(
				this.game,
				this.model.globe.ufoCoordinates,
				target,
				duration * 1000
			).onFinished(() => {
				this.cruisingAnimation = null;
				this.model.globe.ufoExhaust.on.set(false);
				this.changeTargetCity();
			})
		);
		this.updateCameraFollowing();
	}

	changeAltitude(diff) {
		this.altitudeTo(this.model.globe.ufoAltitude.get() + diff);
	}

	altitudeTo(target) {
		if (this.altitudeAnimation && this.altitudeAnimation.isActivated) {
			this.removeChild(this.altitudeAnimation);
		}
		target = Math.max(WorldConstants.UFO_MIN_ALTITUDE, target);
		const SPEED = 1;
		const distance = Math.abs(this.model.globe.ufoAltitude.get() - target);
		if (distance <= 0) return;
		const duration = distance / SPEED;
		this.altitudeAnimation = this.addChild(
			new AnimationFloatController(
				this.game,
				this.model.globe.ufoAltitude,
				target,
				duration * 1000
			).onFinished(() => this.altitudeAnimation = null)
		);

	}

	getCameraAltitude() {
		return this.model.globe.ufoAltitude.get() + WorldConstants.UFO_CAMERA_DISTANCE;
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
		this.cameraAnimation = this.addChild(
			new AnimationFloatController(
				this.game,
				this.model.globe.cameraDistance,
				target,
				duration * 1000
			).onFinished(() => {
				this.updateCameraFollowing();
				this.cameraAnimation = null;
			})
		);
	}
}
