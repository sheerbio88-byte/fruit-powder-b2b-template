import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, envField } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import compress from 'astro-compress';

import astrowind from './vendor/integration';
import { trailingSlashRedirect } from './src/plugins/trailing-slash-redirect';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter';
import { shouldIncludeInSitemap } from './src/utils/sitemap-filter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  env: {
    schema: {
      PUBLIC_SUPABASE_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_SUPABASE_ANON_KEY: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
    },
  },

  site: 'https://sheersuperfood.com',

  trailingSlash: 'always',

  output: 'static',

  integrations: [
    sitemap({
      filter: (page) => shouldIncludeInSitemap(page),
    }),
    icon({
      include: {
        tabler: ['*'],
      },
    }),
    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),
    astrowind({
      config: './src/config.yaml',
    }),
  ],

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin],
  },

  vite: {
    plugins: [tailwindcss(), trailingSlashRedirect()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
