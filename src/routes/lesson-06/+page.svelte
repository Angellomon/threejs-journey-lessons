<script>
	import { createMeshBasicCube, newSizes } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import GUI from 'lil-gui';
	import { browser } from '$app/environment';
	import gsap from 'gsap';

	/** @type {HTMLCanvasElement}*/
	let canvasPerspectiveCamera;

	/** @type {HTMLCanvasElement}*/
	let canvasOrthographicCamera;

	if (browser) {
		const gui = new GUI();
		const perspectiveCameraGUI = gui.addFolder('Perspective Camera');
		const orthographicCameraGUI = gui.addFolder('Orthographic Camera');

		function setupPerspectiveCameraScene() {
			let cube = createMeshBasicCube(1, 0xff0000);

			gsap.to(cube.rotation, {
				y: Math.PI,
				duration: 3,
				ease: 'none',
				repeat: -1
			});

			const cameraSizes = newSizes();
			const cameraSettings = {
				fov: 75,
				aspect: cameraSizes.aspect(),
				near: 0.001,
				far: 90
			};
			const camera = new THREE.PerspectiveCamera(
				cameraSettings.fov,
				cameraSettings.aspect,
				cameraSettings.near,
				cameraSettings.far
			);
			camera.position.z = 5;

			const renderer = new THREE.WebGLRenderer({
				canvas: canvasPerspectiveCamera
			});
			renderer.setSize(cameraSizes.width, cameraSizes.height);

			perspectiveCameraGUI.add(cameraSizes, 'width').onChange((/**@type{number}*/ newWidth) => {
				renderer.setSize(newWidth, cameraSizes.height);

				camera.aspect = newWidth / cameraSizes.height;
				camera.updateProjectionMatrix();
			});

			perspectiveCameraGUI.add(cameraSizes, 'height').onChange((/**@type{number}*/ newHeight) => {
				renderer.setSize(cameraSizes.width, newHeight);
				camera.aspect = cameraSizes.width / newHeight;
				camera.updateProjectionMatrix();
			});

			perspectiveCameraGUI.add(cameraSettings, 'fov').onChange((/**@type{number}*/ newFov) => {
				camera.fov = newFov;
				camera.updateProjectionMatrix();
			});

			perspectiveCameraGUI.add(cameraSettings, 'near').onChange((/**@type{number}*/ newNear) => {
				camera.near = newNear;
				camera.updateProjectionMatrix();
			});

			perspectiveCameraGUI.add(cameraSettings, 'far').onChange((/**@type{number}*/ newFar) => {
				camera.far = newFar;
				camera.updateProjectionMatrix();
			});

			const scene = new THREE.Scene();

			scene.add(cube);

			function tick() {
				renderer.render(scene, camera);

				window.requestAnimationFrame(tick);
			}

			window.requestAnimationFrame(tick);
		}

		function setupOrthographicCameraScene() {
			let cube = createMeshBasicCube(1, 0xff0000);

			gsap.to(cube.rotation, {
				y: Math.PI,
				duration: 3,
				ease: 'none',
				repeat: -1
			});

			const cameraSizes = newSizes();
			const cameraSettings = {
				left: -1 * cameraSizes.aspect(),
				right: 1 * cameraSizes.aspect(),
				top: 1,
				bottom: -1,
				near: 0.1,
				far: 69
			};

			const camera = new THREE.OrthographicCamera(
				cameraSettings.left,
				cameraSettings.right,
				cameraSettings.top,
				cameraSettings.bottom,
				cameraSettings.near,
				cameraSettings.far
			);

			camera.position.z = 5;

			const renderer = new THREE.WebGLRenderer({
				canvas: canvasOrthographicCamera
			});

			renderer.setSize(cameraSizes.width, cameraSizes.height);

			const scene = new THREE.Scene();
			scene.add(cube);

			function tick() {
				renderer.render(scene, camera);

				window.requestAnimationFrame(tick);
			}
			window.requestAnimationFrame(tick);
		}

		onMount(() => {
			setupPerspectiveCameraScene();
			setupOrthographicCameraScene();
		});
	}
</script>

<h1>Perpective Camera</h1>
<canvas bind:this={canvasPerspectiveCamera}></canvas>

<h1>Orthographic Camera</h1>
<canvas bind:this={canvasOrthographicCamera}></canvas>
