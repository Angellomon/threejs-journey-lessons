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
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
</div>
<slot />
