<script lang="ts">
  import Sketch from "$lib/Sketch.svelte";
  import { SKETCH_DATA } from "$lib/sketches.js";

  // Mock nav height - in a real app this would come from your nav component
  const navHeight = 64; // Assuming 64px nav height

  // Example of customizing sketch data
  const customSketchData = {
    ...SKETCH_DATA,
    config: {
      ...SKETCH_DATA.config,
      fps: 15, // Slower animation for demonstration
    },
    content: {
      ...SKETCH_DATA.content,
      overlayText: "Custom Digital Garden",
      overlaySubtext: "Running at 15fps for a more relaxed experience.",
    },
  };
</script>

<svelte:head>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
    }
  </style>
</svelte:head>

<div class="w-full">
  <!-- Full bleed sketch with overlay and tooltip -->
  <Sketch sketchData={customSketchData} {navHeight} />
</div>
