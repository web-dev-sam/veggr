/**
 * Silhouettes for everything green and leafy: leaves, heads, sprigs, shoots and
 * fronds.
 *
 * This is the hardest part of the catalogue to draw distinctly — a third of all
 * plants live here and they are all green — so these families carry the most
 * silhouettes.
 */

import { DEG, TAU, type Draw, type Shape } from "../spec.ts";
import { arc, bar, blob, curve, disc, leaf, onQuad, spiral, wave } from "../shapes.ts";

/* ------------------------------------------------------------------ leafy */

/** Blades fanned from one root — lettuce, chard, spinach. */
const fan: Draw = (d, p) => {
  const count = d.i(3, 5);
  const spread = d.f(24, 46);
  const baseY = d.f(78, 84);
  const blades = Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : (i / (count - 1)) * 2 - 1;
    const length = d.f(46, 58) * (1 - 0.16 * Math.abs(t));
    return { t, angle: -90 + t * spread, length, width: length * d.f(0.26, 0.34) };
  });
  // Outermost first so the centre blade sits on top and reads as the front.
  blades.sort((a, b) => Math.abs(b.t) - Math.abs(a.t));

  const shapes: Shape[] = [
    { d: bar(50, baseY - 4, 50, baseY + 11), stroke: p.inkDeep, width: d.f(4, 5.5) },
  ];
  for (const [i, blade] of blades.entries()) {
    shapes.push({
      d: leaf(50, baseY, blade.angle, blade.length, blade.width),
      fill: i === blades.length - 1 ? p.ink : p.inkDeep,
    });
  }
  const front = blades.at(-1)!;
  shapes.push({
    d: bar(
      50,
      baseY,
      50 + Math.cos(front.angle * DEG) * front.length * 0.82,
      baseY + Math.sin(front.angle * DEG) * front.length * 0.82,
    ),
    stroke: p.spark,
    width: 2,
    opacity: 0.45,
  });
  return shapes;
};

/** A rosette seen from above — rocket, purslane, dandelion, lamb's lettuce. */
const rosette: Draw = (d, p) => {
  const count = d.i(6, 9);
  const spin = d.f(0, 360);
  const length = d.f(30, 39);
  const shapes: Shape[] = [];
  for (let i = 0; i < count; i++) {
    const angle = spin + (i / count) * 360;
    shapes.push({
      d: leaf(
        50 + Math.cos(angle * DEG) * 5,
        50 + Math.sin(angle * DEG) * 5,
        angle,
        length,
        length * d.f(0.26, 0.34),
      ),
      fill: i % 2 === 0 ? p.ink : p.inkDeep,
    });
  }
  shapes.push({ d: disc(50, 50, d.f(6, 8)), fill: p.spark, opacity: 0.85 });
  return shapes;
};

/** One broad veined blade — collard, vine leaf, sweet potato leaf. */
const blade: Draw = (d, p) => {
  const angle = -90 + d.f(-16, 16);
  const length = d.f(58, 68);
  const width = length * d.f(0.34, 0.44);
  const baseX = 50 - Math.cos(angle * DEG) * length * 0.42;
  const baseY = 50 - Math.sin(angle * DEG) * length * 0.42;
  const tipX = baseX + Math.cos(angle * DEG) * length;
  const tipY = baseY + Math.sin(angle * DEG) * length;

  const shapes: Shape[] = [
    { d: leaf(baseX, baseY, angle, length, width), fill: p.ink },
    {
      d: bar(baseX, baseY, baseX + (tipX - baseX) * 0.94, baseY + (tipY - baseY) * 0.94),
      stroke: p.plateTo,
      width: 2.6,
      opacity: 0.55,
    },
  ];

  const veins = d.i(3, 5);
  const splay = d.f(38, 56);
  for (let i = 0; i < veins; i++) {
    const t = 0.2 + (i / veins) * 0.62;
    const x = baseX + (tipX - baseX) * t;
    const y = baseY + (tipY - baseY) * t;
    for (const side of [-1, 1]) {
      const a = (angle + side * splay) * DEG;
      shapes.push({
        d: bar(x, y, x + Math.cos(a) * width * 0.78, y + Math.sin(a) * width * 0.78),
        stroke: p.plateTo,
        width: 1.7,
        opacity: 0.42,
      });
    }
  }
  return shapes;
};

