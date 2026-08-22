/**
 * Silhouettes for what grows underground plus the stalks and fungi: roots,
 * tubers, bulbs, stems, mushrooms.
 */

import { DEG, TAU, type Draw, type Shape } from "../spec.ts";
import { arc, bar, blob, curve, disc, dome, leaf, lens, taper, wave } from "../shapes.ts";

/* ------------------------------------------------------------------- root */

/** A taproot with a leaf crown — carrot, parsnip, salsify. */
const taproot: Draw = (d, p) => {
  const y0 = d.f(32, 38);
  const y1 = d.f(80, 88);
  const half = d.f(12, 17);
  const shapes: Shape[] = [];

  const crown = d.i(2, 3);
  for (let i = 0; i < crown; i++) {
    const t = crown === 1 ? 0 : (i / (crown - 1)) * 2 - 1;
    shapes.push({
      d: leaf(50, y0 - 2, -90 + t * d.f(24, 44), d.f(15, 23), d.f(4, 6.5)),
      fill: p.spark,
      opacity: 0.85,
    });
  }

  shapes.push({ d: taper(50, y0, y1, half, d.f(5, 10)), fill: p.ink });
  shapes.push({
    d: taper(50, y0 + 4, y1 - 8, half * 0.42, 3),
    fill: p.spark,
    opacity: 0.22,
  });

  const hairs = d.i(2, 4);
  for (let i = 0; i < hairs; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const y = y0 + (y1 - y0) * d.f(0.35, 0.8);
    shapes.push({
      d: bar(50 + side * half * 0.5, y, 50 + side * (half + d.f(7, 13)), y + d.f(3, 9)),
      stroke: p.spark,
      width: 2,
      opacity: 0.5,
    });
  }
  return shapes;
};

/** A round body over a short tail with a leaf tuft — beetroot, turnip, radish, swede. */
const bulbRoot: Draw = (d, p) => {
  const cy = d.f(48, 52);
  const rx = d.f(19, 23);
  const ry = d.f(17, 20);
  const hearted = d.odds(0.5);
  const shapes: Shape[] = [];

  // Tuft and tail go first: both hang off the body, so the body edge covers the joins.
  const crown = d.i(2, 3);
  for (let i = 0; i < crown; i++) {
    const t = crown === 1 ? 0 : (i / (crown - 1)) * 2 - 1;
    shapes.push({
      d: leaf(50 + t * rx * 0.22, cy - ry * 0.86, -90 + t * d.f(24, 42), d.f(11, 16), d.f(3.2, 5)),
      fill: p.spark,
      opacity: 0.85,
    });
  }
  shapes.push({
    d: taper(50 + d.f(-3, 3), cy + ry * 0.68, d.f(80, 87), d.f(4.5, 6.5), 2),
    fill: p.inkDeep,
  });

  shapes.push({ d: blob(50, cy, rx, ry, d.i(6, 8), d.f(0.05, 0.1), d), fill: p.ink });
  if (hearted) {
    // A second shoulder in the same ink fuses into one wider, heart-lobed outline.
    shapes.push({
      d: dome(50, cy + ry * 0.12, rx * d.f(0.96, 1.04), ry * d.f(0.8, 0.95)),
      fill: p.ink,
    });
  }
  shapes.push({
    d: arc(50, cy - ry * 0.1, rx * 0.72, ry * 0.72, 196, 344),
    stroke: p.plateTo,
    width: 2.4,
    opacity: 0.45,
  });
  shapes.push({
    d: disc(50 - rx * 0.34, cy - ry * 0.3, d.f(3.4, 4.6)),
    fill: p.spark,
    opacity: 0.55,
  });
  return shapes;
};

