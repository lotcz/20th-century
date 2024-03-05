import FloatValue from "wgge/core/model/value/FloatValue";
import ObjectModel from "wgge/core/model/ObjectModel";
import Vector2 from "wgge/core/model/vector/Vector2";
import ModelNodeCollection from "wgge/core/model/collection/ModelNodeCollection";
import WorldConstants from "../util/WorldConstants";
import NullableNode from "wgge/core/model/value/NullableNode";
import CityModel from "./city/CityModel";
import UfoModel from "./ufo/UfoModel";
import HumanModel from "../inventory/HumanModel";

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
	 * @type UfoModel
	 */
	ufo;

	/**
	 * @type Vector2
	 * GPS coordinates of atmosphere rotation
	 */
	atmoCoordinates;

	/**
	 * @type ModelNodeCollection<CityModel>
	 */
	cities;

	/**
	 * @type NullableNode<CityModel>
	 */
	cursorAtCity;

	/**
	 * @type ModelNodeCollection<HumanModel>
	 */
	humans;

	/**
	 * @type NullableNode<CityModel>
	 */
	cursorAtHuman;

	/**
	 * @type NullableNode<Vector2>>
	 */
	cursorAtGlobe;

	constructor() {
		super();

		this.zoom = this.addProperty('zoom', new FloatValue(1));
		this.rotating = this.addProperty('rotating', new Vector2(0, 0));
		this.time = this.addProperty('time', new FloatValue(0));

		this.cameraCoordinates = this.addProperty('cameraCoordinates', new Vector2());
		this.cameraDistance = this.addProperty('cameraDistance', new FloatValue(WorldConstants.CLOSE_DISTANT_THRESHOLD_RADIUS));

		this.ufo = this.addProperty('ufo', new UfoModel());

		this.atmoCoordinates = this.addProperty('atmoCoordinates', new Vector2());

		this.cities = this.addProperty('cities', new ModelNodeCollection(() => new CityModel()));
		this.cursorAtCity = this.addProperty('cursorAtCity', new NullableNode(() => new CityModel()));

		this.humans = this.addProperty('humans', new ModelNodeCollection(() => new HumanModel()));
		this.cursorAtHuman = this.addProperty('cursorAtHuman', new NullableNode(() => new HumanModel()));

		this.cursorAtGlobe = this.addProperty('cursorAtGlobe', new NullableNode(() => new Vector2()));
	}

	getResourcesForPreloadInternal() {
		return ['img/earth_scan.jpg'];
	}

}
