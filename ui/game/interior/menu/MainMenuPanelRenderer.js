import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import PanelVisitorRenderer from "../../util/panel/PanelVisitorRenderer";
import MenuRenderer from "wgge/game/menu/MenuRenderer";

export default class MainMenuPanelRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.wrapper = this.addElement('div', 'alien-panel panel-menu');

		this.addChild(
			new PanelVisitorRenderer(
				this.game,
				this.model.mainMenuPanel,
				this.wrapper
			)
		);

		this.container = DOMHelper.createElement(this.wrapper, 'div', 'col stretch');

		this.addChild(
			new MenuRenderer(
				this.game,
				this.model.mainMenuPanel.menu,
				DOMHelper.createElement(this.container, 'div')
			)
		);

	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.wrapper);
	}

}
