import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import DirtyValueRenderer from "wgge/core/renderer/dom/DirtyValueRenderer";
import Vector2Renderer from "wgge/core/renderer/dom/Vector2Renderer";
import PanelVisitorRenderer from "../panel/PanelVisitorRenderer";
import MenuRenderer from "wgge/game/menu/MenuRenderer";

export default class DebugInfoRenderer extends DomRenderer {

	/**
	 * @type MainModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.wrapper = this.addElement('div', 'alien-panel debug-info');

		this.addChild(
			new PanelVisitorRenderer(
				this.game,
				this.model.debugPanel,
				this.wrapper
			)
		);

		this.container = DOMHelper.createElement(this.wrapper, 'div');

		this.addChild(
			new DirtyValueRenderer(
				this.game,
				this.model.cockpit.background.zoom,
				DOMHelper.createElement(this.container, 'div')
			)
		);

		this.addChild(
			new DirtyValueRenderer(
				this.game,
				this.model.cockpit.custom,
				DOMHelper.createElement(this.container, 'div')
			)
		);

		this.addChild(
			new Vector2Renderer(
				this.game,
				this.model.cockpit.background.size,
				DOMHelper.createElement(this.container, 'div')
			)
		);

		this.addChild(
			new Vector2Renderer(
				this.game,
				this.model.cockpit.background.coordinates,
				DOMHelper.createElement(this.container, 'div')
			)
		);

		this.addChild(
			new MenuRenderer(
				this.game,
				this.model.debugMenu,
				DOMHelper.createElement(this.container, 'div')
			)
		);
	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.wrapper);
	}

}
