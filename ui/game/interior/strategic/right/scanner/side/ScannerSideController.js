import ControllerBase from "wgge/core/controller/ControllerBase";
import Vector2 from "wgge/core/model/vector/Vector2";
import WorldConstants from "../../../../../util/WorldConstants";
import AnimationVector2Controller from "wgge/core/controller/AnimationVector2Controller";
import {EASING_SPHERE_IN, EASING_SPHERE_OUT} from "wgge/core/animation/ProgressValue";

export default class ScannerSideController extends ControllerBase {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(
			this.model.strategic.scannerPanel,
			'animate-out',
			() => this.animateOut()
		);

	}

	activateInternal() {
		this.animateIn();
	}

	getPanelOffsetOff() {
		return new Vector2(
			WorldConstants.PANEL_SIDE_SIZE.x + WorldConstants.PANEL_MARGIN.x,
			0
		);
	}

	getPanelOffsetOn() {
		return new Vector2(0, 0);
	}

	animateIn() {
		this.model.strategic.scannerPanel.side.offset.set(this.getPanelOffsetOff());

		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.strategic.scannerPanel.side.offset,
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
				this.model.strategic.scannerPanel.side.offset,
				this.getPanelOffsetOff(),
				500,
				EASING_SPHERE_IN
			).onFinished(() => {
				this.model.strategic.selectedPanelRight.set('cruise');
			})
		);
	}


}
