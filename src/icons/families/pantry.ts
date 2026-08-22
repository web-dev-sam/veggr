/**
 * Silhouettes for the dry store and the sweet shelf: nuts, seeds, spices,
 * syrups.
 *
 * These categories fight the produce families' assumption that an item has a
 * distinctive outline. A peppercorn, a juniper berry and an allspice corn are
 * all "a dark sphere", eighteen ground powders are all "a heap", and a syrup
 * has no shape at all until something holds it. So the silhouettes here key
 * off how the thing is *presented* — whole, split, scattered, piled, rolled,
 * ground, poured — rather than off its botany.
 */

import { DEG, TAU, type Draw, type Shape } from "../spec.ts";
import {
  arc,
  bar,
  blob,
  cup,
  curve,
  disc,
  dome,
  leaf,
  lens,
  num,
  spiral,
  wave,
} from "../shapes.ts";

/**
 * A smooth ovoid, tall above the waist and blunt below. Two half-ellipses of
 * the same `rx` meet with matching vertical tangents, so the join is invisible
 * — which a single ellipse or a `blob` cannot give you.
 */
function egg(cx: number, cy: number, rx: number, up: number, down: number): string {
  return `${dome(cx, cy, rx, up)}${cup(cx, cy, rx, down)}`;
}

/* -------------------------------------------------------------------- nut */

/** A bare kernel with a seam down its length — almond, cashew, brazil nut, pine nut. */
const kernel: Draw = (d, p) => {
  const cy = d.f(52, 56);
  const rx = d.f(16, 19);
  const up = d.f(28, 33);
  const down = d.f(18, 22);

  return [
    { d: egg(50, cy, rx, up, down), fill: p.ink },
    {
      d: egg(50 - rx * 0.32, cy - up * 0.1, rx * 0.34, up * 0.42, down * 0.4),
      fill: p.spark,
      opacity: 0.22,
    },
    // Without the seam the kernel is just an egg; it carries the whole read.
    {
      d: curve(
        50 + d.f(-2, 2),
        cy - up * 0.8,
        50 + d.f(-7, 7),
        cy,
        50 + d.f(-2, 2),
        cy + down * 0.76,
      ),
      stroke: p.plateTo,
      width: 2.6,
      opacity: 0.6,
    },
    { d: disc(50 + d.f(-3, 3), cy + down * 0.62, d.f(3.2, 4.4)), fill: p.plateTo, opacity: 0.5 },
  ];
};

/** Meat sitting in a cracked half-shell — walnut, pecan, chestnut, hickory. */
const halfShell: Draw = (d, p) => {
  const rimY = d.f(50, 55);
  const rx = d.f(26, 30);
  const ry = d.f(22, 26);
  const meat = rx * d.f(0.62, 0.72);

  const shapes: Shape[] = [
    {
      d: blob(50, rimY - meat * 0.4, meat, meat * d.f(0.82, 0.96), d.i(6, 8), d.f(0.08, 0.16), d),
      fill: p.spark,
    },
  ];

  const folds = d.i(1, 2);
  for (let i = 0; i < folds; i++) {
    shapes.push({
      d: wave(
        50 - meat * 0.66,
        50 + meat * 0.66,
        rimY - meat * (0.78 - i * 0.4),
        d.f(2, 3.4),
        d.f(1.2, 2),
        d.f(0, TAU),
      ),
      stroke: p.inkDeep,
      width: 2.2,
      opacity: 0.6,
    });
  }

  // Shell last: its rim is what hides where the meat sinks in.
  shapes.push({ d: cup(50, rimY, rx, ry), fill: p.ink });
  shapes.push({
    d: arc(50, rimY, rx * 0.98, ry * 0.2, 180, 360),
    stroke: p.plateTo,
    width: 2.6,
    opacity: 0.5,
  });

  const ribs = d.i(2, 4);
  for (let i = 0; i < ribs; i++) {
    const a = (30 + ((i + 0.5) / ribs) * 120) * DEG;
    shapes.push({
      d: bar(
        50 + Math.cos(a) * rx * 0.44,
        rimY + Math.sin(a) * ry * 0.34,
        50 + Math.cos(a) * rx * 0.86,
        rimY + Math.sin(a) * ry * 0.84,
      ),
      stroke: p.plateTo,
      width: 2,
      opacity: 0.45,
    });
  }
  return shapes;
};

