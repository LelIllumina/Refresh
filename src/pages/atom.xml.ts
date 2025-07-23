import { getCollection } from "astro:content";
import { Feed } from "feed";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const blog = await getCollection("blogs");
  const guide = await getCollection("guides");

  const feed = new Feed({
    title: "lel@nekoweb",
    description: "THE site for lel and gooning",
    id: context.site?.toString() ?? "https://lel.nekoweb.org",
    link: context.site?.toString() ?? "https://lel.nekoweb.org",
    language: "en",
    image: "http://lel.nekoweb.org/images/background.jpg",
    favicon: "http://lel.nekoweb.org/icons/favicon.ico",
    copyright: "All rights reserved 2025, Lel Illumina",
    feedLinks: {
      atom: "https://lel.nekoweb.org/atom.xml",
    },
    author: {
      name: "Lel",
      email: "lelillumina@tfwno.gf",
      link: "https://lel.nekoweb.org/",
    },
  });

  blog.forEach((post) => {
    feed.addItem({
      id: context.site + `/blogs/${post.id}/`,
      title: post.data.title,
      image: encodeURI(
        `${context.site}_astro/${post.data.thumb.src.split("/").pop()}`,
      ),
      date: post.data.date,
      published: post.data.date,
      description: post.data.description,
      content: sanitizeHtml(parser.render(post.body ?? ""), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
      category: (post.data.tags || []).map((tag: string) => ({
        name: tag,
        term: tag,
      })),
      link: context.site + `/blogs/${post.id}/`,
    });
  });
  guide.forEach((post) => {
    feed.addItem({
      id: context.site + `/guides/${post.id}/`,
      title: post.data.title,
      image: encodeURI(
        `${context.site}_astro/${post.data.thumb.src.split("/").pop()}`,
      ),
      date: post.data.date,
      published: post.data.date,
      description: post.data.description,
      content: sanitizeHtml(parser.render(post.body ?? ""), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
      category: (post.data.tags || []).map((tag: string) => ({
        name: tag,
        term: tag,
      })),
      link: context.site + `/guides/${post.id}/`,
    });
  });
  return new Response(feed.atom1(), {
    headers: { "Content-Type": "application/atom+xml" },
  });
}
