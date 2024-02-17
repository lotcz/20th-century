import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import GlobeRenderer from "../globe/GlobeRenderer";
import ImageToCanvasRenderer from "wgge/core/renderer/canvas/ImageToCanvasRenderer";

export default class InteriorRenderer extends DomRenderer {

	/**
	 * @type InteriorModel
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

		const globe = DOMHelper.createElement(this.container, 'div', 'globe container container-host');
		const interior = DOMHelper.createElement(this.container, 'div', 'interior container container-host');

		this.addChild(new GlobeRenderer(this.game, this.model.globe, globe));

		this.imageRenderer = new ImageToCanvasRenderer(this.game, this.model.background, interior);
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
		this.model.background.size.set(this.game.viewBoxSize);
	}
}
