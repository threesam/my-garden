import { sveltekit } from "@sveltejs/kit/vite";
import tailwind from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), tailwind()],

  // Build optimizations
  build: {
    target: "esnext",
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries
          svelte: ["svelte"],
          sveltekit: ["@sveltejs/kit"],
          tailwind: ["tailwindcss"],
          canvas: ["canvas"], // For future canvas libraries
        },
        // Optimize chunk naming
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging
    sourcemap: false,
  },

  // Development optimizations
  server: {
    hmr: {
      overlay: false,
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ["svelte", "@sveltejs/kit"],
  },
});
