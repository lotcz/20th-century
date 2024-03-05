import GlobeObjectModel from "../GlobeObjectModel";
import HumanModel from "../../inventory/HumanModel";

export default class HumanGlobeModel extends GlobeObjectModel {

	/**
	 * @type HumanModel
	 */
	human;

	constructor(persistent = true) {
		super(persistent);

		this.human = this.addProperty('human', new HumanModel());

	}

}
