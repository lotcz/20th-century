import ObjectModel from "wgge/core/model/ObjectModel";
import Vector2 from "wgge/core/model/vector/Vector2";
import StringValue from "wgge/core/model/value/StringValue";

export default class CityModel extends ObjectModel {

	/**
	 * @type StringValue
	 * Scale of currently displayed scene
	 */
	name;

	/**
	 * @type Vector2
	 * GPS coords of camera
	 */
	coordinates;

	/**
	 * @type StringValue
	 * Distance of camera from center of the globe
	 */
	country;

	constructor() {
		super();

		this.name = this.addProperty('name', new StringValue());
		this.coordinates = this.addProperty('coordinates', new Vector2());
		this.country = this.addProperty('country', new StringValue());
	}

}
