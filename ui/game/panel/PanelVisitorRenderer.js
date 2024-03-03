import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import ProgressValue from "wgge/core/animation/ProgressValue";
import Vector2 from "wgge/core/model/vector/Vector2";
import WorldConstants from "../util/WorldConstants";

export default class PanelVisitorRenderer extends DomRenderer {

	/**
	 * @type AlienPanelModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addAutoEvent(
			this.game.viewBoxSize,
			'change',
			() => this.renderInternal(),
			true
		);

	}

	renderInternal() {
		const rangeEnd = this.game.viewBoxSize.subtract(this.model.size.add(WorldConstants.PANEL_MARGIN));
		const rangeStart = rangeEnd.add(WorldConstants.PANEL_MARGIN).multiply(0.5);

		const progressX = new ProgressValue(rangeStart.x, rangeEnd.x);
		const progressY = new ProgressValue(rangeStart.y, rangeEnd.y);
		const panelCornerPosition = new Vector2(
			progressX.get(this.model.alignment.x),
			progressY.get(this.model.alignment.y)
		);

		this.dom.style.left = `${panelCornerPosition.x}px`;
		this.dom.style.top = `${panelCornerPosition.y}px`;
		this.dom.style.width = `${this.model.size.x}px`;
		this.dom.style.height = `${this.model.size.y}px`;
	}

}
