import type { PageServerLoad } from './$types';
import { fetchPageBySlug } from '$lib/sanity/client';

export const load: PageServerLoad = async ({ params }) => {
  const page = await fetchPageBySlug(params.slug);
  if (!page) {
    return { page: { title: 'Not found', body: null } };
  }
  return { page };
};