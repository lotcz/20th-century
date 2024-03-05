import * as THREE from "three";
import GpsUtil from "../../util/GpsUtil";
import WorldConstants from "../../util/WorldConstants";
import ThreeRenderer from "wgge/core/renderer/three/ThreeRenderer";

export default class HumanGlobeRenderer extends ThreeRenderer {

	static MATERIAL_CACHE;

	static GEOMETRY_CACHE;

	/**
	 * @type HumanGlobeModel
	 */
	model;

	constructor(game, model, scene) {
		super(game, model, scene);

		this.model = model;
		this.mesh = null;
	}

	activateInternal() {
		this.mesh = new THREE.Mesh(this.getGeometry(), this.getMaterial());

		this.mesh.layers.set(WorldConstants.LAYER_SCANNER_OBJECTS);
		this.mesh.userData.raycastHuman = this.model;
		this.mesh.userData.name = this.model.human.toString();
		this.scene.add(this.mesh);

		this.updatePosition();
	}

	deactivateInternal() {
		this.mesh.removeFromParent();
		this.mesh = null;
	}

	renderInternal() {
		if (this.model.coordinates.isDirty) {
			this.updatePosition();
		}
	}

	updatePosition() {
		const position = GpsUtil.coordsToPosition(this.model.coordinates, WorldConstants.EARTH_RADIUS);
		this.mesh.position.set(position.x, position.y, position.z);
	}

	getMaterial() {
		if (!HumanGlobeRenderer.MATERIAL_CACHE) {
			HumanGlobeRenderer.MATERIAL_CACHE = new THREE.MeshBasicMaterial({color: 0x2dd42d});
		}
		return HumanGlobeRenderer.MATERIAL_CACHE;
	}

	getGeometry() {
		if (!HumanGlobeRenderer.GEOMETRY_CACHE) {
			HumanGlobeRenderer.GEOMETRY_CACHE = new THREE.SphereGeometry(0.02, 8, 8);
		}
		return HumanGlobeRenderer.GEOMETRY_CACHE;
	}
}
