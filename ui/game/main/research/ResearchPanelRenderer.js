import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import PanelVisitorRenderer from "../../panel/PanelVisitorRenderer";

export default class ResearchPanelRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.wrapper = this.addElement('div', 'alien-panel panel-research');

		this.addChild(
			new PanelVisitorRenderer(
				this.game,
				this.model.research.researchPanel,
				this.wrapper
			)
		);

		this.container = DOMHelper.createElement(this.wrapper, 'div', 'col stretch');
		this.panelTop = DOMHelper.createElement(this.container, 'div', 'row');
		this.panelCenter = DOMHelper.createElement(this.container, 'div', 'row mb-2');
		this.panelBottom = DOMHelper.createElement(this.container, 'div', 'row');


		const woman3 = DOMHelper.createElement(DOMHelper.createElement(this.panelCenter, 'div'),'img', 'icon');
		woman3.src = 'assets/img/humans/woman-young-city-l.png';

		const man2 = DOMHelper.createElement(DOMHelper.createElement(this.panelBottom, 'div'),'img', 'icon-small');
		man2.src = 'assets/img/humans/man-young-l.png';

		DOMHelper.createElement(
			DOMHelper.createElement(this.panelBottom, 'div'),
			'img',
			'icon-small'
		).src = 'assets/img/tech/scanner.png';


	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.wrapper);
	}

}
