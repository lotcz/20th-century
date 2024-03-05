import ObjectModel from "wgge/core/model/ObjectModel";
import ScannerSideModel from "./side/ScannerSideModel";
import ScannerDetailModel from "./detail/ScannerDetailModel";

export default class ScannerModel extends ObjectModel {

	/**
	 * @type ScannerSideModel
	 */
	side;

	/**
	 * @type ScannerDetailModel
	 */
	detail;

	constructor() {
		super();


		this.side = this.addProperty('side', new ScannerSideModel());
		this.detail = this.addProperty('detail', new ScannerDetailModel());
	}

}
