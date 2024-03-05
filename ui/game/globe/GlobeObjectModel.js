import ObjectModel from "wgge/core/model/ObjectModel";
import Vector2 from "wgge/core/model/vector/Vector2";

export default class GlobeObjectModel extends ObjectModel {

	/**
	 * @type Vector2
	 */
	coordinates;

	constructor(persistent = true) {
		super(persistent);

		this.coordinates = this.addProperty('coordinates', new Vector2());

	}

}
