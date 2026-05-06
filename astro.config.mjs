import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Update the site URL when the domain is finalised
export default defineConfig({
  site: 'https://tifa-property.com',
  integrations: [tailwind()],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
