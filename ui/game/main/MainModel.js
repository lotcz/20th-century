import ObjectModel from "wgge/core/model/ObjectModel";
import GlobeModel from "./globe/GlobeModel";
import AlienPanelModel from "../panel/AlienPanelModel";
import StringValue from "wgge/core/model/value/StringValue";
import StrategicModel from "./strategic/StrategicModel";
import Vector2 from "wgge/core/model/vector/Vector2";
import WorldConstants from "../util/WorldConstants";

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
	 * @type StrategicModel
	 */
	strategic;

	constructor() {
		super();

		this.globe = this.addProperty('globe', new GlobeModel());
		this.interiorType = this.addProperty('interiorType', new StringValue(INTERIOR_TYPE_STRATEGIC));

		this.mainInfoPanel = this.addProperty('mainInfoPanel', new AlienPanelModel());
		this.mainInfoPanel.size.set(WorldConstants.PANEL_SIDE_SIZE);
		this.mainInfoPanel.alignment.set(new Vector2(-1, 0));

		this.strategic = this.addProperty('strategic', new StrategicModel());

	}

}
