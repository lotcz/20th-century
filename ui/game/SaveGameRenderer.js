import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import MainRenderer from "./main/MainRenderer";

export default class SaveGameRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addChild(new MainRenderer(this.game, this.model, this.dom));
	}

}
