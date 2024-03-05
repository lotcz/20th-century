import ObjectModel from "wgge/core/model/ObjectModel";
import AlienPanelModel from "../../util/panel/AlienPanelModel";
import BoolValue from "wgge/core/model/value/BoolValue";
import NullableNode from "wgge/core/model/value/NullableNode";
import CityModel from "../../globe/CityModel";
import DirtyValue from "wgge/core/model/value/DirtyValue";
import Vector2 from "wgge/core/model/vector/Vector2";
import WorldConstants from "../../util/WorldConstants";
import CruisePanelModel from "./right/cruise/CruisePanelModel";
import ScannerModel from "./right/scanner/ScannerModel";

export default class StrategicModel extends ObjectModel {

	/**
	 * @type BoolValue
	 */
	cameraFollowing;

	/**
	 * @type DirtyValue
	 */
	selectedPanelLeft;

	/**
	 * @type DirtyValue
	 */
	selectedPanelRight;

	/**
	 * @type AlienPanelModel
	 */
	mainInfoPanel;

	/**
	 * @type AlienPanelModel
	 */
	inventoryPanel;

	/**
	 * @type AlienPanelModel
	 */
	researchPanel;

	/**
	 * @type ScannerModel
	 */
	scannerPanel;

	/**
	 * @type CruisePanelModel
	 */
	cruisePanel;

	/**
	 * @type NullableNode<CityModel>
	 */
	selectedCity;

	constructor() {
		super();

		this.cameraFollowing = this.addProperty('cameraFollowing', new BoolValue(false));

		this.selectedPanelLeft = this.addProperty('selectedPanelLeft', new DirtyValue('inventory'));
		this.selectedPanelRight = this.addProperty('selectedPanelRight', new DirtyValue('cruise'));

		this.inventoryPanel = this.addProperty('inventoryPanel', new AlienPanelModel());
		this.inventoryPanel.size.set(WorldConstants.PANEL_SIDE_SIZE);
		this.inventoryPanel.alignment.set(new Vector2(-1, 0));

		this.mainInfoPanel = this.addProperty('mainInfoPanel', new AlienPanelModel());
		this.mainInfoPanel.size.set(450, 75);
		this.mainInfoPanel.alignment.set(new Vector2(0, -1));

		this.researchPanel = this.addProperty('researchPanel', new AlienPanelModel());
		this.researchPanel.size.set(WorldConstants.PANEL_DETAIL_SIZE);
		this.researchPanel.alignment.set(new Vector2(-1, 0));

		this.scannerPanel = this.addProperty('scannerPanel', new ScannerModel());

		this.cruisePanel = this.addProperty('cruisePanel', new CruisePanelModel());

		this.selectedCity = this.addProperty('selectedCity', new NullableNode(() => new CityModel()));
	}

}
