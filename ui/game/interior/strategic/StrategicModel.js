import ObjectModel from "wgge/core/model/ObjectModel";
import AlienPanelModel from "../../util/panel/AlienPanelModel";
import BoolValue from "wgge/core/model/value/BoolValue";
import NullableNode from "wgge/core/model/value/NullableNode";
import CityModel from "../../globe/CityModel";
import DirtyValue from "wgge/core/model/value/DirtyValue";
import Vector2 from "wgge/core/model/vector/Vector2";
import WorldConstants from "../../util/WorldConstants";
import CruisePanelModel from "./right/cruise/CruisePanelModel";
import ScannerPanelModel from "./right/scanner/ScannerPanelModel";

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
	researchPanel;

	/**
	 * @type ScannerPanelModel
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

		this.selectedPanelLeft = this.addProperty('selectedPanelLeft', new DirtyValue('info'));
		this.selectedPanelRight = this.addProperty('selectedPanelRight', new DirtyValue('cruise'));

		this.mainInfoPanel = this.addProperty('mainInfoPanel', new AlienPanelModel());
		this.mainInfoPanel.size.set(WorldConstants.PANEL_SIDE_SIZE);
		this.mainInfoPanel.alignment.set(new Vector2(-1, 0));

		this.researchPanel = this.addProperty('researchPanel', new AlienPanelModel());
		this.researchPanel.size.set(WorldConstants.PANEL_DETAIL_SIZE);
		this.researchPanel.alignment.set(new Vector2(-1, 0));

		this.scannerPanel = this.addProperty('scannerPanel', new ScannerPanelModel());

		this.cruisePanel = this.addProperty('cruisePanel', new CruisePanelModel());

		this.selectedCity = this.addProperty('selectedCity', new NullableNode(() => new CityModel()));
	}

}
