import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const buildDate = new Date().toISOString();

export default defineConfig({
  integrations: [
    react(),
    tailwind(),
    sitemap({
      serialize(item) {
        item.lastmod = buildDate;
        return item;
      },
    }),
  ],
  site: 'https://fieldmarks.org',
});
