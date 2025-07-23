// @ts-check

import mdx from "@astrojs/mdx";

import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://yourSiteHere.nekoweb.org",

  server: { host: true },
  output: "static",

  integrations: [partytown(), mdx(), sitemap()],
});
