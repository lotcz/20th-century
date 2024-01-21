import FloatValue from "wgge/core/model/value/FloatValue";
import ObjectModel from "wgge/core/model/ObjectModel";
import Vector2 from "wgge/core/model/vector/Vector2";
import ModelNodeCollection from "wgge/core/model/collection/ModelNodeCollection";

export default class GlobeModel extends ObjectModel {

	/**
	 * @type FloatValue
	 * Scale of currently displayed scene
	 */
	zoom;

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
	rotating;

	/**
	 * @type FloatValue
	 * Size of the globe
	 */
	globeDiameter;

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

		this.cameraCoordinates = this.addProperty('cameraCoordinates', new Vector2());
		this.cameraDistance = this.addProperty('cameraDistance', new FloatValue(20));

		this.rotating = this.addProperty('rotating', new Vector2(0, 0));

		this.globeDiameter = this.addProperty('globeDiameter', new FloatValue(12.76));
		this.atmoCoordinates = this.addProperty('atmoCoordinates', new Vector2());

		this.cities = this.addProperty('cities', new ModelNodeCollection());
	}

}