/**
 * Crinkled mass — savoy, curly kale, mizuna, frisée. The lobe count stays low
 * and the jitter high: a Catmull-Rom through twelve barely-displaced samples
 * smooths back into a circle, which is the opposite of crinkled.
 */
const ruffle: Draw = (d, p) => {
  const rx = d.f(26, 30);
  const ry = d.f(24, 28);
  return [
    { d: blob(50, 52, rx, ry, d.i(7, 9), d.f(0.26, 0.4), d), fill: p.ink },
    {
      d: blob(50, 54, rx * 0.6, ry * 0.6, d.i(6, 8), d.f(0.26, 0.42), d),
      fill: p.inkDeep,
      opacity: 0.55,
    },
    { d: bar(50, 78, 50, 30), stroke: p.plateTo, width: 2.4, opacity: 0.45 },
    { d: bar(50, 76, 50, 90), stroke: p.inkDeep, width: 4.5 },
  ];
};

export const LEAFY: readonly Draw[] = [fan, rosette, blade, ruffle];

/* --------------------------------------------------------------- brassica */

/** Florets around a core — broccoli, cauliflower, romanesco. */
const florets: Draw = (d, p) => {
  const cy = d.f(42, 48);
  const ring = d.f(18, 23);
  const core = d.f(11, 15);
  const count = d.i(5, 8);
  const spin = d.f(0, TAU);

  const shapes: Shape[] = [
    { d: bar(50, cy + ring * 0.5, 50, 89), stroke: p.inkDeep, width: d.f(5, 7) },
  ];
  for (let i = 0; i < count; i++) {
    const a = spin + (i / count) * TAU;
    shapes.push({
      d: disc(50 + Math.cos(a) * ring, cy + Math.sin(a) * ring, d.f(7, 10.5)),
      fill: i % 3 === 0 ? p.ink : p.inkDeep,
    });
  }
  shapes.push({ d: disc(50, cy, core), fill: p.ink });
  shapes.push({
    d: disc(50 - core * 0.3, cy - core * 0.3, core * 0.3),
    fill: p.spark,
    opacity: 0.6,
  });
  return shapes;
};

/** A wrapped head — cabbage, napa, kohlrabi. */
const head: Draw = (d, p) => {
  const cy = d.f(50, 55);
  const r = d.f(25, 29);
  const shapes: Shape[] = [
    { d: leaf(50, cy + r * 0.5, 190 + d.f(-12, 12), d.f(26, 34), d.f(8, 11)), fill: p.inkDeep },
    { d: leaf(50, cy + r * 0.5, -10 + d.f(-12, 12), d.f(26, 34), d.f(8, 11)), fill: p.inkDeep },
    { d: disc(50, cy, r), fill: p.ink },
  ];
  const layers = d.i(2, 3);
  for (let i = 0; i < layers; i++) {
    const rr = r * (0.74 - i * 0.2);
    shapes.push({
      d: arc(50, cy, rr, rr * d.f(0.9, 1.1), 160, 380),
      stroke: p.plateTo,
      width: 2.6,
      opacity: 0.5,
    });
  }
  shapes.push({
    d: curve(50 + d.f(-4, 4), cy - r * 0.9, 50 + d.f(-9, 9), cy, 50 + d.f(-4, 4), cy + r * 0.6),
    stroke: p.plateTo,
    width: 2.4,
    opacity: 0.45,
  });
  return shapes;
};

/** Small stacked buds — Brussels sprouts, kalettes. */
const buds: Draw = (d, p) => {
  const count = d.i(2, 3);
  const shapes: Shape[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1) - 0.5;
    const cx = 50 + t * d.f(24, 30);
    const cy = 52 + Math.abs(t) * d.f(8, 16);
    const r = d.f(11, 15) * (1 - Math.abs(t) * 0.18);
    shapes.push({
      d: blob(cx, cy, r, r * d.f(0.9, 1.05), d.i(6, 8), d.f(0.06, 0.14), d),
      fill: i % 2 === 0 ? p.ink : p.inkDeep,
    });
    shapes.push({
      d: bar(cx, cy - r * 0.7, cx, cy + r * 0.7),
      stroke: p.plateTo,
      width: 2,
      opacity: 0.45,
    });
  }
  return shapes;
};