/** Knobbly lobes branching off one palm — ginger, turmeric, galangal, lotus root. */
const rhizome: Draw = (d, p) => {
  const cx = 50 + d.f(-2, 2);
  const cy = d.f(56, 62);
  const rx = d.f(14, 17);
  const ry = d.f(12, 15);
  const spin = d.f(-150, -110);
  const step = d.f(38, 58);
  const arms = Array.from({ length: d.i(2, 3) }, (_, i) => {
    const a = (spin + i * step) * DEG;
    const reach = d.f(15, 19);
    return {
      x: cx + Math.cos(a) * reach,
      y: cy + Math.sin(a) * reach,
      px: -Math.sin(a),
      py: Math.cos(a),
      r: d.f(9, 11.5),
    };
  });

  const shapes: Shape[] = [];
  for (const arm of arms) {
    shapes.push({
      d: blob(arm.x, arm.y, arm.r, arm.r * d.f(0.85, 1.05), d.i(5, 7), d.f(0.1, 0.18), d),
      fill: p.inkDeep,
    });
  }
  shapes.push({ d: blob(cx, cy, rx, ry, d.i(6, 8), d.f(0.08, 0.16), d), fill: p.ink });
  for (const arm of arms) {
    const mx = (cx + arm.x) / 2;
    const my = (cy + arm.y) / 2;
    const len = d.f(6, 9);
    shapes.push({
      d: bar(mx - arm.px * len, my - arm.py * len, mx + arm.px * len, my + arm.py * len),
      stroke: p.plateTo,
      width: 2.2,
      opacity: 0.5,
    });
  }
  shapes.push({
    d: disc(cx - rx * 0.3, cy + ry * 0.2, d.f(3, 4.2)),
    fill: p.spark,
    opacity: 0.5,
  });
  return shapes;
};

export const ROOT: readonly Draw[] = [taproot, bulbRoot, rhizome];

/* ------------------------------------------------------------------ tuber */

/** A lumpy storage organ — potato, yam, taro. */
const lump: Draw = (d, p) => {
  const rx = d.f(26, 31);
  const ry = d.f(22, 27);
  const shapes: Shape[] = [
    { d: blob(50, 52, rx, ry, d.i(6, 8), d.f(0.08, 0.18), d), fill: p.ink },
    {
      d: blob(53, 56, rx * 0.62, ry * 0.62, d.i(5, 7), d.f(0.1, 0.2), d),
      fill: p.inkDeep,
      opacity: 0.4,
    },
  ];
  const eyes = d.i(2, 4);
  for (let i = 0; i < eyes; i++) {
    const a = d.f(0, TAU);
    const r = d.f(0.15, 0.55);
    shapes.push({
      d: disc(50 + Math.cos(a) * rx * r, 52 + Math.sin(a) * ry * r, d.f(2.2, 3.4)),
      fill: p.plateTo,
      opacity: 0.85,
    });
  }
  return shapes;
};

/** A long body lying at a slant — sweet potato, yam, cassava. */
const oblong: Draw = (d, p) => {
  const angle = d.f(-25, 25);
  const length = d.f(52, 62);
  const width = d.f(13, 16.5);
  const cy = d.f(48, 54);
  const dx = Math.cos(angle * DEG);
  const dy = Math.sin(angle * DEG);
  const nx = -dy;
  const ny = dx;

  const shapes: Shape[] = [
    { d: lens(50, cy, angle, length, width), fill: p.ink },
    {
      d: lens(50 + dx * 3 + nx * 3, cy + dy * 3 + ny * 3, angle, length * 0.72, width * 0.5),
      fill: p.inkDeep,
      opacity: 0.45,
    },
  ];
  const eyes = d.i(3, 5);
  for (let i = 0; i < eyes; i++) {
    const t = ((i + 0.5) / eyes - 0.5) * length * 0.72;
    const off = d.f(-0.4, 0.4) * width;
    shapes.push({
      d: disc(50 + dx * t + nx * off, cy + dy * t + ny * off, d.f(2.2, 3.4)),
      fill: p.plateTo,
      opacity: 0.85,
    });
  }
  const lit = width * 0.42;
  shapes.push({
    d: bar(
      50 - dx * length * 0.3 - nx * lit,
      cy - dy * length * 0.3 - ny * lit,
      50 + dx * length * 0.12 - nx * lit,
      cy + dy * length * 0.12 - ny * lit,
    ),
    stroke: p.spark,
    width: 2.4,
    opacity: 0.5,
  });
  return shapes;
};

