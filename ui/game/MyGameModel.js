import GameModel from "wgge/game/GameModel";

export default class MyGameModel extends GameModel {

	/**
	 * @type NullableNode<SaveGameModel>
	 */
	//saveGame;

	constructor(debugModeEnabled = true) {
		super(debugModeEnabled);

		//this.interior = this.addProperty('interior', new NullableNode(() => new SaveGameModel()));

	}

}
