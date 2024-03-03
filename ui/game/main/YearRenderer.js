import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import DirtyValueRenderer from "wgge/core/renderer/dom/DirtyValueRenderer";
import PanelVisitorRenderer from "../panel/PanelVisitorRenderer";

export default class YearRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.wrapper = this.addElement('div', 'alien-panel panel-small');

		this.addChild(
			new PanelVisitorRenderer(
				this.game,
				this.model.yearPanel,
				this.wrapper
			)
		);

		this.container = DOMHelper.createElement(this.wrapper, 'div', 'center');

		this.addChild(
			new DirtyValueRenderer(
				this.game,
				this.model.year,
				this.container
			)
		);

	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.wrapper);
	}

}
