import ControllerBase from "wgge/core/controller/ControllerBase";
import FloatValue from "wgge/core/model/value/FloatValue";
import HttpHelper from "wgge/core/helper/HttpHelper";
import CityModel from "./CityModel";
import UfoController from "./ufo/UfoController";

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

		this.addChild(new UfoController(this.game, this.model.ufo));


	}

	afterActivatedInternal() {
		this.loadCities();
	}

	updateInternal(delta) {
		// DAY/NIGHT
		const DAY_LENGTH = 180000;
		this.model.time.increase(delta / DAY_LENGTH);
		if (this.model.time.get() > 1) this.model.time.increase(-1);

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


}
