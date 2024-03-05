import ObjectModel from "wgge/core/model/ObjectModel";
import Vector2 from "wgge/core/model/vector/Vector2";
import MenuModel from "wgge/game/menu/MenuModel";


export default class AlienPanelModel extends ObjectModel {

	/**
	 * @type Vector2
	 * (0,0) = center, (-1,0) = left, (1,1) = bottom-right
	 */
	alignment;

	/**
	 * @type Vector2
	 */
	size;

	/**
	 * @type Vector2
	 */
	offset;

	/**
	 * @type MenuModel
	 */
	menu;

	constructor(persistent) {
		super(persistent);

		this.alignment = this.addProperty('alignment', new Vector2());
		this.size = this.addProperty('size', new Vector2());
		this.offset = this.addProperty('offset', new Vector2());

		this.menu = this.addProperty('menu', new MenuModel());

	}

}
