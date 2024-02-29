import GameController from "wgge/game/GameController";
import MenuItemModel from "wgge/game/menu/item/MenuItemModel";
import MenuModel from "wgge/game/menu/MenuModel";
import NullableNodeController from "wgge/core/controller/NullableNodeController";
import SaveGameController from "./SaveGameController";
import SaveGameModel from "./SaveGameModel";

export default class MyGameController extends GameController {

	/**
	 * @type MyGameModel
	 */
	model;

	constructor(model) {
		super(model, model);

		this.model = model;

		this.addAutoEvent(
			this.model.controls,
			'esc-key',
			() => {
				if (this.model.menu.isSet()) {
					this.hideMenu();
				} else {
					this.showMainMenu();
				}
			}
		);

		this.addChild(
			new NullableNodeController(
				this.game,
				this.model.saveGame,
				(m) => new SaveGameController(this.game, m)
			)
		);

	}

	afterActivatedInternal() {
		super.afterActivatedInternal();
		//this.showMainMenu();
		this.model.editor.isVisible.set(false);
	}

	showMainMenu() {
		const menu = new MenuModel('Menu');
		menu.items.add(new MenuItemModel('Physics', () => this.model.demoType.set('physics')));
		menu.items.add(new MenuItemModel('Canvas', () => this.model.demoType.set('canvas')));
		menu.items.add(new MenuItemModel('Submerged', () => this.model.demoType.set('submerged')));
		this.model.menu.set(menu);
	}

	async loadResourcesFromStorage() {
		await super.loadResourcesFromStorage();
		this.model.saveGame.set(new SaveGameModel());
	}

}
