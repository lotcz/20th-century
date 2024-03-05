import * as THREE from "three";
import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import CollectionRenderer from "wgge/core/renderer/generic/CollectionRenderer";
import WorldConstants from "../../../../../../util/WorldConstants";
import ScannerViewCityRenderer from "./ScannerViewCityRenderer";
import Vector2 from "wgge/core/model/vector/Vector2";

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
			this.model.strategic.scannerPanel.detail.scannerViewSize,
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
		if (this.model.globe.ufo.position.isDirty) {
			this.updateCameraPosition();
		}
		this.renderer.render(this.scene, this.camera);
	}

	updateCameraPosition() {
		const position= this.model.globe.ufo.position;
		this.camera.position.set(position.x, position.y, position.z);
		this.camera.lookAt(0, 0, 0);
	}

	updateCameraZoom() {
		this.camera.zoom = this.model.globe.zoom.get();
		this.camera.updateProjectionMatrix();
	}

	resize() {
		const size = this.model.strategic.scannerPanel.detail.scannerViewSize;
		this.renderer.setSize(size.x, size.y);
		this.camera.aspect = size.x / size.y;
		this.updateCameraZoom();
		this.renderer.render(this.scene, this.camera);
	}

	raycast() {
		const size = this.model.strategic.scannerPanel.detail.scannerViewSize;
		const rect = this.container.getBoundingClientRect();
		const position = new Vector2(rect.left, rect.top);
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		const mouseCoordinates = this.game.controls.mouseCoordinates.subtract(position);

		if (!(mouseCoordinates.x > 0 && mouseCoordinates.x < size.x && mouseCoordinates.y > 0 && mouseCoordinates.y < size.y)) {
			return;
		}

		mouse.x = (mouseCoordinates.x / size.x) * 2 - 1;
		mouse.y = -(mouseCoordinates.y / size.y) * 2 + 1;

		raycaster.setFromCamera(mouse, this.camera);
		raycaster.layers.disable(WorldConstants.LAYER_DEFAULT);
		raycaster.layers.enable(WorldConstants.LAYER_SCANNER_OBJECTS);
		raycaster.layers.enable(WorldConstants.LAYER_CITIES);
		const intersects = raycaster.intersectObject(this.scene, true);

		if (intersects.length > 0) {
			for (let i = 0, max = intersects.length; i < max; i++) {
				const object = intersects[i].object;
				if (!object) continue;
				if (object.userData.raycastCity) {
					this.model.globe.cursorAtCity.set(object.userData.raycastCity);
					return;
				}
				if (object.userData.raycastHuman) {
					this.model.globe.cursorAtHuman.set(object.userData.raycastHuman);
					return;
				}
			}
		}
		this.model.globe.cursorAtCity.set(null);
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
			this.model.strategic.scannerPanel.detail.scannerViewSize.x / this.model.strategic.scannerPanel.detail.scannerViewSize.y,
			0.1,
			WorldConstants.CAMERA_VISIBILITY_RADIUS
		);
		this.camera.layers.enable(WorldConstants.LAYER_DEFAULT);
		this.camera.layers.enable(WorldConstants.LAYER_GLOBE);
		this.camera.layers.enable(WorldConstants.LAYER_SCANNER_OBJECTS);

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
