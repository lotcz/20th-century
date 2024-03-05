import MenuModel from "wgge/game/menu/MenuModel";
import Vector2 from "wgge/core/model/vector/Vector2";
import AlienPanelModel from "../../../../util/panel/AlienPanelModel";
import WorldConstants from "../../../../util/WorldConstants";

export default class CruisePanelModel extends AlienPanelModel {

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

	constructor() {
		super();

		this.size.set(WorldConstants.PANEL_SIDE_SIZE);
		this.alignment.set(new Vector2(1, 0));

		this.cruiseAltitudeMenu = this.addProperty('cruiseAltitudeMenu', new MenuModel());
		this.cruiseExploreMenu = this.addProperty('cruiseExploreMenu', new MenuModel());
		this.cruiseCityMenu = this.addProperty('cruiseCityMenu', new MenuModel());

		this.toggleScannerMenu = this.addProperty('toggleScannerMenu', new MenuModel());

	}

}
