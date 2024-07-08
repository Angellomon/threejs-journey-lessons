<script>
	import { browser } from '$app/environment';
	import { CameraFullSizes } from '$lib/camera-sizes';
	import { createMeshBasicCube, newSizes } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

	const DEFAULT_FOV = 75;

	/**@type {HTMLCanvasElement}*/
	let canvas;

	function setupScene() {
		const scene = new THREE.Scene();

		const cubesGroup = new THREE.Group();

		scene.add(cubesGroup);

		const redCube = createMeshBasicCube(1, 0xff0000);
		cubesGroup.add(redCube);

		const cameraSizes = new CameraFullSizes('.menu');

		const camera = new THREE.PerspectiveCamera(DEFAULT_FOV, cameraSizes.aspect);

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
			cameraSizes.updateSizes();

			camera.aspect = cameraSizes.aspect;
			camera.updateProjectionMatrix();

			renderer.setSize(...cameraSizes.sizes);
		});
		window.addEventListener('dblclick', () => {
			const isFullscreen = !!document.fullscreenElement;

			if (isFullscreen) document.exitFullscreen();
			else canvas.requestFullscreen();
		});
	}

	if (browser) {
		onMount(() => {
			setupScene();
		});
	}
</script>

<svelte:head>
	<title>07 - Fullscreen & resizing</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>