/** A round nut under a hatched cap — hazelnut, acorn, macadamia, chestnut. */
const cappedNut: Draw = (d, p) => {
  const cy = d.f(56, 60);
  const r = d.f(20, 23);
  const capY = cy - r * d.f(0.4, 0.55);
  const capR = r * d.f(1.02, 1.12);
  const capH = capR * d.f(0.5, 0.66);

  const shapes: Shape[] = [
    {
      d: bar(50, capY - capR * 0.3, 50 + d.f(-5, 5), capY - capH - d.f(7, 12)),
      stroke: p.inkDeep,
      width: 3.6,
    },
    { d: blob(50, cy, r, r * d.f(0.94, 1.06), d.i(7, 9), d.f(0.04, 0.09), d), fill: p.ink },
    { d: disc(50 - r * 0.34, cy + r * 0.12, d.f(3.4, 4.6)), fill: p.spark, opacity: 0.5 },
    { d: dome(50, capY, capR, capH), fill: p.inkDeep },
  ];

  const hatch = d.i(3, 5);
  for (let i = 0; i < hatch; i++) {
    const x = 50 + ((i + 0.5) / hatch - 0.5) * capR * 1.5;
    shapes.push({
      d: bar(x, capY - 1, x, capY - capH * d.f(0.5, 0.8)),
      stroke: p.plateTo,
      width: 2,
      opacity: 0.5,
    });
  }
  return shapes;
};

/** Two lobes pinched at a waist — peanut in its shell, pistachio pair, groundnut. */
const podShell: Draw = (d, p) => {
  const angle = d.f(-118, -62);
  const dx = Math.cos(angle * DEG);
  const dy = Math.sin(angle * DEG);
  const gap = d.f(13, 16);
  const rTop = d.f(14, 16.5);
  const rBot = rTop * d.f(0.9, 1.1);
  const topX = 50 + dx * gap;
  const topY = 50 + dy * gap;
  const botX = 50 - dx * gap;
  const botY = 50 - dy * gap;

  const shapes: Shape[] = [
    // A capsule narrower than either lobe is the pinch; all three fuse in one ink.
    { d: bar(topX, topY, botX, botY), stroke: p.ink, width: Math.min(rTop, rBot) * 1.5 },
    {
      d: blob(topX, topY, rTop, rTop * d.f(0.92, 1.06), d.i(7, 9), d.f(0.05, 0.11), d),
      fill: p.ink,
    },
    {
      d: blob(botX, botY, rBot, rBot * d.f(0.92, 1.06), d.i(7, 9), d.f(0.05, 0.11), d),
      fill: p.ink,
    },
  ];

  const ticks = d.i(2, 3);
  for (let i = 0; i < ticks; i++) {
    const t = ticks === 1 ? 0 : (i / (ticks - 1)) * 2 - 1;
    const cx = 50 + dx * gap * t * 0.62;
    const cy = 50 + dy * gap * t * 0.62;
    const reach = rTop * d.f(0.5, 0.68);
    shapes.push({
      d: bar(cx + dy * reach, cy - dx * reach, cx - dy * reach, cy + dx * reach),
      stroke: p.plateTo,
      width: 2.2,
      opacity: 0.5,
    });
  }
  shapes.push({
    d: disc(topX + dx * rTop * 0.55, topY + dy * rTop * 0.55, d.f(3, 4)),
    fill: p.inkDeep,
    opacity: 0.65,
  });
  return shapes;
};

export const NUT: readonly Draw[] = [kernel, halfShell, cappedNut, podShell];

/* ------------------------------------------------------------------- seed */

