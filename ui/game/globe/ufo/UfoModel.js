import ObjectModel from "wgge/core/model/ObjectModel";
import GpsUtil from "../../util/GpsUtil";
import Vector3 from "wgge/core/model/vector/Vector3";
import FloatValue from "wgge/core/model/value/FloatValue";
import Vector2 from "wgge/core/model/vector/Vector2";
import WorldConstants from "../../util/WorldConstants";
import ParticleGeneratorModel from "wgge/core/particles/generator/ParticleGeneratorModel";
import BoolValue from "wgge/core/model/value/BoolValue";

export default class UfoModel extends ObjectModel {

	/**
	 * @type Vector2
	 */
	coordinates;

	/**
	 * @type FloatValue
	 */
	altitude;

	/**
	 * @type Vector3
	 */
	position;

	/**
	 * @type FloatValue
	 */
	speed;

	/**
	 * @type ParticleGeneratorModel
	 */
	exhaust;

	/**
	 * @type ParticleGeneratorModel
	 */
	ufoLight;

	/**
	 * @type BoolValue
	 */
	ufoScannerOn;

	constructor() {
		super();

		this.coordinates = this.addProperty('coordinates', new Vector2());
		this.altitude = this.addProperty('altitude', new FloatValue(WorldConstants.UFO_MEDIUM_ALTITUDE));
		this.position = this.addProperty('position', new Vector3());
		this.speed = this.addProperty('speed', new FloatValue());

		this.coordinates.addEventListener('change', () => this.updatePosition());
		this.altitude.addEventListener('change', () => this.updatePosition());
		this.position.addEventListener('change', () => this.updateExhaust());
		this.speed.addEventListener('change', () => this.updateExhaust());

		this.exhaust = this.addProperty('exhaust', new ParticleGeneratorModel());
		this.exhaust.particleTemplate.imageUrl.set('img/smoke-green.png');
		this.exhaust.particleTemplate.scale.set(0.1);

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

		this.ufoScannerOn = this.addProperty('ufoScannerOn', new BoolValue(false));

		this.updatePosition();

	}

	updatePosition() {
		this.position.set(GpsUtil.coordsToPositionRad(this.coordinates, this.altitude.get()));
	}

	updateExhaust() {
		this.exhaust.on.set(this.speed.get() > 0);
		this.exhaust.position.set(this.position);
	}

}
