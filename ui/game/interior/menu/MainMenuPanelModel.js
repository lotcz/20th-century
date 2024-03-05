import AlienPanelModel from "../../util/panel/AlienPanelModel";
import ImageViewModel from "wgge/game/resources/image/ImageViewModel";
import WorldConstants from "../../util/WorldConstants";

export default class MainMenuPanelModel extends AlienPanelModel {

	/**
	 * @type ImageViewModel
	 */
	background;

	constructor() {
		super();

		this.size.set(WorldConstants.PANEL_DETAIL_SIZE);

		this.background = this.addProperty('background', new ImageViewModel());
		this.background.image.uri.set('img/interior1.png');
		this.background.zoom.set(0);

	}

}
