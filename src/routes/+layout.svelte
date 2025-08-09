<script lang="ts">
	import '../app.css'
	import Footer from '$lib/Footer.svelte'
</script>

<div class="min-h-screen flex flex-col font-sans">
	<main class="flex-1">
		<slot />
	</main>
	<Footer />
</div>
