import ControllerBase from "wgge/core/controller/ControllerBase";
import ParticleGeneratorController from "../../../particles/generator/ParticleGeneratorController";

export default class UfoController extends ControllerBase {

	/**
	 * @type UfoModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.lastPosition = null;

		this.addChild(new ParticleGeneratorController(this.game, this.model.ufoExhaust));
		this.addChild(new ParticleGeneratorController(this.game, this.model.ufoLight));

		this.lastPosition = null;
		this.lastPositionTime = null;
	}

	updateInternal(delta) {
		this.updateSpeed();

	}

	updateSpeed() {
		const now = performance.now()
		if (this.lastPosition && this.lastPositionTime) {
			const time = (now - this.lastPositionTime) / 1000;
			if (time > 0) {
				this.model.ufoSpeed.set(this.model.ufoPosition.distanceTo(this.lastPosition) / time);
			}
		}
		this.lastPosition = this.model.ufoPosition.clone();
		this.lastPositionTime = now;
	}

}
