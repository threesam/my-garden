<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { createEngine } from './engine'
	import { wireframeRenderer } from './rendererWireframe'

	let canvas: HTMLCanvasElement
	let ctx: CanvasRenderingContext2D | null = null

	const engine = createEngine({ renderer: wireframeRenderer })

	let input = { left: false, right: false, up: false, fire: false }
	let rafId = 0
	let last = 0

	function onKeyDown(e: KeyboardEvent) {
		if (e.code === 'ArrowLeft') input.left = true
		if (e.code === 'ArrowRight') input.right = true
		if (e.code === 'ArrowUp') input.up = true
		if (e.code === 'Space') input.fire = true
	}
	function onKeyUp(e: KeyboardEvent) {
		if (e.code === 'ArrowLeft') input.left = false
		if (e.code === 'ArrowRight') input.right = false
		if (e.code === 'ArrowUp') input.up = false
		if (e.code === 'Space') input.fire = false
	}

	function resize() {
		if (typeof window === 'undefined') return
		const dpr = window.devicePixelRatio || 1
		const width = Math.floor(canvas.clientWidth * dpr)
		const height = Math.floor(canvas.clientHeight * dpr)
		canvas.width = width
		canvas.height = height
		ctx = canvas.getContext('2d')
		if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		engine.resize(width / dpr, height / dpr)
	}

	function loop(now: number) {
		const dt = Math.min(0.033, (now - last) / 1000)
		last = now
		if (input.fire) engine.shoot(now)
		engine.update(input, dt)
		if (ctx) engine.render(ctx)
		rafId = requestAnimationFrame(loop)
	}

	onMount(() => {
		if (typeof window === 'undefined') return
		window.addEventListener('keydown', onKeyDown)
		window.addEventListener('keyup', onKeyUp)
		resize()
		window.addEventListener('resize', resize)
		last = performance.now()
		rafId = requestAnimationFrame(loop)
	})

	onDestroy(() => {
		if (typeof window === 'undefined') return
		window.removeEventListener('keydown', onKeyDown)
		window.removeEventListener('keyup', onKeyUp)
		window.removeEventListener('resize', resize)
		cancelAnimationFrame(rafId)
	})
</script>

<div class="max-w-4xl mx-auto p-4">
	<h1 class="text-3xl font-bold mb-3 text-center">Asteroids</h1>
	<div class="rounded overflow-hidden border border-gray-800 shadow-inner">
		<canvas bind:this={canvas} class="block w-full h-[60vh] bg-black"></canvas>
	</div>
	<p class="mt-3 text-sm text-gray-600 text-center">
		Controls: Arrow keys to rotate/thrust, Space to fire
	</p>
</div>
