import ControllerBase from "wgge/core/controller/ControllerBase";
import GlobeController from "../globe/GlobeController";
import AnimationVector2Controller from "wgge/core/controller/AnimationVector2Controller";
import {EASING_CUBIC_IN} from "wgge/core/animation/ProgressValue";
import Vector2 from "wgge/core/model/vector/Vector2";

export default class InteriorController extends ControllerBase {

	/**
	 * @type InteriorModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(new GlobeController(this.game, this.model.globe));

		this.addAutoEvent(
			this.game.controls,
			'zoom',
			(z) => this.onZoom(z)
		);

		this.addAutoEvent(
			this.game.controls,
			'key-up',
			(k) => this.onKeyUp(k)
		);

		this.addAutoEvent(
			this.game.controls,
			'key-down',
			(k) => this.onKeyDown(k)
		);

		this.addAutoEvent(
			this.game.controls,
			'left-click',
			(k) => this.onClick(k)
		);

	}

	activateInternal() {

	}

	updateInternal(delta) {

	}

	onZoom(z) {
		this.model.zoom.increase(z > 0 ? -0.5 : 0.5);
	}

	onKeyDown(k) {

	}

	onKeyUp(k) {

	}

	onClick(coords) {
		const center = this.game.viewBoxSize.multiply(0.5);
		const target = new Vector2(
			this.model.background.coordinates.x + (coords.x - center.x),
			this.model.background.coordinates.y + (coords.y - center.y)
		);
		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.background.coordinates,
				target,
				500,
				EASING_CUBIC_IN
			)
		);

	}
}
