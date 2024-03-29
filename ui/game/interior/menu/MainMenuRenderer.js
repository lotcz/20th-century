import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import MainMenuPanelRenderer from "./MainMenuPanelRenderer";
import ImageViewRenderer from "wgge/core/renderer/canvas/ImageViewRenderer";

export default class MainMenuRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.globeMesh = null;


	}

	activateInternal() {
		this.container = this.addElement('div', 'container container-host');

		this.addChild(new ImageViewRenderer(this.game, this.model.mainMenuPanel.background, this.container));
		this.addChild(new MainMenuPanelRenderer(this.game, this.model, this.container));
	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.container);
	}

}
