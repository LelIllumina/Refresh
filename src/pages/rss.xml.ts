import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const blog = await getCollection("blogs");
  const guide = await getCollection("guides");

  return rss({
    title: "lel@nekoweb",
    description: "THE site for lel and gooning",
    site: context.site ?? "https://lel.nekoweb.org",
    customData: /* XML */ `<language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <webMaster>lelillumina@tfwno.gf (Lel Illumina)</webMaster>
    <image>
      <url>https://lel.nekoweb.org/images/background.jpg</url>
      <title>lel@nekoweb</title>
      <link>https://lel.nekoweb.org/</link>
      <width>144</width>
      <height>31</height>
      <description>THE site for lel and gooning</description>
    </image>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <copyright>All rights reserved 2025, Lel Illumina</copyright>
    `,
    items: [
      ...blog.map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        content: sanitizeHtml(parser.render(post.body ?? ""), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        }),
        categories: post.data.tags,
        link: `/blogs/${post.id}/`,
      })),
      ...guide.map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        content: sanitizeHtml(parser.render(post.body ?? ""), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        }),
        categories: post.data.tags,
        link: `/guides/${post.id}/`,
      })),
    ],
  });
}
