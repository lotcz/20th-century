import GameRenderer from "wgge/game/GameRenderer";
import InteriorRenderer from "./interior/InteriorRenderer";
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
				this.model.interior,
				(m)=> new InteriorRenderer(this.game, m, this.saveGameLayer)
			)
		);
	}

}
