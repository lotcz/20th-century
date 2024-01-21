import * as THREE from "three";
import RendererBase from "wgge/core/renderer/RendererBase";
import GpsUtil from "../util/GpsUtil";
import DOMHelper from "wgge/core/helper/DOMHelper";

export default class CityRenderer extends RendererBase {

	/**
	 * @type CityModel
	 */
	model;

	constructor(game, model, scene) {
		super(game, model);

		this.model = model;
		this.scene = scene;
		this.cityMesh = null;
		this.textSprite = null;

	}

	activateInternal() {
		this.cityMesh = new THREE.Mesh(
			new THREE.SphereGeometry(0.1, 8, 8),
			new THREE.MeshLambertMaterial({color: 0xf0f0f0})
		);
		this.scene.add(this.cityMesh);

		const canvas = DOMHelper.createElement(document.body, "canvas", "hidden");
		canvas.width = 250;
		canvas.height = 50;
		const ctx = canvas.getContext("2d");
		ctx.font = "20px Arial";
		ctx.fillStyle = "white";
		ctx.fillText(this.model.name.get(), 10, 30);
		const texture = new THREE.CanvasTexture(canvas);
		texture.minFilter = THREE.LinearFilter;
		const textMaterial = new THREE.SpriteMaterial( { map: texture, color: 0xffffff, fog: true } );
		this.textSprite = new THREE.Sprite(textMaterial);
		this.textSprite.scale.set(5, 1);
		this.scene.add(this.textSprite);

		this.updatePosition();
	}

	deactivateInternal() {
		this.scene.remove(this.cityMesh);
		this.cityMesh = null;
	}

	renderInternal() {
		if (this.model.coordinates.isDirty) {
			this.updatePosition();
		}
	}

	updatePosition() {
		const position = GpsUtil.coordsToPosition(this.model.coordinates, 6.35);
		this.cityMesh.position.set(position.x, position.y, position.z);
		const position2 = GpsUtil.coordsToPosition(this.model.coordinates, 6.5);
		this.textSprite.position.set(position2.x, position2.y, position2.z);
	}

}
