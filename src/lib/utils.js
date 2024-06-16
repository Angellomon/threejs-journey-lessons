import * as THREE from 'three';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';

/**
 * @typedef {[number, number]} Scale
 * @typedef {Record<string, string | number>} StyleObj
 * @typedef {{
 * 	width: number,
 * 	height: number,
 * 	aspect: () => number
 * }} Sizes
 */

/**
 * @param  {import('clsx').ClassArray} inputs
 * @returns
 */
export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

/**
 * @param {Element} node
 * @param {*} params
 * @returns
 */
export const flyAndScale = (node, params = { y: -8, x: 0, start: 0.95, duration: 150 }) => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	/**
	 * @param {number} valueA
	 * @param {Scale} scaleA
	 * @param {Scale} scaleB
	 * @returns {number}
	 */
	const scaleConversion = (valueA, scaleA, scaleB) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	/**
	 * @param {StyleObj} style
	 * @returns {string}
	 */
	const styleToString = (style) => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		/**
		 * @param {number} t
		 */
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

/**
 * @export
 * @param {number} [width=600]
 * @param {number} [height=600]
 * @returns {Sizes}
 */
export function newSizes(width = 600, height = 600) {
	return {
		width,
		height,
		aspect() {
			return this.width / this.height;
		}
	};
}

/**
 * Get Delta Time
 *
 * @export
 * @param {number} initialTime
 * @returns {number}
 */
export function getDeltaTime(initialTime) {
	const currentTime = Date.now();

	return currentTime - initialTime;
}

/**
 * Create a basic cube given a length and a color for the MeshBasicMaterial
 *
 * @export
 * @param {number} [length=1]
 * @param {number} [color=0xffffff]
 * @returns {THREE.Mesh}
 */
export function createMeshBasicCube(length = 1, color = 0xffffff) {
	return new THREE.Mesh(
		new THREE.BoxGeometry(length, length, length),
		new THREE.MeshBasicMaterial({ color })
	);
}
