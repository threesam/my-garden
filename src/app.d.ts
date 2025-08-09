/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string
  readonly PUBLIC_SANITY_DATASET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace App {
  // interface Locals {}
  // interface PageData {}
  // interface Platform {}
}