/** Small tubers touching in a clump — new potatoes, jerusalem artichoke, oca, water chestnut. */
const cluster: Draw = (d, p) => {
  const count = d.i(3, 4);
  const spin = d.f(0, 360);
  const cy = d.f(50, 54);
  const ring = count === 3 ? d.f(12.5, 15) : d.f(14, 17);
  const tubers = Array.from({ length: count }, (_, i) => {
    const a = (spin + (i / count) * 360) * DEG;
    return {
      x: 50 + Math.cos(a) * ring,
      y: cy + Math.sin(a) * ring,
      r: d.f(0.72, 1),
    };
  });
  // Radii are drawn as relative weights, then normalised: a clump that happened
  // to roll four small lobes would have nothing left to read at 32px.
  const target = count === 3 ? d.f(12, 13.5) : d.f(10.5, 12);
  const peak = Math.max(...tubers.map((t) => t.r));
  for (const tuber of tubers) tuber.r = (tuber.r / peak) * target;
  // Biggest last so one tuber reads as the front of the clump.
  tubers.sort((a, b) => a.r - b.r);

  const shapes: Shape[] = [];
  for (const [i, tuber] of tubers.entries()) {
    shapes.push({
      d: blob(tuber.x, tuber.y, tuber.r, tuber.r * d.f(0.88, 1.06), d.i(6, 8), d.f(0.07, 0.15), d),
      fill: i === tubers.length - 1 ? p.ink : p.inkDeep,
    });
  }
  const front = tubers.at(-1)!;
  shapes.push({
    d: disc(front.x - front.r * 0.32, front.y - front.r * 0.34, d.f(2.6, 3.6)),
    fill: p.spark,
    opacity: 0.6,
  });
  const eyes = d.i(2, 3);
  for (let i = 0; i < eyes; i++) {
    const tuber = d.pick(tubers);
    const a = d.f(0, TAU);
    const rr = d.f(0.2, 0.55);
    shapes.push({
      d: disc(
        tuber.x + Math.cos(a) * tuber.r * rr,
        tuber.y + Math.sin(a) * tuber.r * rr,
        d.f(2, 3),
      ),
      fill: p.plateTo,
      opacity: 0.8,
    });
  }
  return shapes;
};

export const TUBER: readonly Draw[] = [lump, oblong, cluster];

/* ----------------------------------------------------------------- allium */

/** Concentric layers with a cut gap — onion, garlic, shallot. */
const layers: Draw = (d, p) => {
  const cy = d.f(54, 60);
  const rings = d.i(3, 5);
  const gap = d.f(28, 58);
  const gapAt = d.f(0, 360);
  const step = d.f(5.5, 7.5);
  const shapes: Shape[] = [];

  const outer = 10 + (rings - 1) * step;
  shapes.push({
    d: curve(50, cy - outer, 50 + d.f(-10, 10), d.f(26, 38), 50 + d.f(-14, 14), d.f(10, 18)),
    stroke: p.inkDeep,
    width: d.f(3.5, 5),
  });
  for (let i = rings - 1; i >= 0; i--) {
    const r = 10 + i * step;
    shapes.push({
      d: arc(50, cy, r, r * d.f(0.94, 1.06), gapAt + gap / 2, gapAt + 360 - gap / 2),
      stroke: i % 2 === 0 ? p.ink : p.inkDeep,
      width: d.f(3.4, 4.8),
    });
  }
  shapes.push({ d: disc(50, cy, 4.5), fill: p.spark });
  return shapes;
};

