import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import MenuRenderer from "wgge/game/menu/MenuRenderer";

export default class CruiseTabRenderer extends DomRenderer {

	/**
	 * @type MainModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.container = this.addElement('div', 'cruise-tab row stretch');

		this.panelLeft = DOMHelper.createElement(this.container, 'div', 'col flex-1');
		this.panelCenter = DOMHelper.createElement(this.container, 'div', 'col flex-1');
		this.panelRight = DOMHelper.createElement(this.container, 'div', 'col flex-1');

		this.addChild(
			new MenuRenderer(
				this.game,
				this.model.strategic.cruiseAltitudeMenu,
				DOMHelper.createElement(this.panelLeft, 'div', 'altitude mb-2')
			)
		);

		this.addChild(
			new MenuRenderer(
				this.game,
				this.model.strategic.cruiseExploreMenu,
				DOMHelper.createElement(this.panelLeft, 'div', 'explore')
			)
		);

		this.addChild(
			new MenuRenderer(
				this.game,
				this.model.strategic.cruiseCityMenu,
				DOMHelper.createElement(this.panelCenter, 'div', 'city')
			)
		);

		const woman = DOMHelper.createElement(DOMHelper.createElement(this.panelCenter, 'div'),'img');
		woman.src = 'assets/img/tech/ufo.png';

	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.container);
	}

}
