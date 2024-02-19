import ControllerBase from "wgge/core/controller/ControllerBase";

export default class ParticleController extends ControllerBase {

	/**
	 * @type ParticleModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;
	}

	updateInternal(delta) {
		const deltaSecs = (delta / 1000);
		this.model.lifetime.increase(-deltaSecs);
		if (this.model.lifetime.get() < 0) {
			this.model.removeMyself();
			return;
		}

		if (this.model.fadeOutDuration.get() > 0 && this.model.lifetime.get() < this.model.fadeOutDuration.get()) {
			this.model.opacity.set(this.model.lifetime.get() / this.model.fadeOutDuration.get());
		}

		this.model.position.add(this.model.movement.multiply(deltaSecs));
		this.model.scale.increase(this.model.scaleGrowth.get() * deltaSecs);
	}

}
