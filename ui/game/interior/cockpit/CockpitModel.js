import ObjectModel from "wgge/core/model/ObjectModel";
import ImageModel from "wgge/game/resources/image/ImageModel";
import StringValue from "wgge/core/model/value/StringValue";

export default class CockpitModel extends ObjectModel {

	/**
	 * @type ImageModel
	 */
	background;

	/**
	 * @type StringValue
	 */
	custom;

	constructor() {
		super();

		this.custom = this.addProperty('custom', new StringValue());

		this.background = this.addProperty('background', new ImageModel());
		this.background.uri.set('img/interior2.png');
		this.background.zoom.set(0);

	}

}
