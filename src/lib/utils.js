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
export function createMeshBasicCube(length = 1, color = 0xffffff, wireframe = false) {
	return new THREE.Mesh(
		new THREE.BoxGeometry(length, length, length),
		new THREE.MeshBasicMaterial({ color, wireframe })
	);
}

/**
 * @typedef {{
 * 	width: number,
 * 	height: number,
 * 	depth: number,
 * 	color: number,
 *  wireframe: boolean,
 *  segments: {
 * 	  width: number,
 *    height: number,
 *    depth: number,
 *  }
 * }} BoxOptions
 *
 * @export
 * @param {BoxOptions} options
 */
export function createMeshBox(
	options = {
		color: 0xffffff,
		width: 1,
		height: 1,
		depth: 1,
		wireframe: false,
		segments: {
			width: 1,
			height: 1,
			depth: 1
		}
	}
) {
	return new THREE.Mesh(
		new THREE.BoxGeometry(
			options.width,
			options.height,
			options.depth,
			options.segments.width,
			options.segments.height,
			options.segments.depth
		),
		new THREE.MeshBasicMaterial({
			color: options.color,
			wireframe: options.wireframe
		})
	);
}

/**
 * Creates a basic cube with a texture
 *
 * @export
 * @param {Object} options
 * @param {THREE.Texture} options.map
 * @param {number} [options.length=1]
 */
export function createMeshTextureCube(options) {
	const { length = 1, map } = options;

	return new THREE.Mesh(
		new THREE.BoxGeometry(length, length, length),
		new THREE.MeshBasicMaterial({
			map
		})
	);
}

/**
 * Description placeholder
 *
 * @export
 * @param {Object} params
 * @param {"cube" | "sphere" | "circle" | "cone" | "tetrahedron" | "torus" | "plane"} [params.shape="cube"]
 * @param {number} [params.length=1]
 * @param {number} [params.radius=1]
 * @param {number} [params.height=1]
 * @param {number} [params.width=1]
 * @param {number} [params.tube=1]
 * @param {number} [params.segments=1]
 * @param {number} [params.widthSegments=1]
 * @param {number} [params.heightSegments=1]
 * @param {number} [params.depthSegments=1]
 * @param {number} [params.radialSegments=1]
 * @param {number} [params.tubularSegments=1]
 * @param {number} [params.arc=1]
 * @param {number} [params.detail=0]
 * @param {THREE.Material} params.material
 */
export function createMeshBasicTexture(params) {
	const {
		shape = 'cube',
		length = 1,
		radius = 1,
		height = 1,
		width = 1,
		segments = 1,
		widthSegments = 1,
		heightSegments = 1,
		depthSegments = 1,
		tube = 1,
		radialSegments = 1,
		tubularSegments = 1,
		arc = 7,
		detail = 0,
		material
	} = params;

	/**@type{THREE.BufferGeometry}*/
	let geometry;

	if (shape === 'sphere') {
		geometry = new THREE.SphereGeometry(length, widthSegments, heightSegments);
	} else if (shape === 'cube') {
		geometry = new THREE.BoxGeometry(length, length, length, segments);
	} else if (shape === 'circle') {
		geometry = new THREE.CircleGeometry(radius, segments);
	} else if (shape === 'cone') {
		geometry = new THREE.ConeGeometry(radius, height, segments);
	} else if (shape === 'tetrahedron') {
		geometry = new THREE.TetrahedronGeometry(radius, detail);
	} else if (shape === 'torus') {
		geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
	} else if (shape === 'plane') {
		geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
	} else {
		geometry = geometry = new THREE.BoxGeometry(1, 1, 1, segments);
	}

	return new THREE.Mesh(geometry, material);
}

/**
 * Create Mesh from positions array
 *
 * @export
 * @param {Float32Array} array
 * @param {number} size
 * @param {number} color
 * @param {boolean} wireframe
 */
export function createMeshPositionsArray(array, size, color = 0xffffff, wireframe = false) {
	const attr = new THREE.BufferAttribute(array, size);
	const geo = new THREE.BufferGeometry();

	geo.setAttribute('position', attr);

	return new THREE.Mesh(
		geo,
		new THREE.MeshBasicMaterial({
			color,
			wireframe
		})
	);
}
