import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import MenuRenderer from "wgge/game/menu/MenuRenderer";
import ScannerViewRenderer from "../../scanner/ScannerViewRenderer";

export default class ScannerTabRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.container = this.addElement('div', 'row');

		this.panelLeft = DOMHelper.createElement(this.container, 'div', 'col');
		this.panelCenter = DOMHelper.createElement(this.container, 'div', 'col flex-1');
		this.panelRight = DOMHelper.createElement(this.container, 'div', 'col');

		this.addChild(
			new MenuRenderer(
				this.game,
				this.model.main.scanner.scannerMenu,
				DOMHelper.createElement(this.panelRight, 'div', 'scanner-menu')
			)
		);

		this.addChild(
			new ScannerViewRenderer(
				this.game,
				this.model,
				DOMHelper.createElement(this.panelCenter, 'div', 'scanner-view')
			)
		);

	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.container);
	}

}
