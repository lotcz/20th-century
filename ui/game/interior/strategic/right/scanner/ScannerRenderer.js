import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import ScannerSideRenderer from "./side/ScannerSideRenderer";
import ScannerDetailRenderer from "./detail/ScannerDetailRenderer";

export default class ScannerRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addChild(new ScannerDetailRenderer(this.game, this.model, dom));
		this.addChild(new ScannerSideRenderer(this.game, this.model, dom));


	}


}
