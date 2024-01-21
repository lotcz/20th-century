import Rotation from "wgge/core/model/vector/Rotation";
import Vector3 from "wgge/core/model/vector/Vector3";

export default class GpsUtil {
	static coordsToPosition(c, dist) {
		const lon = Rotation.degToRad(c.x);
		const lat = Rotation.degToRad(c.y);
		const height = Math.sin(lat);
		const r = Math.cos(lat);
		return new Vector3(
			r * Math.sin(lon),
			height,
			r * Math.cos(lon)
		).multiply(dist);
	}
}
