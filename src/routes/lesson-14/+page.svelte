<script>
	import { browser } from '$app/environment';
	import { newSizes } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { GUI } from 'lil-gui';
	import gsap from 'gsap';

	/**@type{HTMLCanvasElement}*/
	let canvas;

	if (browser) {
		let menuHeight = document.querySelector('.menu')?.clientHeight || 0;

		function setupScene() {
			const gui = new GUI();
			const ambientGUI = gui.addFolder('ambient light');
			const pointGUI = gui.addFolder('point light');
			const directionalGUI = gui.addFolder('directional light');
			const hemisphereGUI = gui.addFolder('hemisphere light');
			const rectAreaGUI = gui.addFolder('rect area light');

			const scene = new THREE.Scene();

			const ambientLight = new THREE.AmbientLight(0xffffff, 0);

			ambientGUI.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
			ambientGUI.addColor(ambientLight, 'color');

			function turnOffAmbient() {
				ambientLight.intensity = 0;
			}

			function turnOnAmbient() {
				ambientLight.intensity = 1;
			}

			ambientGUI.add({ turnOnAmbient }, 'turnOnAmbient');
			ambientGUI.add({ turnOffAmbient }, 'turnOffAmbient');

			const pointLight = new THREE.PointLight(0xffffff, 0);
			// pointLight.position.x = 2;
			// pointLight.position.y = 3;
			// pointLight.position.z = 4;

			pointGUI.add(pointLight, 'intensity').min(0).max(2).step(0.01);

			pointGUI.addColor(pointLight, 'color');

			pointGUI.add(pointLight.position, 'x').min(-5).max(5).step(0.01);
			pointGUI.add(pointLight.position, 'y').min(-5).max(5).step(0.01);
			pointGUI.add(pointLight.position, 'z').min(-5).max(5).step(0.01);

			function turnOffPoint() {
				pointLight.intensity = 0;
			}

			function turnOnPoint() {
				pointLight.intensity = 1;
			}

			pointGUI.add({ turnOnPoint }, 'turnOnPoint');
			pointGUI.add({ turnOffPoint }, 'turnOffPoint');

			const directionalLight = new THREE.DirectionalLight(0xffffff, 0);

			directionalGUI.add(directionalLight, 'intensity').min(0).max(2).step(0.01);

			directionalGUI.addColor(directionalLight, 'color');

			directionalGUI.add(directionalLight.position, 'x').min(-5).max(5).step(0.01);
			directionalGUI.add(directionalLight.position, 'y').min(-5).max(5).step(0.01);
			directionalGUI.add(directionalLight.position, 'z').min(-5).max(5).step(0.01);

			function turnOffDirectional() {
				directionalLight.intensity = 0;
			}

			function turnOnDirectional() {
				directionalLight.intensity = 1;
			}

			directionalGUI.add({ turnOnDirectional }, 'turnOnDirectional');
			directionalGUI.add({ turnOffDirectional }, 'turnOffDirectional');

			const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0xff0000, 0);

			hemisphereGUI.add(hemisphereLight, 'intensity').min(0).max(2).step(0.01);

			hemisphereGUI.addColor(hemisphereLight, 'color');
			hemisphereGUI.addColor(hemisphereLight, 'groundColor');

			hemisphereGUI.add(hemisphereLight.position, 'x').min(-5).max(5).step(0.01);
			hemisphereGUI.add(hemisphereLight.position, 'y').min(-5).max(5).step(0.01);
			hemisphereGUI.add(hemisphereLight.position, 'z').min(-5).max(5).step(0.01);

			function turnOffHemisphere() {
				hemisphereLight.intensity = 0;
			}

			function turnOnHemisphere() {
				hemisphereLight.intensity = 1;
			}

			hemisphereGUI.add({ turnOnHemisphere }, 'turnOnHemisphere');
			hemisphereGUI.add({ turnOffHemisphere }, 'turnOffHemisphere');

			const rectAreaLight = new THREE.RectAreaLight(0xffffff, 0, 1, 1);

			rectAreaGUI.add(rectAreaLight, 'intensity').min(0).max(2).step(0.01);
			rectAreaGUI.add(rectAreaLight, 'width').min(0).max(2).step(0.01);
			rectAreaGUI.add(rectAreaLight, 'height').min(0).max(2).step(0.01);

			rectAreaGUI.addColor(rectAreaLight, 'color');

			rectAreaGUI.add(rectAreaLight.position, 'x').min(-5).max(5).step(0.01);
			rectAreaGUI.add(rectAreaLight.position, 'y').min(-5).max(5).step(0.01);
			rectAreaGUI.add(rectAreaLight.position, 'z').min(-5).max(5).step(0.01);

			function turnOffRectArea() {
				rectAreaLight.intensity = 0;
			}

			function turnOnRectArea() {
				rectAreaLight.intensity = 1;
			}

			rectAreaGUI.add({ turnOnRectArea }, 'turnOnRectArea');
			rectAreaGUI.add({ turnOffRectArea }, 'turnOffRectArea');

			scene.add(ambientLight, pointLight, directionalLight, hemisphereLight, rectAreaLight);

			const shapesGroup = new THREE.Group();
			const floorGroup = new THREE.Group();

			scene.add(shapesGroup);
			scene.add(floorGroup);

			const material = new THREE.MeshStandardMaterial();
			material.roughness = 0.4;

			const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
			sphere.position.x = -1;

			gsap.to(sphere.rotation, {
				x: Math.PI * 2,
				y: Math.PI * 2,
				ease: 'none',
				repeat: -1,
				duration: 10
			});

			const cube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), material);
			cube.position.x = 0;

			gsap.to(cube.rotation, {
				x: Math.PI * 2,
				y: Math.PI * 2,
				ease: 'none',
				repeat: -1,
				duration: 10
			});

			const torus = new THREE.Mesh(
				new THREE.TorusGeometry(0.3, 0.15, 12, 48, Math.PI * 2),
				material
			);

			torus.position.x = 1;

			gsap.to(torus.rotation, {
				x: Math.PI * 2,
				y: Math.PI * 2,
				ease: 'none',
				repeat: -1,
				duration: 10
			});

			shapesGroup.add(sphere, cube, torus);

			const floorPlane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);

			floorPlane.rotation.set(Math.PI * 1.5, 0, 0);
			floorPlane.position.y = -0.5;

			floorGroup.add(floorPlane);

			const cameraSizes = newSizes(window.innerWidth, window.innerHeight - menuHeight);
			const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect());

			camera.position.z = 5;

			const controls = new OrbitControls(camera, canvas);

			const renderer = new THREE.WebGLRenderer({
				canvas
			});

			renderer.setSize(cameraSizes.width, cameraSizes.height);

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
			canvas.addEventListener('dblclick', () => {
				const isFullscreen = !!document.fullscreenElement;

				if (isFullscreen) canvas.requestFullscreen();
				else document.exitFullscreen();
			});
		}

		onMount(() => {
			setupScene();
		});
	}
</script>

<canvas bind:this={canvas}></canvas>
