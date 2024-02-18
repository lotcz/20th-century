import * as THREE from "three";
import GpsUtil from "../util/GpsUtil";
import Constants from "../util/Constants";
import ThreeRenderer from "../util/ThreeRenderer";

export default class CityRenderer extends ThreeRenderer {

	/**
	 * @type CityModel
	 */
	model;

	constructor(game, model, scene) {
		super(game, model, scene);

		this.model = model;
		this.cityMesh = null;
	}

	activateInternal() {
		this.cityMesh = new THREE.Mesh(
			new THREE.SphereGeometry(0.1, 8, 8),
			new THREE.MeshLambertMaterial({color: 0xf0f0f0})
		);
		this.cityMesh.layers.set(Constants.LAYER_CLOSE);
		this.scene.add(this.cityMesh);

		this.updatePosition();
	}

	deactivateInternal() {
		this.cityMesh.removeFromParent();
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
	}

}
