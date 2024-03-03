import ObjectModel from "wgge/core/model/ObjectModel";
import IntValue from "wgge/core/model/value/IntValue";
import BoolValue from "wgge/core/model/value/BoolValue";

export default class ScannerModel extends ObjectModel {

	/**
	 * @type IntValue
	 */
	level;

	/**
	 * @type BoolValue
	 */
	sex;

	/**
	 * @type IntValue
	 */
	originYear;

	/**
	 * @type IntValue
	 */
	originCityId;

	/**
	 * @type IntValue
	 */
	originCountryId;

	constructor() {
		super();

		this.age = this.addProperty('age', new IntValue());
		this.sex = this.addProperty('sex', new BoolValue());

		this.originYear = this.addProperty('originYear', new IntValue());
		this.originCityId = this.addProperty('originCityId', new IntValue());
		this.originCountryId = this.addProperty('originCountryId', new IntValue());

	}
}
