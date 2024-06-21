<script>
	import { browser } from '$app/environment';
	import * as THREE from 'three';
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { createMeshBox, newSizes } from '$lib/utils';

	/**@type{HTMLCanvasElement}*/
	let canvas;
	const defaultColor = 0xff0000;

	if (browser) {
		const menuHeight = document.querySelector('.menu')?.clientHeight || 0;

		function setupScene() {
			const scene = new THREE.Scene();

			const cameraSizes = newSizes(window.innerWidth, window.innerHeight - menuHeight);

			const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect());

			camera.position.z = 5;

			const controls = new OrbitControls(camera, canvas);

			const box = createMeshBox({
				color: defaultColor,
				depth: 1,
				height: 1,
				width: 1,
				segments: {
					depth: 1,
					height: 1,
					width: 1
				},
				wireframe: true
			});

			scene.add(box);

			const debugObject = {
				color: defaultColor,
				spin: () => {
					gsap.to(box.rotation, {
						y: box.rotation.y + Math.PI * 2
					});
				}
			};

			const debugGUI = new GUI();

			debugGUI.add(box.position, 'y').min(-3).max(3).step(0.01).name('elevation');

			debugGUI.add(box, 'visible');

			debugGUI.add(box, 'wireframe');

			debugGUI.addColor(debugObject, 'color').onChange((/**@type{number}*/ newColor) => {
				box.material.color.set(newColor);
			});

			debugGUI.add(debugObject, 'spin');

			const renderer = new THREE.WebGLRenderer({
				canvas
			});

			renderer.setSize(window.innerWidth, window.innerHeight - menuHeight);

			function tick() {
				renderer.render(scene, camera);

				controls.update();

				window.requestAnimationFrame(tick);
			}

			window.requestAnimationFrame(tick);
		}

		onMount(() => {
			setupScene();
		});
	}
</script>

<canvas bind:this={canvas}></canvas>
