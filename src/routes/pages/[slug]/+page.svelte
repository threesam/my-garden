<script lang="ts">
  const { data } = $props<{
    data: { page: { title?: string; body?: unknown } };
  }>();
</script>

<section class="px-6 py-12 max-w-3xl mx-auto">
  <h1 class="text-2xl font-semibold mb-4">{data.page.title}</h1>
  <div class="prose prose-neutral max-w-none">
    <p class="text-muted">
      This is a placeholder. Connect Portable Text renderer later.
    </p>
  </div>
</section>