/** Loose seeds lying every which way — sesame, poppy, chia, flax, hemp. */
const scatter: Draw = (d, p) => {
  const count = d.i(6, 8);
  const spin = d.f(0, 360);
  const shapes: Shape[] = [];

  for (let i = 0; i < count; i++) {
    const a = (spin + (i / count) * 360 + d.f(-18, 18)) * DEG;
    const reach = d.f(11, 23);
    shapes.push({
      d: lens(
        50 + Math.cos(a) * reach,
        50 + Math.sin(a) * reach * 0.92,
        d.f(0, 180),
        d.f(13, 18),
        d.f(9, 12),
      ),
      fill: i % 2 === 0 ? p.ink : p.inkDeep,
    });
  }
  // One in the middle: a bare ring reads as a hole at 32px.
  shapes.push({
    d: lens(50 + d.f(-4, 4), 50 + d.f(-4, 4), d.f(0, 180), d.f(12, 16), d.f(8.5, 11)),
    fill: p.ink,
  });
  return shapes;
};

/** One seed drawn large, striped down the husk — sunflower, pumpkin, melon. */
const striped: Draw = (d, p) => {
  const angle = d.f(-104, -76);
  const dx = Math.cos(angle * DEG);
  const dy = Math.sin(angle * DEG);
  const len = d.f(56, 63);
  const wide = d.f(30, 37);
  const half = wide / 2;
  const cy = d.f(48, 51);

  const shapes: Shape[] = [
    // Blunting one tip turns the lens into a seed instead of a petal.
    { d: disc(50 - dx * len * 0.42, cy - dy * len * 0.42, half * 0.5), fill: p.ink },
    { d: lens(50, cy, angle, len, wide), fill: p.ink },
  ];

  const stripes = d.i(2, 3);
  for (let i = 0; i < stripes; i++) {
    const t = stripes === 1 ? 0 : (i / (stripes - 1)) * 2 - 1;
    const off = t * half * 0.52;
    shapes.push({
      d: bar(
        50 - dx * len * 0.3 - dy * off,
        cy - dy * len * 0.3 + dx * off,
        50 + dx * len * 0.34 - dy * off,
        cy + dy * len * 0.34 + dx * off,
      ),
      stroke: p.plateTo,
      width: 2.6,
      opacity: 0.55,
    });
  }
  shapes.push({
    d: lens(50 - dy * half * 0.5, cy + dx * half * 0.5, angle, len * 0.5, wide * 0.2),
    fill: p.spark,
    opacity: 0.3,
  });
  return shapes;
};

/** A heap whose outline is made of the grains themselves — mixed seeds by the spoon. */
const pile: Draw = (d, p) => {
  const baseY = d.f(69, 73);
  const rise = d.f(12, 14);
  const counts = [d.i(4, 5), 3, d.i(1, 2)];
  const shapes: Shape[] = [
    {
      d: bar(50 - 24, baseY + 5, 50 + 24, baseY + 5),
      stroke: p.plateTo,
      width: 2.4,
      opacity: 0.4,
    },
  ];

  for (let row = 0; row < counts.length; row++) {
    const n = counts[row]!;
    const y = baseY - row * rise;
    const spread = 24 - row * 8;
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0 : (i / (n - 1)) * 2 - 1;
      shapes.push({
        d: lens(
          50 + t * spread + d.f(-2, 2),
          y + d.f(-2, 2),
          d.f(-32, 32),
          d.f(17, 21),
          d.f(8, 10.5),
        ),
        fill: (row + i) % 2 === 0 ? p.ink : p.inkDeep,
      });
    }
  }
  return shapes;
};

/**
 * Seeds packed into one head — sunflower head, lotus pod, poppy head. Every
 * third seed rides the rim: a fully contained ring leaves a plain disc, which
 * is the one outline this family cannot afford at 32px.
 */
const seedHead: Draw = (d, p) => {
  const cy = d.f(48, 52);
  const r = d.f(25, 29);
  const count = d.i(7, 9);
  const spin = d.f(0, 360);
  const shapes: Shape[] = [
    { d: blob(50, cy, r, r * d.f(0.92, 1.04), d.i(7, 9), d.f(0.04, 0.09), d), fill: p.ink },
  ];

  for (let i = 0; i < count; i++) {
    const a = spin + (i / count) * 360;
    const reach = r * (i % 3 === 0 ? 1.02 : 0.56);
    shapes.push({
      d: lens(
        50 + Math.cos(a * DEG) * reach,
        cy + Math.sin(a * DEG) * reach,
        a + 90,
        d.f(13, 16),
        d.f(7, 9.5),
      ),
      fill: p.inkDeep,
    });
  }
  shapes.push({
    d: lens(50 + d.f(-3, 3), cy + d.f(-3, 3), d.f(0, 180), d.f(12, 15), d.f(6, 8)),
    fill: p.inkDeep,
  });
  shapes.push({
    d: arc(50, cy, r * 0.8, r * 0.8, 202, 338),
    stroke: p.plateTo,
    width: 2.2,
    opacity: 0.45,
  });
  return shapes;
};

