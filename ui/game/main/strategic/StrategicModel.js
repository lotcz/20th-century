import ObjectModel from "wgge/core/model/ObjectModel";
import AlienPanelModel from "../../panel/AlienPanelModel";
import MenuModel from "wgge/game/menu/MenuModel";
import BoolValue from "wgge/core/model/value/BoolValue";
import NullableNode from "wgge/core/model/value/NullableNode";
import CityModel from "../globe/CityModel";
import DirtyValue from "wgge/core/model/value/DirtyValue";
import Vector2 from "wgge/core/model/vector/Vector2";
import WorldConstants from "../../util/WorldConstants";
import ScannerPanelModel from "./scanner/ScannerPanelModel";

export default class StrategicModel extends ObjectModel {

	/**
	 * @type BoolValue
	 */
	cameraFollowing;

	/**
	 * @type DirtyValue
	 */
	selectedStrategicPanel;

	/**
	 * @type ScannerPanelModel
	 */
	scannerPanel;

	/**
	 * @type AlienPanelModel
	 */
	cruisePanel;

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
	toggleScannerMenu;

	/**
	 * @type NullableNode<CityModel>
	 */
	selectedCity;

	constructor() {
		super();

		this.cameraFollowing = this.addProperty('cameraFollowing', new BoolValue(false));

		this.scannerPanel = this.addProperty('scannerPanel', new ScannerPanelModel());
		this.scannerPanel.size.set(WorldConstants.PANEL_DETAIL_SIZE);
		this.scannerPanel.alignment.set(new Vector2(1, 0));
		this.scannerPanel.offset.set(new Vector2(- WorldConstants.PANEL_SIDE_SIZE.x - WorldConstants.PANEL_MARGIN.x, 0));

		this.selectedStrategicPanel = this.addProperty('selectedStrategicPanel', new DirtyValue('none'));

		this.cruisePanel = this.addProperty('cruisePanel', new AlienPanelModel());
		this.cruisePanel.size.set(WorldConstants.PANEL_SIDE_SIZE);
		this.cruisePanel.alignment.set(new Vector2(1, 0));
		this.cruiseAltitudeMenu = this.addProperty('cruiseAltitudeMenu', new MenuModel());
		this.cruiseExploreMenu = this.addProperty('cruiseExploreMenu', new MenuModel());
		this.cruiseCityMenu = this.addProperty('cruiseCityMenu', new MenuModel());

		this.toggleScannerMenu = this.addProperty('toggleScannerMenu', new MenuModel());

		this.selectedCity = this.addProperty('selectedCity', new NullableNode(() => new CityModel()));
	}

}
