import GameModel from "wgge/game/GameModel";
import InteriorModel from "./interior/InteriorModel";
import NullableNode from "wgge/core/model/value/NullableNode";

export default class MyGameModel extends GameModel {

	/**
	 * @type NullableNode<InteriorModel>
	 */
	interior;

	constructor(debugModeEnabled = true) {
		super(debugModeEnabled);

		this.interior = this.addProperty('interior', new NullableNode(() => new InteriorModel()));

	}

}
