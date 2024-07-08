<script>
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { createMeshBasicTexture } from '$lib/utils';
	import { GUI } from 'lil-gui';
	import { CameraFullSizes } from '$lib/camera-sizes';

	/**@typedef {"basic" | "matcap" | "normal" | "depth" | "lambert" | "phong" | "toon" | "standard" | "physical"} MaterialType*/

	/**@type{HTMLCanvasElement}*/
	let canvas;

	function setupScene() {
		const scene = new THREE.Scene();

		const rgbeLoader = new RGBELoader();

		rgbeLoader.load('/textures/environmentMap/2k.hdr', (enviromentMap) => {
			enviromentMap.mapping = THREE.EquirectangularReflectionMapping;
			scene.background = enviromentMap;
			scene.environment = enviromentMap;
		});

		const textureLoader = new THREE.TextureLoader();

		const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
		const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
		const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
		const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
		const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
		const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
		const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

		const matcapTexture = textureLoader.load('/textures/matcaps/1.png');

		const gradientTexture = textureLoader.load('/textures/gradients/5.jpg');

		doorColorTexture.colorSpace = THREE.SRGBColorSpace;
		matcapTexture.colorSpace = THREE.SRGBColorSpace;

		const basicMaterial = new THREE.MeshBasicMaterial({
			map: doorColorTexture,
			side: THREE.DoubleSide
		});

		const normalMaterial = new THREE.MeshNormalMaterial();

		const matcapMaterial = new THREE.MeshMatcapMaterial({
			matcap: matcapTexture
		});

		const depthMaterial = new THREE.MeshDepthMaterial();

		const lambertMaterial = new THREE.MeshLambertMaterial({});

		const phongMaterial = new THREE.MeshPhongMaterial();
		phongMaterial.shininess = 100;
		phongMaterial.specular = new THREE.Color(0x1188ff);

		const toonMaterial = new THREE.MeshToonMaterial();
		toonMaterial.gradientMap = gradientTexture;
		gradientTexture.magFilter = THREE.NearestFilter;
		gradientTexture.minFilter = THREE.NearestFilter;
		gradientTexture.generateMipmaps = false;

		const standardMaterial = new THREE.MeshStandardMaterial({
			side: THREE.DoubleSide
		});
		standardMaterial.metalness = 0.45;
		standardMaterial.roughness = 0.65;
		standardMaterial.map = doorColorTexture;
		standardMaterial.alphaMap = doorAlphaTexture;
		standardMaterial.normalMap = doorNormalTexture;
		standardMaterial.aoMap = doorAmbientOcclusionTexture;
		standardMaterial.displacementMap = doorHeightTexture;
		standardMaterial.roughnessMap = doorRoughnessTexture;
		standardMaterial.metalnessMap = doorMetalnessTexture;
		standardMaterial.transparent = true;

		const physicalMaterial = new THREE.MeshPhysicalMaterial({
			side: THREE.DoubleSide
		});
		physicalMaterial.metalness = 0.45;
		physicalMaterial.roughness = 0.65;
		physicalMaterial.map = doorColorTexture;
		physicalMaterial.alphaMap = doorAlphaTexture;
		physicalMaterial.normalMap = doorNormalTexture;
		physicalMaterial.aoMap = doorAmbientOcclusionTexture;
		physicalMaterial.displacementMap = doorHeightTexture;
		physicalMaterial.roughnessMap = doorRoughnessTexture;
		physicalMaterial.metalnessMap = doorMetalnessTexture;
		physicalMaterial.transparent = true;

		physicalMaterial.normalScale.set(0.5, 0.5);

		physicalMaterial.clearcoat = 1;
		physicalMaterial.clearcoatRoughness = 0;

		/**@type{THREE.Material}*/
		let shapesMaterial;

		// shapesMaterial = basicMaterial;
		// shapesMaterial = normalMaterial;
		// shapesMaterial = matcapMaterial;
		// shapesMaterial = depthMaterial;
		// shapesMaterial = lambertMaterial;
		// shapesMaterial = phongMaterial;
		// shapesMaterial = toonMaterial;
		shapesMaterial = physicalMaterial;

		// shapesMaterial.side = THREE.DoubleSide;

		const gui = new GUI();

		/**@type{{
		 * metalness: number,
		 * roughness: number,
		 * material: MaterialType,
		 * aoMapIntensity: number,
		 * displacementScale: number,
		 * materials: Record<string, boolean>
		 * }}*/
		const debugObject = {
			metalness: 0.45,
			roughness: 0.65,
			material: 'physical',
			aoMapIntensity: 1,
			displacementScale: 1,
			materials: {
				color: true,
				alpha: true,
				normal: true,
				ambientOcclusion: true,
				displacement: true,
				roughness: true,
				metalness: true
			}
		};

		/**
		 * @param {MaterialType} materialType
		 * @returns {THREE.Material}
		 */
		function getMaterial(materialType) {
			switch (materialType) {
				case 'basic':
					return basicMaterial;
				case 'depth':
					return depthMaterial;
				case 'lambert':
					return lambertMaterial;
				case 'matcap':
					return matcapMaterial;
				case 'normal':
					return normalMaterial;
				case 'phong':
					return phongMaterial;
				case 'standard':
					return standardMaterial;
				case 'toon':
					return toonMaterial;
				case 'physical':
					return physicalMaterial;
				default:
					return basicMaterial;
			}
		}

		const materialTypes = [
			'basic',
			'matcap',
			'normal',
			'depth',
			'lambert',
			'phong',
			'toon',
			'standard',
			'physical'
		];

		gui
			.add(debugObject, 'metalness')
			.min(0)
			.max(1)
			.step(0.01)
			.onChange((/**@type{number}*/ newMetalness) => {
				const mat = /**@type {THREE.MeshStandardMaterial}*/ (getMaterial(debugObject.material));
				mat.metalness = newMetalness;
			});
		gui
			.add(debugObject, 'roughness')
			.min(0)
			.max(1)
			.step(0.01)
			.onChange((/**@type{number}*/ newRoughness) => {
				const mat = /**@type {THREE.MeshStandardMaterial}*/ (getMaterial(debugObject.material));
				mat.roughness = newRoughness;
			});
		gui
			.add(debugObject, 'aoMapIntensity')
			.min(0)
			.max(3)
			.step(0.01)
			.onChange((/**@type{number}*/ newAOMapIntensity) => {
				const mat = /**@type {THREE.MeshStandardMaterial}*/ (getMaterial(debugObject.material));
				mat.aoMapIntensity = newAOMapIntensity;
			});
		gui
			.add(debugObject, 'displacementScale')
			.min(0)
			.max(1)
			.step(0.01)
			.onChange((/**@type{number}*/ newDisplacementScale) => {
				const mat = /**@type {THREE.MeshStandardMaterial}*/ (getMaterial(debugObject.material));
				mat.displacementScale = newDisplacementScale;
			});

		gui.add(physicalMaterial, 'clearcoat').min(0).max(1).step(0.01);
		gui.add(physicalMaterial, 'clearcoatRoughness').min(0).max(1).step(0.01);

		gui.add(physicalMaterial, 'sheen').min(0).max(1).step(0.01);
		gui.add(physicalMaterial, 'sheenRoughness').min(0).max(1).step(0.01);
		gui.addColor(physicalMaterial, 'sheenColor');

		gui.add(physicalMaterial, 'iridescence').min(0).max(1).step(0.01);
		gui.add(physicalMaterial, 'iridescenceIOR').min(0).max(2.33).step(0.01);
		gui.add(physicalMaterial.iridescenceThicknessRange, '0').min(0).max(1000).step(1);
		gui.add(physicalMaterial.iridescenceThicknessRange, '1').min(0).max(1000).step(1);

		gui.add(physicalMaterial, 'transmission').min(0).max(1).step(0.01);
		gui.add(physicalMaterial, 'ior').min(1).max(10).step(0.01);
		gui.add(physicalMaterial, 'thickness').min(0).max(1).step(0.01);

		gui
			.add(debugObject, 'material', materialTypes)
			.onChange((/**@type{MaterialType}*/ newMaterialType) => {
				const newMaterial = getMaterial(newMaterialType);

				sphere.material = newMaterial;
				plane.material = newMaterial;
				torus.material = newMaterial;
			});

		gui.add(debugObject.materials, 'color').onChange((/**@type{boolean}*/ show) => {
			const mat = /**@type {THREE.MeshStandardMaterial}*/ (getMaterial(debugObject.material));
			if (!show) mat.map = null;
			else mat.map = doorColorTexture;

			mat.needsUpdate = true;
		});
		gui.add(debugObject.materials, 'alpha').onChange((/**@type{boolean}*/ show) => {
			const mat = /**@type {THREE.MeshStandardMaterial}*/ (getMaterial(debugObject.material));
			if (!show) mat.alphaMap = null;
			else mat.alphaMap = doorAlphaTexture;

			mat.needsUpdate = true;
		});
		gui.add(debugObject.materials, 'normal').onChange((/**@type{boolean}*/ show) => {
			const mat = /**@type {THREE.MeshStandardMaterial}*/ (getMaterial(debugObject.material));
			if (!show) mat.normalMap = null;
			else mat.normalMap = doorNormalTexture;

			mat.needsUpdate = true;
		});
		gui.add(debugObject.materials, 'ambientOcclusion').onChange((/**@type{boolean}*/ show) => {
			const mat = /**@type {THREE.MeshStandardMaterial}*/ (getMaterial(debugObject.material));
			if (!show) mat.aoMap = null;
			else mat.aoMap = doorAmbientOcclusionTexture;

			mat.needsUpdate = true;
		});
		gui.add(debugObject.materials, 'displacement').onChange((/**@type{boolean}*/ show) => {
			const mat = /**@type {THREE.MeshStandardMaterial}*/ (getMaterial(debugObject.material));
			if (!show) mat.displacementMap = null;
			else mat.displacementMap = doorHeightTexture;

			mat.needsUpdate = true;
		});
		gui.add(debugObject.materials, 'roughness').onChange((/**@type{boolean}*/ show) => {
			const mat = /**@type {THREE.MeshStandardMaterial}*/ (getMaterial(debugObject.material));
			if (!show) mat.roughnessMap = null;
			else mat.roughnessMap = doorRoughnessTexture;

			mat.needsUpdate = true;
		});
		gui.add(debugObject.materials, 'metalness').onChange((/**@type{boolean}*/ show) => {
			const mat = /**@type {THREE.MeshStandardMaterial}*/ (getMaterial(debugObject.material));
			if (!show) mat.metalnessMap = null;
			else mat.metalnessMap = doorMetalnessTexture;

			mat.needsUpdate = true;
		});

		const ambientLight = new THREE.AmbientLight(0xffffff, 1);

		scene.add(ambientLight);

		const pointLight = new THREE.PointLight(0xffffff, 30);
		pointLight.position.x = 2;
		pointLight.position.y = 3;
		pointLight.position.z = 4;

		scene.add(pointLight);

		const shapesGroup = new THREE.Group();

		scene.add(shapesGroup);

		const sphere = createMeshBasicTexture({
			shape: 'sphere',
			length: 0.5,
			widthSegments: 64,
			heightSegments: 64,
			material: shapesMaterial
		});

		sphere.position.x = -1.5;

		shapesGroup.add(sphere);

		const plane = createMeshBasicTexture({
			shape: 'plane',
			width: 1,
			height: 1,
			material: shapesMaterial,
			widthSegments: 50,
			heightSegments: 50
		});

		plane.position.x = 0;

		shapesGroup.add(plane);

		const torus = createMeshBasicTexture({
			shape: 'torus',
			radius: 0.3,
			tube: 0.2,
			radialSegments: 64,
			tubularSegments: 128,
			arc: 7,
			material: shapesMaterial
		});

		torus.position.x = 1.5;

		shapesGroup.add(torus);

		const cameraSizes = new CameraFullSizes('.menu');

		const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect);
		camera.position.z = 5;

		const controls = new OrbitControls(camera, canvas);

		const renderer = new THREE.WebGLRenderer({
			canvas
		});

		renderer.setSize(...cameraSizes.sizes);

		const clock = new THREE.Clock();

		function tick() {
			const elapsedTime = clock.getElapsedTime();

			sphere.rotation.y = 0.1 * elapsedTime;
			plane.rotation.y = 0.1 * elapsedTime;
			torus.rotation.y = 0.1 * elapsedTime;

			sphere.rotation.x = 0.15 * elapsedTime;
			plane.rotation.x = 0.15 * elapsedTime;
			torus.rotation.x = 0.15 * elapsedTime;

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

			if (isFullscreen) {
				document.exitFullscreen();
			} else {
				canvas.requestFullscreen();
			}
		});
	}

	if (browser) {
		onMount(() => {
			setupScene();
		});
	}
</script>

<svelte:head>
	<title>11 - Materials</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>
