import ObjectModel from "wgge/core/model/ObjectModel";
import BoolValue from "wgge/core/model/value/BoolValue";
import Vector3 from "wgge/core/model/vector/Vector3";
import ModelNodeCollection from "wgge/core/model/collection/ModelNodeCollection";
import FloatValue from "wgge/core/model/value/FloatValue";
import ParticleModel from "../ParticleModel";

export default class ParticleGeneratorModel extends ObjectModel {

	/**
	 * @type Vector3
	 */
	position;

	/**
	 * @type BoolValue
	 */
	on;

	/**
	 * @type ParticleModel
	 */
	particleTemplate;

	/**
	 * @type FloatValue
	 */
	particlesPerSecond;

	/**
	 *  new particles may be smaller or bigger
	 * @type FloatValue
	 */
	particleScaleSpread;

	/**
	 *  particles starting point offset
	 * @type Vector3
	 */
	particlePositionSpread;

	/**
	 *  random movement change per second
	 * @type Vector3
	 */
	particleMovementSpread;

	/**
	 * @type FloatValue
	 */
	particleLifetimeSpread;

	/**
	 * @type ModelNodeCollection
	 */
	particles;

	constructor(persistent) {
		super(persistent);

		this.position = this.addProperty('position', new Vector3());
		this.on = this.addProperty('on', new BoolValue(false));

		this.particleTemplate = this.addProperty('particleTemplate', new ParticleModel());

		this.particlesPerSecond = this.addProperty('particlesPerSecond', new FloatValue(50));

		this.particleScaleSpread = this.addProperty('particleScaleSpread', new FloatValue(0.1));
		this.particlePositionSpread = this.addProperty('particlePositionSpread', new Vector3());
		this.particleMovementSpread = this.addProperty('particleMovementSpread', new Vector3(0.1, 0.1, 0.1));
		this.particleLifetimeSpread = this.addProperty('particleLifetimeSpread', new FloatValue(1));

		this.particles =  this.addProperty('particles', new ModelNodeCollection());
	}

}
