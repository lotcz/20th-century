import ControllerBase from "wgge/core/controller/ControllerBase";
import GlobeController from "./globe/GlobeController";
import StrategicController from "./strategic/StrategicController";
import SwitchController from "wgge/core/renderer/generic/SwitchController";
import ResearchController from "./research/ResearchController";

export default class MainController extends ControllerBase {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(new GlobeController(this.game, this.model.main.globe));

		this.addChild(
			new SwitchController(
				this.game,
				this.model,
				this.model.main.interiorType,
				{
					'strategic': () => new StrategicController(this.game, this.model),
					'research': () => new ResearchController(this.game, this.model)
				}
			)
		);

	}

}
