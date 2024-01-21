import * as THREE from "three";
import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import GlobeRenderer from "../globe/GlobeRenderer";
import ImageToCanvasRenderer from "wgge/core/renderer/canvas/ImageToCanvasRenderer";
import Vector3 from "wgge/core/model/vector/Vector3";

const POSITIONS = {
	camera: new Vector3(0, 1, -25),
	cameraLook: new Vector3(0, 1, -100),
	alien: new Vector3(0, 0, -30),
	cube: new Vector3(-4, 0, -27),
	sphere: new Vector3(4, 1, -27)
};

export default class InteriorRenderer extends DomRenderer {

	/**
	 * @type InteriorModel
	 */
	model;

	/**
	 * @type AnimationHelper
	 */
	alien;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.globeMesh = null;

		this.addAutoEvent(
			this.game.viewBoxSize,
			'change',
			() => this.resize(),
			true
		);

	}

	activateInternal() {
		this.container = this.addElement('div', 'container container-host');

		const globe = DOMHelper.createElement(this.container, 'div', 'globe container container-host');
		const interior = DOMHelper.createElement(this.container, 'div', 'interior container container-host');

		this.addChild(new GlobeRenderer(this.game, this.model.globe, globe));

		this.addChild(new ImageToCanvasRenderer(this.game, this.model.background, interior));

		// THREE
		this.renderer = new THREE.WebGLRenderer({alpha: true });
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		interior.appendChild(this.renderer.domElement);
		DOMHelper.addClass(this.renderer.domElement, 'container');
		this.renderer.setSize(this.game.viewBoxSize.x, this.game.viewBoxSize.y);
		this.scene = new THREE.Scene();
		//this.scene.fog = new THREE.Fog( 0x050511, 8, 12 );

		this.camera = new THREE.PerspectiveCamera(50,this.game.viewBoxSize.x / this.game.viewBoxSize.y, 0.1, 150);
		this.camera.position.set(POSITIONS.camera.x, POSITIONS.camera.y, POSITIONS.camera.z);
		this.camera.lookAt(POSITIONS.cameraLook.x, POSITIONS.cameraLook.y, POSITIONS.cameraLook.z);

		this.ambientLight = new THREE.AmbientLight(0xe0e0e0);
		//this.scene.add(this.ambientLight);

		this.directLight = new THREE.DirectionalLight( 0xe0e0e0, 0.5);
		this.directLight.position.set( 5, 5, 5 );
		this.directLight.castShadow = true;
		this.scene.add(this.directLight);
/*
		this.game.assets.getAsset('m3d/2', (interior) => {
			this.interior = interior;
			this.scene.add(this.interior);
			const material = new THREE.MeshPhongMaterial({color: 0xc0c0c0, side: THREE.DoubleSide});
			this.interior.traverse(
				(mesh) => {
					if (mesh.material && mesh.geometry) {
						//mesh.material.dispose();
						mesh.material = material;
						//mesh.castShadow = true;
						mesh.receiveShadow = false;
				.renderer.setClearColor(0x000000, 0);

		this.scene = new THREE.Scene();
		//this.sc	}
					mesh.needsUpdate = true;
				}
			);
			material.needsUpdate = true;
		});
*/
		this.game.assets.getAsset('m3a/1', (anim) => {
			this.alien = anim;
			this.scene.add(this.alien.mesh);
			this.alien.mesh.position.set(POSITIONS.alien.x, POSITIONS.alien.y, POSITIONS.alien.z);
			this.game.assets.getAsset(
				`mat/2`,
				(material) => {
					this.alien.mesh.traverse(
						(mesh) => {
							if (mesh.material && mesh.material.name === "SkinMaterial" && mesh.geometry) {
								mesh.material.dispose();
								mesh.material = material;
								mesh.castShadow = true;
								mesh.receiveShadow = false;
							}
							material.needsUpdate = true;
							mesh.needsUpdate = true;

							const sphere = new THREE.Mesh(
								new THREE.SphereGeometry(1),
								material
							);
							sphere.position.set(POSITIONS.sphere.x, POSITIONS.sphere.y, POSITIONS.sphere.z);
							this.scene.add(sphere);

							const cube = new THREE.Mesh(
								new THREE.BoxGeometry(2, 2, 2),
								material
							);
							cube.position.set(POSITIONS.cube.x, POSITIONS.cube.y, POSITIONS.cube.z)
							this.scene.add(cube);
						}
					);
				}
			);
			this.alien.activateAction('Armature|mixamo.com|Layer0', 0, false);
		});

		this.resize();
	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.canvas);
		this.canvas = null;
		this.alien = null;
		this.renderer.dispose();
		this.renderer = null;
	}

	renderInternal() {
		if (this.model.zoom.isDirty) {
			this.updateCameraZoom();
		}
		if (this.alien) {
			this.alien.update();
		}
		this.renderer.render(this.scene, this.camera);
	}

	updateCameraZoom() {
		this.camera.zoom = this.model.zoom.get();
		this.camera.updateProjectionMatrix();
	}

	resize() {
		this.model.background.size.set(this.game.viewBoxSize);
		this.renderer.setSize(this.game.viewBoxSize.x, this.game.viewBoxSize.y);
		this.camera.aspect = this.game.viewBoxSize.x / this.game.viewBoxSize.y;
		this.updateCameraZoom();
		this.renderer.render(this.scene, this.camera);
	}
}
