// @ts-check

import mdx from "@astrojs/mdx";

import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://lel.nekoweb.org",
  server: { host: true },
  output: "static",

  trailingSlash: "always",

  build: {
    format: "preserve",
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  integrations: [partytown(), mdx(), sitemap()],

  experimental: {
    contentIntellisense: true,
    clientPrerender: true,
  },
});
