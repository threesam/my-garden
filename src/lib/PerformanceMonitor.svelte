<script lang="ts">
	import { onMount } from 'svelte'

	let fps = $state(0)
	let memoryUsage = $state(0)
	let isVisible = $state(false)
	let frameCount = $state(0)
	let lastTime = $state(performance.now())

	onMount(() => {
		// FPS counter
		function updateFPS() {
			frameCount++
			const currentTime = performance.now()

			if (currentTime - lastTime >= 1000) {
				fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
				frameCount = 0
				lastTime = currentTime
			}

			requestAnimationFrame(updateFPS)
		}

		// Memory usage (if available)
		function updateMemory() {
			if ('memory' in performance) {
				const memory = (performance as any).memory
				memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
			}
		}

		// Start monitoring
		updateFPS()
		setInterval(updateMemory, 1000)

		// Visibility API for performance optimization
		document.addEventListener('visibilitychange', () => {
			isVisible = !document.hidden
		})
	})
</script>

{#if isVisible}
	<div
		class="fixed top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded text-xs font-mono z-50"
	>
		<div>FPS: {fps}</div>
		{#if memoryUsage > 0}
			<div>Memory: {memoryUsage}MB</div>
		{/if}
	</div>
{/if}
