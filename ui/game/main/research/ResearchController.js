import ControllerBase from "wgge/core/controller/ControllerBase";
import AnimationFloatController from "wgge/core/controller/AnimationFloatController";
import Vector2 from "wgge/core/model/vector/Vector2";
import AnimationVector2Controller from "wgge/core/controller/AnimationVector2Controller";
import WorldConstants from "../../util/WorldConstants";
import {EASING_CUBIC_IN} from "wgge/core/animation/ProgressValue";
import {INTERIOR_TYPE_STRATEGIC} from "../MainModel";
import MenuItemModel from "wgge/game/menu/item/MenuItemModel";

const BACKGROUND_COORDS_ON = new Vector2(960, 640);
const BACKGROUND_ZOOM_ON = 1.1;

const BACKGROUND_COORDS_OFF = new Vector2(1280, 630);
const BACKGROUND_ZOOM_OFF = 4.2;

export default class ResearchController extends ControllerBase {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(
			this.game.viewBoxSize,
			'change',
			() => this.resize(),
			true
		);

	}

	activateInternal() {
		this.animateIn();

		this.model.main.mainInfoPanel.menu.items.reset();
		this.model.main.mainInfoPanel.menu.items.add(new MenuItemModel('Strategic', () => this.animateOut()));
	}

	resize() {
		this.model.research.background.viewSize.set(this.game.viewBoxSize);
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
		this.model.research.researchPanel.offset.set(this.getPanelOffsetOff());
		this.model.research.background.coordinates.set(BACKGROUND_COORDS_OFF);
		this.model.research.background.zoom.set(BACKGROUND_ZOOM_OFF);

		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.research.researchPanel.offset,
				this.getPanelOffsetOn(),
				500,
				(v) => Math.log2(v) / 4 + 1
			)
		);
		this.addChild(
			new AnimationFloatController(
				this.game,
				this.model.research.background.zoom,
				BACKGROUND_ZOOM_ON,
				1000
			)
		);
		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.research.background.coordinates,
				BACKGROUND_COORDS_ON,
				1000
			)
		);
	}

	animateOut() {
		this.resetChildren();
		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.research.researchPanel.offset,
				this.getPanelOffsetOff(),
				500,
				EASING_CUBIC_IN
			)
		);
		this.addChild(
			new AnimationFloatController(
				this.game,
				this.model.research.background.zoom,
				BACKGROUND_ZOOM_OFF,
				1000
			)
		);
		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.research.background.coordinates,
				BACKGROUND_COORDS_OFF,
				1000
			).onFinished(() => {
				this.model.main.interiorType.set(INTERIOR_TYPE_STRATEGIC);
			})
		);
	}

}
