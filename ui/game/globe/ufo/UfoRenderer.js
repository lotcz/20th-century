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
		this.scannerPointer = null;

		this.addAutoEvent(
			this.model.ufoScannerOn,
			'change',
			() => {
				if (this.scannerPointer) {
					this.scannerPointer.removeFromParent();
					this.scannerPointer = null;
				}

				if (!this.model.ufoScannerOn.get()) return;

				const material = new THREE.LineBasicMaterial({color: 0xffffff, vertexColors: true});

				const color = new THREE.Color();
				const colors = [];
				color.setHex(0xff0000);
				colors.push(color.r, color.g, color.b);
				color.setHex(0xffffff);
				colors.push(color.r, color.g, color.b);

				const points = [];
				points.push(new THREE.Vector3(0, 0, 0));
				points.push(new THREE.Vector3(0, 0, 3));
				const geometry = new THREE.BufferGeometry().setFromPoints(points);
				geometry.setAttribute( 'color', new THREE.Float32BufferAttribute(colors, 3 ) );
				this.scannerPointer = new THREE.Line(geometry, material);
				this.ufoMesh.add(this.scannerPointer);
			},
			true
		);
	}

	activateInternal() {
		this.ufoMesh = new THREE.Group();
		this.scene.add(this.ufoMesh);

		this.game.assets.loadModel3d(1, (model) => {
			this.ufoMesh.add(model);
		});

		this.addChild(new ParticleGeneratorRenderer(this.game, this.model.exhaust, this.scene));
		this.addChild(new ParticleGeneratorRenderer(this.game, this.model.ufoLight, this.ufoMesh));
		this.updatePosition();
	}

	deactivateInternal() {
		this.ufoMesh.removeFromParent();
		this.ufoMesh = null;
		if (this.scannerPointer) {
			this.scannerPointer.removeFromParent();
			this.scannerPointer = null;
		}
	}

	renderInternal() {
		if (this.model.position.isDirty) {
			this.updatePosition();
		}
	}

	updatePosition() {
		const position = this.model.position;
		this.ufoMesh.position.set(position.x, position.y, position.z);
		this.ufoMesh.lookAt(0, 0, 0);
	}

}
