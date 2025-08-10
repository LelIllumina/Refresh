import { Vibrant } from "node-vibrant/node";
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ImageMetadata } from "astro";

export async function getGlowColors(src: string | URL | ImageMetadata) {
  let imgPath: string;

  if (
    typeof src === "object" &&
    "src" in src &&
    "width" in src &&
    "height" in src
  ) {
    imgPath = src.src;
  } else if (typeof src === "string") {
    imgPath = src;
  } else if (src instanceof URL) {
    imgPath = fileURLToPath(src);
  } else {
    throw new TypeError("Unsupported src type passed to getGlowColors()");
  }

  // Remove query parameters and vite stuff
  imgPath = imgPath.split("?")[0];

  if (imgPath.startsWith("/@fs/")) {
    imgPath = imgPath.replace(/^\/@fs\//, "");
  }

  if (imgPath.startsWith("/src/")) {
    const projectRoot = fileURLToPath(new URL("../..", import.meta.url));
    imgPath = path.join(projectRoot, imgPath.replace(/^\/+/, ""));
  }

  if (!path.isAbsolute(imgPath)) {
    imgPath = fileURLToPath(new URL(imgPath, import.meta.url));
  }

  const buffer = await sharp(imgPath)
    .resize(100, 100, { fit: "inside" })
    .jpeg({ quality: 80 })
    .toBuffer();

  const palette = await Vibrant.from(buffer).getPalette();
  return { palette };
}
