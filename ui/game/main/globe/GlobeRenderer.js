import * as THREE from "three";
import {Lensflare, LensflareElement} from "three/examples/jsm/objects/Lensflare";
import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import Rotation from "wgge/core/model/vector/Rotation";
import GpsUtil from "../../util/GpsUtil";
import CollectionRenderer from "wgge/core/renderer/generic/CollectionRenderer";
import CityRenderer from "./CityRenderer";
import WorldConstants from "../../util/WorldConstants";
import ParticleGeneratorRenderer from "../../particles/generator/ParticleGeneratorRenderer";

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
		);

		this.addAutoEvent(
			this.game.controls.mouseCoordinates,
			'change',
			() => this.raycast(),
			true
		);
	}

	activateInternal() {
		this.container = this.addElement('div', 'container container-host');

		// THREE
		this.renderer = new THREE.WebGLRenderer({alpha: true });
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
		this.camera.layers.enable(WorldConstants.LAYER_DEFAULT);
		this.camera.layers.enable(WorldConstants.LAYER_CLOSE);
		this.camera.layers.enable(WorldConstants.LAYER_DISTANT);
		this.earthGroup.add(this.camera);

		this.ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
		this.scene.add(this.ambientLight);

		this.globeMesh = new THREE.Mesh(
			new THREE.SphereGeometry(WorldConstants.EARTH_RADIUS, 64, 64, 3/2 * Math.PI),
			new THREE.MeshLambertMaterial({color: 0xffffff})
		);
		this.earthGroup.add(this.globeMesh);

		this.atmoMesh = new THREE.Mesh(
			new THREE.SphereGeometry(WorldConstants.ATMOSPHERE_RADIUS, 64, 64),
			new THREE.MeshLambertMaterial({transparent: true, side: THREE.DoubleSide})
		);
		this.atmoMesh.layers.set(WorldConstants.LAYER_ATMOSPHERE);
		this.earthGroup.add(this.atmoMesh);

		this.deepSpaceMesh = new THREE.Mesh(
			new THREE.SphereGeometry(WorldConstants.DEEP_SPACE_RADIUS, 16, 16, 3/2 * Math.PI),
			new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.BackSide})
		);
		this.scene.add(this.deepSpaceMesh);

		this.moonMesh = new THREE.Mesh(
			new THREE.SphereGeometry(WorldConstants.MOON_RADIUS, 32, 32),
			new THREE.MeshLambertMaterial({color: 0xefefef})
		);
		this.moonMesh.position.set(WorldConstants.MOON_DISTANCE, 0, 0);
		this.scene.add(this.moonMesh);

		this.updateCameraPosition();
		this.updateAtmoVisibility();
		this.resize();

		//img/earth_scan.jpg
		this.game.assets.getAsset('img/8k_earth_daymap.jpg', (img) => {
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
			texture.repeat.set(1, 1);
			this.atmoMesh.material.map = texture;
			this.atmoMesh.material.needsUpdate = true;
		});

		this.game.assets.getAsset('img/8k_stars_milky_way.jpg', (img) => {
			const texture = new THREE.Texture();
			texture.image = img;
			texture.needsUpdate = true;
			texture.repeat.set(1, 1);
			this.deepSpaceMesh.material.map = texture;
			this.deepSpaceMesh.material.needsUpdate = true;
		});

		this.game.assets.getAsset('img/2k_moon.jpg', (img) => {
			const texture = new THREE.Texture();
			texture.image = img;
			texture.needsUpdate = true;
			texture.repeat.set(1, 1);
			this.moonMesh.material.map = texture;
			this.moonMesh.material.needsUpdate = true;
		});

		this.game.assets.getAsset('img/lensflare0.png', (img1) => {
			this.game.assets.getAsset('img/lensflare3.png', (img2) => {
				const textureFlare0 = new THREE.Texture();
				textureFlare0.image = img1;
				textureFlare0.needsUpdate = true;
				const textureFlare3 = new THREE.Texture();
				textureFlare3.image = img2;
				textureFlare3.needsUpdate = true;

				const light = new THREE.PointLight(0xfff0ef, 1, WorldConstants.DEEP_SPACE_RADIUS, 0);
				light.position.set(0, 0, WorldConstants.SUN_DISTANCE);
				this.scene.add( light );

				const lensflare = new Lensflare();
				lensflare.addElement(new LensflareElement(textureFlare0, 120, 0));
				lensflare.addElement(new LensflareElement(textureFlare3, 100, 0.1));
				lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.2));
				lensflare.addElement(new LensflareElement(textureFlare3, 100, 0.3));
				lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.4));
				light.add(lensflare);

			});
		});

		this.ufoMesh = new THREE.Group();
		//const light = new THREE.PointLight(0xfff0ef, 1, 0.01, 0);
		//light.position.set(0, 0,0.001);
		//this.ufoMesh.add(light);
		this.earthGroup.add(this.ufoMesh);

		this.game.assets.loadModel3d(1, (model) => {
			this.ufoMesh.add(model);
		});

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.cities,
				(m) => new CityRenderer(this.game, m, this.earthGroup)
			)
		);

		this.addChild(new ParticleGeneratorRenderer(this.game, this.model.ufoExhaust, this.earthGroup));
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
		if (this.model.time.isDirty) {
			this.updateDayTime();
		}
		if (this.model.cameraDistance.isDirty) {
			this.updateAtmoVisibility();
		}
		if (this.model.cameraCoordinates.isDirty || this.model.cameraDistance.isDirty) {
			this.updateCameraPosition();
		}
		if (this.model.ufoCoordinates.isDirty || this.model.ufoAltitude.isDirty) {
			this.updateUfoPosition();
		}
		if (this.model.atmoCoordinates.isDirty) {
			this.updateAtmoPosition();
		}
		this.renderer.render(this.scene, this.camera);
	}

	updateDayTime() {
		this.earthGroup.rotation.set(0, this.model.time.get() * Math.PI * 2,0);
	}

	updateUfoPosition() {
		const position = GpsUtil.coordsToPositionRad(this.model.ufoCoordinates, this.model.ufoAltitude.get());
		this.ufoMesh.position.set(position.x, position.y, position.z);
		this.ufoMesh.lookAt(this.globeMesh.position);
	}

	updateAtmoPosition() {
		this.atmoMesh.rotation.set(
			0,
			Rotation.degToRad(this.model.atmoCoordinates.x),
			Rotation.degToRad(this.model.atmoCoordinates.y)
		);
	}

	setLayerVisibility(layer, visible) {
		if (this.camera.layers.isEnabled(layer) && !visible) {
			this.camera.layers.disable(layer);
		}
		if (visible && !this.camera.layers.isEnabled(layer)) {
			this.camera.layers.enable(layer);
		}
	}

	updateAtmoVisibility() {
		const distant = this.model.cameraDistance.get() > WorldConstants.CLOSE_DISTANT_THRESHOLD_RADIUS;
		this.setLayerVisibility(WorldConstants.LAYER_CLOSE, !distant);
		this.setLayerVisibility(WorldConstants.LAYER_DISTANT, distant);
		const atmosphere = this.model.cameraDistance.get() > WorldConstants.ATMOSPHERE_VISIBLE_RADIUS;
		this.setLayerVisibility(WorldConstants.LAYER_ATMOSPHERE, atmosphere);
	}

	updateCameraPosition() {
		const position= GpsUtil.coordsToPositionRad(this.model.cameraCoordinates, this.model.cameraDistance.get());
		this.camera.position.set(position.x, position.y, position.z);
		this.camera.lookAt(0, 0, 0);

		this.deepSpaceMesh.position.set(position.x, position.y, position.z);
	}

	updateCameraZoom() {
		this.camera.zoom = this.model.zoom.get();
		this.camera.updateProjectionMatrix();
	}

	resize() {
		this.renderer.setSize(this.game.viewBoxSize.x, this.game.viewBoxSize.y);
		this.camera.aspect = this.game.viewBoxSize.x / this.game.viewBoxSize.y;
		this.updateCameraZoom();
		this.renderer.render(this.scene, this.camera);
	}

	raycast() {
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
