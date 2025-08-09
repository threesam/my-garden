<script lang="ts">
	import Sketch from '$lib/Sketch.svelte'
	import PerformanceMonitor from '$lib/PerformanceMonitor.svelte'
	import { SKETCH_DATA } from '$lib/sketches.js'

	const FPS = 60

	// Example of customizing sketch data
	const customSketchData = $state({
		...SKETCH_DATA,
		config: {
			...SKETCH_DATA.config,
			fps: FPS, // Slower animation for demonstration
		},
		content: {
			...SKETCH_DATA.content,
			overlayText: 'The Garden',
			overlaySubtext: `A place to think and grow.`,
		},
	})
</script>

<div class="min-h-screen bg-white">
	<div class="relative w-full h-screen">
		<!-- Full bleed sketch with overlay and tooltip -->
		<Sketch sketchData={customSketchData} />
	</div>

	<!-- Performance monitor (only in development) -->
	{#if import.meta.env.DEV && import.meta.env.MODE === 'development'}
		<PerformanceMonitor />
	{/if}
</div>