export const SEED: readonly Draw[] = [scatter, striped, pile, seedHead];

/* ------------------------------------------------------------------ spice */

/** A heap of ground powder dusted with its own grain — paprika, turmeric, curry, sumac. */
const mound: Draw = (d, p) => {
  const baseY = d.f(68, 72);
  const rx = d.f(28, 32);
  const ry = d.f(24, 29);

  const shapes: Shape[] = [
    { d: dome(50, baseY, rx, ry), fill: p.ink },
    // A second peak in the same ink fuses into one lopsided heap.
    { d: dome(50 + d.f(-10, 10), baseY, rx * d.f(0.5, 0.68), ry * d.f(0.72, 1.02)), fill: p.ink },
    { d: cup(50, baseY, rx, d.f(3, 5.5)), fill: p.ink },
  ];

  const grains = d.i(4, 6);
  for (let i = 0; i < grains; i++) {
    const a = d.f(190, 350) * DEG;
    const k = d.f(0.2, 0.72);
    shapes.push({
      d: disc(50 + Math.cos(a) * rx * k, baseY + Math.sin(a) * ry * k, d.f(2.4, 3.6)),
      fill: p.spark,
      opacity: 0.45,
    });
  }

  const spills = d.i(2, 3);
  for (let i = 0; i < spills; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    shapes.push({
      d: disc(50 + side * d.f(rx * 0.8, rx * 1.1), baseY + d.f(3, 7), d.f(2.6, 4)),
      fill: p.inkDeep,
      opacity: 0.8,
    });
  }
  return shapes;
};

/** Whole corns of uneven size, each speckled — black pepper, allspice, juniper, coriander. */
const corns: Draw = (d, p) => {
  const count = d.i(3, 4);
  const spin = d.f(0, 360);
  const seats = Array.from({ length: count }, (_, i) => {
    const a = (spin + (i / count) * 360 + d.f(-20, 20)) * DEG;
    const reach = d.f(13, 18);
    return {
      x: 50 + Math.cos(a) * reach,
      y: 50 + Math.sin(a) * reach * 0.9,
      r: d.f(10.5, 15),
    };
  });

  const shapes: Shape[] = [];
  for (let i = 0; i < seats.length; i++) {
    const s = seats[i]!;
    shapes.push({
      d: blob(s.x, s.y, s.r, s.r * d.f(0.9, 1.08), d.i(6, 8), d.f(0.07, 0.14), d),
      fill: i % 2 === 0 ? p.ink : p.inkDeep,
    });
  }
  for (const s of seats) {
    shapes.push({
      d: arc(s.x, s.y, s.r * 0.62, s.r * 0.62, 205, 335),
      stroke: p.plateTo,
      width: 2,
      opacity: 0.45,
    });
    shapes.push({
      d: disc(s.x + s.r * d.f(-0.35, 0.35), s.y + s.r * d.f(0.1, 0.45), d.f(2.4, 3.2)),
      fill: p.spark,
      opacity: 0.55,
    });
  }
  return shapes;
};

