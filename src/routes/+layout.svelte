<script lang="ts">
  export const data = undefined;
  import '../app.css';
</script>

<div class="min-h-screen flex flex-col font-sans">
  <nav class="w-full py-4 px-6 flex items-center justify-between border-b border-black/10">
    <div class="text-lg font-semibold select-none">[Logo]</div>
  </nav>
  <main class="flex-1">
    <slot />
  </main>
  <footer class="w-full border-t border-black/10 py-10 px-6 grid gap-6 sm:grid-cols-3">
    <div>
      <p class="text-sm text-muted">“Add a thoughtful quote here.”</p>
    </div>
    <div>
      <h2 class="font-medium mb-2 text-sm">Contact</h2>
      <ul class="space-y-1 text-sm">
        <li><a class="underline hover:no-underline" href="mailto:you@example.com">you@example.com</a></li>
      </ul>
    </div>
    <div>
      <h2 class="font-medium mb-2 text-sm">Social</h2>
      <ul class="space-y-1 text-sm">
        <li><a class="underline hover:no-underline" href="/" aria-disabled="true">Twitter</a></li>
        <li><a class="underline hover:no-underline" href="/" aria-disabled="true">GitHub</a></li>
        <li><a class="underline hover:no-underline" href="/" aria-disabled="true">LinkedIn</a></li>
      </ul>
    </div>
  </footer>
</div>

<style>
  .text-muted { color: var(--color-muted); }
</style>