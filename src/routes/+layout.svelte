<script>
	import * as Menubar from '$lib/components/ui/menubar';
	import '../app.css';
</script>

<div class="menu">
	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Trigger>Lessons</Menubar.Trigger>
			<Menubar.Content>
				<a href="/lesson-03"><Menubar.Item>03 - Geometry</Menubar.Item></a>
				<Menubar.Separator />

				<a href="/lesson-04"><Menubar.Item>04 - Transform Objects</Menubar.Item></a>
				<Menubar.Separator />

				<a href="/lesson-05"><Menubar.Item>05 - Animation</Menubar.Item></a>
				<Menubar.Separator />

				<a href="/lesson-06"><Menubar.Item>06 - Cameras</Menubar.Item></a>
				<Menubar.Separator />

				<a href="/lesson-07"><Menubar.Item>07 - Fullscreen and resizing</Menubar.Item></a>
				<Menubar.Separator />

				<a href="/lesson-08"><Menubar.Item>08 - Geometries</Menubar.Item></a>
				<Menubar.Separator />

				<a href="/lesson-09"><Menubar.Item>09 - Debug UI</Menubar.Item></a>
				<Menubar.Separator />

				<a href="/lesson-10"><Menubar.Item>10 - Textures</Menubar.Item></a>
				<Menubar.Separator />

				<a href="/lesson-11"><Menubar.Item>11 - Materials</Menubar.Item></a>
				<Menubar.Separator />

				<a href="/lesson-12"><Menubar.Item>12 - 3D Text</Menubar.Item></a>
				<Menubar.Separator />

				<a href="/lesson-14"><Menubar.Item>14 - Lights</Menubar.Item></a>
				<Menubar.Separator />

				<a href="/lesson-15"><Menubar.Item>15 - Shadows</Menubar.Item></a>
				<Menubar.Separator />

				<a href="/lesson-16"><Menubar.Item>16 - Haunted House</Menubar.Item></a>
				<Menubar.Separator />
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
</div>
<slot />
