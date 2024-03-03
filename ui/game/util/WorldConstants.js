import Vector2 from "wgge/core/model/vector/Vector2";

export default class WorldConstants {

	// LAYERS
	static LAYER_DEFAULT = 0;
	static LAYER_CLOSE = 1;
	static LAYER_DISTANT = 2;
	static LAYER_ATMOSPHERE = 3;

	// DIMENSIONS (thousands of km)
	static EARTH_DIAMETER = 12.76;
	static EARTH_RADIUS = WorldConstants.EARTH_DIAMETER / 2;
	static ATMOSPHERE_RADIUS = WorldConstants.EARTH_RADIUS + 0.1;

	static UFO_MIN_ALTITUDE = WorldConstants.ATMOSPHERE_RADIUS + 0.1;
	static UFO_CAMERA_DISTANCE = 1;

	static MOON_RADIUS = 1.738;
	static MOON_DISTANCE = WorldConstants.EARTH_DIAMETER * 15;
	static SUN_DISTANCE = 149600;

	static ATMOSPHERE_VISIBLE_RADIUS = WorldConstants.EARTH_RADIUS + 2;
	static CLOSE_DISTANT_THRESHOLD_RADIUS = WorldConstants.EARTH_RADIUS * 4;
	static MIN_DISTANCE_RADIUS = WorldConstants.EARTH_RADIUS + 1;
	static MAX_DISTANCE_RADIUS = WorldConstants.MOON_DISTANCE + (WorldConstants.MOON_RADIUS * 2) + 10;
	static DEEP_SPACE_RADIUS = WorldConstants.SUN_DISTANCE * 2;
	static CAMERA_VISIBILITY_RADIUS = WorldConstants.DEEP_SPACE_RADIUS * 2;

	// UI
	static PANEL_MARGIN = new Vector2(15, 15);
	static PANEL_PADDING = new Vector2(15, 15);

}
