import * as THREE from "three";
import GpsUtil from "../../util/GpsUtil";
import WorldConstants from "../../util/WorldConstants";
import ThreeRenderer from "wgge/core/renderer/three/ThreeRenderer";

export default class CityRenderer extends ThreeRenderer {

	static CITY_MATERIAL_CACHE;

	static CITY_GEOMETRY_CACHE;

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

		this.cityMesh.layers.set(WorldConstants.LAYER_CITIES);
		this.cityMesh.userData.raycastCity = this.model;
		this.cityMesh.userData.name = this.model.name.get();
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
		if (!CityRenderer.CITY_MATERIAL_CACHE) {
			CityRenderer.CITY_MATERIAL_CACHE = new THREE.MeshBasicMaterial({color: 0x2dc4c5});
		}
		return CityRenderer.CITY_MATERIAL_CACHE;
	}

	getGeometry() {
		if (!CityRenderer.CITY_GEOMETRY_CACHE) {
			CityRenderer.CITY_GEOMETRY_CACHE = new THREE.SphereGeometry(0.02, 8, 8);
		}
		return CityRenderer.CITY_GEOMETRY_CACHE;
	}
}
