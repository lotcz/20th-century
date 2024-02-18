import FloatValue from "wgge/core/model/value/FloatValue";
import ObjectModel from "wgge/core/model/ObjectModel";
import Vector2 from "wgge/core/model/vector/Vector2";
import ModelNodeCollection from "wgge/core/model/collection/ModelNodeCollection";
import Constants from "../util/Constants";
import ParticleGeneratorModel from "../particles/generator/ParticleGeneratorModel";
import GpsUtil from "../util/GpsUtil";

export default class GlobeModel extends ObjectModel {

	/**
	 * @type FloatValue
	 * Scale of currently displayed scene
	 */
	zoom;

	/**
	 * @type Vector2
	 */
	rotating;

	/**
	 * @type Vector2
	 * GPS coords of camera
	 */
	cameraCoordinates;

	/**
	 * @type FloatValue
	 * Distance of camera from center of the globe
	 */
	cameraDistance;

	/**
	 * @type Vector2
	 */
	ufoCoordinates;

	/**
	 * @type FloatValue
	 */
	ufoDistance;

	/**
	 * @type ParticleGeneratorModel
	 */
	ufoExhaust;

	/**
	 * @type Vector2
	 * GPS coordinates of atmosphere rotation
	 */
	atmoCoordinates;

	/**
	 * @type ModelNodeCollection<CityModel>
	 * GPS coordinates of atmosphere rotation
	 */
	cities;

	constructor() {
		super();

		this.zoom = this.addProperty('zoom', new FloatValue(1));
		this.rotating = this.addProperty('rotating', new Vector2(0, 0));

		this.cameraCoordinates = this.addProperty('cameraCoordinates', new Vector2());
		this.cameraDistance = this.addProperty('cameraDistance', new FloatValue(Constants.CLOSE_DISTANT_THRESHOLD_RADIUS));

		this.ufoCoordinates = this.addProperty('ufoCoordinates', new Vector2());
		this.ufoDistance = this.addProperty('ufoDistance', new FloatValue(Constants.ATMOSPHERE_RADIUS+1));

		this.ufoExhaust = this.addProperty('ufoExhaust', new ParticleGeneratorModel());
		this.ufoCoordinates.addEventListener('change', () => this.updateExhaust());
		this.ufoDistance.addEventListener('change', () => this.updateExhaust());

		this.atmoCoordinates = this.addProperty('atmoCoordinates', new Vector2());

		this.cities = this.addProperty('cities', new ModelNodeCollection());
	}

	updateExhaust() {
		this.ufoExhaust.position.set(GpsUtil.coordsToPosition(this.ufoCoordinates, this.ufoDistance.get()));
	}
}
