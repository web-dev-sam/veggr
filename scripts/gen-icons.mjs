#!/usr/bin/env node
/**
 * App icon generator — node stdlib only (zlib + fs).
 *
 * There is no rasteriser in this project and there should not be one for four
 * PNGs. The mark is three fanned capsules, the same "leaves from one root" idea
 * the leafy family in src/icons/glyph.ts draws, so the installed icon belongs
 * to the same visual family as the 288 icons inside the app.
 *
 * Colours are declared in OKLCH to match src/style.css exactly and converted
 * here, so the tokens have one source of truth.
 *
 * Run: vp run icons
 */

import { deflateSync, constants } from "node:zlib";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/* ------------------------------------------------------------------ colour */

/** OKLCH -> 8-bit sRGB. Björn Ottosson's inverse matrices, gamut clamped. */
function oklch(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = Math.cos(h) * C;
  const b = Math.sin(h) * C;

  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];

  return linear.map((v) => {
    const c = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
    return Math.max(0, Math.min(255, Math.round(c * 255)));
  });
}

// A deep green plate, the same idea as the in-app icon plates, so the installed
// icon reads as one of the family rather than a black square.
const BG = oklch(0.25, 0.05, 150);
const INK = oklch(0.87, 0.19, 128); // --accent
const INK_DEEP = oklch(0.7, 0.17, 132); // --accent-deep

/* ------------------------------------------------------------------- glyph */

/**
 * A sprig: one bright stem with two leaves branching off it, alternating high
 * and low so it reads as a growing thing rather than a symmetric arrow. Unit
 * square, origin at the centre, y down. Each part is a capsule — a segment plus
 * a radius — which is all the rasteriser below needs to solve exactly.
 *
 * Painter order: leaves first, stem last, so the stem sits on top.
 */
const PARTS = [
  { a: [-0.02, 0.1], b: [-0.33, -0.16], r: 0.088, colour: INK_DEEP },
  { a: [0.02, -0.06], b: [0.33, -0.32], r: 0.088, colour: INK_DEEP },
  { a: [0, 0.42], b: [0, -0.36], r: 0.077, colour: INK },
];

/** Squared distance from a point to a segment. */
function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = dx * dx + dy * dy;
  const t = len === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

/* -------------------------------------------------------------- rasteriser */

/**
 * Supersampled coverage per part, composited in painter order. Exact geometry
 * beats a font or a traced path here: four small PNGs, no dependencies.
 *
 * @param {number} size edge length in px
 * @param {number} inset fraction of the canvas the glyph occupies
 * @param {number} ss supersampling factor per axis
 */
function raster(size, inset, ss = 4) {
  const pixels = Buffer.alloc(size * size * 3);
  const samples = ss * ss;
  const cover = new Float64Array(PARTS.length);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      cover.fill(0);
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const ux = ((x + (sx + 0.5) / ss) / size - 0.5) / inset;
          const uy = ((y + (sy + 0.5) / ss) / size - 0.5) / inset;
          // Topmost part wins the subsample, which is what makes overlaps opaque.
          let hit = -1;
          for (const [index, part] of PARTS.entries()) {
            if (distToSegment(ux, uy, part.a[0], part.a[1], part.b[0], part.b[1]) <= part.r) {
              hit = index;
            }
          }
          if (hit >= 0) cover[hit] += 1 / samples;
        }
      }

      const at = (y * size + x) * 3;
      for (let channel = 0; channel < 3; channel++) {
        let value = BG[channel];
        for (const [index, part] of PARTS.entries()) {
          value += (part.colour[channel] - value) * cover[index];
        }
        pixels[at + channel] = Math.round(value);
      }
    }
  }
  return pixels;
}

/* ------------------------------------------------------------ png encoding */

const CRC = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (const byte of buf) c = CRC[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, payload) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(payload.length, 0);
  head.write(type, 4, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), payload])), 0);
  return Buffer.concat([head, payload, crc]);
}

function encodePNG(pixels, size) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolour
  // Filter type 0 per scanline: these are flat gradients, nothing to gain.
  const stride = size * 3;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0;
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: constants.Z_BEST_COMPRESSION })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* -------------------------------------------------------------------- svg */

const hex = (rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;

function faviconSVG() {
  // 62 = the same 0.62 inset the PNGs use, on a 100-unit viewBox.
  const at = (v) => (50 + v * 62).toFixed(1);
  const shapes = PARTS.map(
    (part) =>
      `<path d="M${at(part.a[0])} ${at(part.a[1])}L${at(part.b[0])} ${at(part.b[1])}" ` +
      `stroke="${hex(part.colour)}" stroke-width="${(part.r * 124).toFixed(1)}" ` +
      `stroke-linecap="round" fill="none"/>`,
  ).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\
<rect width="100" height="100" rx="24" fill="${hex(BG)}"/>${shapes}</svg>\n`;
}

/* -------------------------------------------------------------------- main */

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
mkdirSync(pub, { recursive: true });

// Scaffold leftovers this replaces.
for (const stale of ["icons.svg", "vite.svg"]) {
  rmSync(join(pub, stale), { force: true });
}

const TARGETS = [
  { file: "pwa-192x192.png", size: 192, inset: 0.72 },
  { file: "pwa-512x512.png", size: 512, inset: 0.72 },
  // Maskable icons get cropped to a circle, so the glyph sits well inside.
  { file: "pwa-maskable-512x512.png", size: 512, inset: 0.52 },
  { file: "apple-touch-icon.png", size: 180, inset: 0.68 },
];

for (const target of TARGETS) {
  const png = encodePNG(raster(target.size, target.inset), target.size);
  writeFileSync(join(pub, target.file), png);
  console.log(`  ${target.file}  ${(png.length / 1024).toFixed(1)} KB`);
}

writeFileSync(join(pub, "favicon.svg"), faviconSVG());
console.log("  favicon.svg");
console.log(`  theme colour ${hex(BG)}  accent ${hex(INK)}`);
