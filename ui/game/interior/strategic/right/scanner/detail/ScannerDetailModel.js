import Vector2 from "wgge/core/model/vector/Vector2";
import AlienPanelModel from "../../../../../util/panel/AlienPanelModel";
import WorldConstants from "../../../../../util/WorldConstants";


export default class ScannerDetailModel extends AlienPanelModel {

	/**
	 * @type Vector2
	 */
	scannerViewSize;

	constructor() {
		super();

		this.size.set(WorldConstants.PANEL_DETAIL_SIZE);
		this.alignment.set(new Vector2(1, 0));

		this.scannerViewSize = this.addProperty('scannerViewSize', new Vector2(0, 0, false));
	}

}
