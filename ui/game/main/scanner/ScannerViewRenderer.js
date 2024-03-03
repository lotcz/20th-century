import * as THREE from "three";
import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import GpsUtil from "../../util/GpsUtil";
import CollectionRenderer from "wgge/core/renderer/generic/CollectionRenderer";
import WorldConstants from "../../util/WorldConstants";
import ScannerCityRenderer from "./ScannerCityRenderer";

export default class ScannerViewRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.addAutoEvent(
			this.model.main.scanner.scannerViewSize,
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
		this.container = this.addElement('div', 'scanner-view');

		// THREE
		this.renderer = new THREE.WebGLRenderer({alpha: true });
		this.container.appendChild(this.renderer.domElement);
		DOMHelper.addClass(this.renderer.domElement, 'container');
		this.renderer.setSize(this.game.viewBoxSize.x, this.game.viewBoxSize.y);
		this.renderer.setClearColor(0x000000, 0);

		this.scene = new THREE.Scene();
		this.earthGroup = new THREE.Group();
		this.scene.add(this.earthGroup);

		this.camera = new THREE.PerspectiveCamera(
			50,
			this.game.viewBoxSize.x / this.game.viewBoxSize.y,
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

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.main.globe.cities,
				(m) => new ScannerCityRenderer(this.game, m, this.earthGroup)
			)
		);

		this.updateCameraPosition();
		this.resize();
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
		if (this.model.main.globe.zoom.isDirty) {
			this.updateCameraZoom();
		}
		if (this.model.main.globe.ufoCoordinates.isDirty || this.model.main.globe.ufoAltitude.isDirty) {
			this.updateCameraPosition();
		}
		this.renderer.render(this.scene, this.camera);
	}

	updateCameraPosition() {
		const position= GpsUtil.coordsToPositionRad(this.model.main.globe.ufoCoordinates, this.model.main.globe.ufoAltitude.get());
		this.camera.position.set(position.x, position.y, position.z);
		this.camera.lookAt(0, 0, 0);
	}

	updateCameraZoom() {
		this.camera.zoom = this.model.main.globe.zoom.get();
		this.camera.updateProjectionMatrix();
	}

	resize() {
		const size = this.model.main.scanner.scannerViewSize;
		this.renderer.setSize(size.x, size.y);
		this.camera.aspect = size.x / size.y;
		this.updateCameraZoom();
		this.renderer.render(this.scene, this.camera);
	}

	raycast() {
		const size = this.model.main.scanner.scannerViewSize;
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
}
