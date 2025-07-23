import { getCollection } from "astro:content";

import type { APIContext } from "astro";

import rss from "@astrojs/rss";

export async function GET(context: APIContext) {
  const blog = await getCollection("blogs");

  return rss({
    title: "lel@nekoweb",
    description: "THE site for lel and gooning",
    site: context.site?.toString() ?? "https://lel.nekoweb.org",
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blogs/${post.id}/`,
    })),
  });
}
