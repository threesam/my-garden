<script lang="ts">
  // Footer component
</script>

<footer
  class="w-full border-t border-black/10 py-10 px-6 grid gap-6 sm:grid-cols-3"
  aria-label="Site footer"
>
  <div>
    <p class="text-sm text-muted">"Add a thoughtful quote here."</p>
  </div>
  <div>
    <h2 class="font-medium mb-2 text-sm">Contact</h2>
    <ul class="space-y-1 text-sm">
      <li>
        <a
          class="underline hover:no-underline"
          href="mailto:you@example.com"
          aria-label="Send email to you@example.com"
        >
          you@example.com
        </a>
      </li>
    </ul>
  </div>
  <div>
    <h2 class="font-medium mb-2 text-sm">Social</h2>
    <ul class="space-y-1 text-sm">
      <li>
        <a
          class="underline hover:no-underline"
          href="/"
          aria-disabled="true"
          aria-label="Twitter (coming soon)"
        >
          Twitter
        </a>
      </li>
      <li>
        <a
          class="underline hover:no-underline"
          href="/"
          aria-disabled="true"
          aria-label="GitHub (coming soon)"
        >
          GitHub
        </a>
      </li>
      <li>
        <a
          class="underline hover:no-underline"
          href="/"
          aria-disabled="true"
          aria-label="LinkedIn (coming soon)"
        >
          LinkedIn
        </a>
      </li>
    </ul>
  </div>
</footer>

<style>
  .text-muted {
    color: var(--color-muted);
  }
</style>
