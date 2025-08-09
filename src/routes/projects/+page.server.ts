import type { PageServerLoad } from './$types';
import { fetchProjects } from '$lib/sanity/client';

export const load: PageServerLoad = async () => {
  const projects = await fetchProjects();
  return { projects };
};