import { defineCollection, z } from "astro:content";
import { rssSchema } from "@astrojs/rss";

import { glob } from "astro/loaders";

const blogs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blogs" }),
  schema: () =>
    rssSchema.extend({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      thumb: z.preprocess(
        (val) => `/src/assets/images/blog/${val}`,
        z.string(),
      ),
      tags: z.array(z.string()),
      keywords: z.array(z.string()).optional(),
      draft: z.boolean(),
    }),
});
const guides = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/guides" }),
  schema: () =>
    rssSchema.extend({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      thumb: z.preprocess(
        (val) => `/src/assets/images/blog/${val}`,
        z.string(),
      ),
      tags: z.array(z.string()),
      keywords: z.array(z.string()).optional(),
      draft: z.boolean(),
    }),
});

export const collections = { blogs, guides };
