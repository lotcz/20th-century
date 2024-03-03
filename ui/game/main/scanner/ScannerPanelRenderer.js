import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import PanelVisitorRenderer from "../../panel/PanelVisitorRenderer";
import MenuRenderer from "wgge/game/menu/MenuRenderer";
import ScannerViewRenderer from "./ScannerViewRenderer";

export default class ScannerPanelRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.wrapper = this.addElement('div', 'alien-panel panel-scanner');

		this.addChild(
			new PanelVisitorRenderer(
				this.game,
				this.model.main.scanner.scannerPanel,
				this.wrapper
			)
		);

		this.container = DOMHelper.createElement(this.wrapper, 'div', 'col stretch');
		this.panelTop = DOMHelper.createElement(this.container, 'div', 'col');
		this.panelCenter = DOMHelper.createElement(this.container, 'div', 'col flex-1');
		this.panelBottom = DOMHelper.createElement(this.container, 'div', 'col');

		this.addChild(
			new MenuRenderer(
				this.game,
				this.model.main.scanner.scannerMenu,
				DOMHelper.createElement(this.panelTop, 'div', 'scanner-menu')
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
		DOMHelper.destroyElement(this.wrapper);
	}

}
