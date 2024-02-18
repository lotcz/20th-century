export default class Constants {

	// LAYERS
	static LAYER_DEFAULT = 0;
	static LAYER_CLOSE = 1;
	static LAYER_DISTANT = 2;

	// DIMENSIONS (thousands of km)
	static EARTH_DIAMETER = 12.76;
	static EARTH_RADIUS = Constants.EARTH_DIAMETER / 2;
	static ATMOSPHERE_RADIUS = Constants.EARTH_RADIUS + 0.1;

	static MOON_RADIUS = 1.738;
	static MOON_DISTANCE = Constants.EARTH_DIAMETER * 30;

	static SUN_RADIUS = 6.96;
	static SUN_DISTANCE = 1496.00;

	static CLOSE_DISTANT_THRESHOLD_RADIUS = Constants.EARTH_RADIUS * 2;
	static MIN_DISTANCE_RADIUS = Constants.EARTH_RADIUS + 0.05;
	static MAX_DISTANCE_RADIUS = Constants.EARTH_RADIUS * 10;
	static DEEP_SPACE_RADIUS = Constants.SUN_DISTANCE * 2;
	static CAMERA_VISIBILITY_RADIUS = Constants.DEEP_SPACE_RADIUS * 2;

}