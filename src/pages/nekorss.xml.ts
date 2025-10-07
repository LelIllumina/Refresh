import { getCollection } from "astro:content";

import type { APIContext } from "astro";

import rss from "@astrojs/rss";

export async function GET(context: APIContext) {
  const blog = await getCollection("blogs");

  return rss({
    title: "lel@nekoweb",
    description: "THE site for lel and gooning",
    site: context.site?.toString() ?? "https://lel.nekoweb.org",
    items: blog.map(({ id, data }) => {
      const { title, created, modified, description, tags } = data;
      return {
        title,
        pubDate: created,
        lastBuildDate: modified,
        description,
        categories: tags,
        link: `/blogs/${id}/`,
      };
    }),
  });
}
