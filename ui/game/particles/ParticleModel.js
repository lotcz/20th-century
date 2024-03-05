import ObjectModel from "wgge/core/model/ObjectModel";
import Vector3 from "wgge/core/model/vector/Vector3";
import FloatValue from "wgge/core/model/value/FloatValue";
import StringValue from "wgge/core/model/value/StringValue";

export default class ParticleModel extends ObjectModel {

	/**
	 * @type StringValue
	 */
	imageUrl;

	/**
	 * @type Vector3
	 */
	position;

	/**
	 * @type FloatValue
	 */
	scale;

	/**
	 * @type FloatValue
	 */
	opacity;

	/**
	 * @type Vector3
	 */
	movement;

	/**
	 * Remaining lifetime in seconds
	 * @type FloatValue
	 */
	lifetime;

	/**
	 * Per second
	 * @type FloatValue
	 */
	scaleGrowth;

	/**
	 * In seconds
	 * @type FloatValue
	 */
	fadeOutDuration;

	constructor(persistent) {
		super(persistent);

		this.imageUrl = this.addProperty('imageUrl', new StringValue('img/smoke-white.png'));
		this.position = this.addProperty('position', new Vector3());
		this.scale = this.addProperty('scale', new FloatValue(1));
		this.opacity = this.addProperty('opacity', new FloatValue(1));
		this.movement = this.addProperty('movement', new Vector3());
		this.lifetime = this.addProperty('lifetime', new FloatValue(1));
		this.scaleGrowth = this.addProperty('scaleGrowth', new FloatValue(-0.12));
		this.fadeOutDuration = this.addProperty('fadeOutDuration', new FloatValue(0.3));
	}

	getResourcesForPreloadInternal() {
		return [this.imageUrl.get()];
	}

}
