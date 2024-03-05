import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import MenuRenderer from "wgge/game/menu/MenuRenderer";
import PanelVisitorRenderer from "../../../../../util/panel/PanelVisitorRenderer";


export default class ScannerSideRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.wrapper = this.addElement('div', 'alien-panel panel-scanner-side');

		this.addChild(
			new PanelVisitorRenderer(
				this.game,
				this.model.strategic.scannerPanel.side,
				this.wrapper
			)
		);

		this.container = DOMHelper.createElement(this.wrapper,'div', 'col stretch');

		this.panelTop = DOMHelper.createElement(this.container, 'div', 'col flex-1');
		this.panelCenter = DOMHelper.createElement(this.container, 'div', 'col flex-1');
		this.panelBottom = DOMHelper.createElement(this.container, 'div', 'col flex-1');

		const woman = DOMHelper.createElement(DOMHelper.createElement(this.panelTop, 'div'),'img');
		woman.src = 'assets/img/tech/scanner.png';


		this.addChild(
			new MenuRenderer(
				this.game,
				this.model.strategic.scannerPanel.side.menu,
				DOMHelper.createElement(this.panelBottom, 'div')
			)
		);

	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.container);
	}

}
