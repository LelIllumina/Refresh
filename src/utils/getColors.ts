import { Vibrant } from "node-vibrant/node";
import sharp from "sharp";

import path from "node:path";
import { join } from "node:path";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

import type { ImageMetadata } from "astro";

const tempDir = await mkdtemp(join(tmpdir(), "bun-"));
const httpsCheckRegex = /^(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w\- ./?%&=]*)?$/i;

export async function getGlowColors(src: string | URL | ImageMetadata) {
  let imgPath: string;

  if (
    typeof src === "object" &&
    "src" in src &&
    "width" in src &&
    "height" in src
  ) {
    // This is ImageMetadata - use the original src path
    imgPath = src.src;
  } else if (typeof src === "string") {
    imgPath = src;
  } else if (src instanceof URL) {
    imgPath = fileURLToPath(src);
  } else {
    throw new TypeError(
      "Unsupported src type passed to getGlowColors() :" + src,
    );
  }

  // Skip processing for Astro's generated paths
  if (imgPath.includes("/_astro/")) {
    console.warn(
      "Skipping glow color extraction for optimized image:",
      imgPath,
    );
    return {
      palette: {
        Muted: { hex: "#000000" },
        LightVibrant: { hex: "#ffffff" },
      },
    };
  }

  // Handle HTTPS URLs
  if (httpsCheckRegex.test(imgPath)) {
    const res = await fetch(imgPath);
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const tempFilePath = join(tempDir, "image.png");
    await writeFile(tempFilePath, buffer);
    imgPath = tempFilePath;
  }

  // Clean query parameters
  imgPath = imgPath.split("?")[0];

  // Handle Astro's virtual filesystem
  if (imgPath.startsWith("/@fs/")) {
    imgPath = imgPath.replace(/^\/@fs\//, "");
  }

  // Handle src directory paths
  if (imgPath.startsWith("/src/")) {
    const projectRoot = fileURLToPath(new URL("../..", import.meta.url));
    imgPath = path.join(projectRoot, imgPath.replace(/^\/+/, ""));
  }

  // Convert relative paths to absolute
  if (!path.isAbsolute(imgPath)) {
    imgPath = fileURLToPath(new URL(imgPath, import.meta.url));
  }

  try {
    const buffer = await sharp(imgPath)
      .resize(100, 100, { fit: "inside" })
      .jpeg({ quality: 80 })
      .toBuffer();

    const palette = await Vibrant.from(buffer).getPalette();
    return { palette };
  } catch (err: unknown) {
    console.warn("Failed to extract glow colors:", (err as Error).message);
    return {
      palette: {
        Muted: { hex: "#000000" },
        LightVibrant: { hex: "#ffffff" },
      },
    };
  }
}
