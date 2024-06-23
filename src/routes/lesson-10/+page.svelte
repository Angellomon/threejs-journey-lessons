<script>
	import { browser } from '$app/environment';
	import { createMeshTextureCube, newSizes } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

	/**@type{HTMLCanvasElement}*/
	let canvas;

	if (browser) {
		let menuHeight = document.querySelector('.menu')?.clientHeight || 0;

		const loadingManager = new THREE.LoadingManager();

		loadingManager.onStart = () => {
			console.log('on start');
		};
		loadingManager.onProgress = () => {
			console.log('on progress');
		};
		loadingManager.onLoad = () => {
			console.log('on load');
		};
		loadingManager.onError = () => {
			console.log('on error');
		};

		const textureLoader = new THREE.TextureLoader(loadingManager);

		const texture = textureLoader.load('/textures/muta-meme.jpeg');
		texture.colorSpace = THREE.SRGBColorSpace;

		function setupScene() {
			const scene = new THREE.Scene();

			const cube = createMeshTextureCube({
				map: texture
			});
			scene.add(cube);

			const cameraSizes = newSizes(window.innerWidth, window.innerHeight - menuHeight);

			const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect());

			camera.position.z = 5;

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
			window.addEventListener('resize', () => {
				menuHeight = document.querySelector('.menu')?.clientHeight || 0;

				// @ts-ignore
				const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;

				cameraSizes.width = window.innerWidth;

				if (!isFullscreen) cameraSizes.height = window.innerHeight - menuHeight;
				else cameraSizes.height = window.innerHeight;

				camera.aspect = cameraSizes.aspect();
				camera.updateProjectionMatrix();

				renderer.setSize(cameraSizes.width, cameraSizes.height);
			});
			canvas.addEventListener('dblclick', () => {
				// @ts-ignore
				const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;

				if (isFullscreen) document.exitFullscreen();
				else canvas.requestFullscreen();
			});
		}

		onMount(() => {
			setupScene();
		});
	}
</script>

<svelte:head>
	<title>10 - Textures</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>
