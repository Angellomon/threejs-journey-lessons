import { calculateMenuHeight } from './utils';

export class CameraFullSizes {
	/**
	 * @param {string} menuQuery
	 */
	constructor(menuQuery = '.menu') {
		this.menuQuery = menuQuery;
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		if (menuQuery)
			this.height = window.innerHeight - CameraFullSizes.calculateMenuHeight(menuQuery);
	}

	updateSizes() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		if (this.menuQuery)
			this.height = window.innerHeight - CameraFullSizes.calculateMenuHeight(this.menuQuery);
	}

	/**
	 * Get the sizes tuple [width, height]
	 *
	 * @readonly
	 * @type {[number, number]}
	 */
	get sizes() {
		return [this.width, this.height];
	}

	get aspect() {
		return this.width / this.height;
	}

	/**
	 * @param {string} menuQuery
	 */
	static calculateMenuHeight(menuQuery) {
		return document.querySelector(menuQuery)?.clientHeight || 0;
	}
}
