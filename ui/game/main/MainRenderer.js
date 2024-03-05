import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import GlobeRenderer from "./globe/GlobeRenderer";
import StrategicRenderer from "./strategic/StrategicRenderer";
import MainInfoRenderer from "./MainInfoRenderer";
import ResearchRenderer from "./research/ResearchRenderer";
import SwitchRenderer from "wgge/core/renderer/generic/SwitchRenderer";

export default class MainRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.game.assets.preload(this.model.main.getResourcesForPreload());

		this.container = this.addElement('div', 'container container-host');

		const globe = DOMHelper.createElement(this.container, 'div', 'globe container container-host');
		this.addChild(new GlobeRenderer(this.game, this.model.main.globe, globe));

		const interior = DOMHelper.createElement(this.container, 'div', 'interior container container-host');
		this.addChild(
			new SwitchRenderer(
				this.game,
				this.model,
				this.model.main.interiorType,
				{
					'strategic': () => new StrategicRenderer(this.game, this.model, interior),
					'research': () => new ResearchRenderer(this.game, this.model, interior)
				}
			)
		);

		this.addChild(
			new MainInfoRenderer(
				this.game,
				this.model,
				this.container
			)
		);

	}

	deactivateInternal() {
		this.model.triggerEvent('destroy-cache');
		this.resetChildren();
		DOMHelper.destroyElement(this.canvas);

	}

}
