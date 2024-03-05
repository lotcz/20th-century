import * as THREE from "three";
import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import CollectionRenderer from "wgge/core/renderer/generic/CollectionRenderer";
import WorldConstants from "../../../../../util/WorldConstants";
import ScannerViewCityRenderer from "./ScannerViewCityRenderer";

export default class ScannerViewRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.globe.cities,
				(m) => new ScannerViewCityRenderer(this.game, m, this.earthGroup)
			)
		);

		this.addAutoEvent(
			this.model,
			'destroy-cache',
			() => this.destroyCache()
		);

		this.addAutoEvent(
			this.model.strategic.scannerPanel.scannerViewSize,
			'change',
			() => this.resize(),
			true
		);

		this.addAutoEvent(
			this.game.controls.mouseCoordinates,
			'change',
			() => this.raycast(),
			true
		);
	}

	activateInternal() {
		this.container = this.addElement('div', 'scanner-view border');

		this.restoreSceneFromCache();
		this.container.appendChild(this.renderer.domElement);
		DOMHelper.addClass(this.renderer.domElement, 'container');

		this.updateCameraPosition();
		this.resize();
	}

	deactivateInternal() {
		DOMHelper.destroyElement(this.container);
		this.container = null;
	}

	renderInternal() {
		if (this.model.globe.zoom.isDirty) {
			this.updateCameraZoom();
		}
		if (this.model.globe.ufo.ufoPosition.isDirty) {
			this.updateCameraPosition();
		}
		this.renderer.render(this.scene, this.camera);
	}

	updateCameraPosition() {
		const position= this.model.globe.ufo.ufoPosition;
		this.camera.position.set(position.x, position.y, position.z);
		this.camera.lookAt(0, 0, 0);
	}

	updateCameraZoom() {
		this.camera.zoom = this.model.globe.zoom.get();
		this.camera.updateProjectionMatrix();
	}

	resize() {
		const size = this.model.strategic.scannerPanel.scannerViewSize;
		this.renderer.setSize(size.x, size.y);
		this.camera.aspect = size.x / size.y;
		this.updateCameraZoom();
		this.renderer.render(this.scene, this.camera);
	}

	raycast() {
		const size = this.model.strategic.scannerPanel.scannerViewSize;
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		mouse.x = (this.game.controls.mouseCoordinates.x / this.game.viewBoxSize.x) * 2 - 1;
		mouse.y = -(this.game.controls.mouseCoordinates.y / this.game.viewBoxSize.y) * 2 + 1;

		raycaster.setFromCamera(mouse, this.camera);
		const intersects = raycaster.intersectObject(this.scene, true);

		if (intersects.length > 0) {
			for (let i = 0, max = intersects.length; i < max; i++) {
				const object = intersects[i].object;
				if (!object) continue;
				if (object.raycastCity) {
					this.model.triggerEvent('raycast-city', object.raycastCity);
					return;
				}
			}
		}
		this.model.triggerEvent('raycast-city', null);
	}

	restoreSceneFromCache() {
		if (this.model.cachedScannerScene) {
			this.renderer = this.model.cachedScannerScene.renderer;
			this.camera = this.model.cachedScannerScene.camera;
			this.scene = this.model.cachedScannerScene.scene;
			this.earthGroup = this.model.cachedScannerScene.earthGroup;
			return;
		}

		// THREE
		this.renderer = new THREE.WebGLRenderer({alpha: true });
		this.renderer.setClearColor(0x000000, 0);

		this.scene = new THREE.Scene();
		this.earthGroup = new THREE.Group();
		this.scene.add(this.earthGroup);

		this.camera = new THREE.PerspectiveCamera(
			33,
			this.model.strategic.scannerPanel.scannerViewSize.x / this.model.strategic.scannerPanel.scannerViewSize.y,
			0.1,
			WorldConstants.CAMERA_VISIBILITY_RADIUS
		);
		this.earthGroup.add(this.camera);

		this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
		this.scene.add(this.ambientLight);

		this.globeMesh = new THREE.Mesh(
			new THREE.SphereGeometry(WorldConstants.EARTH_RADIUS, 64, 64, 3/2 * Math.PI),
			new THREE.MeshLambertMaterial({color: 0xffffff})
		);
		this.earthGroup.add(this.globeMesh);

		this.game.assets.getAsset('img/earth_scan.jpg', (img) => {
			const texture = new THREE.Texture();
			texture.image = img;
			texture.needsUpdate = true;
			texture.repeat.set(1, 1);
			this.globeMesh.material.map = texture;
			this.globeMesh.material.needsUpdate = true;
		});

		this.model.cachedScannerScene = {
			'renderer': this.renderer,
			'camera': this.camera,
			'scene': this.scene,
			'earthGroup': this.earthGroup
		};
	}

	destroyCache() {
		this.renderer.dispose();
		this.renderer = null;
		this.globeMesh = null;
		this.earthGroup = null;
		this.scene = null;
		this.camera = null;
		this.model.cachedScannerScene = null;
	}
}
