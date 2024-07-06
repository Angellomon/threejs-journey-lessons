<script>
	import { browser } from '$app/environment';
	import { newSizes } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { GUI } from 'lil-gui';

	/**@type{HTMLCanvasElement}*/
	let canvas;

	if (browser) {
		let menuHeight = document.querySelector('.menu')?.clientHeight || 0;

		function setupScene() {
			const debugUI = new GUI();
			const ambientLightDebugUI = debugUI.addFolder('Ambient Light');
			const directionalLightDebugUI = debugUI.addFolder('Directional Light');
			const spotlightDebugUI = debugUI.addFolder('Spotlight Light');

			const textureLoader = new THREE.TextureLoader();
			const bakedShadowTexture = textureLoader.load('/textures/bakedShadow.jpg');
			bakedShadowTexture.colorSpace = THREE.SRGBColorSpace;

			const simpleShadowTexture = textureLoader.load('/textures/simpleShadow.jpg');
			simpleShadowTexture.colorSpace = THREE.SRGBColorSpace;

			const scene = new THREE.Scene();

			const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
			scene.add(ambientLight);
			ambientLightDebugUI.add(ambientLight, 'intensity').min(0).max(2).step(0.01);

			const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
			const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
			scene.add(directionalLight, directionalLightHelper);

			const directionalLightHelperDebugUI = directionalLightDebugUI.addFolder('Helper');

			const directionalLightShadowCameraDebugUI =
				directionalLightDebugUI.addFolder('Shadow Camera');
			const directionalLightShadowDebugUI = directionalLightDebugUI.addFolder('Shadow');
			const directionalLightMapSizeDebugUI = directionalLightDebugUI.addFolder('Shadow Map Size');

			directionalLight.castShadow = true;
			directionalLight.shadow.camera.top = 2;

			directionalLightShadowDebugUI.add(directionalLight.shadow, 'radius').min(0).max(10);

			directionalLightMapSizeDebugUI
				.add(directionalLight.shadow.mapSize, 'width')
				.min(0)
				.max(2048)
				.step(32);
			directionalLightMapSizeDebugUI
				.add(directionalLight.shadow.mapSize, 'height')
				.min(0)
				.max(2048)
				.step(32);

			directionalLightShadowCameraDebugUI.add(directionalLight.shadow.camera, 'top');
			directionalLightShadowCameraDebugUI.add(directionalLight.shadow.camera, 'bottom');
			directionalLightShadowCameraDebugUI.add(directionalLight.shadow.camera, 'left');
			directionalLightShadowCameraDebugUI.add(directionalLight.shadow.camera, 'right');
			directionalLightShadowCameraDebugUI.add(directionalLight.shadow.camera, 'near');
			directionalLightShadowCameraDebugUI.add(directionalLight.shadow.camera, 'far');

			directionalLightHelperDebugUI.add(directionalLightHelper, 'visible');

			directionalLight.position.y = 2;

			const directionalLightPositionDebugUI = directionalLightDebugUI.addFolder('Position');

			directionalLightDebugUI.add(directionalLight, 'intensity').min(0).max(2).step(0.01);
			directionalLightPositionDebugUI
				.add(directionalLight.position, 'x')
				.min(-5)
				.max(5)
				.step(0.001)
				.onChange(() => {
					directionalLightHelper.update();
				});
			directionalLightPositionDebugUI
				.add(directionalLight.position, 'y')
				.min(-5)
				.max(5)
				.step(0.001)
				.onChange(() => {
					directionalLightHelper.update();
				});
			directionalLightPositionDebugUI
				.add(directionalLight.position, 'z')
				.min(-5)
				.max(5)
				.step(0.001)
				.onChange(() => {
					directionalLightHelper.update();
				});

			const spotlight = new THREE.SpotLight(0xffffff, 1, 2, Math.PI * 0.2);
			const spotlightHelper = new THREE.SpotLightHelper(spotlight);
			scene.add(spotlight, spotlightHelper);

			spotlight.position.y = 2;

			spotlight.castShadow = true;

			spotlightDebugUI.add(spotlight, 'intensity');
			spotlightDebugUI.add(spotlight, 'distance');

			const spotlightPositionFolder = spotlightDebugUI.addFolder('Position');
			spotlightPositionFolder
				.add(spotlight.position, 'x')
				.min(-5)
				.max(5)
				.onChange(() => {
					spotlightHelper.update();
				});
			spotlightPositionFolder
				.add(spotlight.position, 'y')
				.min(-5)
				.max(5)
				.onChange(() => {
					spotlightHelper.update();
				});
			spotlightPositionFolder
				.add(spotlight.position, 'z')
				.min(-5)
				.max(5)
				.onChange(() => {
					spotlightHelper.update();
				});

			const spotlightShadowFolder = spotlightDebugUI.addFolder('Shadow');

			spotlightShadowFolder.add(spotlight, 'castShadow');
			spotlightShadowFolder
				.add(spotlight.shadow.camera, 'fov')
				.min(0)
				.max(120)
				.onChange(() => {
					spotlight.shadow.needsUpdate = true;
				});

			const spotlightHelperFolder = spotlightDebugUI.addFolder('Helper');
			spotlightHelperFolder.add(spotlightHelper, 'visible');

			const pointLight = new THREE.PointLight(0xffffff, 2);
			const pointLightHelper = new THREE.PointLightHelper(pointLight);

			scene.add(pointLight, pointLightHelper);

			pointLight.castShadow = true;

			pointLight.position.set(1, 1, 1);

			const material = new THREE.MeshStandardMaterial();

			const materialDebugUI = directionalLightDebugUI.addFolder('Standard Material');

			materialDebugUI.add(material, 'roughness').min(0).max(1).step(0.001);
			materialDebugUI.add(material, 'metalness').min(0).max(1).step(0.001);

			const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 16), material);
			scene.add(sphere);

			sphere.castShadow = true;

			const plane = new THREE.Mesh(
				new THREE.PlaneGeometry(5, 5),
				new THREE.MeshBasicMaterial({ map: bakedShadowTexture })
			);
			plane.position.y = -0.5;
			scene.add(plane);

			plane.rotation.x = Math.PI * -0.5;
			plane.receiveShadow = true;

			const sphereShadow = new THREE.Mesh(
				new THREE.PlaneGeometry(1.5, 1.5),
				new THREE.MeshBasicMaterial({
					color: 0x000000,
					transparent: true,
					alphaMap: simpleShadowTexture
				})
			);
			sphereShadow.rotation.x = Math.PI * -0.5;
			sphereShadow.position.y = -0.5 + 0.001;
			sphereShadow.position.x = sphere.position.x;
			sphereShadow.position.z = sphere.position.z;

			scene.add(sphereShadow);

			const cameraSizes = newSizes(window.innerWidth, window.innerHeight - menuHeight);

			const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect());
			camera.position.z = 5;
			camera.position.y = 1;
			camera.lookAt(new THREE.Vector3());

			const controls = new OrbitControls(camera, canvas);

			const renderer = new THREE.WebGLRenderer({
				canvas
			});
			renderer.shadowMap.enabled = false;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap;

			renderer.setSize(cameraSizes.width, cameraSizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
			document.addEventListener('dblclick', () => {
				const isFullscreen = !!document.fullscreenElement;

				if (isFullscreen) document.exitFullscreen();
				else canvas.requestFullscreen();
			});
		}

		onMount(() => {
			setupScene();
		});
	}
</script>

<canvas bind:this={canvas}></canvas>
