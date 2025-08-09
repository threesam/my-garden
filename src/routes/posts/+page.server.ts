import type { PageServerLoad } from './$types';
import { fetchPosts } from '$lib/sanity/client';

export const load: PageServerLoad = async () => {
  const posts = await fetchPosts();
  return { posts };
};