/** A bulb trailing long shoots — spring onion, welsh onion, garlic scapes. */
const bulbAndShoots: Draw = (d, p) => {
  const cy = d.f(68, 73);
  const rx = d.f(13, 17);
  const ry = d.f(11, 14);
  const count = d.i(2, 4);
  const spread = d.f(9, 15);
  // A two-shoot pair drawn at the full spread reads as a fork, so narrow the
  // splay when there are few shoots and let the bulb stay the dominant mass.
  const splay = count === 2 ? 0.55 : 1;
  const shapes: Shape[] = [];

  const roots = d.i(2, 3);
  for (let i = 0; i < roots; i++) {
    const t = roots === 1 ? 0 : (i / (roots - 1)) * 2 - 1;
    const y = cy + ry * 0.62;
    shapes.push({
      d: bar(50 + t * rx * 0.28, y, 50 + t * rx * 0.44, y + d.f(4, 6.5)),
      stroke: p.spark,
      width: 1.8,
      opacity: 0.55,
    });
  }

  for (let i = 0; i < count; i++) {
    const t = (count === 1 ? 0 : (i / (count - 1)) * 2 - 1) * splay;
    const tipY = d.f(19, 27) + Math.abs(t) * d.f(2, 8);
    shapes.push({
      d: curve(
        50 + t * rx * 0.3,
        cy - ry * 0.4,
        50 + t * spread * 0.9,
        (cy + tipY) / 2,
        50 + t * spread,
        tipY,
      ),
      stroke: i % 2 === 0 ? p.ink : p.inkDeep,
      width: d.f(4.5, 6.5),
    });
  }

  shapes.push({ d: blob(50, cy, rx, ry, d.i(6, 8), d.f(0.05, 0.11), d), fill: p.ink });
  shapes.push({
    d: arc(50, cy + ry * 0.15, rx * 0.6, ry * 0.6, 180, 360),
    stroke: p.plateTo,
    width: 2.2,
    opacity: 0.5,
  });
  shapes.push({
    d: bar(50 - rx * 0.72, cy - ry * 0.55, 50 + rx * 0.72, cy - ry * 0.55),
    stroke: p.plateTo,
    width: 2.2,
    opacity: 0.45,
  });
  return shapes;
};

/** Nested sheaths banded across the middle — leek, elephant garlic. */
const sheath: Draw = (d, p) => {
  const cy = d.f(55, 58);
  const length = d.f(50, 57);
  const width = d.f(11, 14);
  const topY = cy - length / 2;
  const shapes: Shape[] = [];

  const blades = d.i(2, 4);
  for (let i = 0; i < blades; i++) {
    const t = blades === 1 ? 0 : (i / (blades - 1)) * 2 - 1;
    shapes.push({
      d: leaf(50 + t * width * 0.3, topY + 4, -90 + t * d.f(22, 44), d.f(11, 16), d.f(3.4, 5)),
      fill: i % 2 === 0 ? p.inkDeep : p.spark,
      opacity: i % 2 === 0 ? 1 : 0.85,
    });
  }

  shapes.push({ d: lens(50, cy, -90, length, width), fill: p.ink });
  const inner = d.i(1, 2);
  for (let i = 0; i < inner; i++) {
    shapes.push({
      d: lens(
        50 + d.f(-2, 2),
        cy + d.f(-3, 3),
        -90,
        length * (0.86 - i * 0.14),
        width * (0.72 - i * 0.28),
      ),
      fill: i === 0 ? p.inkDeep : p.spark,
      opacity: i === 0 ? 0.55 : 0.35,
    });
  }
  const bands = d.i(1, 2);
  for (let i = 0; i < bands; i++) {
    const by = cy + (i - (bands - 1) / 2) * d.f(9, 14) + d.f(-3, 3);
    shapes.push({
      d: bar(50 - width * 0.92, by, 50 + width * 0.92, by),
      stroke: p.plateTo,
      width: 2.8,
      opacity: 0.5,
    });
  }
  return shapes;
};

export const ALLIUM: readonly Draw[] = [layers, bulbAndShoots, sheath];

/* ------------------------------------------------------------------- stem */

/** A bundle of stalks — celery, asparagus, rhubarb. */
const stalks: Draw = (d, p) => {
  const count = d.i(3, 4);
  const gap = d.f(8, 11.5);
  const tipped = d.odds(0.5);
  const shapes: Shape[] = [];
  for (let i = 0; i < count; i++) {
    const offset = i - (count - 1) / 2;
    const x = 50 + offset * gap;
    const topY = d.f(20, 32);
    const tilt = offset * d.f(1.5, 4);
    shapes.push({
      d: bar(x, 88, x + tilt, topY),
      stroke: i % 2 === 0 ? p.ink : p.inkDeep,
      width: d.f(6, 8),
    });
    if (tipped) {
      shapes.push({
        d: leaf(x + tilt, topY, -90 + tilt * 2, d.f(9, 14), d.f(3.5, 5)),
        fill: p.spark,
        opacity: 0.9,
      });
    }
  }
  const span = gap * count * 0.42;
  shapes.push({
    d: bar(50 - span, d.f(62, 72), 50 + span, d.f(62, 72)),
    stroke: p.spark,
    width: 3.2,
    opacity: 0.6,
  });
  return shapes;
};

