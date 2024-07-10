<script>
	import { browser } from '$app/environment';
	import { CameraFullSizes } from '$lib/camera-sizes';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { Timer } from 'three/addons/misc/Timer.js';

	/**@type{HTMLCanvasElement}*/
	let canvas;

	function setupScene() {
		const scene = new THREE.Scene();

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);

		scene.add(ambientLight, directionalLight);

		const cameraSizes = new CameraFullSizes('.menu');

		const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect);
		camera.position.x = 4;
		camera.position.y = 2;
		camera.position.z = 5;

		const controls = new OrbitControls(camera, canvas);
		controls.enableDamping = true;

		const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial());
		scene.add(floor);

		floor.rotation.x = Math.PI * -0.5;
		floor.position.y = 0;

		const renderer = new THREE.WebGLRenderer({
			canvas
		});
		renderer.setSize(cameraSizes.width, cameraSizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		const timer = new Timer();

		function render() {
			renderer.render(scene, camera);

			controls.update();
		}

		function tick() {
			timer.update();

			render();

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
