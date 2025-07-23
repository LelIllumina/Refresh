// @ts-check
import { defineConfig } from "astro/config";

import partytown from "@astrojs/partytown";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://yourSiteHere.nekoweb.org",

  //   server: { host: true }, // uncomment if live server dosent work for some reason
  // You can find more informaation about Astro's configuration options at https://docs.astro.build/en/reference/configuration-reference/
  output: "static",

  integrations: [partytown(), mdx(), sitemap()]
});