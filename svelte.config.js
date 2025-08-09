import adapter from "@sveltejs/adapter-vercel";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      runtime: "nodejs20.x",
      // Enable edge functions for better performance
      regions: ["iad1"],
      // Optimize for performance
      maxDuration: 10,
    }),

    // Performance optimizations
    prerender: {
      // Handle dynamic routes
      handleHttpError: "warn",
    },

    // Optimize service worker
    serviceWorker: {
      register: false, // Disable for now, can be enabled later
    },

    // Optimize CSP
    csp: {
      mode: "hash",
      directives: {
        "default-src": ["self"],
        "script-src": ["self", "unsafe-inline"],
        "style-src": ["self", "unsafe-inline"],
        "img-src": ["self", "data:", "https:"],
        "connect-src": ["self"],
      },
    },
  },
};

export default config;
