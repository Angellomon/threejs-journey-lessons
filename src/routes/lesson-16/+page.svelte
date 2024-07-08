<script>
	import { browser } from '$app/environment';
	import { CameraFullSizes } from '$lib/camera-sizes';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

	/**@type{HTMLCanvasElement}*/
	let canvas;

	function setupScene() {
		const scene = new THREE.Scene();

		const ambientLight = new THREE.AmbientLight(0xffffff, 1);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

		scene.add(ambientLight, directionalLight);

		const cameraSizes = new CameraFullSizes('.menu');

		const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect);
		camera.position.z = 5;

		const controls = new OrbitControls(camera, canvas);

		const sphere = new THREE.Mesh(
			new THREE.SphereGeometry(0.5, 64, 64),
			new THREE.MeshStandardMaterial({ color: 0xffffff })
		);

		scene.add(sphere);

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
			cameraSizes.updateSizes();
			camera.aspect = cameraSizes.aspect;
			camera.updateProjectionMatrix();

			renderer.setSize(...cameraSizes.sizes);
		});

		canvas.addEventListener('dblclick', () => {
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
	<title>Haunted House Project</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>
