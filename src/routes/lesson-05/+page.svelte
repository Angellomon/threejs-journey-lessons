<script>
	import * as THREE from 'three';
	import { createCubeBasicMesh, getDeltaTime } from '$lib/utils';
	import { onMount } from 'svelte';

	/** @type {HTMLCanvasElement} */
	let canvas;

	onMount(() => {
		const scene = new THREE.Scene();

		const cubesGroup = new THREE.Group();
		scene.add(cubesGroup);

		const cube1 = createCubeBasicMesh(1, 0xff0000);
		cube1.position.x = -1;
		cubesGroup.add(cube1);

		const cube2 = createCubeBasicMesh(1, 0x00ff00);
		cube2.position.x = 0;
		cubesGroup.add(cube2);

		const cube3 = createCubeBasicMesh(1, 0x0000ff);
		cube1.position.x = 1;
		cubesGroup.add(cube3);

		const renderer = new THREE.WebGLRenderer({
			canvas
		});

		let initialTime = Date.now();

		function tick() {
			const deltaTime = getDeltaTime(initialTime);

			initialTime = Date.now();
		}
	});
</script>

<canvas bind:this={canvas}></canvas>
