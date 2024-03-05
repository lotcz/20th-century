import ControllerBase from "wgge/core/controller/ControllerBase";
import WorldConstants from "../../../../util/WorldConstants";
import Vector2 from "wgge/core/model/vector/Vector2";
import AnimationVector2Controller from "wgge/core/controller/AnimationVector2Controller";
import {EASING_CUBIC_IN} from "wgge/core/animation/ProgressValue";
import MenuItemModel from "wgge/game/menu/item/MenuItemModel";

export default class ScannerPanelController extends ControllerBase {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(
			this.model.strategic.scannerPanel.size,
			'change',
			() => {
				const borders = WorldConstants.PANEL_PADDING.multiply(2).add(new Vector2(2, 2)) ;
				const space = new Vector2(0, 0);
				const size = this.model.strategic.scannerPanel.size.subtract(borders).subtract(space);
				this.model.strategic.scannerPanel.scannerViewSize.set(size);
			},
			true
		);

	}

	activateInternal() {
		this.animateIn();

		const scannerMenu = this.model.strategic.cruisePanel.toggleScannerMenu;
		scannerMenu.items.reset();
		const button = scannerMenu.items.add(new MenuItemModel('Scanner', () => this.animateOut()));
		button.isActive.set(true);
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
		this.model.strategic.scannerPanel.offset.set(this.getPanelOffsetOff());

		this.addChild(
			new AnimationVector2Controller(
				this.game,
				this.model.strategic.scannerPanel.offset,
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
				this.model.strategic.scannerPanel.offset,
				this.getPanelOffsetOff(),
				500,
				EASING_CUBIC_IN
			).onFinished(() => {
				this.model.strategic.selectedPanelRight.set('cruise');
			})
		);
	}

}
