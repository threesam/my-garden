<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    createCellularAutomataSketch,
    type CellularAutomataSketch,
    type SketchData,
    SKETCH_DATA,
  } from "./sketches.js";

  export let sketchData: SketchData = SKETCH_DATA;
  export let navHeight: number = 0;

  let canvas: HTMLCanvasElement;
  let sketch: CellularAutomataSketch;
  let container: HTMLDivElement;
  let observer: IntersectionObserver;
  let isVisible = false;
  let sketchHeight: number;
  let showTooltip = false;
  let tooltipContainer: HTMLDivElement;

  onMount(() => {
    if (!canvas) return;

    console.log("🎨 Creating cellular automata sketch...");

    // Calculate sketch height based on screen minus nav
    sketchHeight = window.innerHeight - navHeight;
    container.style.height = `${sketchHeight}px`;

    // Set canvas dimensions to match container
    canvas.width = window.innerWidth;
    canvas.height = sketchHeight;

    // Create the sketch based on type
    if (sketchData.type === "cellular-automata") {
      sketch = createCellularAutomataSketch(canvas, sketchData);
      console.log("✅ Sketch created successfully");
    }

    // Set up intersection observer
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (entry.isIntersecting) {
            console.log("👁️ Sketch entering viewport - starting animation");
            sketch?.start();
          } else {
            console.log("👁️ Sketch leaving viewport - stopping animation");
            sketch?.stop();
          }
        });
      },
      {
        threshold: 0.1, // Start when 10% visible
        rootMargin: "50px", // Start 50px before entering viewport
      }
    );

    observer.observe(container);

    // Handle window resize
    const handleResize = () => {
      if (sketch) {
        console.log("📐 Resizing sketch...");
        sketchHeight = window.innerHeight - navHeight;
        container.style.height = `${sketchHeight}px`;

        // Update canvas dimensions
        canvas.width = window.innerWidth;
        canvas.height = sketchHeight;

        sketch.resize();
      }
    };

    // Handle click outside tooltip
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showTooltip &&
        tooltipContainer &&
        !tooltipContainer.contains(event.target as Node)
      ) {
        showTooltip = false;
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("click", handleClickOutside);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    };
  });

  onDestroy(() => {
    sketch?.destroy();
  });
</script>

<div bind:this={container} class="w-full relative">
  <canvas bind:this={canvas} class="w-full h-full block"></canvas>

  <!-- Black overlay when tooltip is active -->
  {#if showTooltip}
    <div
      class="absolute inset-0 bg-black/90 z-10 pointer-events-none transition-all duration-400"
    ></div>
  {/if}

  <!-- Overlay text -->
  {#if sketchData.content.overlayText || sketchData.content.overlaySubtext}
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="text-center text-black z-10 px-6">
        {#if sketchData.content.overlayText}
          <h1 class="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            {sketchData.content.overlayText}
          </h1>
        {/if}
        {#if sketchData.content.overlaySubtext}
          <p
            class="text-xl md:text-2xl max-w-2xl mx-auto drop-shadow-lg opacity-90"
          >
            {sketchData.content.overlaySubtext}
          </p>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Tooltip in bottom right corner -->
  {#if sketchData.content.tooltipContent}
    <div bind:this={tooltipContainer} class="absolute bottom-4 right-4 z-20">
      <!-- Info button -->
      <button
        on:click={() => (showTooltip = !showTooltip)}
        class="w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200 flex items-center justify-center"
      >
        <svg
          class="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </button>

      <!-- Tooltip content -->
      {#if showTooltip}
        <div
          class="absolute bottom-12 right-0 w-80 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-4 text-sm"
        >
          <div class="space-y-3">
            <h3 class="font-semibold text-gray-900">Cellular Automata</h3>
            <p class="text-gray-700 leading-relaxed">
              {sketchData.content.tooltipContent}
            </p>
            <div class="text-xs text-gray-500 space-y-1">
              <p>• Responsive design that adapts to viewport size</p>
              <p>• Intersection Observer for performance optimization</p>
              <p>• Minimal white theme with light gray cells</p>
              <p>• Overlay text with drop shadows for readability</p>
              <p>• Running at {sketchData.config.fps}fps</p>
            </div>
          </div>

          <!-- Close button -->
          <button
            on:click={() => (showTooltip = false)}
            class="absolute top-2 right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <svg
              class="w-3 h-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>
