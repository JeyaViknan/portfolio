import { defineConfig } from 'astro/config';

// Set SITE_URL once the domain is known; canonical and og:url depend on it.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  trailingSlash: 'always',
  // Styles ship inside each page, so a CDN can never serve a page without its CSS.
  build: { inlineStylesheets: 'always' },
});
