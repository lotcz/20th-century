import AlienPanelModel from "../../util/panel/AlienPanelModel";
import ImageViewModel from "wgge/game/resources/image/ImageViewModel";

export default class MainMenuPanelModel extends AlienPanelModel {

	/**
	 * @type ImageViewModel
	 */
	background;

	constructor() {
		super();

		this.size.set(250, 250);
		this.alignment.set(-0.75, 0.55);

		this.background = this.addProperty('background', new ImageViewModel());
		this.background.image.uri.set('img/interior1.png');
		this.background.zoom.set(0);

	}

}
