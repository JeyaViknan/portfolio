import { defineConfig } from 'astro/config';

// Set SITE_URL once the domain is known; canonical and og:url depend on it.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  trailingSlash: 'always',
});
