<script>
	import { browser } from '$app/environment';
	import { createMeshBasicTexture, createMeshTextureCube, newSizes } from '$lib/utils';
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

		const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
		const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
		const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
		const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
		const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
		const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
		const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

		const checkerboard1024Texture = textureLoader.load('/textures/checkerboard-1024x1024.png');
		const checkerboard8Texture = textureLoader.load('/textures/checkerboard-8x8.png');

		const minecraftTexture = textureLoader.load('/textures/minecraft.png');

		/**@type{THREE.Texture}*/
		let texture;

		// texture = doorColorTexture
		texture = minecraftTexture;
		// texture = checkerboard1024Texture;
		// texture = checkerboard8Texture;

		texture.generateMipmaps = false;
		texture.colorSpace = THREE.SRGBColorSpace;
		texture.minFilter = THREE.NearestFilter;
		texture.magFilter = THREE.NearestFilter;

		doorColorTexture.repeat.x = 2;
		doorColorTexture.repeat.y = 3;

		doorColorTexture.wrapS = THREE.RepeatWrapping;
		doorColorTexture.wrapT = THREE.RepeatWrapping;

		doorColorTexture.offset.x = 0.5;
		doorColorTexture.offset.y = 0.5;

		doorColorTexture.rotation = Math.PI * 0.5;

		doorColorTexture.center.x = 0.5;
		doorColorTexture.center.y = 0.5;

		doorColorTexture.minFilter = THREE.LinearFilter;

		function setupScene() {
			const scene = new THREE.Scene();

			const cube = createMeshBasicTexture({
				shape: 'cube',
				texture,
				radius: 1
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
