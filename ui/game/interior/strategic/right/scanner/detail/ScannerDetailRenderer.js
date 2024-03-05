import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import ConditionalNodeRenderer from "wgge/core/renderer/generic/ConditionalNodeRenderer";
import PanelVisitorRenderer from "../../../../../util/panel/PanelVisitorRenderer";
import ScannerViewRenderer from "./view/ScannerViewRenderer";

export default class ScannerDetailRenderer extends DomRenderer {

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
				this.model.strategic.scannerPanel.detail,
				this.wrapper
			)
		);

		this.container = DOMHelper.createElement(this.wrapper, 'div', 'col stretch');
		this.panelTop = DOMHelper.createElement(this.container, 'div', 'col');
		this.panelCenter = DOMHelper.createElement(this.container, 'div', 'col flex-1');
		this.panelBottom = DOMHelper.createElement(this.container, 'div', 'col');

		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.model.globe.ufo.ufoScannerOn,
				() => this.model.globe.ufo.ufoScannerOn.get(),
				() => new ScannerViewRenderer(
					this.game,
					this.model,
					DOMHelper.createElement(this.panelCenter, 'div', 'scanner-view')
				)
			)
		);

	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.wrapper);
	}

}
