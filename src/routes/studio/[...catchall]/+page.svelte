<script lang="ts">
  import { onMount } from 'svelte';
  import { renderStudio, createConfig } from 'sanity';

  let el: HTMLDivElement | null = null;

  const config = createConfig({
    name: 'Garden Studio',
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'your_project_id',
    dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
    basePath: '/studio',
    schema: {
      types: [
        { type: 'document', name: 'project', title: 'Project', fields: [
          { type: 'string', name: 'title', title: 'Title' },
          { type: 'slug', name: 'slug', title: 'Slug', options: { source: 'title' } },
          { type: 'text', name: 'summary', title: 'Summary' }
        ]},
        { type: 'document', name: 'post', title: 'Post', fields: [
          { type: 'string', name: 'title', title: 'Title' },
          { type: 'slug', name: 'slug', title: 'Slug', options: { source: 'title' } },
          { type: 'text', name: 'excerpt', title: 'Excerpt' },
          { type: 'datetime', name: 'publishedAt', title: 'Published at' }
        ]},
        { type: 'document', name: 'page', title: 'Page', fields: [
          { type: 'string', name: 'title', title: 'Title' },
          { type: 'slug', name: 'slug', title: 'Slug', options: { source: 'title' } },
          { type: 'array', name: 'body', title: 'Body', of: [{ type: 'block' }] }
        ]}
      ]
    }
  });

  onMount(() => {
    if (el) renderStudio(el, config);
  });
</script>

<svelte:head>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="w-full h-[calc(100vh-4rem)]">
  <div bind:this={el} class="w-full h-full"></div>
</div>