/** A rolled stick with the curl showing at the cut — cinnamon, vanilla, liquorice, lemongrass. */
const quill: Draw = (d, p) => {
  const angle = d.f(-108, -72);
  const dx = Math.cos(angle * DEG);
  const dy = Math.sin(angle * DEG);
  const half = d.f(25, 29);
  const w = d.f(13, 17);
  const tipX = 50 + dx * half;
  const tipY = 50 + dy * half;
  const lean = (angle + d.f(16, 28)) * DEG;
  // Offset sideways, or the back stick hides behind the front one entirely.
  const side = d.odds(0.5) ? 1 : -1;
  const bx = 50 - dy * w * side * d.f(0.6, 0.85);
  const by = 50 + dx * w * side * d.f(0.6, 0.85);

  const shapes: Shape[] = [
    {
      d: bar(
        bx - Math.cos(lean) * half * 0.88,
        by - Math.sin(lean) * half * 0.88,
        bx + Math.cos(lean) * half * 0.84,
        by + Math.sin(lean) * half * 0.84,
      ),
      stroke: p.inkDeep,
      width: w * d.f(0.5, 0.66),
    },
    { d: bar(50 - dx * half, 50 - dy * half, tipX, tipY), stroke: p.ink, width: w },
  ];

  const seams = d.i(1, 2);
  for (let i = 0; i < seams; i++) {
    const off = (i === 0 ? -1 : 1) * w * d.f(0.16, 0.26);
    shapes.push({
      d: bar(
        50 - dx * half * 0.66 - dy * off,
        50 - dy * half * 0.66 + dx * off,
        50 + dx * half * 0.7 - dy * off,
        50 + dy * half * 0.7 + dx * off,
      ),
      stroke: p.plateTo,
      width: 2.2,
      opacity: 0.5,
    });
  }
  shapes.push({
    d: spiral(tipX, tipY, 1.6, w * 0.36, d.f(1.2, 1.6), d.f(0, TAU)).path,
    stroke: p.plateTo,
    width: 2.2,
    opacity: 0.75,
  });
  return shapes;
};

/** Points radiating from a hub — star anise, clove, mace blades. */
const star: Draw = (d, p) => {
  const points = d.i(6, 8);
  const cy = d.f(48, 52);
  const hub = d.f(9, 12);
  const reach = d.f(20, 25);
  const spin = d.f(0, 360);
  const shapes: Shape[] = [];

  for (let i = 0; i < points; i++) {
    shapes.push({
      d: leaf(50, cy, spin + (i / points) * 360, hub + reach, d.f(9, 13)),
      fill: i % 2 === 0 ? p.ink : p.inkDeep,
    });
  }
  shapes.push({ d: disc(50, cy, hub), fill: p.ink });
  shapes.push({ d: disc(50, cy, hub * d.f(0.42, 0.56)), fill: p.spark, opacity: 0.6 });
  return shapes;
};

/** A pair of dried pods hanging by their stalks — chilli, cardamom, tamarind. */
const pods: Draw = (d, p) => {
  const rootY = d.f(28, 32);
  const lean = d.f(16, 30);
  const specs = [
    { x: 50 - d.f(6, 10), a: 90 - lean, len: d.f(42, 49), w: d.f(15, 20), fill: p.ink },
    { x: 50 + d.f(6, 10), a: 90 + lean, len: d.f(35, 43), w: d.f(13, 17), fill: p.inkDeep },
  ];

  const shapes: Shape[] = [];
  for (const s of specs) {
    // Stalk first: the pod's shoulder is broad enough to swallow the join.
    shapes.push({
      d: bar(s.x, rootY, s.x + d.f(-4, 4), rootY - d.f(9, 14)),
      stroke: p.spark,
      width: 3,
      opacity: 0.85,
    });
    shapes.push({ d: leaf(s.x, rootY, s.a, s.len, s.w), fill: s.fill });
  }

  const front = specs[0]!;
  const fdx = Math.cos(front.a * DEG);
  const fdy = Math.sin(front.a * DEG);
  shapes.push({
    d: curve(
      front.x + fdx * front.len * 0.18,
      rootY + fdy * front.len * 0.18,
      front.x + fdx * front.len * 0.5 + d.f(-5, 5),
      rootY + fdy * front.len * 0.5,
      front.x + fdx * front.len * 0.86,
      rootY + fdy * front.len * 0.86,
    ),
    stroke: p.plateTo,
    width: 2.4,
    opacity: 0.55,
  });
  return shapes;
};

export const SPICE: readonly Draw[] = [mound, corns, quill, star, pods];

/* ------------------------------------------------------------------ sweet */

