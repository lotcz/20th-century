import Vector2 from "wgge/core/model/vector/Vector2";
import AlienPanelModel from "../../../../../util/panel/AlienPanelModel";
import WorldConstants from "../../../../../util/WorldConstants";
import MenuModel from "wgge/game/menu/MenuModel";

export default class ScannerSideModel extends AlienPanelModel {

	/**
	 * @type MenuModel
	 */
	actionsMenu

	constructor() {
		super();

		this.size.set(WorldConstants.PANEL_SIDE_SIZE);
		this.alignment.set(new Vector2(1, 0));

		this.actionsMenu = this.addProperty('actionsMenu', new MenuModel());

	}

}
