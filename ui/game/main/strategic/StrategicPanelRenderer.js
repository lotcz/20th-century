import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import MenuRenderer from "wgge/game/menu/MenuRenderer";
import SwitchRenderer from "../../util/SwitchRenderer";
import CruiseTabRenderer from "./cruise/CruiseTabRenderer";
import CityTabRenderer from "./city/CityTabRenderer";
import ScannerTabRenderer from "./scanner/ScannerTabRenderer";
import PanelVisitorRenderer from "../../panel/PanelVisitorRenderer";

export default class StrategicPanelRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.wrapper = this.addElement('div', 'alien-panel panel-navigation');

		this.addChild(
			new PanelVisitorRenderer(
				this.game,
				this.model.main.strategic.strategicPanel,
				this.wrapper
			)
		);

		this.container = DOMHelper.createElement(this.wrapper, 'div', 'col stretch');

		this.addChild(
			new MenuRenderer(
				this.game,
				this.model.main.strategic.strategicTabMenu,
				DOMHelper.createElement(this.container, 'div', 'tabs mb-2')
			)
		);

		const tab = DOMHelper.createElement(this.container, 'div', 'tab')
		this.addChild(
			new SwitchRenderer(
				this.game,
				this.model,
				this.model.main.strategic.strategicTab,
				{
					'cruise': () => new CruiseTabRenderer(this.game, this.model.main, tab),
					'city': () => new CityTabRenderer(this.game, this.model.main, tab),
					'scanner': () => new ScannerTabRenderer(this.game, this.model, tab)
				}
			)
		);

	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.wrapper);
	}

}
