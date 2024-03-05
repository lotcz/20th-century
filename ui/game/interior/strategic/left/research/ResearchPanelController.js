import ControllerBase from "wgge/core/controller/ControllerBase";
import Vector2 from "wgge/core/model/vector/Vector2";
import AnimationVector2Controller from "wgge/core/controller/AnimationVector2Controller";
import WorldConstants from "../../../../util/WorldConstants";
import {EASING_SPHERE_IN, EASING_SPHERE_OUT} from "wgge/core/animation/ProgressValue";
import MenuItemModel from "wgge/game/menu/item/MenuItemModel";

export default class ResearchPanelController extends ControllerBase {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

	}

	activateInternal() {
		this.animateIn();

		this.model.strategic.inventoryPanel.menu.items.reset();
		this.model.strategic.inventoryPanel.menu.items.add(new MenuItemModel('Menu', () => this.model.interiorType.set('menu')));
		const button = this.model.strategic.inventoryPanel.menu.items.add(new MenuItemModel('Research', () => this.animateOut()));
		button.isActive.set(true);
	}

	getPanelOffsetOff() {
		return new Vector2(
			- (WorldConstants.PANEL_DETAIL_SIZE.x) + WorldConstants.PANEL_SIDE_SIZE.x,
			0
		);
	}

	getPanelOffsetOn() {
		return new Vector2(
			WorldConstants.PANEL_SIDE_SIZE.x + WorldConstants.PANEL_MARGIN.x,
			0
		);
	}

	animateIn() {
		this.model.strategic.researchPanel.offset.set(this.getPanelOffsetOff());

		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.strategic.researchPanel.offset,
				this.getPanelOffsetOn(),
				500,
				EASING_SPHERE_OUT
			)
		);

	}

	animateOut() {
		this.resetChildren();
		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.strategic.researchPanel.offset,
				this.getPanelOffsetOff(),
				500,
				EASING_SPHERE_IN
			).onFinished(() => {
				this.model.strategic.selectedPanelLeft.set('inventory');
			})
		);
	}

}
