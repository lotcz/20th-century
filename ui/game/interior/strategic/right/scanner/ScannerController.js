import ControllerBase from "wgge/core/controller/ControllerBase";
import MenuItemModel from "wgge/game/menu/item/MenuItemModel";
import ScannerDetailController from "./detail/ScannerDetailController";
import ScannerSideController from "./side/ScannerSideController";


export default class ScannerController extends ControllerBase {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(new ScannerSideController(this.game, this.model));
		this.addChild(new ScannerDetailController(this.game, this.model));

	}

	activateInternal() {
		const scannerMenu = this.model.strategic.scannerPanel.side.menu;
		scannerMenu.items.reset();
		scannerMenu.items.add(new MenuItemModel('Cruise', () => this.animateOut()));
	}

	animateOut() {
		this.model.strategic.scannerPanel.triggerEvent('animate-out');
	}

}
