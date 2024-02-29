import ControllerBase from "wgge/core/controller/ControllerBase";
import GlobeController from "../../globe/GlobeController";

export default class StrategicController extends ControllerBase {

	/**
	 * @type MainModel
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


}
