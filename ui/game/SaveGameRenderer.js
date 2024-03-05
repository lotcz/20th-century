import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import DOMHelper from "wgge/core/helper/DOMHelper";
import GlobeRenderer from "./globe/GlobeRenderer";
import SwitchRenderer from "wgge/core/renderer/generic/SwitchRenderer";
import StrategicRenderer from "./interior/strategic/StrategicRenderer";
import MainMenuRenderer from "./interior/menu/MainMenuRenderer";

export default class SaveGameRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.game.assets.preload(this.model.getResourcesForPreload());

		this.container = this.addElement('div', 'container container-host');

		const globe = DOMHelper.createElement(this.container, 'div', 'globe container container-host');
		this.addChild(new GlobeRenderer(this.game, this.model.globe, globe));

		const interior = DOMHelper.createElement(this.container, 'div', 'interior container container-host');
		this.addChild(
			new SwitchRenderer(
				this.game,
				this.model,
				this.model.interiorType,
				{
					'strategic': () => new StrategicRenderer(this.game, this.model, interior),
					'menu': () => new MainMenuRenderer(this.game, this.model, interior)
				}
			)
		);

	}

	deactivateInternal() {
		this.model.triggerEvent('destroy-cache');
		this.resetChildren();
		DOMHelper.destroyElement(this.container);
	}


}
