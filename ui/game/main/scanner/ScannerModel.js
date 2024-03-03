import ObjectModel from "wgge/core/model/ObjectModel";
import StringValue from "wgge/core/model/value/StringValue";
import AlienPanelModel from "../../panel/AlienPanelModel";
import MenuModel from "wgge/game/menu/MenuModel";
import Vector2 from "wgge/core/model/vector/Vector2";

export default class ScannerModel extends ObjectModel {

	/**
	 * @type StringValue
	 */
	highlighted;

	/**
	 * @type AlienPanelModel
	 */
	scannerPanel;

	/**
	 * @type MenuModel
	 */
	scannerMenu;

	/**
	 * @type Vector2
	 */
	scannerViewSize;

	constructor() {
		super();

		this.highlighted = this.addProperty('highlighted', new StringValue());

		this.scannerPanel = this.addProperty('scannerPanel', new AlienPanelModel(false));
		this.scannerPanel.alignment.set(0, 0);
		this.scannerPanel.size.set(650, 550);

		this.scannerMenu = this.addProperty('scannerMenu', new MenuModel());
		this.scannerViewSize = this.addProperty('scannerViewSize', new Vector2(0, 0, false));
	}

}
