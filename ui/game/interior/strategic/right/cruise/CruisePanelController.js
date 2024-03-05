import ControllerBase from "wgge/core/controller/ControllerBase";
import MenuItemModel from "wgge/game/menu/item/MenuItemModel";

export default class CruisePanelController extends ControllerBase {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

	}

	activateInternal() {
		const scannerMenu = this.model.strategic.cruisePanel.toggleScannerMenu;
		scannerMenu.items.reset();
		scannerMenu.items.add(new MenuItemModel('Scanner', () => this.model.strategic.selectedPanelRight.set('scanner')));
	}


}
