import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import CruisePanelRenderer from "./right/cruise/CruisePanelRenderer";
import SwitchRenderer from "wgge/core/renderer/generic/SwitchRenderer";
import ScannerPanelRenderer from "./right/scanner/ScannerPanelRenderer";
import InfoPanelRenderer from "./left/info/InfoPanelRenderer";
import ResearchPanelRenderer from "./left/research/ResearchPanelRenderer";

export default class StrategicRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.container = this.addElement('div', 'container container-host');
		this.panel = DOMHelper.createElement(this.container, 'div', 'container container-host');

		this.addChild(
			new SwitchRenderer(
				this.game,
				this.model,
				this.model.strategic.selectedPanelLeft,
				{
					'research': () => new ResearchPanelRenderer(this.game, this.model, this.panel)
				}
			)
		);

		this.addChild(
			new SwitchRenderer(
				this.game,
				this.model,
				this.model.strategic.selectedPanelRight,
				{
					'scanner': () => new ScannerPanelRenderer(this.game, this.model, this.panel)
				}
			)
		);

		this.addChild(
			new InfoPanelRenderer(
				this.game,
				this.model,
				this.container
			)
		);

		this.addChild(
			new CruisePanelRenderer(
				this.game,
				this.model,
				this.container
			)
		);

	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.container);
	}


}
