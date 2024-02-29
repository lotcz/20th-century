import ObjectModel from "wgge/core/model/ObjectModel";
import AlienPanelModel from "../panel/AlienPanelModel";

export default class StrategicModel extends ObjectModel {

	/**
	 * @type AlienPanelModel
	 */
	globeControlPanel;

	constructor() {
		super();

		this.globeControlPanel = this.addProperty('globeControlPanel', new AlienPanelModel());
		this.globeControlPanel.size.set(600, 250);
		this.globeControlPanel.alignment.set(0, 1);

	}

}
