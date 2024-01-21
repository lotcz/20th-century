import * as THREE from "three";
import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import CanvasBackgroundRenderer from "./CanvasBackgroundRenderer";
import Rotation from "wgge/core/model/vector/Rotation";
import GpsUtil from "../util/GpsUtil";
import CollectionRenderer from "wgge/core/renderer/generic/CollectionRenderer";
import CityRenderer from "./CityRenderer";

export default class GlobeRenderer extends DomRenderer {

	/**
	 * @type GlobeModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.globeMesh = null;

		this.addAutoEvent(
			this.game.viewBoxSize,
			'change',
			() => this.resize(),
			true
		)
	}

	activateInternal() {
		this.container = this.addElement('div', 'container container-host');

		this.canvas = DOMHelper.createElement(this.container, 'canvas');
		this.addChild(new CanvasBackgroundRenderer(this.game, this.model, this.canvas));

		// THREE
		this.renderer = new THREE.WebGLRenderer({alpha: true });
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.container.appendChild(this.renderer.domElement);
		DOMHelper.addClass(this.renderer.domElement, 'container');
		this.renderer.setSize(this.game.viewBoxSize.x, this.game.viewBoxSize.y);
		this.renderer.setClearColor(0x000000, 0);

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(50,this.game.viewBoxSize.x / this.game.viewBoxSize.y, 1, 50);
		this.camera.layers.enable(0); // enabled by default
		this.camera.layers.enable(1);

		this.ambientLight = new THREE.AmbientLight(0xe0e0e0);
		this.scene.add(this.ambientLight);

		this.directLight = new THREE.DirectionalLight( 0xe0e0e0, 1);
		this.directLight.position.set( 0, 10, -10 );
		this.scene.add(this.directLight);

		this.globeMesh = new THREE.Mesh(
			new THREE.SphereGeometry(this.model.globeDiameter.get() / 2, 64, 64, 3/2 * Math.PI),
			new THREE.MeshLambertMaterial({color: 0xffffff})
		);

		this.scene.add(this.globeMesh);

		this.atmoMesh = new THREE.Mesh(
			new THREE.SphereGeometry(this.model.globeDiameter.get() / 1.97, 64, 64),
			new THREE.MeshLambertMaterial({transparent: true, side: THREE.DoubleSide})
		);
		this.atmoMesh.layers.set(1);

		this.scene.add(this.atmoMesh);

		this.updateCameraPosition();
		this.updateAtmoVisibility();
		this.resize();

		this.game.assets.getAsset('img/earthmap4k.jpg', (img) => {
			const texture = new THREE.Texture();
			texture.image = img;
			texture.needsUpdate = true;
			texture.repeat.set(1, 1);
			this.globeMesh.material.map = texture;
			this.globeMesh.material.needsUpdate = true;
		});

		this.game.assets.getAsset('img/earthcloudmap.png', (img) => {
			const texture = new THREE.Texture();
			texture.image = img;
			texture.needsUpdate = true;
			texture.wrapS = 1;
			texture.wrapT = 1;
			texture.repeat.set(1, 1);
			this.atmoMesh.material.map = texture;
			this.atmoMesh.material.needsUpdate = true;
		});

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.cities,
				(m) => new CityRenderer(this.game, m, this.scene)
			)
		);
	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.canvas);
		this.canvas = null;
		this.globeMesh = null;
		this.renderer.dispose();
		this.renderer = null;
	}

	renderInternal() {
		if (this.model.zoom.isDirty) {
			this.updateCameraZoom();
		}
		if (this.model.cameraDistance.isDirty) {
			this.updateAtmoVisibility();
		}
		if (this.model.cameraCoordinates.isDirty || this.model.cameraDistance.isDirty) {
			this.updateCameraPosition();
		}
		if (this.model.atmoCoordinates.isDirty) {
			this.updateAtmoPosition();
		}
		this.renderer.render(this.scene, this.camera);
	}

	updateCameraPosition() {
		const position= GpsUtil.coordsToPosition(this.model.cameraCoordinates, this.model.cameraDistance.get());
		//console.log(position);
		this.camera.position.set(position.x, position.y, position.z);
		this.camera.lookAt(0, 0, 0);
	}

	updateAtmoPosition() {
		this.atmoMesh.rotation.set(
			0,
			Rotation.degToRad(this.model.atmoCoordinates.x),
			Rotation.degToRad(this.model.atmoCoordinates.y)
		);
	}

	updateAtmoVisibility() {
		const visible = this.model.cameraDistance.get() > (this.model.globeDiameter.get() * 1.2);
		if (this.camera.layers.isEnabled(1) && !visible) {
			this.camera.layers.disable(1);
		}
		if (visible && !this.camera.layers.isEnabled(1)) {
			this.camera.layers.enable(1);
		}
	}

	updateCameraZoom() {
		this.camera.zoom = this.model.zoom.get();
		this.camera.updateProjectionMatrix();
	}

	resize() {
		this.canvas.width = this.game.viewBoxSize.x;
		this.canvas.height = this.game.viewBoxSize.y;
		this.renderer.setSize(this.game.viewBoxSize.x, this.game.viewBoxSize.y);
		this.camera.aspect = this.game.viewBoxSize.x / this.game.viewBoxSize.y;
		//this.effectFXAA.uniforms['resolution'].value.set(1 / this.game.viewBoxSize.x, 1 / this.game.viewBoxSize.y);
		this.updateCameraZoom();
		this.renderer.render(this.scene, this.camera);
	}
}
