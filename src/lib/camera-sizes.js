/**
 * Describes camera sizes given the width and height of a window considering a possible menu or other HTML element to substract its height
 *
 * @export
 * @class CameraFullSizes
 */
export class CameraFullSizes {
	/**
	 * @param {string} menuQuery HTML Element query to substract its height, _if it doesn't exist, the substractable height becomes 0_
	 */
	constructor(menuQuery = '') {
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

/**
 * @property {number} width
 * @property {number} height
 */
export class CameraFixedSizes {
	/**
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(width, height) {
		this.width = width;
		this.height = height;
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
}
