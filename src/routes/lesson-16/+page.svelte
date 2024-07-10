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

		const textureLoader = new THREE.TextureLoader();

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

		const houseGroup = new THREE.Group();
		scene.add(houseGroup);

		const houseWalls = new THREE.Mesh(
			new THREE.BoxGeometry(4, 2.5, 4),
			new THREE.MeshStandardMaterial()
		);
		houseGroup.add(houseWalls);

		houseWalls.position.set(0, 1.25, 0);

		const houseRoof = new THREE.Mesh(
			new THREE.ConeGeometry(3.5, 1.5, 4, 1),
			new THREE.MeshStandardMaterial()
		);
		houseGroup.add(houseRoof);

		houseRoof.position.set(0, 3.25, 0);
		houseRoof.rotation.y = Math.PI * 0.25;

		const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
		const dooorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
		const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
		const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
		const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
		const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
		const doorRoughnessMap = textureLoader.load('/textures/door/roughness.jpg');

		const houseDoor = new THREE.Mesh(
			new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
			new THREE.MeshStandardMaterial({
				map: doorColorTexture,
				alphaMap: dooorAlphaTexture,
				aoMap: doorAmbientOcclusionTexture,
				displacementMap: doorHeightTexture,
				metalnessMap: doorMetalnessTexture,
				roughnessMap: doorRoughnessMap,
				normalMap: doorNormalTexture,
				transparent: true,
				metalness: 0.45,
				roughness: 0.65,
				displacementScale: 0.1
			})
		);
		houseGroup.add(houseDoor);

		houseDoor.position.set(0, 1, 1.98);

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
