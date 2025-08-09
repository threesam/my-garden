<script lang="ts">
  export let data: { posts: Array<{ _id: string; title: string; excerpt?: string; publishedAt?: string }> };
</script>

<section class="px-6 py-12 max-w-4xl mx-auto">
  <h1 class="text-2xl font-semibold mb-6">Posts</h1>
  <ul class="space-y-4">
    {#each data.posts as p}
      <li class="border border-black/10 rounded p-4">
        <h2 class="font-medium">{p.title}</h2>
        {#if p.excerpt}<p class="text-sm text-muted">{p.excerpt}</p>{/if}
        {#if p.publishedAt}<p class="text-xs text-muted mt-1">{new Date(p.publishedAt).toLocaleDateString()}</p>{/if}
      </li>
    {/each}
  </ul>
</section>