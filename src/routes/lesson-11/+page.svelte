<script>
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { createMeshBasicTexture, newSizes } from '$lib/utils';
	import { GUI } from 'lil-gui';

	/**@typedef {"basic" | "matcap" | "normal" | "depth" | "lambert" | "phong" | "toon" | "standard"} MaterialType*/

	/**@type{HTMLCanvasElement}*/
	let canvas;

	if (browser) {
		let menuHeight = document.querySelector('.menu')?.clientHeight || 0;

		const scene = new THREE.Scene();

		function setupScene() {
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
			standardMaterial.aoMap = doorAmbientOcclusionTexture;
			standardMaterial.displacementMap = doorHeightTexture;

			/**@type{THREE.Material}*/
			let shapesMaterial;

			// shapesMaterial = basicMaterial;
			// shapesMaterial = normalMaterial;
			// shapesMaterial = matcapMaterial;
			// shapesMaterial = depthMaterial;
			// shapesMaterial = lambertMaterial;
			// shapesMaterial = phongMaterial;
			// shapesMaterial = toonMaterial;
			shapesMaterial = standardMaterial;

			shapesMaterial.side = THREE.DoubleSide;

			const gui = new GUI();

			/**@type{{
			 * metalness: number,
			 * roughness: number,
			 * material: MaterialType,
			 * aoMapIntensity: number,
			 * displacementScale: number
			 * }}*/
			const debugObject = {
				metalness: 0.45,
				roughness: 0.65,
				material: 'standard',
				aoMapIntensity: 1,
				displacementScale: 0.1
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
				'standard'
			];

			gui
				.add(debugObject, 'metalness')
				.min(0)
				.max(1)
				.step(0.01)
				.onChange((/**@type{number}*/ newMetalness) => {
					const mat = /**@type {THREE.MeshStandardMaterial}*/ (getMaterial('standard'));
					mat.metalness = newMetalness;
				});
			gui
				.add(debugObject, 'roughness')
				.min(0)
				.max(1)
				.step(0.01)
				.onChange((/**@type{number}*/ newRoughness) => {
					const mat = /**@type {THREE.MeshStandardMaterial}*/ (getMaterial('standard'));
					mat.roughness = newRoughness;
				});
			gui
				.add(debugObject, 'aoMapIntensity')
				.min(0)
				.max(3)
				.step(0.01)
				.onChange((/**@type{number}*/ newAOMapIntensity) => {
					const mat = /**@type {THREE.MeshStandardMaterial}*/ (getMaterial('standard'));
					mat.aoMapIntensity = newAOMapIntensity;
				});
			gui
				.add(debugObject, 'displacementScale')
				.min(0)
				.max(1)
				.step(0.01)
				.onChange((/**@type{number}*/ newDisplacementScale) => {
					const mat = /**@type {THREE.MeshStandardMaterial}*/ (getMaterial('standard'));
					mat.displacementScale = newDisplacementScale;
				});
			gui
				.add(debugObject, 'material', materialTypes)
				.onChange((/**@type{MaterialType}*/ newMaterialType) => {
					const newMaterial = getMaterial(newMaterialType);

					sphere.material = newMaterial;
					plane.material = newMaterial;
					torus.material = newMaterial;
				});

			gui.add;

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
				widthSegments: 100,
				heightSegments: 100
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

			const cameraSizes = newSizes(window.innerWidth, window.innerHeight - menuHeight);

			const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect());
			camera.position.z = 5;

			const controls = new OrbitControls(camera, canvas);

			const renderer = new THREE.WebGLRenderer({
				canvas
			});

			renderer.setSize(cameraSizes.width, cameraSizes.height);

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
			document.addEventListener('resize', () => {
				menuHeight = document.querySelector('.menu')?.clientHeight || 0;

				// @ts-ignore
				const isFullscreen = document.fullscreenEnabled || document.webkitFullscreenEnabled;

				cameraSizes.width = window.innerWidth;

				if (isFullscreen) cameraSizes.height = window.innerHeight - menuHeight;
				else cameraSizes.height = window.innerHeight;

				renderer.setSize(cameraSizes.width, cameraSizes.height);
			});
			window.addEventListener('dblclick', () => {
				// @ts-ignore
				const isFullscreen = document.fullscreenEnabled || document.webkitFullscreenEnabled;

				if (isFullscreen) {
					document.exitFullscreen();
				} else {
					canvas.requestFullscreen();
				}
			});
		}

		onMount(() => {
			setupScene();
		});
	}
</script>

<svelte:head>
	<title>11 - Materials</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>
