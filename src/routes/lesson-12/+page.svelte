<script>
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { createMeshBasicCube, newSizes } from '$lib/utils';

	/**@type{HTMLCanvasElement}*/
	let canvas;

	if (browser) {
		let menuHeight = document.querySelector('.menu')?.clientHeight || 0;

		function setupScene() {
			const scene = new THREE.Scene();

			const cube = createMeshBasicCube(1, 0xffffff);
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
				const isFullscreen = !!document.fullscreenElement;

				cameraSizes.width = window.innerWidth;

				if (isFullscreen) cameraSizes.height = window.innerHeight;
				else cameraSizes.height = window.innerHeight - menuHeight;

				camera.aspect = cameraSizes.aspect();
				camera.updateProjectionMatrix();
				renderer.setSize(cameraSizes.width, cameraSizes.height);
			});
			canvas.addEventListener('dblclick', () => {
				const isFullscreen = !!document.fullscreenElement;

				console.log('dblclick', isFullscreen);
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
