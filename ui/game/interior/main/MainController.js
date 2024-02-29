import ControllerBase from "wgge/core/controller/ControllerBase";
import GlobeController from "../../globe/GlobeController";
import CockpitController from "../cockpit/CockpitController";
import ConditionalNodeController from "wgge/core/controller/ConditionalNodeController";
import {INTERIOR_TYPE_COCKPIT} from "./MainModel";
import StrategicController from "../strategic/StrategicController";

export default class MainController extends ControllerBase {

	/**
	 * @type MainModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(new GlobeController(this.game, this.model.globe));

		this.addChild(
			new ConditionalNodeController(
				this.game,
				this.model.interiorType,
				() => this.model.interiorType.equalsTo(INTERIOR_TYPE_COCKPIT),
				() => new CockpitController(this.game, this.model),
				() => new StrategicController(this.game, this.model)
			)
		);

	}

}
