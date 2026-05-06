import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Update the site URL when the domain is finalised
export default defineConfig({
  site: 'https://property.tifa.co.uk',
  integrations: [tailwind()],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
