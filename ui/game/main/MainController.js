import ControllerBase from "wgge/core/controller/ControllerBase";
import GlobeController from "./globe/GlobeController";
import ScannerController from "./scanner/ScannerController";
import ConditionalNodeController from "wgge/core/controller/ConditionalNodeController";
import {INTERIOR_TYPE_SCANNER} from "./MainModel";
import StrategicController from "./strategic/StrategicController";

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
			new ConditionalNodeController(
				this.game,
				this.model.main.interiorType,
				() => this.model.main.interiorType.equalsTo(INTERIOR_TYPE_SCANNER),
				() => new ScannerController(this.game, this.model),
				() => new StrategicController(this.game, this.model.main)
			)
		);

	}

}
