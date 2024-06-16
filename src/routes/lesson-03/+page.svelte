<script>
	import { newSizes } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	// canvas setup
	/** @type {HTMLCanvasElement}*/
	let canvas;

	onMount(() => {
		// Scene setup
		const scene = new THREE.Scene();

		// Objects Setup
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
		const mesh = new THREE.Mesh(geometry, material);

		scene.add(mesh);

		const sizes = newSizes();

		// camera
		const camera = new THREE.PerspectiveCamera(75, sizes.aspect());
		camera.position.z = 3;

		scene.add(camera);

		// renderer
		const renderer = new THREE.WebGLRenderer({
			canvas
		});

		renderer.setSize(sizes.width, sizes.height);
		renderer.render(scene, camera);
	});
</script>

<svelte:head>
	<title>03 - Geometry</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>
