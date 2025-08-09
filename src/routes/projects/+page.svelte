<script lang="ts">
  const { data } = $props<{
    data: { projects: Array<{ _id: string; title: string; summary?: string }> };
  }>();
</script>

<section class="px-6 py-12 max-w-4xl mx-auto">
  <h1 class="text-2xl font-semibold mb-6">Projects</h1>
  <ul class="space-y-4">
    {#each data.projects as p}
      <li class="border border-black/10 rounded p-4">
        <h2 class="font-medium">{p.title}</h2>
        {#if p.summary}<p class="text-sm text-muted">{p.summary}</p>{/if}
      </li>
    {/each}
  </ul>
</section>
