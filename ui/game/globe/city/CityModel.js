import StringValue from "wgge/core/model/value/StringValue";
import GlobeObjectModel from "../GlobeObjectModel";

export default class CityModel extends GlobeObjectModel {

	/**
	 * @type StringValue
	 */
	name;

	/**
	 * @type StringValue
	 */
	country;

	constructor(persistent = true) {
		super(persistent);

		this.name = this.addProperty('name', new StringValue());
		this.country = this.addProperty('country', new StringValue());
	}

}
