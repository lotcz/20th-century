import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import GlobeRenderer from "./globe/GlobeRenderer";
import ScannerRenderer from "./scanner/ScannerRenderer";
import ConditionalNodeRenderer from "wgge/core/renderer/generic/ConditionalNodeRenderer";
import StrategicRenderer from "./strategic/StrategicRenderer";
import {INTERIOR_TYPE_SCANNER} from "./MainModel";
import MainInfoRenderer from "./MainInfoRenderer";
import YearRenderer from "./YearRenderer";

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
			new ConditionalNodeRenderer(
				this.game,
				this.model.main.interiorType,
				() => this.model.main.interiorType.equalsTo(INTERIOR_TYPE_SCANNER),
				() => new ScannerRenderer(this.game, this.model, interior),
				() => new StrategicRenderer(this.game, this.model, interior)
			)
		);

		this.addChild(
			new MainInfoRenderer(
				this.game,
				this.model,
				this.container
			)
		);

		this.addChild(
			new YearRenderer(
				this.game,
				this.model,
				this.container
			)
		);

	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.canvas);
	}

}
