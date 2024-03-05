import ControllerBase from "wgge/core/controller/ControllerBase";
import Vector2 from "wgge/core/model/vector/Vector2";
import AnimationVector2Controller from "wgge/core/controller/AnimationVector2Controller";
import {EASING_SPHERE_IN, EASING_SPHERE_OUT} from "wgge/core/animation/ProgressValue";
import WorldConstants from "../../../../../util/WorldConstants";

export default class ScannerDetailController extends ControllerBase {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(
			this.model.strategic.scannerPanel.detail.size,
			'change',
			() => {
				const borders = WorldConstants.PANEL_PADDING.multiply(2).add(new Vector2(2, 2)) ;
				const space = new Vector2(0, 0);
				const size = this.model.strategic.scannerPanel.detail.size.subtract(borders).subtract(space);
				this.model.strategic.scannerPanel.detail.scannerViewSize.set(size);
			},
			true
		);

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
			WorldConstants.PANEL_DETAIL_SIZE.x + WorldConstants.PANEL_MARGIN.x,
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
		this.model.strategic.scannerPanel.detail.offset.set(this.getPanelOffsetOff());

		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.strategic.scannerPanel.detail.offset,
				this.getPanelOffsetOn(),
				500,
				EASING_SPHERE_OUT
			).onFinished(() => {
				this.model.globe.ufo.ufoScannerOn.set(true);
			})
		);

	}

	animateOut() {
		this.resetChildren();
		this.model.globe.ufo.ufoScannerOn.set(false);
		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.strategic.scannerPanel.detail.offset,
				this.getPanelOffsetOff(),
				500,
				EASING_SPHERE_IN
			).onFinished(() => {
				this.model.strategic.selectedPanelRight.set('cruise');
			})
		);
	}

}
