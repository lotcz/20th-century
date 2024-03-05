import Rotation from "wgge/core/model/vector/Rotation";
import Vector3 from "wgge/core/model/vector/Vector3";
import Vector2 from "wgge/core/model/vector/Vector2";

export default class GpsUtil {

	static coordsToPositionRad(c, dist) {
		const lon = c.x;
		const lat = c.y;
		const height = Math.sin(lat);
		const r = Math.cos(lat);
		return new Vector3(
			r * Math.sin(lon),
			height,
			r * Math.cos(lon)
		).multiply(dist);
	}

	static coordsToPosition(c, dist) {
		return this.coordsToPositionRad(
			new Vector2(Rotation.degToRad(c.x), Rotation.degToRad(c.y)),
			dist
		);
	}

	static coordsToPosition3(v) {
		return this.coordsToPositionRad(
			new Vector2(Rotation.degToRad(v.x), Rotation.degToRad(v.y)),
			v.z
		);
	}

	static positionToCoordsRad(p) {
		const r = Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.z, 2));
		const lon = Math.asin(p.x / r);
		const lat = Math.atan(p.y / r);
		return new Vector2(lon, lat);
	}
}
