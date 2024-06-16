<script>
	import * as Menubar from '$lib/components/ui/menubar';
	import '../app.css';
</script>

<Menubar.Root>
	<Menubar.Menu>
		<Menubar.Trigger>Lessons</Menubar.Trigger>
		<Menubar.Content>
			<a href="/lesson-03"><Menubar.Item>03 - Geometry</Menubar.Item></a>
			<Menubar.Separator />
			<a href="/lesson-04"><Menubar.Item>04 - Transform Objects</Menubar.Item></a>
			<a href="/lesson-05"><Menubar.Item>05 - Animation</Menubar.Item></a>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>

<slot />
