/**
 * Bakes "Bhavish Goyal" into single-stroke SVG path data for the handwritten
 * hero animation. Uses a Hershey single-stroke font, so the strokes read as
 * pen paths rather than letter outlines, and smooths the original polylines
 * into Catmull-Rom cubic Béziers so curves stay fluid at display size.
 *
 * Each disconnected pen-lift becomes its own <path> element (SVG restarts
 * stroke-dasharray/dashoffset per subpath, so multi-stroke letters like "B"
 * or the dot on "i" only draw correctly in sequence if each stroke is its
 * own path — see HandwrittenName.tsx).
 *
 * Swap the FONT constant and re-run to try a different style:
 *   "futural"  — plain sans, unjoined print letters (current)
 *   "scripts"  — monoline cursive script
 *   "scriptc"  — heavier compact cursive
 *   "cursive"  — simple upright cursive
 *   node scripts/generate-name-path.mjs
 *
 * Output: src/components/hero/name-path.ts (committed, no runtime dependency).
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import hershey from "hersheytext";

const TEXT = "Bhavish Goyal";
const FONT = "futural"; // Hershey "Roman Simplex" — plain single-stroke sans

// Let the library compose the line (it handles cursive advances/joins),
// then lift each glyph's path + x offset out of its SVG output.
const svg = hershey.renderTextSVG(TEXT, { font: FONT, pos: { x: 0, y: 0 } });
const glyphRe = /<path[^>]*?d="([^"]+)"[^>]*?translate\(([\d.-]+)[,\s]*([\d.-]+)?/g;
const altRe = /<path[^>]*?translate\(([\d.-]+)[,\s]*([\d.-]+)?\)[^>]*?d="([^"]+)"/g;

const glyphs = [];
let m;
while ((m = glyphRe.exec(svg))) glyphs.push({ d: m[1], x: Number(m[2]), y: Number(m[3] ?? 0) });
if (glyphs.length === 0) {
  while ((m = altRe.exec(svg))) glyphs.push({ d: m[3], x: Number(m[1]), y: Number(m[2] ?? 0) });
}
if (glyphs.length === 0) throw new Error("Could not parse glyph paths from hersheytext output");

// --- Parse absolute M/L polylines into subpaths of points, shifted by offset
function parseSubpaths(d, dx, dy) {
  const subpaths = [];
  let current = null;
  const re = /([ML])\s*|(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g;
  let cmd = "M";
  let match;
  while ((match = re.exec(d))) {
    if (match[1]) {
      cmd = match[1];
      if (cmd === "M") {
        current = [];
        subpaths.push(current);
      }
      continue;
    }
    current?.push([Number(match[2]) + dx, Number(match[3]) + dy]);
  }
  return subpaths.filter((s) => s.length > 1);
}

// --- Catmull-Rom (uniform) -> cubic Bézier through all points
const r = (n) => Math.round(n * 100) / 100;
function smooth(points) {
  let d = `M${r(points[0][0])},${r(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${r(c1[0])},${r(c1[1])} ${r(c2[0])},${r(c2[1])} ${r(p2[0])},${r(p2[1])}`;
  }
  return d;
}

// Tiny closed loops (e.g. the dot on "i") smooth into a hollow ring rather
// than a solid dot — render those as a short round-capped nub instead.
const DOT_THRESHOLD = 2.5; // em units (glyph height is ~21)

let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;
// Flat list of independent pen strokes, in natural writing order (glyph by
// glyph, left to right; within a glyph, in the order Hershey drew them).
const strokes = [];

for (const glyph of glyphs) {
  const subpaths = parseSubpaths(glyph.d, glyph.x, glyph.y);
  for (const pts of subpaths) {
    let bw = 0;
    let bh = 0;
    {
      let bMinX = Infinity, bMinY = Infinity, bMaxX = -Infinity, bMaxY = -Infinity;
      for (const [px, py] of pts) {
        minX = Math.min(minX, px);
        maxX = Math.max(maxX, px);
        minY = Math.min(minY, py);
        maxY = Math.max(maxY, py);
        bMinX = Math.min(bMinX, px);
        bMaxX = Math.max(bMaxX, px);
        bMinY = Math.min(bMinY, py);
        bMaxY = Math.max(bMaxY, py);
      }
      bw = bMaxX - bMinX;
      bh = bMaxY - bMinY;
    }

    if (Math.max(bw, bh) < DOT_THRESHOLD) {
      const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
      const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
      strokes.push(`M${r(cx - 0.15)},${r(cy)} L${r(cx + 0.15)},${r(cy)}`);
    } else {
      strokes.push(smooth(pts));
    }
  }
}

const pad = 2.5;
const width = r(maxX - minX + pad * 2);
const height = r(maxY - minY + pad * 2);
const viewBox = `${r(minX - pad)} ${r(minY - pad)} ${width} ${height}`;

const out = `/**
 * GENERATED — do not edit by hand.
 * Single-stroke pen paths for "${TEXT}" (Hershey font "${FONT}", Catmull-Rom smoothed).
 * Regenerate with: node scripts/generate-name-path.mjs
 */

export const NAME_TEXT = ${JSON.stringify(TEXT)};
export const NAME_VIEWBOX = ${JSON.stringify(viewBox)};
export const NAME_ASPECT = ${width / height};

export const NAME_STROKES: string[] = ${JSON.stringify(strokes, null, 2)};
`;

const dest = join(dirname(fileURLToPath(import.meta.url)), "../src/components/hero/name-path.ts");
writeFileSync(dest, out);
console.log(`Wrote ${strokes.length} strokes, viewBox "${viewBox}" -> ${dest}`);