/** Regular hexagon, pointy top and bottom, so a row of them tiles as a comb. */
function hexagon(cx: number, cy: number, r: number): string {
  let path = "";
  for (let i = 0; i < 6; i++) {
    const a = (i * 60 + 30) * DEG;
    path += `${i === 0 ? "M" : "L"}${num(cx + Math.cos(a) * r)} ${num(cy + Math.sin(a) * r)}`;
  }
  return `${path}Z`;
}

/** A thread breaking into a drop above its own pool — the class's one universal. */
const pour: Draw = (d, p) => {
  const baseY = d.f(70, 74);
  const rx = d.f(26, 31);
  const lift = d.f(7, 9);
  const topY = d.f(15, 19);
  const lean = d.f(-6, 6);
  const surface = baseY - lift;
  // The thread stops well short of the pool and a loose drop covers the gap.
  // Run it all the way down and the glyph reads as a stalk on a mound.
  const cut = surface - d.f(20, 26);

  const shapes: Shape[] = [
    // Pool: a low dome closed by a shallow cup, so the underside reads as
    // liquid sitting on a surface rather than a slice through a ball.
    { d: dome(50, baseY, rx, lift), fill: p.ink },
    { d: cup(50, baseY, rx, d.f(3, 5)), fill: p.ink },
    {
      d: curve(50 + lean * 1.8, topY, 50 + lean * 2.4, (topY + cut) / 2, 50 + lean, cut),
      stroke: p.ink,
      width: d.f(5, 6.5),
    },
    { d: leaf(50 + lean, cut + d.f(7, 10), 90, d.f(11, 14), d.f(4, 5.2)), fill: p.ink },
    {
      d: arc(50, surface + lift * 0.5, rx * 0.5, lift * 0.45, 200, 340),
      stroke: p.spark,
      width: 2.4,
      opacity: 0.55,
    },
  ];

  // Beads that ran ahead of the pool: the two ends are what say "spreading".
  for (const side of [-1, 1]) {
    shapes.push({
      d: disc(50 + side * rx * d.f(0.86, 1.08), baseY - d.f(0, 3), d.f(2.8, 4.2)),
      fill: p.inkDeep,
    });
  }
  return shapes;
};

/** An ovoid pot under its lid, filled to a line — honey, treacle, anything by the spoon. */
const pot: Draw = (d, p) => {
  const cy = d.f(58, 62);
  const rx = d.f(21, 25);
  const up = d.f(19, 23);
  const down = d.f(22, 26);
  const lidY = cy - up - d.f(2, 4);
  const lidHalf = rx * d.f(0.74, 0.88);

  return [
    { d: egg(50, cy, rx, up, down), fill: p.ink },
    // The fill line is what separates a pot from a plain egg at 32px.
    {
      d: wave(
        50 - rx * 0.84,
        50 + rx * 0.84,
        cy - up * 0.36,
        d.f(1.6, 2.6),
        d.f(1, 1.6),
        d.f(0, TAU),
      ),
      stroke: p.spark,
      width: 2.6,
      opacity: 0.6,
    },
    { d: disc(50 - rx * 0.4, cy + down * 0.14, d.f(3.4, 4.6)), fill: p.spark, opacity: 0.4 },
    { d: bar(50 - lidHalf, lidY, 50 + lidHalf, lidY), stroke: p.inkDeep, width: d.f(6, 8) },
    { d: disc(50 + d.f(-2, 2), lidY - d.f(6, 9), d.f(3, 4.2)), fill: p.inkDeep },
  ];
};

/** Cells of comb with one of them running — honey at its most recognisable. */
const comb: Draw = (d, p) => {
  const r = d.f(14.5, 17);
  const step = r * Math.sqrt(3);
  // Axial cells, nearest first: taking a prefix always leaves the cluster joined.
  const cells: readonly [number, number][] = [
    [0, 0],
    [1, 0],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [1, -1],
  ];
  const count = d.i(4, 6);
  const cx = 50 - d.f(4, 10);
  const cy = 50 - d.f(2, 8);

  const seats = cells.slice(0, count).map(([q, s]) => ({
    x: cx + (q + s / 2) * step,
    y: cy + s * r * 1.5,
  }));

  const shapes: Shape[] = seats.map((seat, i) => ({
    d: hexagon(seat.x, seat.y, r * 0.93),
    fill: i % 2 === 0 ? p.ink : p.inkDeep,
  }));

  const full = seats[d.i(0, seats.length - 1)]!;
  shapes.push({ d: hexagon(full.x, full.y, r * 0.52), fill: p.spark, opacity: 0.6 });

  const low = seats.reduce((a, b) => (b.y > a.y ? b : a));
  shapes.push({
    d: bar(low.x, low.y + r * 0.8, low.x + d.f(-2, 2), low.y + r * 1.5),
    stroke: p.ink,
    width: 3.4,
  });
  shapes.push({ d: disc(low.x + d.f(-2, 2), low.y + r * 1.8, d.f(4, 5.4)), fill: p.ink });
  return shapes;
};

