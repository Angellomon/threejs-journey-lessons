<script>
	import * as THREE from 'three';
	import { createMeshBasicCube, getDeltaTime, newSizes } from '$lib/utils';
	import { onMount } from 'svelte';

	/** @type {HTMLCanvasElement} */
	let canvas;

	onMount(() => {
		const scene = new THREE.Scene();

		const cubesGroup = new THREE.Group();
		scene.add(cubesGroup);

		const cube1 = createMeshBasicCube(1, 0xff0000);
		cube1.position.x = -2;
		cubesGroup.add(cube1);

		const cube2 = createMeshBasicCube(1, 0x00ff00);
		cube2.position.x = 0;
		cubesGroup.add(cube2);

		const cube3 = createMeshBasicCube(1, 0x0000ff);
		cube3.position.x = 2;
		cubesGroup.add(cube3);

		const cameraSizes = newSizes(600, 600);

		const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect());

		camera.position.z = 5;

		const renderer = new THREE.WebGLRenderer({
			canvas
		});

		let initialTime = Date.now();

		function tick() {
			const deltaTime = getDeltaTime(initialTime);

			initialTime = Date.now();

			renderer.setSize(cameraSizes.width, cameraSizes.height);
			renderer.render(scene, camera);

			window.requestAnimationFrame(tick);
		}

		tick();
	});
</script>

<canvas bind:this={canvas}></canvas>
