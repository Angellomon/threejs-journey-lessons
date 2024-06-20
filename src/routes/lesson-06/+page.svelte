<script>
	import { createMeshBasicCube, newSizes } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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
		const perspectiveRendererGUI = perspectiveCameraGUI.addFolder('Renderer Settings');
		const orthographicRendererGUI = orthographicCameraGUI.addFolder('Renderer Settings');
		const perspectivePositionGUI = perspectiveCameraGUI.addFolder('Position');
		const orthographicPositionGUI = orthographicCameraGUI.addFolder('Position');

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
				far: 90,
				lookAt: true
			};
			const camera = new THREE.PerspectiveCamera(
				cameraSettings.fov,
				cameraSettings.aspect,
				cameraSettings.near,
				cameraSettings.far
			);

			camera.position.z = 5;
			camera.position.y = 5;
			camera.lookAt(cube.position);

			const controls = new OrbitControls(camera, canvasPerspectiveCamera);

			const renderer = new THREE.WebGLRenderer({
				canvas: canvasPerspectiveCamera
			});
			renderer.setSize(cameraSizes.width, cameraSizes.height);

			perspectiveCameraGUI.add(cameraSettings, 'lookAt').onChange((/**@type{boolean}*/ lookAt) => {
				if (lookAt) camera.lookAt(cube.position);
			});

			perspectivePositionGUI.add(controls.target, 'x', -100, 100, 1).onChange(() => {
				if (cameraSettings.lookAt) camera.lookAt(cube.position);

				controls.update();
			});
			perspectivePositionGUI.add(controls.target, 'y', -100, 100, 1).onChange(() => {
				if (cameraSettings.lookAt) camera.lookAt(cube.position);

				controls.update();
			});
			perspectivePositionGUI.add(controls.target, 'z', -100, 100, 1).onChange(() => {
				if (cameraSettings.lookAt) camera.lookAt(cube.position);

				controls.update();
			});
			// .onChange((/**@type{number}*/newX) => {
			// 	camera
			// })

			perspectiveRendererGUI
				.add(cameraSizes, 'width', 0, window.innerWidth, 10)
				.onChange((/**@type{number}*/ newWidth) => {
					renderer.setSize(newWidth, cameraSizes.height);

					camera.aspect = newWidth / cameraSizes.height;
					camera.updateProjectionMatrix();
				});

			perspectiveRendererGUI
				.add(cameraSizes, 'height', 0, window.innerHeight, 10)
				.onChange((/**@type{number}*/ newHeight) => {
					renderer.setSize(cameraSizes.width, newHeight);
					camera.aspect = cameraSizes.width / newHeight;
					camera.updateProjectionMatrix();
				});

			perspectiveCameraGUI
				.add(cameraSettings, 'fov', 0, 100)
				.onChange((/**@type{number}*/ newFov) => {
					camera.fov = newFov;
					camera.updateProjectionMatrix();
				});

			perspectiveCameraGUI
				.add(cameraSettings, 'near', 0, 10, 0.01)
				.onChange((/**@type{number}*/ newNear) => {
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

				controls.update();

				window.requestAnimationFrame(tick);
			}

			window.requestAnimationFrame(tick);
		}

		function setupOrthographicCameraScene() {
			let cube = createMeshBasicCube(1, 0xff0000);

			gsap.to(cube.rotation, {
				y: Math.PI * 0.5,
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
				far: 69,
				lookAt: true
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
			camera.position.y = 5;
			camera.lookAt(cube.position);

			const controls = new OrbitControls(camera, canvasOrthographicCamera);

			const renderer = new THREE.WebGLRenderer({
				canvas: canvasOrthographicCamera
			});

			renderer.setSize(cameraSizes.width, cameraSizes.height);

			orthographicCameraGUI.add(cameraSettings, 'lookAt').onChange((/**@type{boolean}*/ lookAt) => {
				if (lookAt) camera.lookAt(cube.position);
			});

			orthographicPositionGUI.add(controls.target, 'x', -100, 100, 1).onChange(() => {
				if (cameraSettings.lookAt) camera.lookAt(cube.position);

				controls.update();
			});
			orthographicPositionGUI.add(controls.target, 'y', -100, 100, 1).onChange(() => {
				if (cameraSettings.lookAt) camera.lookAt(cube.position);

				controls.update();
			});
			orthographicPositionGUI.add(controls.target, 'z', -100, 100, 1).onChange(() => {
				if (cameraSettings.lookAt) camera.lookAt(cube.position);

				controls.update();
			});

			orthographicRendererGUI
				.add(cameraSizes, 'width', 0, window.innerWidth, 10)
				.onChange((/**@type{number}*/ newWidth) => {
					const aspect = newWidth / cameraSizes.height;

					renderer.setSize(newWidth, cameraSizes.height);

					camera.left = cameraSettings.left * aspect;
					camera.right = cameraSettings.right * aspect;
					camera.updateProjectionMatrix();
				});

			orthographicRendererGUI
				.add(cameraSizes, 'height', 0, window.innerHeight, 10)
				.onChange((/**@type{number}*/ newHeight) => {
					const aspect = cameraSizes.width / newHeight;

					renderer.setSize(cameraSizes.width, newHeight);

					camera.left = cameraSettings.left * aspect;
					camera.right = cameraSettings.right * aspect;
					camera.updateProjectionMatrix();
				});

			orthographicCameraGUI
				.add(cameraSettings, 'left', -10, 10, 1)
				.onChange((/**@type{number}*/ newLeft) => {
					camera.left = newLeft * cameraSizes.aspect();
					camera.updateProjectionMatrix();
				});

			orthographicCameraGUI
				.add(cameraSettings, 'right', -10, 10, 1)
				.onChange((/**@type{number}*/ newRight) => {
					camera.right = newRight * cameraSizes.aspect();
					camera.updateProjectionMatrix();
				});

			orthographicCameraGUI
				.add(cameraSettings, 'near', 0, 10, 0.01)
				.onChange((/**@type{number}*/ newNear) => {
					camera.near = newNear;
					camera.updateProjectionMatrix();
				});

			orthographicCameraGUI.add(cameraSettings, 'far').onChange((/**@type{number}*/ newFar) => {
				camera.far = newFar;
				camera.updateProjectionMatrix();
			});

			const scene = new THREE.Scene();
			scene.add(cube);

			function tick() {
				renderer.render(scene, camera);

				controls.update();

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

<h1>Perpective Camera (with OrbitControls)</h1>
<canvas bind:this={canvasPerspectiveCamera}></canvas>

<h1>Orthographic Camera (with OrbitControls)</h1>
<canvas bind:this={canvasOrthographicCamera}></canvas>
