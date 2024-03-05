import ObjectModel from "wgge/core/model/ObjectModel";
import ParticleGeneratorModel from "../../../particles/generator/ParticleGeneratorModel";
import GpsUtil from "../../../util/GpsUtil";
import Vector3 from "wgge/core/model/vector/Vector3";
import FloatValue from "wgge/core/model/value/FloatValue";
import Vector2 from "wgge/core/model/vector/Vector2";
import WorldConstants from "../../../util/WorldConstants";

export default class UfoModel extends ObjectModel {

	/**
	 * @type Vector2
	 */
	ufoCoordinates;

	/**
	 * @type FloatValue
	 */
	ufoAltitude;

	/**
	 * @type Vector3
	 */
	ufoPosition;

	/**
	 * @type FloatValue
	 */
	ufoSpeed;

	/**
	 * @type ParticleGeneratorModel
	 */
	ufoExhaust;

	/**
	 * @type ParticleGeneratorModel
	 */
	ufoLight;

	constructor() {
		super();

		this.ufoCoordinates = this.addProperty('ufoCoordinates', new Vector2());
		this.ufoAltitude = this.addProperty('ufoAltitude', new FloatValue(WorldConstants.UFO_MEDIUM_ALTITUDE));
		this.ufoPosition = this.addProperty('ufoPosition', new Vector3());
		this.ufoSpeed = this.addProperty('ufoSpeed', new FloatValue());

		this.ufoCoordinates.addEventListener('change', () => this.updatePosition());
		this.ufoAltitude.addEventListener('change', () => this.updatePosition());
		this.ufoPosition.addEventListener('change', () => this.updateExhaust());
		this.ufoSpeed.addEventListener('change', () => this.updateExhaust());

		this.ufoExhaust = this.addProperty('ufoExhaust', new ParticleGeneratorModel());
		this.ufoExhaust.particleTemplate.imageUrl.set('img/smoke-green.png');
		this.ufoExhaust.particleTemplate.scale.set(0.1);

		this.ufoLight = this.addProperty('ufoLight', new ParticleGeneratorModel());
		this.ufoLight.particleTemplate.imageUrl.set('img/smoke-red.png');
		this.ufoLight.particleTemplate.lifetime.set(0.5);
		this.ufoLight.particleTemplate.scale.set(0.1);
		this.ufoLight.particleTemplate.scaleGrowth.set(0);
		this.ufoLight.particleTemplate.fadeOutDuration.set(0.1);
		this.ufoLight.particlePositionSpread.set(0.01, 0.01, 0.01);
		this.ufoLight.particleMovementSpread.set(0.01, 0.01, 0.01);
		this.ufoLight.particleLifetimeSpread.set(0.25);
		this.ufoLight.particleScaleSpread.set(0.05);
		this.ufoLight.particlesPerSecond.set(8);
		this.ufoLight.on.set(true);

		this.updatePosition();

	}

	updatePosition() {
		this.ufoPosition.set(GpsUtil.coordsToPositionRad(this.ufoCoordinates, this.ufoAltitude.get()));
	}

	updateExhaust() {
		this.ufoExhaust.on.set(this.ufoSpeed.get() > 0);
		this.ufoExhaust.position.set(this.ufoPosition);
	}

}
