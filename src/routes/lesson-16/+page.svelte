<script>
	import { browser } from '$app/environment';
	import { CameraFullSizes } from '$lib/camera-sizes';
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { Timer } from 'three/addons/misc/Timer.js';

	/**@type{HTMLCanvasElement}*/
	let canvas;

	function setupScene() {
		const debugGUI = new GUI();

		const scene = new THREE.Scene();

		const textureLoader = new THREE.TextureLoader();

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

		scene.add(ambientLight, directionalLight);

		const cameraSizes = new CameraFullSizes('.menu');

		const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect);
		camera.position.x = 4;
		camera.position.y = 2;
		camera.position.z = 5;

		const controls = new OrbitControls(camera, canvas);
		controls.enableDamping = true;

		const floorAlphaMap = textureLoader.load('/textures/floor/alpha.jpg');
		const floorColorMap = textureLoader.load('/textures/floor/leafy_grass_diff_1k.jpg');
		const floorHeightMap = textureLoader.load('/textures/floor/leafy_grass_disp_1k.jpg');
		const floorNormalMap = textureLoader.load('/textures/floor/leafy_grass_nor_gl_1k.jpg');

		// Ambient Occlusion + Roughness + Metalness
		const floorARMMap = textureLoader.load('/textures/floor/leafy_grass_arm_1k.jpg');

		floorColorMap.colorSpace = THREE.SRGBColorSpace;
		floorHeightMap.colorSpace = THREE.SRGBColorSpace;
		floorNormalMap.colorSpace = THREE.SRGBColorSpace;
		floorARMMap.colorSpace = THREE.SRGBColorSpace;

		floorColorMap.wrapS = THREE.RepeatWrapping;
		floorHeightMap.wrapS = THREE.RepeatWrapping;
		floorNormalMap.wrapS = THREE.RepeatWrapping;
		floorARMMap.wrapS = THREE.RepeatWrapping;

		floorColorMap.wrapT = THREE.RepeatWrapping;
		floorHeightMap.wrapT = THREE.RepeatWrapping;
		floorNormalMap.wrapT = THREE.RepeatWrapping;
		floorARMMap.wrapT = THREE.RepeatWrapping;

		floorColorMap.repeat.set(4, 4);
		floorHeightMap.repeat.set(4, 4);
		floorNormalMap.repeat.set(4, 4);
		floorARMMap.repeat.set(4, 4);

		const floor = new THREE.Mesh(
			new THREE.PlaneGeometry(20, 20, 100, 100),
			new THREE.MeshStandardMaterial({
				map: floorColorMap,
				aoMap: floorARMMap,
				roughnessMap: floorARMMap,
				metalnessMap: floorARMMap,
				normalMap: floorNormalMap,
				displacementMap: floorHeightMap,
				// alphaMap: floorAlphaMap,
				displacementScale: 0.3,
				displacementBias: -0.12,
				// roughness: 0.8,
				// metalness: 0.01,
				transparent: true
				// wireframe: true
			})
		);
		scene.add(floor);

		debugGUI
			.add(floor.material, 'displacementScale')
			.min(0)
			.max(1)
			.step(0.001)
			.name('floor displacement scale');

		debugGUI
			.add(floor.material, 'displacementBias')
			.min(-1)
			.max(1)
			.step(0.001)
			.name('floor displacement bias');

		floor.rotation.x = Math.PI * -0.5;
		floor.position.y = 0;

		const houseGroup = new THREE.Group();
		scene.add(houseGroup);

		// const wallColorTexture = textureLoader.load('/textures/walls/medieval_red_brick_diff_1k.jpg');
		// const wallHeightTexture = textureLoader.load('/textures/walls/medieval_red_brick_disp_1k.png');
		// const wallNormalTexture = textureLoader.load(
		// 	'/textures/walls/medieval_red_brick_nor_gl_1k.exr'
		// );
		// const wallRoughnessTexture = textureLoader.load(
		// 	'/textures/walls/medieval_red_brick_rough_1k.exr'
		// );

		// wallColorTexture.colorSpace = THREE.SRGBColorSpace;

		// wallColorTexture.repeat.set(1, 1);
		// wallHeightTexture.repeat.set(1, 1);

		// wallColorTexture.wrapS = THREE.RepeatWrapping;
		// wallHeightTexture.wrapS = THREE.RepeatWrapping;

		// wallColorTexture.wrapT = THREE.RepeatWrapping;
		// wallHeightTexture.wrapT = THREE.RepeatWrapping;

		const houseWalls = new THREE.Mesh(
			new THREE.BoxGeometry(4, 2.5, 4),
			new THREE.MeshStandardMaterial({
				// map: wallColorTexture,
				// // displacementMap: wallHeightTexture,
				// // displacementScale: 0.08,
				// // displacementBias: 0,
				// normalMap: wallNormalTexture,
				// roughnessMap: wallRoughnessTexture,
				// roughness: 0.6,
				// transparent: true
				// wireframe: true
			})
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

		doorColorTexture.colorSpace = THREE.SRGBColorSpace;

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

		houseDoor.position.set(0, 1, 2);

		const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
		const bushMaterial = new THREE.MeshStandardMaterial({
			color: 0x00ff00
		});

		const frontBushes = new THREE.Group();
		scene.add(frontBushes);

		const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
		frontBushes.add(bush1);

		bush1.scale.setScalar(0.5);
		bush1.position.set(0.9, 0.2, 2.2);

		const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
		frontBushes.add(bush2);

		bush2.scale.setScalar(0.25);
		bush2.position.set(1.5, 0.15, 2.2);

		const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
		frontBushes.add(bush3);

		bush3.scale.setScalar(0.45);
		bush3.position.set(-0.8, 0.2, 2.2);

		const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
		frontBushes.add(bush4);

		bush4.scale.setScalar(0.22);
		bush4.position.set(-1.4, 0.12, 2.1);

		const graves = new THREE.Group();
		scene.add(graves);

		const graveGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.15);
		const graveMaterial = new THREE.MeshStandardMaterial({
			color: 0x4f4f4f
		});

		const TOTAL_GRAVES = 30;

		for (let i = 0; i < TOTAL_GRAVES; i++) {
			const angle = Math.random() * Math.PI * 2;

			const x = Math.sin(angle) * (Math.random() * 4 + 5);
			const z = Math.cos(angle) * (Math.random() * 4 + 5);

			const grave = new THREE.Mesh(graveGeometry, graveMaterial);

			grave.position.x = x;
			grave.position.z = z;
			grave.position.y = Math.min(Math.random(), 0.2);
			// grave.position.y = Math.abs(Math.random() - 0.5) - 0.1;

			grave.rotation.y = Math.random() * Math.PI;
			grave.rotation.z = (Math.random() - 0.5) * Math.PI * 0.07;

			graves.add(grave);
		}

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
