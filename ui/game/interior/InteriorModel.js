import ObjectModel from "wgge/core/model/ObjectModel";
import GlobeModel from "../globe/GlobeModel";
import FloatValue from "wgge/core/model/value/FloatValue";
import ImageModel from "wgge/game/resources/image/ImageModel";

export default class InteriorModel extends ObjectModel {

	/**
	 * @type FloatValue
	 * Scale of currently displayed scene
	 */
	zoom;

	/**
	 * @type GlobeModel
	 */
	globe;

	/**
	 * @type ImageModel
	 */
	background;

	constructor() {
		super();

		this.zoom = this.addProperty('zoom', new FloatValue(1));
		this.globe = this.addProperty('globe', new GlobeModel());
		this.background = this.addProperty('background', new ImageModel());
		this.background.uri.set('img/interior2.png');

	}

}
