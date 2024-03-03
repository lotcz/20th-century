import FloatValue from "wgge/core/model/value/FloatValue";
import ObjectModel from "wgge/core/model/ObjectModel";
import Vector2 from "wgge/core/model/vector/Vector2";
import ModelNodeCollection from "wgge/core/model/collection/ModelNodeCollection";
import WorldConstants from "../../util/WorldConstants";
import ParticleGeneratorModel from "../../particles/generator/ParticleGeneratorModel";
import GpsUtil from "../../util/GpsUtil";
import NullableNode from "wgge/core/model/value/NullableNode";
import CityModel from "./CityModel";

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
	 * @type FloatValue
	 */
	time;

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
	 * @type Vector2
	 */
	ufoSpeed;

	/**
	 * @type FloatValue
	 */
	ufoAltitude;

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

	/**
	 * @type NullableNode<CityModel>
	 */
	cursorAtCity;

	constructor() {
		super();

		this.zoom = this.addProperty('zoom', new FloatValue(1));
		this.rotating = this.addProperty('rotating', new Vector2(0, 0));
		this.time = this.addProperty('time', new FloatValue(0));

		this.cameraCoordinates = this.addProperty('cameraCoordinates', new Vector2());
		this.cameraDistance = this.addProperty('cameraDistance', new FloatValue(WorldConstants.CLOSE_DISTANT_THRESHOLD_RADIUS));

		this.ufoCoordinates = this.addProperty('ufoCoordinates', new Vector2());
		this.ufoSpeed = this.addProperty('ufoSpeed', new Vector2(0.1, 0));
		this.ufoAltitude = this.addProperty('ufoAltitude', new FloatValue(WorldConstants.EARTH_RADIUS+2));

		this.ufoExhaust = this.addProperty('ufoExhaust', new ParticleGeneratorModel());
		this.ufoExhaust.particleTemplate.imageUrl.set('img/smoke-green.png');
		this.ufoExhaust.particleTemplate.scale.set(0.05);
		this.ufoCoordinates.addEventListener('change', () => this.updateExhaust());
		this.ufoAltitude.addEventListener('change', () => this.updateExhaust());

		this.atmoCoordinates = this.addProperty('atmoCoordinates', new Vector2());

		this.cities = this.addProperty('cities', new ModelNodeCollection());
		this.cursorAtCity = this.addProperty('cursorAtCity', new NullableNode(() => new CityModel()));
	}

	updateExhaust() {
		this.ufoExhaust.position.set(GpsUtil.coordsToPositionRad(this.ufoCoordinates, this.ufoAltitude.get()));
	}
}
