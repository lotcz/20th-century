import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import ImageToCanvasRenderer from "wgge/core/renderer/canvas/ImageToCanvasRenderer";

export default class CockpitRenderer extends DomRenderer {

	/**
	 * @type MainModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.globeMesh = null;

		this.addAutoEvent(
			this.game.viewBoxSize,
			'change',
			() => this.resize(),
			true
		);

	}

	activateInternal() {
		this.container = this.addElement('div', 'container container-host');

		this.imageRenderer = new ImageToCanvasRenderer(this.game, this.model.cockpit.background, this.container);
		this.addChild(this.imageRenderer);

		this.resize();
	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.canvas);
	}

	renderInternal() {

	}

	resize() {
		this.model.cockpit.background.size.set(this.game.viewBoxSize);
	}
}