export const BRASSICA: readonly Draw[] = [florets, head, buds];

/* ------------------------------------------------------------------- herb */

/** Leaflet pairs up a stem — basil, mint, coriander. */
const sprig: Draw = (d, p) => {
  const bend = d.f(-14, 14);
  const topY = d.f(15, 23);
  const cx = 50 + bend;
  const tipX = 50 + bend * 0.4;
  const shapes: Shape[] = [
    { d: curve(50, 88, cx, 50, tipX, topY), stroke: p.inkDeep, width: d.f(3, 4.5) },
  ];
  const pairs = d.i(3, 4);
  const splay = d.f(46, 68);
  for (let i = 0; i < pairs; i++) {
    const t = 0.2 + (i / pairs) * 0.66;
    const at = onQuad(50, 88, cx, 50, tipX, topY, t);
    // Broad leaves: this silhouette has to read as foliage next to `needles`.
    const length = d.f(20, 27) * (1 - 0.28 * t);
    for (const side of [-1, 1]) {
      shapes.push({
        d: leaf(at.x, at.y, at.angle + side * splay, length, length * d.f(0.38, 0.5)),
        fill: side < 0 ? p.ink : p.inkDeep,
      });
    }
  }
  shapes.push({
    d: leaf(tipX, topY, -90 + bend, d.f(10, 15), d.f(3.5, 5)),
    fill: p.spark,
    opacity: 0.9,
  });
  return shapes;
};

/** Whorls of leaves at intervals — oregano, marjoram, lovage. */
const whorl: Draw = (d, p) => {
  const shapes: Shape[] = [{ d: bar(50, 90, 50, 20), stroke: p.inkDeep, width: d.f(3, 4.2) }];
  const tiers = d.i(2, 3);
  for (let i = 0; i < tiers; i++) {
    const y = 32 + (i / tiers) * 46;
    const count = d.i(3, 4);
    const length = d.f(20, 27) * (1 - i * 0.1);
    for (let k = 0; k < count; k++) {
      const angle = 186 + (k / (count - 1)) * 168 + d.f(-8, 8);
      shapes.push({
        d: leaf(50, y, angle, length, length * d.f(0.36, 0.46)),
        fill: (i + k) % 2 === 0 ? p.ink : p.inkDeep,
      });
    }
  }
  return shapes;
};

/** Needles along a woody stem — rosemary, thyme, savory. */
const needles: Draw = (d, p) => {
  const bend = d.f(-10, 10);
  const cx = 50 + bend;
  const shapes: Shape[] = [
    { d: curve(50, 90, cx, 50, 50 + bend * 0.3, 14), stroke: p.inkDeep, width: d.f(3.2, 4.4) },
  ];
  const count = d.i(7, 11);
  const splay = d.f(48, 70);
  for (let i = 0; i < count; i++) {
    const t = 0.1 + (i / count) * 0.85;
    const at = onQuad(50, 90, cx, 50, 50 + bend * 0.3, 14, t);
    const length = d.f(9, 15) * (1 - 0.3 * t);
    const side = i % 2 === 0 ? -1 : 1;
    const a = (at.angle + side * splay) * DEG;
    shapes.push({
      d: bar(at.x, at.y, at.x + Math.cos(a) * length, at.y + Math.sin(a) * length),
      stroke: i % 3 === 0 ? p.spark : p.ink,
      width: d.f(2.4, 3.2),
    });
  }
  return shapes;
};

/**
 * Individual leaves, no stem — bay, curry leaf, kaffir lime leaf, shiso. The
 * one herb silhouette that is not "a stem with things along it", which is what
 * the other three all are however their leaves are shaped.
 */
