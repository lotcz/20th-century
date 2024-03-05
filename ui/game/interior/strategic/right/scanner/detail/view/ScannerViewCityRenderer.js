import * as THREE from "three";
import GpsUtil from "../../../../../../util/GpsUtil";
import WorldConstants from "../../../../../../util/WorldConstants";
import ThreeRenderer from "wgge/core/renderer/three/ThreeRenderer";

export default class ScannerViewCityRenderer extends ThreeRenderer {

	static CITY_MATERIAL_CACHE = null;
	static CITY_GEOMETRY_CACHE = null;
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
		this.cityMesh = new THREE.Mesh(this.getGeometry(), this.getMaterial());
		this.cityMesh.userData.raycastCity = this.model;
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

	getMaterial() {
		if (!ScannerViewCityRenderer.CITY_MATERIAL_CACHE) {
			ScannerViewCityRenderer.CITY_MATERIAL_CACHE = new THREE.MeshBasicMaterial({color: 0xdd1010});
		}
		return ScannerViewCityRenderer.CITY_MATERIAL_CACHE;
	}

	getGeometry() {
		if (!ScannerViewCityRenderer.CITY_GEOMETRY_CACHE) {
			ScannerViewCityRenderer.CITY_GEOMETRY_CACHE = new THREE.SphereGeometry(0.04, 8, 8);
		}
		return ScannerViewCityRenderer.CITY_GEOMETRY_CACHE;
	}

}
