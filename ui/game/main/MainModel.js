import ObjectModel from "wgge/core/model/ObjectModel";
import GlobeModel from "./globe/GlobeModel";
import AlienPanelModel from "../panel/AlienPanelModel";
import MenuModel from "wgge/game/menu/MenuModel";
import MenuItemModel from "wgge/game/menu/item/MenuItemModel";
import StringValue from "wgge/core/model/value/StringValue";
import ScannerModel from "./scanner/ScannerModel";
import StrategicModel from "./strategic/StrategicModel";

export const INTERIOR_TYPE_SCANNER = 'scanner';
export const INTERIOR_TYPE_STRATEGIC = 'strategic';
export const INTERIOR_TYPE_RESEARCH = 'research';

export default class MainModel extends ObjectModel {

	/**
	 * @type GlobeModel
	 */
	globe;

	/**
	 * @type StringValue
	 */
	interiorType;

	/**
	 * @type AlienPanelModel
	 */
	mainInfoPanel;

	/**
	 * @type MenuModel
	 */
	infoMenu;

	/**
	 * @type ScannerModel
	 */
	scanner;

	/**
	 * @type StrategicModel
	 */
	strategic;

	constructor() {
		super();

		this.globe = this.addProperty('globe', new GlobeModel());
		this.interiorType = this.addProperty('interiorType', new StringValue(INTERIOR_TYPE_STRATEGIC));

		this.mainInfoPanel = this.addProperty('mainInfoPanel', new AlienPanelModel());
		this.mainInfoPanel.size.set(150, 450);
		this.mainInfoPanel.alignment.set(-1, 1);

		this.infoMenu = this.addProperty('infoMenu', new MenuModel());
		this.infoMenu.items.add(new MenuItemModel('Research', () => this.interiorType.set(INTERIOR_TYPE_RESEARCH)));

		this.scanner = this.addProperty('scanner', new ScannerModel());
		this.strategic = this.addProperty('strategic', new StrategicModel());

	}

}
