// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  experimental: {
      responsiveImages: true,
      svg: true,
    },

  integrations: [svelte()]
});