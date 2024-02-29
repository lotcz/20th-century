import ObjectModel from "wgge/core/model/ObjectModel";
import GlobeModel from "../../globe/GlobeModel";
import AlienPanelModel from "../panel/AlienPanelModel";
import MenuModel from "wgge/game/menu/MenuModel";
import MenuItemModel from "wgge/game/menu/item/MenuItemModel";
import StringValue from "wgge/core/model/value/StringValue";
import CockpitModel from "../cockpit/CockpitModel";
import StrategicModel from "../strategic/StrategicModel";

export const INTERIOR_TYPE_COCKPIT = 'cockpit';
export const INTERIOR_TYPE_STRATEGIC = 'main';

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
	 * @type ModelNodeCollection<AlienPanelModel>
	 */
	panels;

	/**
	 * @type AlienPanelModel
	 */
	debugPanel;

	/**
	 * @type MenuModel
	 */
	debugMenu;

	/**
	 * @type CockpitModel
	 */
	cockpit;

	/**
	 * @type StrategicModel
	 */
	strategic;

	constructor() {
		super();

		this.globe = this.addProperty('globe', new GlobeModel());
		this.interiorType = this.addProperty('interiorType', new StringValue(INTERIOR_TYPE_STRATEGIC));

		this.debugPanel = this.addProperty('debugPanel', new AlienPanelModel());
		this.debugPanel.size.set(250, 250);
		this.debugPanel.alignment.set(-1, 1);

		this.debugMenu = this.addProperty('debugMenu', new MenuModel());
		this.debugMenu.items.add(new MenuItemModel('Cockpit', () => this.interiorType.set(INTERIOR_TYPE_COCKPIT)));
		this.debugMenu.items.add(new MenuItemModel('Strategic', () => this.interiorType.set(INTERIOR_TYPE_STRATEGIC)));

		this.cockpit = this.addProperty('cockpit', new CockpitModel());
		this.strategic = this.addProperty('strategic', new StrategicModel());

	}

}
