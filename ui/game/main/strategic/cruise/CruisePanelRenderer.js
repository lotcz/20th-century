import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import MenuRenderer from "wgge/game/menu/MenuRenderer";
import PanelVisitorRenderer from "../../../panel/PanelVisitorRenderer";

export default class CruisePanelRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.wrapper = this.addElement('div', 'alien-panel panel-cruise');

		this.addChild(
			new PanelVisitorRenderer(
				this.game,
				this.model.main.strategic.cruisePanel,
				this.wrapper
			)
		);

		this.container = DOMHelper.createElement(this.wrapper,'div', 'cruise-menu col stretch');

		this.panelTop = DOMHelper.createElement(this.container, 'div', 'col flex-1');
		this.panelCenter = DOMHelper.createElement(this.container, 'div', 'col flex-1');
		this.panelBottom = DOMHelper.createElement(this.container, 'div', 'col flex-1');

		const woman = DOMHelper.createElement(DOMHelper.createElement(this.panelTop, 'div'),'img');
		woman.src = 'assets/img/tech/ufo.png';

		this.addChild(
			new MenuRenderer(
				this.game,
				this.model.main.strategic.cruiseAltitudeMenu,
				DOMHelper.createElement(this.panelTop, 'div', 'altitude mb-2')
			)
		);

		this.addChild(
			new MenuRenderer(
				this.game,
				this.model.main.strategic.cruiseExploreMenu,
				DOMHelper.createElement(this.panelCenter, 'div', 'explore')
			)
		);

		this.addChild(
			new MenuRenderer(
				this.game,
				this.model.main.strategic.cruiseCityMenu,
				DOMHelper.createElement(this.panelBottom, 'div', 'city')
			)
		);

		this.addChild(
			new MenuRenderer(
				this.game,
				this.model.main.strategic.toggleScannerMenu,
				DOMHelper.createElement(this.panelBottom, 'div', 'city')
			)
		);

	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.container);
	}

}
