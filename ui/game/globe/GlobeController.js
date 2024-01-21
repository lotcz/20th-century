import ControllerBase from "wgge/core/controller/ControllerBase";
import FloatValue from "wgge/core/model/value/FloatValue";
import HttpHelper from "wgge/core/helper/HttpHelper";
import CityModel from "./CityModel";

const HALF_CIRCLE = 180;
const QUARTER_CIRCLE = 90;

export default class GlobeController extends ControllerBase {

	/**
	 * @type GlobeModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(
			this.game.controls,
			'zoom',
			(z) => this.onZoom(z)
		);

		this.addAutoEvent(
			this.game.controls,
			'key-up',
			(k) => this.onKeyUp(k)
		);

		this.addAutoEvent(
			this.game.controls,
			'key-down',
			(k) => this.onKeyDown(k)
		);

	}

	afterActivatedInternal() {
		this.loadCities();
	}

	updateInternal(delta) {
		// GLOBE
		if (this.model.rotating.size() > 0) {
			let lon = this.model.cameraCoordinates.x;
			lon += this.model.rotating.x * delta / 1000;
			if (lon > HALF_CIRCLE) lon -= 2 * HALF_CIRCLE;
			if (lon < -HALF_CIRCLE) lon += 2 * HALF_CIRCLE;

			let lat = this.model.cameraCoordinates.y;
			lat += this.model.rotating.y * delta / 1000;
			if (lat > QUARTER_CIRCLE) lat = QUARTER_CIRCLE;
			if (lat < -QUARTER_CIRCLE) lat = -QUARTER_CIRCLE;

			this.model.cameraCoordinates.set(lon, lat);
		}

		// ATMOSPHERE
		const alon = new FloatValue(this.model.atmoCoordinates.x);
		alon.increase((delta / 250000) * HALF_CIRCLE);
		if (alon.get() > HALF_CIRCLE) alon.increase(- 2 * HALF_CIRCLE);
		const alat = new FloatValue(this.model.atmoCoordinates.y);
//		alat.increase((delta / 30000) * halfCircle);
//		if (alat.get() > halfCircle) alat.increase(- 2 * halfCircle);
		this.model.atmoCoordinates.set(alon.get(), alat.get());
	}

	loadCities() {
		HttpHelper
			.get('http://127.0.0.1:5000/city')
			.then(
				(response) => {
					response
						.json()
						.then(
							(cities) => {
								cities.forEach(
									(c) => {
										const city = new CityModel();
										city.name.set(c.name);
										city.coordinates.set(c.longitude, c.latitude);
										this.model.cities.add(city);
									}
								);
							}
						);
				}
			);
	}

	onZoom(z) {
		this.model.cameraDistance.increase(z > 0 ? 0.5 : -0.5);
	}

	onKeyDown(k) {
		const ROTATION_SPEED = 30;
		switch (k) {
			case 65:
				this.model.rotating.set(-ROTATION_SPEED, this.model.rotating.y);
				break;
			case 68:
				this.model.rotating.set(ROTATION_SPEED, this.model.rotating.y);
				break;
			case 87:
				this.model.rotating.set(this.model.rotating.x, ROTATION_SPEED);
				break;
			case 83:
				this.model.rotating.set(this.model.rotating.x, -ROTATION_SPEED);
				break;
		}
	}

	onKeyUp(k) {
		switch (k) {
			case 65:
			case 68:
				this.model.rotating.set(0, this.model.rotating.y);
				break;
			case 87:
			case 83:
				this.model.rotating.set(this.model.rotating.x, 0);
				break;
		}
	}
}
