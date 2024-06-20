<script>
	import { browser } from '$app/environment';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { onMount } from 'svelte';
	import { createMeshBox, newSizes } from '$lib/utils';
	import { GUI } from 'lil-gui';
	import gsap from 'gsap';

	/**@type{HTMLCanvasElement}*/
	let canvas;

	const DEFAULT_FOV = 75;

	if (browser) {
		const menuHeight = document.querySelector('.menu')?.clientHeight || 0;

		const gui = new GUI();
		const boxGUI = gui.addFolder('Box');

		function setupScene() {
			const scene = new THREE.Scene();

			const cubesGroup = new THREE.Group();
			scene.add(cubesGroup);

			const redCube = createMeshBox({
				width: 1,
				height: 2,
				depth: 3,
				wireframe: true,
				segments: {
					width: 2,
					height: 2,
					depth: 2
				},
				color: 0xff0000
			});
			cubesGroup.add(redCube);

			const redCubeTimeline = gsap.timeline({
				repeat: -1
			});
			redCubeTimeline.to(redCube.rotation, {
				y: Math.PI,
				duration: 3,
				ease: 'none'
			});

			const cameraSizes = newSizes(window.innerWidth, window.innerHeight - menuHeight);

			const camera = new THREE.PerspectiveCamera(DEFAULT_FOV, cameraSizes.aspect());
			camera.position.z = 5;

			const controls = new OrbitControls(camera, canvas);

			const renderer = new THREE.WebGLRenderer({
				canvas
			});
			renderer.setSize(cameraSizes.width, cameraSizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
	<title>08 - Geometries</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>
