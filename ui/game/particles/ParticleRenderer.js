import * as THREE from "three";
import ThreeRenderer from "../util/ThreeRenderer";

export default class ParticleRenderer extends ThreeRenderer {

	/**
	 * @type ParticleModel
	 */
	model;

	sprite;

	constructor(game, model, scene) {
		super(game, model, scene);

		this.model = model;
	}

	activateInternal() {
		this.game.assets.getAsset(
			this.model.imageUrl.get(),
			(img) => {
				const texture = new THREE.Texture();
				texture.image = img;
				texture.needsUpdate = true;
				const material = new THREE.SpriteMaterial({map: texture});
				this.sprite = new THREE.Sprite(material);
				this.scene.add(this.sprite);
			}
		);
	}

	deactivateInternal() {
		if (this.sprite) {
			this.sprite.opacity
			this.sprite.removeFromParent();
		}
	}

	renderInternal() {
		if (!this.sprite) return;

		this.sprite.position.set(this.model.position.x, this.model.position.y, this.model.position.z);
		this.sprite.scale.set(this.model.scale.get(), this.model.scale.get(), this.model.scale.get());

		if (this.model.opacity.isDirty) {
			this.sprite.material.opacity = this.model.opacity.get();
			this.sprite.material.needsUpdate = true;
		}
	}

}
