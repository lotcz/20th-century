import RendererBase from "wgge/core/renderer/RendererBase";

export default class SwitchRenderer extends RendererBase {

	/**
	 * @type DirtyValue
	 */
	valueModel;

	/**
	 * @type object
	 */
	rendererFactories;

	constructor(game, model, valueModel, rendererFactories) {
		super(game, model);

		this.rendererFactories = rendererFactories;

		this.addAutoEvent(
			valueModel,
			'change',
			() => {
				this.resetChildren();
				const factory = this.rendererFactories[valueModel.get()];
				if (factory) {
					this.addChild(factory());
				}
			},
			true
		);
	}

}
