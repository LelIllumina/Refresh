// @ts-check

import mdx from "@astrojs/mdx";

import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

import purgecss from "astro-purgecss";
import playformCompress from "@playform/compress";
import playformInline from "@playform/inline";
import pageInsight from "astro-page-insight";
import metaTags from "astro-meta-tags";

import emoji from "remark-emoji";

import icon from "astro-icon";

export default defineConfig({
  site: "https://lel.nekoweb.org",
  server: { host: true },
  output: "static",

  trailingSlash: "always",

  build: {
    format: "preserve",
    inlineStylesheets: "never",
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  integrations: [
    sitemap(),
    mdx(),
    partytown(),
    purgecss(),
    playformInline(),
    playformCompress(),
    pageInsight(),
    metaTags(),
    icon(),
  ],

  markdown: {
    remarkPlugins: [[emoji, { accessible: true }]],
  },

  experimental: {
    contentIntellisense: true,
    clientPrerender: true,
  },
});