/** One thick spear scaled near the tip — asparagus, bamboo shoot, palm heart. */
const spear: Draw = (d, p) => {
  const baseY = d.f(82, 86);
  const tipY = d.f(22, 28);
  const half = d.f(10, 13);
  const lean = d.f(-4, 4);
  const shapes: Shape[] = [
    // Inverted taper: the broad shoulder sits at the base, the point at the top.
    { d: taper(50 + lean, baseY, tipY, half, -d.f(4, 7)), fill: p.ink },
    { d: taper(50 + lean, baseY - 7, tipY + 12, half * 0.34, -3), fill: p.spark, opacity: 0.2 },
  ];

  const scales = d.i(3, 5);
  for (let i = 0; i < scales; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const y = tipY + 7 + i * d.f(4.5, 7);
    const w = half * ((y - tipY) / (baseY - tipY)) ** 0.6;
    shapes.push({
      d: leaf(
        50 + lean + side * w * 0.55,
        y + d.f(5, 8),
        -90 + side * d.f(12, 30),
        d.f(9, 13),
        d.f(2.8, 4),
      ),
      fill: p.inkDeep,
    });
  }
  const cut = baseY - d.f(6, 11);
  shapes.push({
    d: bar(50 + lean - half * 0.7, cut, 50 + lean + half * 0.7, cut),
    stroke: p.plateTo,
    width: 2.4,
    opacity: 0.5,
  });
  return shapes;
};

/** A layered bulb sprouting fronds — fennel, cardoon, celeriac-style stems. */
const bulbStem: Draw = (d, p) => {
  const cy = d.f(66, 71);
  const rx = d.f(18, 22);
  const ry = d.f(12, 16);
  const fronds = d.i(2, 3);
  const shapes: Shape[] = [];

  for (let i = 0; i < fronds; i++) {
    const t = fronds === 1 ? 0 : (i / (fronds - 1)) * 2 - 1;
    const tipX = 50 + t * d.f(9, 16);
    const tipY = d.f(22, 31);
    shapes.push({
      d: curve(50 + t * rx * 0.22, cy - ry * 0.8, 50 + t * rx * 0.7, (cy + tipY) / 2, tipX, tipY),
      stroke: i % 2 === 0 ? p.inkDeep : p.ink,
      width: d.f(2.2, 3.2),
    });
    shapes.push({
      d: leaf(tipX, tipY + 5, -90 + t * d.f(8, 22), d.f(8, 12), d.f(2.6, 3.8)),
      fill: p.spark,
      opacity: 0.8,
    });
  }

  shapes.push({ d: blob(50, cy, rx, ry, d.i(6, 8), d.f(0.04, 0.09), d), fill: p.ink });
  const rings = d.i(2, 3);
  for (let i = 0; i < rings; i++) {
    const k = 0.78 - i * 0.26;
    shapes.push({
      d: arc(50, cy + ry * 0.35, rx * k, ry * (k + 0.35), 180, 360),
      stroke: p.plateTo,
      width: 2.4,
      opacity: 0.55,
    });
  }
  return shapes;
};

export const STEM: readonly Draw[] = [stalks, spear, bulbStem];

/* --------------------------------------------------------------- mushroom */

