import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';

// The React components were written for plain Vite, where `import logo from './x.svg'` gives the file's URL. Astro
// gives an image object instead, so those <img src={logo}> rendered "[object Object]" (broken logos). This asks for
// the URL, as Vite did.
const imageUrls = {
  name: 'frank-image-urls',
  enforce: 'pre',
  transform(code, id) {
    if (!/\/src\/.*\.jsx?$/.test(id)) return null;
    const out = code.replace(/(from\s+['"])(\.{1,2}\/[^'"?]+\.(?:svg|png|jpe?g|webp|avif|gif))(['"])/g, '$1$2?url$3');
    return out === code ? null : { code: out, map: null };
  },
};

export default defineConfig({
  site: 'https://www.hifrank.ai',
  integrations: [react()],
  // pricing.html, docs/overview.html, ... so URLs match hifrank.ai paths (/pricing, /docs/overview)
  build: { format: 'file' },
  trailingSlash: 'never',
  vite: {
    plugins: [imageUrls],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  },
});
