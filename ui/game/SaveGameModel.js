import ObjectModel from "wgge/core/model/ObjectModel";
import IntValue from "wgge/core/model/value/IntValue";
import GlobeModel from "./globe/GlobeModel";
import StringValue from "wgge/core/model/value/StringValue";
import StrategicModel from "./interior/strategic/StrategicModel";
import MainMenuPanelModel from "./interior/menu/MainMenuPanelModel";
import InventoryModel from "./inventory/InventoryModel";

export default class SaveGameModel extends ObjectModel {

	/**
	 * @type IntValue
	 */
	year;

	/**
	 * @type GlobeModel
	 */
	globe;

	/**
	 * @type InventoryModel
	 */
	inventory;

	/**
	 * @type StringValue
	 */
	interiorType;

	/**
	 * @type StrategicModel
	 */
	strategic;

	/**
	 * @type MainMenuPanelModel
	 */
	mainMenuPanel;

	constructor() {
		super();

		this.year = this.addProperty('year', new IntValue(new Date().getFullYear()));

		this.globe = this.addProperty('globe', new GlobeModel());

		this.inventory = this.addProperty('research', new InventoryModel());

		this.interiorType = this.addProperty('interiorType', new StringValue('menu'));

		this.strategic = this.addProperty('strategic', new StrategicModel());
		this.mainMenuPanel = this.addProperty('mainMenuPanel', new MainMenuPanelModel());
	}

}
