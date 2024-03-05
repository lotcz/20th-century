import ControllerBase from "wgge/core/controller/ControllerBase";
import GlobeController from "./globe/GlobeController";
import SwitchController from "wgge/core/renderer/generic/SwitchController";
import StrategicController from "./interior/strategic/StrategicController";
import MainMenuController from "./interior/menu/MainMenuController";

export default class SaveGameController extends ControllerBase {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(new GlobeController(this.game, this.model.globe));

		this.addChild(
			new SwitchController(
				this.game,
				this.model,
				this.model.interiorType,
				{
					'strategic': () => new StrategicController(this.game, this.model),
					'menu': () => new MainMenuController(this.game, this.model)
				}
			)
		);
	}

}
