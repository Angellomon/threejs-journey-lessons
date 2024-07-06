<script>
	import { browser } from '$app/environment';
	import { newSizes } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { GUI } from 'lil-gui';

	/**@type{HTMLCanvasElement}*/
	let canvas;

	const showShadow = false;

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
			const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);

			scene.add(directionalLight, directionalLightCameraHelper);

			directionalLightCameraHelper.visible = showShadow;

			directionalLight.castShadow = true;
			directionalLight.shadow.mapSize.width = 1024;
			directionalLight.shadow.mapSize.height = 1024;
			directionalLight.shadow.camera.near = 1;
			directionalLight.shadow.camera.far = 6;
			directionalLight.shadow.camera.top = 2;
			directionalLight.shadow.camera.right = 2;
			directionalLight.shadow.camera.bottom = -2;
			directionalLight.shadow.camera.left = -2;
			directionalLight.shadow.radius = 10;
			directionalLight.position.set(2, 2, -1);

			directionalLight.position.y = 2;

			directionalLightDebugUI.add(directionalLight, 'intensity').min(0).max(2).step(0.01);

			const spotlight = new THREE.SpotLight(0xffffff, 1, 2, Math.PI * 0.2);
			const spotlightCameraHelper = new THREE.CameraHelper(spotlight.shadow.camera);

			scene.add(spotlight, spotlightCameraHelper, spotlight.target);

			spotlightCameraHelper.visible = showShadow;

			spotlight.castShadow = true;
			spotlight.shadow.mapSize.width = 1024;
			spotlight.shadow.mapSize.height = 1024;
			spotlight.shadow.camera.near = 1;
			spotlight.shadow.camera.far = 6;
			spotlight.position.set(0, 2, 2);

			spotlightDebugUI.add(spotlight, 'intensity');

			const pointLight = new THREE.PointLight(0xffffff, 2);
			const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);

			scene.add(pointLight, pointLightCameraHelper);

			pointLightCameraHelper.visible = showShadow;

			pointLight.castShadow = true;
			pointLight.shadow.mapSize.width = 1024;
			pointLight.shadow.mapSize.height = 1024;
			pointLight.shadow.camera.near = 0.1;
			pointLight.shadow.camera.far = 5;
			pointLight.position.set(-1, 1, 0);

			const material = new THREE.MeshStandardMaterial();

			const materialDebugUI = directionalLightDebugUI.addFolder('Standard Material');

			materialDebugUI.add(material, 'roughness').min(0).max(1).step(0.001);
			materialDebugUI.add(material, 'metalness').min(0).max(1).step(0.001);

			const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 16), material);
			scene.add(sphere);

			sphere.castShadow = true;

			const plane = new THREE.Mesh(
				new THREE.PlaneGeometry(5, 5),
				// new THREE.MeshStandardMaterial()
				new THREE.MeshBasicMaterial({ map: bakedShadowTexture })
			);
			plane.rotation.x = -Math.PI * 0.5;
			plane.rotation.z = Math.PI * 1.25;
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
			camera.position.x = 1;
			camera.position.y = 1;
			camera.position.z = 2;
			camera.lookAt(new THREE.Vector3());

			const controls = new OrbitControls(camera, canvas);

			const renderer = new THREE.WebGLRenderer({
				canvas
			});
			renderer.shadowMap.enabled = showShadow;
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