const scatter: Draw = (d, p) => {
  const count = d.i(3, 4);
  const shapes: Shape[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * TAU + d.f(0, 1.2);
    const reach = d.f(9, 17);
    const length = d.f(26, 34);
    shapes.push({
      d: leaf(
        50 + Math.cos(a) * reach - Math.cos(a) * length * 0.5,
        52 + Math.sin(a) * reach - Math.sin(a) * length * 0.5,
        (a / DEG) % 360,
        length,
        length * d.f(0.32, 0.42),
      ),
      fill: i % 2 === 0 ? p.ink : p.inkDeep,
    });
  }
  shapes.push({ d: disc(50, 52, d.f(3.5, 5)), fill: p.spark, opacity: 0.7 });
  return shapes;
};

export const HERB: readonly Draw[] = [sprig, whorl, needles, scatter];

/* ----------------------------------------------------------------- sprout */

/** An unfurling coil — the classic shoot. */
const coil: Draw = (d, p) => {
  const spun = spiral(52, 54, 3, d.f(23, 30), d.f(0.75, 1.35), d.f(0, TAU));
  return [
    { d: spun.path, stroke: p.ink, width: d.f(6, 8) },
    { d: leaf(spun.endX, spun.endY, spun.endAngle, d.f(14, 21), d.f(5, 7)), fill: p.inkDeep },
    { d: disc(52, 54, 4.5), fill: p.spark },
  ];
};

/** Two shoots off one seed — bean sprouts, pea shoots, microgreens. */
const shoots: Draw = (d, p) => {
  const seedY = d.f(76, 84);
  const shapes: Shape[] = [];
  for (const side of [-1, 1]) {
    const reach = d.f(16, 26) * side;
    const topY = d.f(18, 32);
    shapes.push({
      d: curve(50, seedY, 50 + reach * 1.3, (seedY + topY) / 2, 50 + reach, topY),
      stroke: side < 0 ? p.ink : p.inkDeep,
      width: d.f(4.5, 6),
    });
    shapes.push({
      d: leaf(50 + reach, topY, -90 + side * d.f(20, 45), d.f(12, 18), d.f(4, 6)),
      fill: side < 0 ? p.inkDeep : p.ink,
    });
  }
  shapes.push({ d: disc(50, seedY, d.f(5, 7)), fill: p.spark });
  return shapes;
};

export const SPROUT: readonly Draw[] = [coil, shoots];

/* -------------------------------------------------------------------- sea */

/** Undulating bands — nori, kombu, wakame. */
const ribbon: Draw = (d, p) => {
  const amp = d.f(8, 15);
  const cycles = d.f(1.1, 2.1);
  const phase = d.f(0, TAU);
  const shapes: Shape[] = [
    { d: wave(16, 84, d.f(36, 44), amp, cycles, phase), stroke: p.ink, width: d.f(9, 13) },
    {
      d: wave(20, 80, d.f(60, 70), amp * 0.7, cycles * 1.3, phase + 1.4),
      stroke: p.inkDeep,
      width: d.f(5, 7.5),
      opacity: 0.85,
    },
  ];
  const bubbles = d.i(2, 3);
  for (let i = 0; i < bubbles; i++) {
    shapes.push({
      d: disc(d.f(22, 78), d.f(16, 30), d.f(2.6, 4.2)),
      fill: p.spark,
      opacity: 0.75,
    });
  }
  return shapes;
};

/** A branching frond — dulse, sea lettuce, samphire. */
const frond: Draw = (d, p) => {
  const bend = d.f(-12, 12);
  const shapes: Shape[] = [
    { d: curve(50, 90, 50 + bend, 50, 50 + bend * 0.4, 16), stroke: p.inkDeep, width: d.f(4, 5.5) },
  ];
  const branches = d.i(4, 6);
  for (let i = 0; i < branches; i++) {
    const t = 0.15 + (i / branches) * 0.75;
    const at = onQuad(50, 90, 50 + bend, 50, 50 + bend * 0.4, 16, t);
    const side = i % 2 === 0 ? -1 : 1;
    const reach = d.f(14, 24) * (1 - 0.25 * t);
    shapes.push({
      d: curve(
        at.x,
        at.y,
        at.x + side * reach * 0.7,
        at.y - reach * 0.2,
        at.x + side * reach,
        at.y - reach * 0.8,
      ),
      stroke: i % 3 === 0 ? p.spark : p.ink,
      width: d.f(3, 4.4),
      opacity: 0.95,
    });
  }
  return shapes;
};

export const SEA: readonly Draw[] = [ribbon, frond];
