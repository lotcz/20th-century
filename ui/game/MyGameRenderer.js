import GameRenderer from "wgge/game/GameRenderer";
import SaveGameRenderer from "./SaveGameRenderer";
import NullableNodeRenderer from "wgge/core/renderer/generic/NullableNodeRenderer";

export default class MyGameRenderer extends GameRenderer {

	/**
	 * @type MyGameModel
	 */
	model;

	constructor(model, dom) {
		super(model, dom);

		this.model = model;

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.saveGame,
				(m)=> new SaveGameRenderer(this.game, m, this.saveGameLayer)
			)
		);
	}

}
