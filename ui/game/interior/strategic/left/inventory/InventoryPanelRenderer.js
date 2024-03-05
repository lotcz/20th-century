import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import PanelVisitorRenderer from "../../../../util/panel/PanelVisitorRenderer";
import MenuRenderer from "wgge/game/menu/MenuRenderer";

export default class InventoryPanelRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.wrapper = this.addElement('div', 'alien-panel debug-info');

		this.addChild(
			new PanelVisitorRenderer(
				this.game,
				this.model.strategic.inventoryPanel,
				this.wrapper
			)
		);

		this.container = DOMHelper.createElement(this.wrapper, 'div', 'center');

		this.addChild(
			new MenuRenderer(
				this.game,
				this.model.strategic.inventoryPanel.menu,
				DOMHelper.createElement(this.container, 'div')
			)
		);
	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.wrapper);
	}

}
