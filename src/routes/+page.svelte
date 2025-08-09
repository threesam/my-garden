<script lang="ts">
  import Sketch from "$lib/Sketch.svelte";
  import PerformanceMonitor from "$lib/PerformanceMonitor.svelte";
  import { SKETCH_DATA } from "$lib/sketches.js";

  // Mock nav height - in a real app this would come from your nav component
  const navHeight = 64; // Assuming 64px nav height
  const FPS = 60;

  // Example of customizing sketch data
  const customSketchData = {
    ...SKETCH_DATA,
    config: {
      ...SKETCH_DATA.config,
      fps: FPS, // Slower animation for demonstration
    },
    content: {
      ...SKETCH_DATA.content,
      overlayText: "My Garden",
      overlaySubtext: `A place to think and grow.`,
    },
  };
</script>

<svelte:head>
  <style>
    /* Ensure smooth loading */
    .page-container {
      min-height: 100vh;
      background-color: var(--color-white);
    }

    /* Prevent layout shift during loading */
    .sketch-container {
      position: relative;
      width: 100%;
      height: calc(100vh - 64px);
    }
  </style>
</svelte:head>

<div class="page-container">
  <div class="sketch-container">
    <!-- Full bleed sketch with overlay and tooltip -->
    <Sketch sketchData={customSketchData} {navHeight} />
  </div>

  <!-- Performance monitor (only in development) -->
  {#if import.meta.env.DEV && import.meta.env.MODE === "development"}
    <PerformanceMonitor />
  {/if}
</div>
