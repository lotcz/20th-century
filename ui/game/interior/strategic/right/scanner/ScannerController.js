import ControllerBase from "wgge/core/controller/ControllerBase";
import MenuItemModel from "wgge/game/menu/item/MenuItemModel";
import ScannerDetailController from "./detail/ScannerDetailController";
import ScannerSideController from "./side/ScannerSideController";
import NumberHelper from "wgge/core/helper/NumberHelper";
import Vector2 from "wgge/core/model/vector/Vector2";
import HumanGlobeModel from "../../../../globe/human/HumanGlobeModel";


export default class ScannerController extends ControllerBase {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(new ScannerSideController(this.game, this.model));
		this.addChild(new ScannerDetailController(this.game, this.model));

	}

	activateInternal() {
		const scannerMenu = this.model.strategic.scannerPanel.side.menu;
		scannerMenu.items.reset();
		scannerMenu.items.add(new MenuItemModel('Cruise', () => this.animateOut()));

		const actionsMenu = this.model.strategic.scannerPanel.side.actionsMenu;
		actionsMenu.items.reset();
		actionsMenu.items.add(new MenuItemModel('Scan', () => this.scanArea()));
	}

	animateOut() {
		this.model.strategic.scannerPanel.triggerEvent('animate-out');
	}

	scanArea() {
		const focus = this.model.globe.ufo.coordinates;
		const range = new Vector2(0.2, 0.2);
		const rangeStart = focus.subtract(range);
		const rangeEnd = focus.add(range);
		const coords = new Vector2(
			NumberHelper.random(rangeStart.x, rangeEnd.x),
			NumberHelper.random(rangeStart.y, rangeEnd.y)
		);

		const humanOnGlobe = new HumanGlobeModel();
		humanOnGlobe.human.originYear.set(this.model.year.get());
		humanOnGlobe.human.sex.set(Math.random() < 0.5);
		humanOnGlobe.human.age.set(NumberHelper.random(18, 99));

		this.model.globe.humans.add(humanOnGlobe);

	}


}
