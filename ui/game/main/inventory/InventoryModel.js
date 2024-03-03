import ObjectModel from "wgge/core/model/ObjectModel";
import HumanModel from "./HumanModel";
import ModelNodeCollection from "wgge/core/model/collection/ModelNodeCollection";

export default class InventoryModel extends ObjectModel {

	/**
	 * @type ModelNodeCollection<HumanModel>
	 */
	humans;

	constructor() {
		super();

		this.humans = this.addProperty('humans', new ModelNodeCollection(() => new HumanModel()));
	}
}
