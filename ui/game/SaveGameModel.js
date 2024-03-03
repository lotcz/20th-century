import ObjectModel from "wgge/core/model/ObjectModel";
import MainModel from "./main/MainModel";
import IntValue from "wgge/core/model/value/IntValue";
import AlienPanelModel from "./panel/AlienPanelModel";

export default class SaveGameModel extends ObjectModel {

	/**
	 * @type MainModel
	 */
	main;

	/**
	 * @type IntValue
	 */
	year;

	/**
	 * @type AlienPanelModel
	 */
	yearPanel;

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

	constructor() {
		super();

		this.main = this.addProperty('main', new MainModel());
		this.year = this.addProperty('year', new IntValue(new Date().getFullYear()));
		this.materials = this.addProperty('materials', new IntValue(0));
		this.biologyPoints = this.addProperty('biologyPoints', new IntValue(0));
		this.historyPoints = this.addProperty('historyPoints', new IntValue(0));

		this.yearPanel = this.addProperty('yearPanel', new AlienPanelModel());
		this.yearPanel.size.set(110, 75);
		this.yearPanel.alignment.set(1, -1);
	}

}
