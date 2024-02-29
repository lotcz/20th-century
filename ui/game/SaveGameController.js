import ControllerBase from "wgge/core/controller/ControllerBase";
import MainController from "./interior/main/MainController";

export default class SaveGameController extends ControllerBase {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(new MainController(this.game, this.model.main));
	}

}
