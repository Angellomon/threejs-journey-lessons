<script>
	import * as THREE from 'three';
	import { createMeshBasicCube, getDeltaTime, newSizes } from '$lib/utils';
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	/** @type {HTMLCanvasElement} */
	let canvasNonGSAP;

	/** @type {HTMLCanvasElement} */
	let canvasGSAP;

	const cube1InitalXPosition = -2;
	const cube2InitalXPosition = 0;
	const cube3InitalXPosition = 2;

	function setupNonGSAPWay() {
		const scene = new THREE.Scene();

		const cubesGroup = new THREE.Group();
		scene.add(cubesGroup);

		const cube1 = createMeshBasicCube(1, 0xff0000);
		cube1.position.x = cube1InitalXPosition;
		cube1.position.z = 0;
		cubesGroup.add(cube1);

		const cube2 = createMeshBasicCube(1, 0x00ff00);
		cube2.position.x = cube2InitalXPosition;
		cube2.position.z = 0;
		cubesGroup.add(cube2);

		const cube3 = createMeshBasicCube(1, 0x0000ff);
		cube3.position.x = cube3InitalXPosition;
		cube3.position.z = 0;
		cubesGroup.add(cube3);

		const cameraSizes = newSizes(600, 600);

		const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect());

		camera.position.z = 5;

		const renderer = new THREE.WebGLRenderer({
			canvas: canvasNonGSAP
		});

		let initialTime = Date.now();

		const clock = new THREE.Clock();

		function tick() {
			const deltaTime = getDeltaTime(initialTime);
			const elapsedTime = clock.getElapsedTime();

			initialTime = Date.now();

			cube1.rotation.x = 1 * elapsedTime;
			cube2.rotation.y = 1 * elapsedTime;
			cube3.rotation.z = 1 * elapsedTime;

			cube1.position.y = Math.sin(elapsedTime);
			cube2.position.y = Math.cos(elapsedTime);
			cube3.position.y = Math.sin(elapsedTime);

			const cube1Scale = Math.abs(Math.sin(elapsedTime));
			const cube2Scale = Math.abs(Math.cos(elapsedTime));
			const cube3Scale = Math.abs(Math.sin(elapsedTime));

			cube1.scale.set(cube1Scale, cube1Scale, cube1Scale);
			cube2.scale.set(cube2Scale, cube2Scale, cube2Scale);
			cube3.scale.set(cube3Scale, cube3Scale, cube3Scale);

			renderer.setSize(cameraSizes.width, cameraSizes.height);
			renderer.render(scene, camera);

			window.requestAnimationFrame(tick);
		}

		tick();
	}

	function setupGSAPWay() {
		const scene = new THREE.Scene();

		const cubesGroup = new THREE.Group();
		scene.add(cubesGroup);

		const cube1 = createMeshBasicCube(1, 0xff0000);
		cube1.position.x = cube1InitalXPosition;
		cube1.position.z = 0;
		cubesGroup.add(cube1);

		const cube2 = createMeshBasicCube(1, 0x00ff00);
		cube2.position.x = cube2InitalXPosition;
		cube2.position.z = 0;
		cubesGroup.add(cube2);

		const cube3 = createMeshBasicCube(1, 0x0000ff);
		cube3.position.x = cube3InitalXPosition;
		cube3.position.z = 0;
		cubesGroup.add(cube3);

		const cameraSizes = newSizes(600, 600);

		const camera = new THREE.PerspectiveCamera(75, cameraSizes.aspect());

		camera.position.z = 5;

		const renderer = new THREE.WebGLRenderer({
			canvas: canvasGSAP
		});

		renderer.setSize(cameraSizes.width, cameraSizes.height);

		const cube1Timeline = gsap.timeline({
			repeat: -1
		});
		cube1Timeline
			.from([cube1.position, cube1.rotation], {
				duration: 1,
				y: -1,
				ease: 'none'
			})
			.to([cube1.position, cube1.rotation], {
				duration: 1,
				y: 1,
				ease: 'none'
			})
			.to([cube1.position, cube1.rotation], {
				duration: 2,
				y: -1,
				ease: 'none'
			});

		const cube2Timeline = gsap.timeline({
			repeat: -1
		});

		cube2Timeline.to(cube2.rotation, {
			duration: Math.PI,
			y: Math.PI,
			ease: 'none'
		});

		const cube3Timeline = gsap.timeline({
			repeat: -1
		});
		cube3Timeline
			.from(cube3.position, {
				duration: 2,
				// delay: 1,
				x: 4,
				ease: 'bounce.out'
			})
			.to(cube3.position, {
				duration: 2,
				x: 4,
				ease: 'bounce.out'
			});

		function tick() {
			renderer.render(scene, camera);

			window.requestAnimationFrame(tick);
		}

		tick();
	}

	onMount(() => {
		setupNonGSAPWay();
		setupGSAPWay();
	});
</script>

<svelte:head>
	<title>05 - Animations</title>
</svelte:head>

<h1>Non GSAP Way</h1>
<canvas bind:this={canvasNonGSAP}></canvas>
<h1>GSAP Way</h1>
<canvas bind:this={canvasGSAP}></canvas>
