import ObjectModel from "wgge/core/model/ObjectModel";
import MainModel from "./interior/main/MainModel";

export default class SaveGameModel extends ObjectModel {

	/**
	 * @type MainModel
	 */
	main;

	constructor() {
		super();

		this.main = this.addProperty('main', new MainModel());

	}

}
