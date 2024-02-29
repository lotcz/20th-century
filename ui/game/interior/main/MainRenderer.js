import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import GlobeRenderer from "../../globe/GlobeRenderer";
import CockpitRenderer from "../cockpit/CockpitRenderer";
import ConditionalNodeRenderer from "wgge/core/renderer/generic/ConditionalNodeRenderer";
import StrategicRenderer from "../strategic/StrategicRenderer";
import {INTERIOR_TYPE_COCKPIT} from "./MainModel";
import DebugInfoRenderer from "./DebugInfoRenderer";

export default class MainRenderer extends DomRenderer {

	/**
	 * @type MainModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.container = this.addElement('div', 'container container-host');

		const globe = DOMHelper.createElement(this.container, 'div', 'globe container container-host');
		this.addChild(new GlobeRenderer(this.game, this.model.globe, globe));

		const interior = DOMHelper.createElement(this.container, 'div', 'interior container container-host');
		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.model.interiorType,
				() => this.model.interiorType.equalsTo(INTERIOR_TYPE_COCKPIT),
				() => new CockpitRenderer(this.game, this.model, interior),
				() => new StrategicRenderer(this.game, this.model, interior)
			)
		);

		this.addChild(
			new DebugInfoRenderer(
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
