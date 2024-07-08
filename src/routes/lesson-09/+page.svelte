<script>
	import { browser } from '$app/environment';
	import * as THREE from 'three';
	import GUI from 'lil-gui';
	import { onDestroy, onMount } from 'svelte';
	import gsap from 'gsap';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { createMeshBox } from '$lib/utils';
	import { CameraFullSizes } from '$lib/camera-sizes';

	/**@type{HTMLCanvasElement}*/
	let canvas;
	const defaultColor = 0xff0000;

	function setupScene() {
		const scene = new THREE.Scene();

		const cameraSizes = new CameraFullSizes('.menu');

		const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect);

		camera.position.z = 5;

		const controls = new OrbitControls(camera, canvas);

		const box = createMeshBox({
			color: defaultColor,
			depth: 1,
			height: 1,
			width: 1,
			segments: {
				depth: 1,
				height: 1,
				width: 1
			},
			wireframe: true
		});

		scene.add(box);

		const debugObject = {
			color: defaultColor,
			spin: () => {
				gsap.to(box.rotation, {
					y: box.rotation.y + Math.PI * 2
				});
			}
		};

		const debugGUI = new GUI({
			width: 300,
			closeFolders: true
		});

		debugGUI.add(box.position, 'y').min(-3).max(3).step(0.01).name('elevation');

		debugGUI.add(box, 'visible');

		debugGUI.add(box.material, 'wireframe');

		debugGUI.addColor(debugObject, 'color').onChange((/**@type{number}*/ newColor) => {
			box.material.color.set(newColor);
		});

		debugGUI.add(debugObject, 'spin');

		const renderer = new THREE.WebGLRenderer({
			canvas
		});

		renderer.setSize(...cameraSizes.sizes);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		function tick() {
			renderer.render(scene, camera);

			controls.update();

			window.requestAnimationFrame(tick);
		}

		window.requestAnimationFrame(tick);
		document.addEventListener('keydown', (e) => {
			if (e.key == 'h') debugGUI.show(debugGUI._hidden);
		});
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

		onDestroy(() => {
			document.removeEventListener('keydown', () => {});
			document.removeEventListener('resize', () => {});
			document.removeEventListener('dblclick', () => {});
		});
	}
</script>

<svelte:head>
	<title>09 - Debug UI</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>
