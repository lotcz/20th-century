import StringValue from "wgge/core/model/value/StringValue";
import AlienPanelModel from "../../../panel/AlienPanelModel";
import Vector2 from "wgge/core/model/vector/Vector2";

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

		this.highlighted = this.addProperty('highlighted', new StringValue());
		this.scannerViewSize = this.addProperty('scannerViewSize', new Vector2(0, 0, false));
	}

}
