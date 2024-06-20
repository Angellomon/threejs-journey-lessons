<script>
	import { browser } from '$app/environment';
	import { createMeshBasicCube, newSizes } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

	const DEFAULT_FOV = 75;

	/**@type {HTMLCanvasElement}*/
	let canvas;

	if (browser) {
		const menuHeight = document.querySelector('.menu')?.clientHeight || 0;

		function setupScene() {
			const scene = new THREE.Scene();

			const cubesGroup = new THREE.Group();

			scene.add(cubesGroup);

			const redCube = createMeshBasicCube(1, 0xff0000);
			cubesGroup.add(redCube);

			const cameraSizes = newSizes(window.innerWidth, window.innerHeight - menuHeight);

			const camera = new THREE.PerspectiveCamera(DEFAULT_FOV, cameraSizes.aspect());

			const controls = new OrbitControls(camera, canvas);

			camera.position.z = 5;

			const renderer = new THREE.WebGLRenderer({
				canvas
			});

			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

			renderer.setSize(cameraSizes.width, cameraSizes.height);

			function tick() {
				renderer.render(scene, camera);

				controls.update();

				window.requestAnimationFrame(tick);
			}

			window.requestAnimationFrame(tick);
			window.addEventListener('resize', () => {
				// @ts-ignore
				const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
				cameraSizes.width = window.innerWidth;
				if (!isFullscreen) cameraSizes.height = window.innerHeight - menuHeight;
				else cameraSizes.height = window.innerHeight;

				camera.aspect = cameraSizes.aspect();
				camera.updateProjectionMatrix();

				renderer.setSize(cameraSizes.width, cameraSizes.height);
			});
			window.addEventListener('dblclick', () => {
				// @ts-ignore
				const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;

				if (!isFullscreen) canvas.requestFullscreen();
				else document.exitFullscreen();
			});
		}

		onMount(() => {
			setupScene();
		});
	}
</script>

<svelte:head>
	<title>07 - Fullscreen & resizing</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>
