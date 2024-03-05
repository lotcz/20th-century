import ControllerBase from "wgge/core/controller/ControllerBase";
import AnimationFloatController from "wgge/core/controller/AnimationFloatController";
import Vector2 from "wgge/core/model/vector/Vector2";
import AnimationVector2Controller from "wgge/core/controller/AnimationVector2Controller";
import MenuItemModel from "wgge/game/menu/item/MenuItemModel";
import WorldConstants from "../../util/WorldConstants";
import {EASING_LOG_OUT} from "wgge/core/animation/ProgressValue";

const BACKGROUND_COORDS_ON = new Vector2(960, 640);
const BACKGROUND_ZOOM_ON = 1.1;

const BACKGROUND_COORDS_OFF = new Vector2(1280, 630);
const BACKGROUND_ZOOM_OFF = 4.2;

export default class MainMenuController extends ControllerBase {

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

		this.model.mainMenuPanel.menu.items.reset();
		this.model.mainMenuPanel.menu.items.add(new MenuItemModel('Continue', () => this.animateOut()));
		this.model.mainMenuPanel.menu.items.add(new MenuItemModel('New Game', () => this.animateOut()));
		this.model.mainMenuPanel.menu.items.add(new MenuItemModel('Quit', () => this.animateOut()));
	}

	resize() {
		this.model.mainMenuPanel.background.viewSize.set(this.game.viewBoxSize);
	}

	getPanelOffsetOff() {
		return new Vector2(
			- (this.game.viewBoxSize.x + WorldConstants.PANEL_DETAIL_SIZE.x)  * 0.5,
			0
		);
	}

	getPanelOffsetOn() {
		return new Vector2(0,0);
	}

	animateIn() {
		this.model.mainMenuPanel.offset.set(this.getPanelOffsetOff());
		this.model.mainMenuPanel.background.coordinates.set(BACKGROUND_COORDS_OFF);
		this.model.mainMenuPanel.background.zoom.set(BACKGROUND_ZOOM_OFF);

		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.mainMenuPanel.offset,
				this.getPanelOffsetOn(),
				500,
				EASING_LOG_OUT
			)
		);
		this.addChild(
			new AnimationFloatController(
				this.game,
				this.model.mainMenuPanel.background.zoom,
				BACKGROUND_ZOOM_ON,
				500
			)
		);
		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.mainMenuPanel.background.coordinates,
				BACKGROUND_COORDS_ON,
				500
			)
		);
	}

	animateOut() {
		this.resetChildren();
		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.mainMenuPanel.offset,
				this.getPanelOffsetOff(),
				500
			)
		);
		this.addChild(
			new AnimationFloatController(
				this.game,
				this.model.mainMenuPanel.background.zoom,
				BACKGROUND_ZOOM_OFF,
				500
			)
		);
		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.mainMenuPanel.background.coordinates,
				BACKGROUND_COORDS_OFF,
				500
			).onFinished(() => {
				this.model.interiorType.set('strategic');
			})
		);
	}

}