/** A pressed cone with a chunk broken off — jaggery, palm sugar, carob in a block. */
const loaf: Draw = (d, p) => {
  const baseY = d.f(74, 78);
  const topY = d.f(28, 34);
  const half = d.f(24, 28);
  const crown = half * d.f(0.3, 0.42);
  const cap = d.f(7, 10);
  const cx = 50 - d.f(2, 7);

  const body =
    `M${num(cx - half)} ${num(baseY)}` +
    `L${num(cx - crown)} ${num(topY)}` +
    `Q${num(cx)} ${num(topY - cap)} ${num(cx + crown)} ${num(topY)}` +
    `L${num(cx + half)} ${num(baseY)}Z`;

  const shapes: Shape[] = [
    { d: body, fill: p.ink },
    { d: cup(cx, baseY, half, d.f(4, 6)), fill: p.ink },
    // Broken chunk: the cone alone is a triangle, and a triangle is a plate.
    {
      d: blob(
        cx + half * d.f(1.08, 1.24),
        baseY - d.f(5, 9),
        d.f(7.5, 10),
        d.f(6.5, 9),
        d.i(5, 7),
        d.f(0.1, 0.2),
        d,
      ),
      fill: p.inkDeep,
    },
  ];

  const grains = d.i(3, 5);
  for (let i = 0; i < grains; i++) {
    const k = d.f(0.25, 0.9);
    shapes.push({
      d: disc(cx + d.f(-1, 1) * half * (1 - k) * 0.8, topY + (baseY - topY) * k, d.f(2.2, 3.2)),
      fill: p.spark,
      opacity: 0.45,
    });
  }
  return shapes;
};

/** Ridges stacked on a stick, one drip hanging off it — the dipper. */
const dipper: Draw = (d, p) => {
  const tilt = d.f(-14, 14);
  const dx = Math.sin(tilt * DEG);
  const dy = Math.cos(tilt * DEG);
  const headStart = d.f(0.4, 0.48);
  const span = d.f(58, 64);
  const x0 = 50 - dx * span * 0.5;
  const y0 = d.f(14, 18);
  const at = (t: number): [number, number] => [x0 + dx * span * t, y0 + dy * span * t];

  const [hx, hy] = at(headStart);
  const [tx, ty] = at(1);
  const shapes: Shape[] = [
    { d: bar(x0, y0, hx, hy), stroke: p.inkDeep, width: d.f(4, 5) },
    // Head core: without a body behind them the ridges read as loose beads.
    { d: bar(hx, hy, tx, ty), stroke: p.inkDeep, width: d.f(9, 11) },
  ];

  // Ridges run *across* the shaft — that crosswise repeat is the whole read.
  const ridges = d.i(3, 4);
  for (let i = 0; i < ridges; i++) {
    const [x, y] = at(headStart + ((i + 0.5) / ridges) * (1 - headStart) * 0.94);
    shapes.push({
      d: lens(x, y, tilt, d.f(20, 25), d.f(6, 7.5)),
      fill: i % 2 === 0 ? p.ink : p.inkDeep,
    });
  }

  const dripY = ty + d.f(6, 10);
  shapes.push({ d: leaf(tx, ty + 2, 90, dripY - ty, d.f(3.4, 4.6)), fill: p.ink });
  shapes.push({ d: disc(tx + d.f(-2, 2), dripY + d.f(3, 6), d.f(3, 4.2)), fill: p.spark });
  return shapes;
};

export const SWEET: readonly Draw[] = [pour, pot, comb, loaf, dipper];
