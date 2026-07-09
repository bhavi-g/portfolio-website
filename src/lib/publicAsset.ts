import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Server-only: returns the public URL of the first existing file among the
 * given basenames, or null. Lets a section auto-swap its placeholder for a
 * real asset the moment the file is dropped into /public — no code change.
 * Evaluated at build time (the page is statically generated).
 */
export function findPublicAsset(basenames: string[]): string | null {
  for (const name of basenames) {
    try {
      if (existsSync(join(process.cwd(), "public", name))) return `/${name}`;
    } catch {
      // ignore
    }
  }
  return null;
}

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Server-only: looks for a project preview image at
 * public/projects/<slugified-title>.(jpg|jpeg|png|webp) — drop the file in
 * with that name and it appears automatically, no code change needed.
 */
export function findProjectImage(title: string): string | null {
  const slug = slugify(title);
  return findPublicAsset(IMAGE_EXTENSIONS.map((ext) => `projects/${slug}.${ext}`));
}
