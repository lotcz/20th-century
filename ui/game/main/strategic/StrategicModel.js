import ObjectModel from "wgge/core/model/ObjectModel";
import AlienPanelModel from "../../panel/AlienPanelModel";
import MenuModel from "wgge/game/menu/MenuModel";
import BoolValue from "wgge/core/model/value/BoolValue";
import NullableNode from "wgge/core/model/value/NullableNode";
import CityModel from "../globe/CityModel";
import DirtyValue from "wgge/core/model/value/DirtyValue";
import MenuItemModel from "wgge/game/menu/item/MenuItemModel";

export default class StrategicModel extends ObjectModel {

	/**
	 * @type BoolValue
	 */
	cameraFollowing;

	/**
	 * @type AlienPanelModel
	 */
	strategicPanel;

	/**
	 * @type DirtyValue
	 */
	strategicTab;

	/**
	 * @type MenuModel
	 */
	strategicTabMenu;

	/**
	 * @type MenuModel
	 */
	cruiseAltitudeMenu;

	/**
	 * @type MenuModel
	 */
	cruiseExploreMenu;

	/**
	 * @type MenuModel
	 */
	cruiseCityMenu;

	/**
	 * @type MenuModel
	 */
	scannerMenu;

	/**
	 * @type NullableNode<CityModel>
	 */
	selectedCity;

	constructor() {
		super();

		this.cameraFollowing = this.addProperty('cameraFollowing', new BoolValue(false));

		this.strategicPanel = this.addProperty('strategicPanel', new AlienPanelModel());
		this.strategicPanel.size.set(600, 250);
		this.strategicPanel.alignment.set(0, 1);

		this.strategicTab = this.addProperty('strategicTab', new DirtyValue('cruise'));
		this.strategicTabMenu = this.addProperty('strategicTabMenu', new MenuModel());
		this.strategicTabMenu.items.add(new MenuItemModel('Cruise', () => this.strategicTab.set('cruise')));
		this.strategicTabMenu.items.add(new MenuItemModel('City', () => this.strategicTab.set('city')));
		this.strategicTabMenu.items.add(new MenuItemModel('Scanner', () => this.strategicTab.set('scanner')));

		this.cruiseAltitudeMenu = this.addProperty('cruiseAltitudeMenu', new MenuModel());
		this.cruiseExploreMenu = this.addProperty('cruiseExploreMenu', new MenuModel());
		this.cruiseCityMenu = this.addProperty('cruiseCityMenu', new MenuModel());
		this.scannerMenu = this.addProperty('scannerMenu', new MenuModel());

		this.selectedCity = this.addProperty('selectedCity', new NullableNode(() => new CityModel()));
	}

}
