import ControllerBase from "wgge/core/controller/ControllerBase";
import MenuItemModel from "wgge/game/menu/item/MenuItemModel";
import {INTERIOR_TYPE_STRATEGIC} from "../MainModel";

export default class ScannerController extends ControllerBase {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

	}

	activateInternal() {
		const scannerMenu = this.model.main.scanner.scannerMenu;
		scannerMenu.items.reset();
		scannerMenu.items.add(new MenuItemModel('Strategic', () => this.model.main.interiorType.set(INTERIOR_TYPE_STRATEGIC)));
	}

}
