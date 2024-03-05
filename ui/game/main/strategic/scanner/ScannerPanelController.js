import ControllerBase from "wgge/core/controller/ControllerBase";
import WorldConstants from "../../../util/WorldConstants";
import Vector2 from "wgge/core/model/vector/Vector2";
import AnimationVector2Controller from "wgge/core/controller/AnimationVector2Controller";
import {EASING_CUBIC_IN} from "wgge/core/animation/ProgressValue";

export default class ScannerPanelController extends ControllerBase {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(
			this.model.main.strategic.scannerPanel.size,
			'change',
			() => {
				const borders = WorldConstants.PANEL_PADDING.multiply(2).add(new Vector2(2, 2)) ;
				const space = new Vector2(0, 0);
				const size = this.model.main.strategic.scannerPanel.size.subtract(borders).subtract(space);
				this.model.main.strategic.scannerPanel.scannerViewSize.set(size);
			},
			true
		);

	}

	activateInternal() {
		this.animateIn();
	}

	getPanelOffsetOff() {
		return new Vector2(
			WorldConstants.PANEL_SIDE_SIZE.x,
			0
		);
	}

	getPanelOffsetOn() {
		return new Vector2(
			- WorldConstants.PANEL_SIDE_SIZE.x - WorldConstants.PANEL_MARGIN.x,
			0
		);
	}

	animateIn() {
		this.model.main.strategic.scannerPanel.offset.set(this.getPanelOffsetOff());

		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.main.strategic.scannerPanel.offset,
				this.getPanelOffsetOn(),
				500,
				(v) => Math.log2(v) / 4 + 1
			)
		);

	}

	animateOut() {
		this.resetChildren();
		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.main.strategic.scannerPanel.offset,
				this.getPanelOffsetOff(),
				500,
				EASING_CUBIC_IN
			).onFinished(() => {
				this.model.main.strategic.selectedStrategicPanel.set('none');
			})
		);
	}


}
