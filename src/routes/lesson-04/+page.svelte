<script>
	import { newSizes } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	/** @type {HTMLCanvasElement}*/
	let canvas;

	onMount(() => {
		// scene setup
		const scene = new THREE.Scene();

		// Group setup

		const cubesGroup = new THREE.Group();
		scene.add(cubesGroup);

		const cube1 = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 0xff0000 })
		);
		cube1.position.x = -2;
		cubesGroup.add(cube1);

		const cube2 = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 0x00ff00 })
		);
		cube2.position.x = 0;
		cubesGroup.add(cube2);

		const cube3 = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 0x0000ff })
		);
		cube3.position.x = 2;
		cubesGroup.add(cube3);

		cubesGroup.position.x = 2;
		cubesGroup.scale.y = 2;
		cubesGroup.rotation.y = 1;

		// // geometries
		// const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
		// const boxMaterial = new THREE.MeshBasicMaterial({
		// 	color: 0xff0000
		// });
		// const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

		// // boxMesh.position.x = 0.7;
		// // boxMesh.position.y = -0.6;
		// // boxMesh.position.z = 1;
		// boxMesh.position.set(0.7, -0.6, 1);

		// // boxMesh.scale.x = 2;
		// // boxMesh.scale.y = 0.5;
		// // boxMesh.scale.z = 0.5;
		// boxMesh.scale.set(2, 0.5, 0.5);

		// // prevent gimbal lock
		// boxMesh.rotation.reorder('YXZ');

		// // boxMesh.rotation.x = Math.PI * 0.25;
		// boxMesh.rotation.y = Math.PI * 0.25;
		// boxMesh.rotation.x = Math.PI * 0.25;
		// // boxMesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0.25);

		// console.log(boxMesh.position.length());

		// scene.add(boxMesh);
		// boxMesh.position.normalize();
		// console.log(boxMesh.position.length());

		// camera

		const cameraSizes = newSizes();
		const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect());

		camera.position.z = 6;

		// axes helper
		const axesHelper = new THREE.AxesHelper(2);

		scene.add(axesHelper);

		// renderer
		const renderer = new THREE.WebGLRenderer({
			canvas
		});

		renderer.setSize(cameraSizes.width, cameraSizes.width);
		renderer.render(scene, camera);
	});
</script>

<svelte:head>
	<title>04 - Transform Objects</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>