/** Cap over a stipe — the archetypal mushroom. */
const cap: Draw = (d, p) => {
  const capY = d.f(48, 56);
  const capR = d.f(23, 29);
  const flat = d.f(0.66, 0.95);
  const shapes: Shape[] = [
    { d: bar(50, capY - 4, 50 + d.f(-4, 4), d.f(78, 87)), stroke: p.inkDeep, width: d.f(9, 13) },
    { d: dome(50, capY, capR, capR * flat), fill: p.ink },
  ];
  const gills = d.i(3, 6);
  for (let i = 0; i < gills; i++) {
    const x = 50 + ((i + 0.5) / gills - 0.5) * capR * 1.7;
    shapes.push({
      d: bar(x, capY, x, capY + d.f(3, 6)),
      stroke: p.plateTo,
      width: 2,
      opacity: 0.5,
    });
  }
  if (d.odds(0.35)) {
    const dots = d.i(2, 4);
    for (let i = 0; i < dots; i++) {
      const a = d.f(200, 340);
      const rr = d.f(0.2, 0.6);
      shapes.push({
        d: disc(
          50 + Math.cos(a * (Math.PI / 180)) * capR * rr,
          capY + Math.sin(a * (Math.PI / 180)) * capR * flat * rr,
          d.f(2.4, 3.6),
        ),
        fill: p.spark,
        opacity: 0.55,
      });
    }
  }
  return shapes;
};

/** Thin stems under small caps — enoki, shimeji, oyster, beech mushroom. */
const clusterCaps: Draw = (d, p) => {
  const count = d.i(3, 5);
  const baseY = d.f(80, 85);
  const spread = d.f(15, 23);
  const tall = d.f(40, 54);
  const droop = d.f(6, 16);
  const capR = d.f(7.5, 10.5) - (count - 3) * 0.9;
  const shapes: Shape[] = [
    {
      d: blob(50, baseY - 3, d.f(9, 12), d.f(4, 6), d.i(5, 7), d.f(0.1, 0.2), d),
      fill: p.inkDeep,
    },
  ];

  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : (i / (count - 1)) * 2 - 1;
    const tipX = 50 + t * spread;
    const tipY = baseY - (tall - Math.abs(t) * droop + d.f(-3, 3));
    shapes.push({
      d: curve(50 + t * 4, baseY - 3, 50 + t * spread * 0.75, (baseY + tipY) / 2, tipX, tipY),
      stroke: i % 2 === 0 ? p.inkDeep : p.ink,
      width: d.f(3.4, 4.6),
    });
    const r = capR * d.f(0.82, 1.12);
    shapes.push({
      d: dome(tipX, tipY + r * 0.25, r, r * d.f(0.72, 1)),
      fill: i % 2 === 0 ? p.ink : p.inkDeep,
    });
  }
  return shapes;
};

/** A wide wavy cap with no stem — maitake, hen of the woods, wood ear, chanterelle. */
const frilled: Draw = (d, p) => {
  const cy = d.f(48, 54);
  const rx = d.f(25, 29);
  const ry = d.f(14, 18);
  const shapes: Shape[] = [{ d: blob(50, cy, rx, ry, d.i(7, 10), d.f(0.1, 0.18), d), fill: p.ink }];

  const ripples = d.i(1, 2);
  for (let i = 0; i < ripples; i++) {
    shapes.push({
      d: wave(
        50 - rx * 0.82,
        50 + rx * 0.82,
        cy - ry * (0.62 - i * 0.3),
        d.f(2.4, 4.2),
        d.f(1.8, 3.4),
        d.f(0, TAU),
      ),
      stroke: i === 0 ? p.inkDeep : p.spark,
      width: i === 0 ? d.f(2.6, 3.6) : 2,
      opacity: i === 0 ? 0.85 : 0.5,
    });
  }

  const gills = d.i(5, 8);
  const inset = d.f(24, 34);
  for (let i = 0; i < gills; i++) {
    const a = (inset + ((i + 0.5) / gills) * (180 - inset * 2)) * DEG;
    shapes.push({
      d: bar(
        50 + Math.cos(a) * rx * 0.5,
        cy + Math.sin(a) * ry * 0.3,
        50 + Math.cos(a) * rx * 0.92,
        cy + Math.sin(a) * ry * 0.95,
      ),
      stroke: p.plateTo,
      width: 2,
      opacity: 0.55,
    });
  }
  return shapes;
};

export const MUSHROOM: readonly Draw[] = [cap, clusterCaps, frilled];
