import * as THREE from "three";
import GpsUtil from "../../util/GpsUtil";
import WorldConstants from "../../util/WorldConstants";
import ThreeRenderer from "../../util/ThreeRenderer";

export default class ScannerCityRenderer extends ThreeRenderer {

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
			new THREE.SphereGeometry(0.02, 8, 8),
			new THREE.MeshBasicMaterial({color: 0xfda4a5})
		);
		this.cityMesh.raycastCity = this;
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
		const position = GpsUtil.coordsToPosition(this.model.coordinates, WorldConstants.EARTH_RADIUS);
		this.cityMesh.position.set(position.x, position.y, position.z);
	}

}
