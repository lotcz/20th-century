import ObjectModel from "wgge/core/model/ObjectModel";
import HumanModel from "./HumanModel";
import ModelNodeCollection from "wgge/core/model/collection/ModelNodeCollection";
import IntValue from "wgge/core/model/value/IntValue";

export default class InventoryModel extends ObjectModel {

	/**
	 * @type IntValue
	 */
	materials;

	/**
	 * @type IntValue
	 */
	biologyPoints;

	/**
	 * @type IntValue
	 */
	historyPoints;

	/**
	 * @type ModelNodeCollection<HumanModel>
	 */
	humans;

	constructor() {
		super();

		this.materials = this.addProperty('materials', new IntValue(0));
		this.biologyPoints = this.addProperty('biologyPoints', new IntValue(0));
		this.historyPoints = this.addProperty('historyPoints', new IntValue(0));

		this.humans = this.addProperty('humans', new ModelNodeCollection(() => new HumanModel()));
	}
}
