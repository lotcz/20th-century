import StringValue from "wgge/core/model/value/StringValue";
import Vector2 from "wgge/core/model/vector/Vector2";
import AlienPanelModel from "../../../../util/panel/AlienPanelModel";
import WorldConstants from "../../../../util/WorldConstants";

export default class ScannerPanelModel extends AlienPanelModel {

	/**
	 * @type StringValue
	 */
	highlighted;

	/**
	 * @type Vector2
	 */
	scannerViewSize;

	constructor() {
		super();

		this.size.set(WorldConstants.PANEL_DETAIL_SIZE);
		this.alignment.set(new Vector2(1, 0));

		this.highlighted = this.addProperty('highlighted', new StringValue());
		this.scannerViewSize = this.addProperty('scannerViewSize', new Vector2(0, 0, false));
	}

}
