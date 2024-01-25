import CanvasRenderer from "wgge/core/renderer/canvas/CanvasRenderer";
import Vector2 from "wgge/core/model/vector/Vector2";
import NumberHelper from "wgge/core/helper/NumberHelper";

export default class CanvasBackgroundRenderer extends CanvasRenderer {

	/**
	 * @type GlobeModel
	 */
	model;

	constructor(game, model, canvas) {
		super(game, model, canvas);

		this.model = model;

		this.addAutoEvent(
			this.game.viewBoxSize,
			'change',
			() => this.renderStars(),
			true
		);

	}

	renderInternal() {
		if (this.model.cameraDistance.isDirty) {
			this.renderStars();
		}
	}

	renderStars() {
		this.drawRect(
			new Vector2(),
			this.game.viewBoxSize,
			'rgba(10, 20, 30)'
		);
		const MAGNITUDE = 400;
		for (let i = 0; i < MAGNITUDE; i++) {
			this.drawCircle(
				new Vector2(
					NumberHelper.random(0, this.game.viewBoxSize.x),
					NumberHelper.random(0, this.game.viewBoxSize.y)
				),
				NumberHelper.random(0.1, 2),
				'white'
			);
		}
	}

}
