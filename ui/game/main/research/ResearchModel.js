import ObjectModel from "wgge/core/model/ObjectModel";
import AlienPanelModel from "../../panel/AlienPanelModel";
import ImageViewModel from "wgge/game/resources/image/ImageViewModel";
import WorldConstants from "../../util/WorldConstants";

export default class ResearchModel extends ObjectModel {

	/**
	 * @type ImageViewModel
	 */
	background;

	/**
	 * @type AlienPanelModel
	 */
	researchPanel;


	constructor() {
		super();

		this.researchPanel = this.addProperty('researchPanel', new AlienPanelModel());
		this.researchPanel.size.set(WorldConstants.PANEL_DETAIL_SIZE);
		this.researchPanel.alignment.set(-1, 0);

		this.background = this.addProperty('background', new ImageViewModel());
		this.background.image.uri.set('img/interior1.png');
		this.background.zoom.set(0);

	}

}
