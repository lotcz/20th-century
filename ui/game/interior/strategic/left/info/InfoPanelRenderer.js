import DOMHelper from "wgge/core/helper/DOMHelper";
import DomRenderer from "wgge/core/renderer/dom/DomRenderer";
import PanelVisitorRenderer from "../../../../util/panel/PanelVisitorRenderer";
import MenuRenderer from "wgge/game/menu/MenuRenderer";
import DirtyValueRenderer from "wgge/core/renderer/dom/DirtyValueRenderer";
import Vector2Renderer from "wgge/core/renderer/dom/Vector2Renderer";
import Rotation from "wgge/core/model/vector/Rotation";
import WorldConstants from "../../../../util/WorldConstants";
import NumberHelper from "wgge/core/helper/NumberHelper";
import NullableNodeRenderer from "wgge/core/renderer/generic/NullableNodeRenderer";

export default class InfoPanelRenderer extends DomRenderer {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.wrapper = this.addElement('div', 'alien-panel debug-info');

		this.addChild(
			new PanelVisitorRenderer(
				this.game,
				this.model.strategic.mainInfoPanel,
				this.wrapper
			)
		);

		this.container = DOMHelper.createElement(this.wrapper, 'div', 'center');

		DOMHelper.createElement(this.container, 'div', 'small-text', 'Year')
		this.addChild(
			new DirtyValueRenderer(
				this.game,
				this.model.year,
				DOMHelper.createElement(this.container, 'div')
			)
		);

		DOMHelper.createElement(this.container, 'div', 'small-text', 'Altitude')
		this.addChild(
			new DirtyValueRenderer(
				this.game,
				this.model.globe.ufo.ufoAltitude,
				DOMHelper.createElement(this.container, 'div'),
				(alt) => `${Math.round((alt - WorldConstants.EARTH_RADIUS) * 1000)}km`
			)
		);

		DOMHelper.createElement(this.container, 'div', 'small-text', 'Speed')
		this.addChild(
			new DirtyValueRenderer(
				this.game,
				this.model.globe.ufo.ufoSpeed,
				DOMHelper.createElement(this.container, 'div'),
				(speed) => `${NumberHelper.round(speed * 1000, -2)}km/s`
			)
		);

		DOMHelper.createElement(this.container, 'div', 'small-text', 'Position')
		this.addChild(
			new Vector2Renderer(
				this.game,
				this.model.globe.ufo.ufoCoordinates,
				DOMHelper.createElement(this.container, 'div'),
				(p) => `${Math.round(Rotation.radToDeg(p.y))}° ${Math.round(Rotation.radToDeg(p.x))}°`
			)
		);

		DOMHelper.createElement(this.container, 'div', 'small-text', 'Cursor')
		const cursorPos = DOMHelper.createElement(this.container, 'div');
		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.globe.cursorAtGlobe,
				(m) => new Vector2Renderer(
					this.game,
					m,
					cursorPos,
					(p) => `${Math.round(Rotation.radToDeg(p.y))}° ${Math.round(Rotation.radToDeg(p.x))}°`
				)
			)
		);

		DOMHelper.createElement(this.container, 'div', 'small-text', 'Materials')
		this.addChild(
			new Vector2Renderer(
				this.game,
				this.model.inventory.materials,
				DOMHelper.createElement(this.container, 'div')
			)
		);

		DOMHelper.createElement(this.container, 'div', 'small-text', 'Biology')
		this.addChild(
			new Vector2Renderer(
				this.game,
				this.model.inventory.biologyPoints,
				DOMHelper.createElement(this.container, 'div')
			)
		);

		DOMHelper.createElement(this.container, 'div', 'small-text', 'History')
		this.addChild(
			new Vector2Renderer(
				this.game,
				this.model.inventory.historyPoints,
				DOMHelper.createElement(this.container, 'div')
			)
		);

		this.addChild(
			new MenuRenderer(
				this.game,
				this.model.strategic.mainInfoPanel.menu,
				DOMHelper.createElement(this.container, 'div')
			)
		);
	}

	deactivateInternal() {
		this.resetChildren();
		DOMHelper.destroyElement(this.wrapper);
	}

}
