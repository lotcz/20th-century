import ControllerBase from "wgge/core/controller/ControllerBase";
import MenuItemModel from "wgge/game/menu/item/MenuItemModel";

export default class InfoPanelController extends ControllerBase {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

	}

	activateInternal() {
		this.model.strategic.mainInfoPanel.menu.items.reset();
		this.model.strategic.mainInfoPanel.menu.items.add(new MenuItemModel('Menu', () => this.model.interiorType.set('menu')));
		this.model.strategic.mainInfoPanel.menu.items.add(new MenuItemModel('Research', () => this.model.strategic.selectedPanelLeft.set('research')));
	}


}
