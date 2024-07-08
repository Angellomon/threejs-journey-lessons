<script>
	import gsap from 'gsap';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { FontLoader } from 'three/addons/loaders/FontLoader.js';
	import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { CameraFullSizes } from '$lib/camera-sizes';

	/**@type{HTMLCanvasElement}*/
	let canvas;

	const GEOMETRIES_NUMBER = 100;

	function setupScene() {
		const scene = new THREE.Scene();

		// const axesHelper = new THREE.AxesHelper();
		// scene.add(axesHelper);

		const textureLoader = new THREE.TextureLoader();

		const textTexture = textureLoader.load('/textures/matcaps/3.png');
		const geometriesTexture = textureLoader.load('/textures/matcaps/4.png');
		geometriesTexture.colorSpace = THREE.SRGBColorSpace;
		textTexture.colorSpace = THREE.SRGBColorSpace;

		const fontLoader = new FontLoader();
		fontLoader.load('/fonts/mulish.typeface.json', (font) => {
			const textMesh = new THREE.Mesh(
				new TextGeometry('hmmm', {
					font,
					size: 0.5,
					height: 0.02,
					curveSegments: 12,
					bevelEnabled: true,
					bevelThickness: 0.03,
					bevelSize: 0.02,
					bevelOffset: 0,
					bevelSegments: 8
				}),
				new THREE.MeshMatcapMaterial({
					matcap: textTexture
					// wireframe: true
				})
			);

			gsap.from(textMesh.scale, {
				x: 0,
				y: 0,
				z: 0,
				duration: 1,
				ease: 'bounce'
			});

			textMesh.geometry.computeBoundingBox();

			// if (textMesh.geometry.boundingBox)
			// 	textMesh.geometry.translate(
			// 		-textMesh.geometry.boundingBox.max.x * 0.5,
			// 		-textMesh.geometry.boundingBox.max.y * 0.5,
			// 		-textMesh.geometry.boundingBox.max.z * 0.5
			// 	);
			textMesh.geometry.center();

			scene.add(textMesh);
		});

		const torusGeometry = new THREE.TorusGeometry(0.15, 0.1, 20, 45);
		const cubeGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);

		const geometriesMaterial = new THREE.MeshMatcapMaterial({
			matcap: geometriesTexture
		});

		for (let i = 0; i < GEOMETRIES_NUMBER; i++) {
			/**@type{THREE.Mesh}*/
			let mesh;

			if (Math.random() < 0.6) mesh = new THREE.Mesh(torusGeometry, geometriesMaterial);
			else mesh = new THREE.Mesh(cubeGeometry, geometriesMaterial);

			gsap.from(mesh.scale, {
				x: 0,
				y: 0,
				z: 0,
				ease: 'none',
				duration: 1
			});

			gsap.fromTo(
				mesh.rotation,
				{
					x: 0,
					y: 0,
					duration: 10,
					repeat: -1,
					ease: 'none'
				},
				{
					x: Math.PI * 2,
					y: Math.PI * 2,
					duration: 10,
					repeat: -1,
					ease: 'none'
				}
			);

			mesh.position.x = (Math.random() - 0.5) * 25;
			mesh.position.y = (Math.random() - 0.5) * 25;
			mesh.position.z = (Math.random() - 0.5) * 25;

			mesh.rotation.x = Math.random() * Math.PI;
			mesh.rotation.y = Math.random() * Math.PI;
			mesh.rotation.z = Math.random() * Math.PI;

			scene.add(mesh);
		}

		// const cube = createMeshBasicCube(1, 0xffffff);
		// scene.add(cube);

		const cameraSizes = new CameraFullSizes('.menu');

		const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect, 0.02);
		camera.position.z = 5;

		gsap.from(camera.rotation, {
			x: -1 * Math.PI * 0.25,
			duration: 1
		});

		const controls = new OrbitControls(camera, canvas);

		const renderer = new THREE.WebGLRenderer({
			canvas
		});
		renderer.setSize(...cameraSizes.sizes);

		function tick() {
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

<canvas bind:this={canvas}></canvas>
