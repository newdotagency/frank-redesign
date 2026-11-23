import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://www.hifrank.ai',
  integrations: [react()],
  // pricing.html, docs/overview.html, ... so URLs match hifrank.ai paths (/pricing, /docs/overview)
  build: { format: 'file' },
  trailingSlash: 'never',
  vite: { resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } } },
});
