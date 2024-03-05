import * as THREE from "three";
import ThreeRenderer from "wgge/core/renderer/three/ThreeRenderer";
import ParticleGeneratorRenderer from "wgge/core/particles/generator/ParticleGeneratorRenderer";

export default class UfoRenderer extends ThreeRenderer {

	/**
	 * @type UfoModel
	 */
	model;

	constructor(game, model, scene) {
		super(game, model, scene);

		this.model = model;
		this.ufoMesh = null;

	}

	activateInternal() {
		this.ufoMesh = new THREE.Group();
		this.scene.add(this.ufoMesh);

		this.game.assets.loadModel3d(1, (model) => {
			this.ufoMesh.add(model);
		});

		this.addChild(new ParticleGeneratorRenderer(this.game, this.model.ufoExhaust, this.scene));
		this.addChild(new ParticleGeneratorRenderer(this.game, this.model.ufoLight, this.ufoMesh));
		this.updatePosition();
	}

	deactivateInternal() {
		this.ufoMesh.removeFromParent();
		this.ufoMesh = null;
	}

	renderInternal() {
		if (this.model.ufoPosition.isDirty) {
			this.updatePosition();
		}
	}

	updatePosition() {
		const position = this.model.ufoPosition;
		this.ufoMesh.position.set(position.x, position.y, position.z);
		this.ufoMesh.lookAt(0, 0, 0);
	}

}
