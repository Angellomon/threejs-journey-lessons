<script>
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { createMeshBasicTexture, newSizes } from '$lib/utils';

	/**@type{HTMLCanvasElement}*/
	let canvas;

	if (browser) {
		let menuHeight = document.querySelector('.menu')?.clientHeight || 0;

		const material = new THREE.MeshBasicMaterial({
			side: THREE.DoubleSide
		});

		function setupScene() {
			const scene = new THREE.Scene();

			const shapesGroup = new THREE.Group();

			scene.add(shapesGroup);

			const sphere = createMeshBasicTexture({
				shape: 'sphere',
				length: 0.5,
				widthSegments: 16,
				heightSegments: 16,
				material
			});

			sphere.position.x = -1.5;

			shapesGroup.add(sphere);

			const plane = createMeshBasicTexture({
				shape: 'plane',
				width: 1,
				height: 1,
				material
			});

			plane.position.x = 0;

			shapesGroup.add(plane);

			const torus = createMeshBasicTexture({
				shape: 'torus',
				radius: 0.3,
				tube: 0.2,
				radialSegments: 16,
				tubularSegments: 32,
				arc: 7,
				material
			});

			torus.position.x = 1.5;

			shapesGroup.add(torus);

			const cameraSizes = newSizes(window.innerWidth, window.innerHeight - menuHeight);

			const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect());
			camera.position.z = 5;

			const controls = new OrbitControls(camera, canvas);

			const renderer = new THREE.WebGLRenderer({
				canvas
			});

			renderer.setSize(cameraSizes.width, cameraSizes.height);

			const clock = new THREE.Clock();

			function tick() {
				const elapsedTime = clock.getElapsedTime();

				sphere.rotation.y = 0.1 * elapsedTime;
				plane.rotation.y = 0.1 * elapsedTime;
				torus.rotation.y = 0.1 * elapsedTime;

				sphere.rotation.x = 0.15 * elapsedTime;
				plane.rotation.x = 0.15 * elapsedTime;
				torus.rotation.x = 0.15 * elapsedTime;

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

<svelte:head>
	<title>11 - Materials</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>
