import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import StrategicPanelRenderer from "./StrategicPanelRenderer";

export default class StrategicRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.container = this.addElement('div', 'container container-host');

		this.addChild(
			new StrategicPanelRenderer(
				this.game,
				this.model,
				this.container
			)
		);

	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.container);
	}


}
