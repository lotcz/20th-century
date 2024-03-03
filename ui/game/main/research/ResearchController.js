import ControllerBase from "wgge/core/controller/ControllerBase";
import AnimationVector2Controller from "wgge/core/controller/AnimationVector2Controller";
import {EASING_CUBIC_IN} from "wgge/core/animation/ProgressValue";
import Vector2 from "wgge/core/model/vector/Vector2";

export default class ResearchController extends ControllerBase {

	/**
	 * @type MainModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.mouseAnimation = null;

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

		this.addAutoEvent(
			this.game.controls.mouseCoordinates,
			'change',
			() => this.onMouseMove(this.game.controls.mouseCoordinates)
		);

	}

	activateInternal() {

	}

	updateInternal(delta) {

	}

	onZoom(z) {
		//this.model.globe.zoom.increase(z > 0 ? -0.5 : 0.5);
	}

	onKeyDown(k) {

	}

	onKeyUp(k) {

	}

	onClick(coords) {
		return;
		const center = this.game.viewBoxSize.multiply(0.5);
		const target = new Vector2(
			this.model.scanner.background.coordinates.x + (coords.x - center.x),
			this.model.scanner.background.coordinates.y + (coords.y - center.y)
		);
		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.scanner.background.coordinates,
				target,
				500,
				EASING_CUBIC_IN
			)
		);

	}

	onMouseMove(coords) {
		if (this.mouseAnimation && this.mouseAnimation.isActivated) {
			this.removeChild(this.mouseAnimation);
		}

		const center = this.game.viewBoxSize.multiply(0.5);
		const diff = new Vector2(
			(coords.x - center.x) / center.x,
			(coords.y - center.y) / center.y
		);


		const imageCenter = this.model.scanner.background.size.multiply(0.5);
		const target = new Vector2(
			imageCenter.x + (diff.x * imageCenter.x),
			imageCenter.y + (diff.y * imageCenter.y)
		);

		this.model.scanner.custom.set(target.toString());

		this.mouseAnimation = new AnimationVector2Controller(
			this.game,
			this.model.scanner.background.coordinates,
			target,
			500
		)
		this.addChild(this.mouseAnimation);
	}
}
