<script>
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { newSizes } from '$lib/utils';

	/**@type{HTMLCanvasElement}*/
	let canvas;

	if (browser) {
		let menuHeight = document.querySelector('.menu')?.clientHeight || 0;

		function setupScene() {
			const scene = new THREE.Scene();

			const cameraSizes = newSizes(window.innerWidth, window.innerHeight - menuHeight);

			const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect());

			const controls = new OrbitControls(camera, canvas);

			const renderer = new THREE.WebGLRenderer({
				canvas
			});

			renderer.setSize(cameraSizes.width, cameraSizes.height);

			function tick() {
				renderer.render(scene, camera);

				controls.update();

				window.requestAnimationFrame(tick);
			}

			window.requestAnimationFrame(tick);
			document.addEventListener('resize', () => {
				menuHeight = document.querySelector('.menu')?.clientHeight || 0;

				// @ts-ignore
				const isFullscreen = document.fullscreenEnabled || document.webkitFullscreenEnabled;

				cameraSizes.width = window.innerWidth;

				if (isFullscreen) cameraSizes.height = window.innerHeight - menuHeight;
				else cameraSizes.height = window.innerHeight;

				renderer.setSize(cameraSizes.width, cameraSizes.height);
			});
			window.addEventListener('dblclick', () => {
				// @ts-ignore
				const isFullscreen = document.fullscreenEnabled || document.webkitFullscreenEnabled;

				if (isFullscreen) {
					document.exitFullscreen();
				} else {
					canvas.requestFullscreen();
				}
			});
		}

		onMount(() => {
			setupScene();
		});
	}
</script>

<canvas bind:this={canvas}></canvas>
