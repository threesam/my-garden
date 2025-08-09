import { createClient, type ClientConfig } from '@sanity/client';
import groq from 'groq';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string | undefined) ?? 'production';

const client: ReturnType<typeof createClient> | null = projectId
  ? createClient({ projectId, dataset, apiVersion: '2025-01-01', useCdn: true } satisfies ClientConfig)
  : null;

// Fallback data
export interface Project { _id: string; title: string; slug?: { current: string }; summary?: string }
export interface Post { _id: string; title: string; slug?: { current: string }; excerpt?: string; publishedAt?: string }
export interface Page { _id: string; title: string; slug?: { current: string }; body?: unknown }

const fallback = {
  projects: [{ _id: 'fallback-project', title: 'Getting Started', summary: 'Your first project.' } satisfies Project],
  posts: [{ _id: 'fallback-post', title: 'Hello Garden', excerpt: 'Welcome to your new garden.' } satisfies Post],
  pages: [{ _id: 'fallback-page', title: 'About', slug: { current: 'about' } } satisfies Page]
};

export async function fetchProjects(): Promise<Project[]> {
  try {
    if (!client) return fallback.projects;
    const result = await client.fetch<Project[]>(groq`*[_type == "project"]{ _id, title, slug, summary } | order(title asc)`);
    return result?.length ? result : fallback.projects;
  } catch {
    return fallback.projects;
  }
}

export async function fetchPosts(): Promise<Post[]> {
  try {
    if (!client) return fallback.posts;
    const result = await client.fetch<Post[]>(groq`*[_type == "post"]{ _id, title, slug, excerpt, publishedAt } | order(publishedAt desc)`);
    return result?.length ? result : fallback.posts;
  } catch {
    return fallback.posts;
  }
}

export async function fetchPageBySlug(slug: string): Promise<Page | null> {
  try {
    if (!client) return fallback.pages.find(p => p.slug?.current === slug) ?? null;
    const result = await client.fetch<Page | null>(groq`*[_type == "page" && slug.current == $slug][0]{ _id, title, slug, body }`, { slug });
    return result ?? fallback.pages.find(p => p.slug?.current === slug) ?? null;
  } catch {
    return fallback.pages.find(p => p.slug?.current === slug) ?? null;
  }
}