/**
 * Silhouettes for sweet fruit: citrus, pome, stone, berry, vine, melon and the
 * whole tropical tail.
 *
 * `fruit` is the largest category in the catalogue — around a third of every
 * icon the app draws — so it carries twelve silhouettes where the other
 * families get three or five. Fewer would put an apple, a plum, a lychee and a
 * passion fruit on screen as the same shaded ball, and hue drift cannot
 * separate a hundred round objects.
 *
 * The forms key off how the fruit is *cut* or *carried* — whole, wedged,
 * halved, bunched, bunched-and-crowned — rather than off its botany, because
 * that is the difference that survives being shrunk to a list row.
 */

import { DEG, TAU, type Draw, type Shape } from "../spec.ts";
import { arc, bar, blob, cup, curve, disc, dome, leaf, lens, num, taper, wave } from "../shapes.ts";

/**
 * Ovoid: one `rx`, two heights. The halves share a vertical tangent at the
 * waist so the join is invisible, which is what lets a pear neck or an avocado
 * shoulder fuse into the body instead of showing a seam.
 */
function egg(cx: number, cy: number, rx: number, up: number, down: number): string {
  return `${dome(cx, cy, rx, up)}${cup(cx, cy, rx, down)}`;
}

/**
 * Pie sector: apex, one straight cut, the arc of rind, the other cut. `arc`
 * closes across the chord, which is the one part of a citrus wedge that has to
 * come to a point.
 */
function sector(cx: number, cy: number, r: number, from: number, to: number): string {
  return `M${num(cx)} ${num(cy)}L${arc(cx, cy, r, r, from, to).slice(1)}Z`;
}

/**
 * Closed polygon alternating `outer` and `inner` radii — the ridged section of
 * a star fruit. `blob` cannot stand in: its jitter is drawn per lobe, so the
 * points come out uneven rather than alternating, and the spline rounds the
 * notches away.
 */
function spikeRing(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  points: number,
  spin: number,
): string {
  const steps = points * 2;
  let path = "";
  for (let i = 0; i < steps; i++) {
    const a = (spin + (i / steps) * 360) * DEG;
    const r = i % 2 === 0 ? outer : inner;
    path += `${i === 0 ? "M" : "L"}${num(cx + Math.cos(a) * r)} ${num(cy + Math.sin(a) * r)}`;
  }
  return `${path}Z`;
}

/* ------------------------------------------------------------------ fruit */

/** A citrus cut across the segments — orange, grapefruit, lemon, mandarin, pomelo. */
const segmented: Draw = (d, p) => {
  const cy = d.f(48, 52);
  const r = d.f(30, 34);
  const flesh = r * d.f(0.8, 0.88);
  const wedges = d.i(6, 9);
  const spin = d.f(0, 360);

  // Rind is the outer disc showing past the flesh, not a stroke: a stroked ring
  // thins away at 44px, a 4-unit band does not.
  const shapes: Shape[] = [
    { d: disc(50, cy, r), fill: p.inkDeep },
    { d: disc(50, cy, flesh), fill: p.ink },
  ];

  for (let i = 0; i < wedges; i++) {
    const a = (spin + (i / wedges) * 360) * DEG;
    shapes.push({
      d: bar(
        50 + Math.cos(a) * flesh * 0.14,
        cy + Math.sin(a) * flesh * 0.14,
        50 + Math.cos(a) * flesh * 0.97,
        cy + Math.sin(a) * flesh * 0.97,
      ),
      stroke: p.plateTo,
      width: 2.4,
      opacity: 0.55,
    });
  }

  const pips = d.i(2, 3);
  for (let i = 0; i < pips; i++) {
    const a = spin + ((i + 0.5) / wedges) * 360 + (i % 2) * 180;
    shapes.push({
      d: lens(
        50 + Math.cos(a * DEG) * flesh * d.f(0.4, 0.6),
        cy + Math.sin(a * DEG) * flesh * d.f(0.4, 0.6),
        a + 90,
        d.f(8, 11),
        d.f(3.4, 4.6),
      ),
      fill: p.spark,
      opacity: 0.7,
    });
  }
  shapes.push({ d: disc(50, cy, flesh * d.f(0.12, 0.17)), fill: p.spark, opacity: 0.6 });
  return shapes;
};

/** One wedge cut lengthwise, rind on the back — lemon, lime, orange, blood orange. */
const wedge: Draw = (d, p) => {
  const bisect = d.f(-116, -64);
  const half = d.f(36, 46);
  const r = d.f(41, 46);
  const dx = Math.cos(bisect * DEG);
  const dy = Math.sin(bisect * DEG);
  // Apex pulled back down the bisector, or the wedge hangs off one side of the plate.
  const ax = 50 - dx * r * 0.44;
  const ay = 50 - dy * r * 0.44;

  // Flesh reuses the apex and both cuts, so the rind band is left along the arc alone.
  const shapes: Shape[] = [
    { d: sector(ax, ay, r, bisect - half, bisect + half), fill: p.inkDeep },
    { d: sector(ax, ay, r * d.f(0.8, 0.87), bisect - half, bisect + half), fill: p.ink },
  ];

  const ribs = d.i(2, 4);
  for (let i = 0; i < ribs; i++) {
    const a = (bisect - half + ((i + 1) / (ribs + 1)) * half * 2) * DEG;
    shapes.push({
      d: bar(
        ax + Math.cos(a) * r * 0.16,
        ay + Math.sin(a) * r * 0.16,
        ax + Math.cos(a) * r * 0.74,
        ay + Math.sin(a) * r * 0.74,
      ),
      stroke: p.plateTo,
      width: 2.2,
      opacity: 0.5,
    });
  }
  shapes.push({
    d: lens(ax + dx * r * 0.34, ay + dy * r * 0.34, bisect + 90, d.f(9, 12), d.f(3.6, 4.8)),
    fill: p.spark,
    opacity: 0.65,
  });
  return shapes;
};

/** Round body, short stalk, one leaf — apple, pear, quince, medlar, loquat. */
const pome: Draw = (d, p) => {
  const cy = d.f(53, 57);
  const rx = d.f(20, 23);
  const ry = rx * d.f(0.98, 1.12);
  const pear = d.odds(0.45);
  const stalkX = 50 + d.f(-5, 5);
  const shapes: Shape[] = [
    {
      d: bar(50, cy - ry * 0.86, stalkX, cy - ry - d.f(8, 12)),
      stroke: p.inkDeep,
      width: 3.2,
    },
    { d: blob(50, cy, rx, ry, d.i(7, 9), d.f(0.03, 0.07), d), fill: p.ink },
  ];

  if (pear) {
    // A narrower shoulder in the same ink fuses into a neck; two bodies would show a seam.
    const neck = ry * d.f(0.55, 0.68);
    shapes.push({
      d: egg(50 + d.f(-2, 2), cy - ry * 0.68, rx * d.f(0.58, 0.68), neck, neck),
      fill: p.ink,
    });
  }

  const side = d.odds(0.5) ? 1 : -1;
  shapes.push({
    d: leaf(
      50 + side * 2,
      cy - ry * (pear ? 1.02 : 0.86),
      side > 0 ? d.f(-34, -6) : d.f(-174, -146),
      d.f(14, 19),
      d.f(4.6, 6.4),
    ),
    fill: p.spark,
    opacity: 0.9,
  });
  shapes.push({
    d: arc(50, cy, rx * 0.7, ry * 0.7, 198, 268),
    stroke: p.plateTo,
    width: 2.4,
    opacity: 0.4,
  });
  shapes.push({
    d: disc(50 - rx * 0.34, cy - ry * 0.24, d.f(3.6, 4.8)),
    fill: p.spark,
    opacity: 0.5,
  });
  return shapes;
};

/** Two cheeks either side of a cleft — peach, plum, apricot, cherry, nectarine. */
const stone: Draw = (d, p) => {
  const cy = d.f(52, 56);
  const rx = d.f(22, 25);
  const ry = rx * d.f(0.84, 0.96);
  const off = rx * d.f(0.36, 0.44);
  const shoulder = ry * d.f(1.0, 1.08);

  // Body is three fills in one ink: a bowl plus two shoulders that leave a
  // notch where they meet. Wider than tall, so the outline is not the pome's.
  const shapes: Shape[] = [
    {
      d: bar(50 + d.f(-2, 2), cy - ry * 0.8, 50 + d.f(-4, 4), cy - ry - d.f(7, 11)),
      stroke: p.inkDeep,
      width: 2.8,
    },
    { d: cup(50, cy, rx, ry), fill: p.ink },
    { d: dome(50 - off, cy, rx * 0.66, shoulder), fill: p.ink },
    { d: dome(50 + off, cy, rx * 0.66, shoulder), fill: p.ink },
  ];

  shapes.push({
    d: lens(50, cy - ry * 0.12, 90, ry * d.f(1.6, 1.9), d.f(2.8, 4)),
    fill: p.plateTo,
    opacity: 0.55,
  });
  shapes.push({
    d: disc(50 - off * d.f(1.0, 1.3), cy - ry * 0.18, d.f(3.6, 5)),
    fill: p.spark,
    opacity: 0.45,
  });
  // Sheen on the far cheek, kept high: swung low it pairs with the blush and
  // the pair reads as a face.
  shapes.push({
    d: arc(50 + off, cy - ry * 0.16, rx * 0.42, ry * 0.42, 296, 352),
    stroke: p.plateTo,
    width: 2.2,
    opacity: 0.4,
  });
  return shapes;
};

/** A bunch narrowing to a point — grape, elderberry, redcurrant, longan, rowan. */
const cluster: Draw = (d, p) => {
  const rows = d.i(3, 4);
  const r = d.f(8.5, 10);
  const topY = d.f(34, 37);
  // A fourth row has to buy its height from the overlap, or the bunch runs off the plate.
  const step = r * (rows > 3 ? d.f(1.0, 1.15) : d.f(1.2, 1.4));
  const shapes: Shape[] = [
    {
      d: bar(50, topY - r * 0.5, 50 + d.f(-5, 5), topY - r - d.f(6, 9)),
      stroke: p.inkDeep,
      width: 3,
    },
    {
      d: leaf(50 + d.f(-3, 3), topY - r * 0.9, d.f(-164, -136), d.f(13, 17), d.f(5, 6.6)),
      fill: p.spark,
      opacity: 0.9,
    },
  ];

  for (let row = 0; row < rows; row++) {
    const count = rows - row;
    for (let i = 0; i < count; i++) {
      shapes.push({
        d: disc(50 + (i - (count - 1) / 2) * r * 1.55, topY + row * step, r * d.f(0.92, 1.04)),
        fill: (row + i) % 2 === 0 ? p.ink : p.inkDeep,
      });
    }
  }

  const lit = d.i(2, 3);
  for (let i = 0; i < lit; i++) {
    shapes.push({
      d: disc(
        50 + d.f(-1.6, 1.6) * r * (i - 1) - r * 0.3,
        topY + i * step + r * 0.1,
        d.f(2.4, 3.2),
      ),
      fill: p.spark,
      opacity: 0.55,
    });
  }
  return shapes;
};

/** Plump body, calyx crown, seeds on the skin — strawberry, mulberry, rosehip, lychee. */
const berry: Draw = (d, p) => {
  const y0 = d.f(38, 42);
  const y1 = d.f(78, 83);
  const half = d.f(21, 25);

  const shapes: Shape[] = [];
  const crown = d.i(3, 5);
  for (let i = 0; i < crown; i++) {
    const t = crown === 1 ? 0 : (i / (crown - 1)) * 2 - 1;
    shapes.push({
      d: leaf(50 + t * half * 0.5, y0 - 1, -90 + t * d.f(30, 54), d.f(13, 18), d.f(4.2, 6)),
      fill: p.spark,
      opacity: 0.9,
    });
  }

  shapes.push({ d: taper(50, y0, y1, half, d.f(8, 13)), fill: p.ink });

  // Seeds ride the taper: the row width follows the body or they sit off the edge.
  const rows = d.i(3, 4);
  for (let row = 0; row < rows; row++) {
    const v = 0.18 + (row / rows) * 0.66;
    const count = rows - row > 1 ? 3 - (row % 2) : 1;
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0 : (i / (count - 1)) * 2 - 1;
      shapes.push({
        d: lens(
          50 + t * half * (1 - v * 0.85) * 0.6,
          y0 + (y1 - y0) * v,
          d.f(-40, 40),
          d.f(6.5, 8.5),
          d.f(2.6, 3.4),
        ),
        fill: p.spark,
        opacity: 0.75,
      });
    }
  }
  shapes.push({
    d: arc(50, y0 + (y1 - y0) * 0.3, half * 0.6, half * 0.6, 200, 260),
    stroke: p.plateTo,
    width: 2.4,
    opacity: 0.4,
  });
  return shapes;
};

/** A long crescent — banana, plantain, saba, finger lime, horned melon. */
const curved: Draw = (d, p) => {
  const lean = d.f(52, 78);
  const span = d.f(46, 54);
  const bow = d.f(17, 24);
  const thick = d.f(15, 19);
  const flip = d.odds(0.5) ? 1 : -1;
  const dx = Math.cos(lean * DEG);
  const dy = Math.sin(lean * DEG);
  const nx = -dy * flip;
  const ny = dx * flip;
  const x0 = 50 - dx * span * 0.5;
  const y0 = 50 - dy * span * 0.5;
  const x1 = 50 + dx * span * 0.5;
  const y1 = 50 + dy * span * 0.5;

  /** A quadratic's apex sits halfway to its control, so the bow is doubled here. */
  const bend = (k: number): string =>
    curve(
      x0 + nx * k,
      y0 + ny * k,
      50 + nx * (bow * 2 + k),
      50 + ny * (bow * 2 + k),
      x1 + nx * k,
      y1 + ny * k,
    );

  const shapes: Shape[] = [
    // A shorter, thinner crescent behind: one banana becomes a hand of them.
    {
      d: bend(-thick * d.f(0.5, 0.7)),
      stroke: p.inkDeep,
      width: thick * d.f(0.6, 0.74),
    },
    { d: bend(0), stroke: p.ink, width: thick },
    // Blunt ends: the stalk and the blossom scar, both darker than the body.
    { d: disc(x0, y0, thick * d.f(0.24, 0.3)), fill: p.inkDeep },
    { d: disc(x1, y1, thick * d.f(0.2, 0.26)), fill: p.inkDeep },
    {
      d: bend(thick * d.f(0.22, 0.3)),
      stroke: p.plateTo,
      width: 2.4,
      opacity: 0.5,
    },
    {
      d: bend(-thick * d.f(0.2, 0.28)),
      stroke: p.spark,
      width: 2.6,
      opacity: 0.35,
    },
  ];
  return shapes;
};

/** A big rind under running bands — watermelon, cantaloupe, honeydew, papaya, pumelo. */
const striped: Draw = (d, p) => {
  const oblong = d.odds(0.4);
  const cy = d.f(49, 51);
  const rx = oblong ? d.f(23, 27) : d.f(29, 33);
  const ry = oblong ? d.f(31, 35) : rx * d.f(0.9, 1.0);

  const shapes: Shape[] = [{ d: egg(50, cy, rx, ry, ry), fill: p.ink }];

  const bands = d.i(3, 5);
  for (let i = 0; i < bands; i++) {
    const t = ((i + 0.5) / bands) * 2 - 1;
    shapes.push({
      // Meridians, not chords: each one bulges to its own share of the rind.
      d: curve(50, cy - ry * 0.95, 50 + t * rx * 1.7, cy, 50, cy + ry * 0.95),
      stroke: i % 2 === 0 ? p.plateTo : p.inkDeep,
      width: d.f(3.4, 4.6),
      opacity: 0.6,
    });
  }

  shapes.push({
    d: lens(50 - rx * 0.42, cy - ry * 0.42, d.f(30, 60), rx * 0.5, rx * 0.16),
    fill: p.spark,
    opacity: 0.25,
  });
  shapes.push({
    d: disc(50 + d.f(-3, 3), cy + ry * 0.86, d.f(2.8, 3.8)),
    fill: p.plateTo,
    opacity: 0.5,
  });
  return shapes;
};

/** Upright body under a spiky crown — pineapple, sugar-apple, cherimoya, salak. */
const crowned: Draw = (d, p) => {
  const cy = d.f(57, 60);
  const rx = d.f(19, 22);
  const ry = d.f(20, 23);
  const shapes: Shape[] = [];

  const spikes = d.i(3, 5);
  for (let i = 0; i < spikes; i++) {
    const t = spikes === 1 ? 0 : (i / (spikes - 1)) * 2 - 1;
    shapes.push({
      d: leaf(
        50 + t * rx * 0.45,
        cy - ry * 0.88,
        -90 + t * d.f(22, 42),
        d.f(16, 23) * (1 - Math.abs(t) * 0.22),
        d.f(4.4, 6.4),
      ),
      fill: i % 2 === 0 ? p.spark : p.inkDeep,
      opacity: 0.95,
    });
  }

  shapes.push({ d: egg(50, cy, rx, ry * d.f(0.96, 1.08), ry), fill: p.ink });

  // Wavy courses rather than straight bars: the rind of a pineapple is scaled,
  // and a straight band here would read as the melon's stripe.
  const rows = d.i(3, 4);
  for (let row = 0; row < rows; row++) {
    const v = -0.5 + (row / (rows - 1)) * 1.0;
    const wide = rx * Math.sqrt(1 - v * v) * 0.84;
    shapes.push({
      d: wave(50 - wide, 50 + wide, cy + v * ry, d.f(1.8, 3), d.f(1.6, 2.4), d.f(0, TAU)),
      stroke: p.plateTo,
      width: 2.4,
      opacity: 0.5,
    });
  }
  shapes.push({
    d: disc(50 - rx * 0.36, cy - ry * 0.1, d.f(3, 4)),
    fill: p.spark,
    opacity: 0.45,
  });
  return shapes;
};

/** Bracts standing off the body — dragon fruit, rambutan, soursop, horned melon. */
const spiked: Draw = (d, p) => {
  const cy = d.f(50, 54);
  const rx = d.f(18, 20);
  const ry = rx * d.f(1.1, 1.28);
  // Six at minimum: five bracts keep landing as two ears and a snout.
  const bracts = d.i(6, 8);
  const spin = d.f(0, 360);

  const shapes: Shape[] = [];
  for (let i = 0; i < bracts; i++) {
    const a = spin + (i / bracts) * 360 + d.f(-14, 14);
    const s = Math.sin(a * DEG);
    // Downward bracts are cropped: at full length they walk off the plate.
    const len = d.f(13, 18) * (1 - Math.max(0, s) * 0.35);
    shapes.push({
      d: leaf(
        50 + Math.cos(a * DEG) * rx * 0.7,
        cy + s * ry * 0.7,
        a + d.f(-20, 20),
        len,
        d.f(4.8, 6.8),
      ),
      fill: i % 3 === 0 ? p.spark : p.inkDeep,
      opacity: 0.95,
    });
  }

  shapes.push({ d: egg(50, cy, rx, ry, ry * d.f(0.9, 1.0)), fill: p.ink });

  const scales = d.i(2, 3);
  for (let i = 0; i < scales; i++) {
    const v = -0.4 + (i / scales) * 0.9;
    shapes.push({
      d: arc(50, cy + v * ry, rx * 0.66, ry * 0.3, 200, 340),
      stroke: p.plateTo,
      width: 2.2,
      opacity: 0.45,
    });
  }
  shapes.push({
    d: disc(50 - rx * 0.34, cy - ry * 0.3, d.f(3.2, 4.2)),
    fill: p.spark,
    opacity: 0.5,
  });
  return shapes;
};

/** The ridged section of a star fruit — carambola, bilimbi, and their cousins. */
const star: Draw = (d, p) => {
  const cy = d.f(49, 51);
  const points = d.i(5, 6);
  const outer = d.f(30, 34);
  const inner = outer * d.f(0.4, 0.5);
  const spin = d.f(0, 360);

  // Rind is the outer star showing past a shrunk copy of itself, so the band
  // follows the ridges instead of cutting across them.
  const shapes: Shape[] = [
    { d: spikeRing(50, cy, outer, inner, points, spin), fill: p.inkDeep },
    { d: spikeRing(50, cy, outer * 0.82, inner * 0.76, points, spin), fill: p.ink },
  ];

  for (let i = 0; i < points; i++) {
    const a = (spin + (i / points) * 360) * DEG;
    shapes.push({
      d: disc(50 + Math.cos(a) * inner * 0.72, cy + Math.sin(a) * inner * 0.72, d.f(2.4, 3.2)),
      fill: p.plateTo,
      opacity: 0.55,
    });
  }
  shapes.push({ d: disc(50, cy, inner * d.f(0.3, 0.4)), fill: p.spark, opacity: 0.55 });
  return shapes;
};

/** Cut open on the stone — avocado, mango cheek, papaya, persimmon, sapote. */
const halved: Draw = (d, p) => {
  const cy = d.f(50, 54);
  const rx = d.f(21, 24);
  const up = rx * d.f(1.0, 1.22);
  const down = rx * d.f(1.0, 1.14);
  const necked = d.odds(0.45);
  const hollow = d.odds(0.45);
  // The stone sits off the axis. Dead centre inside two rings reads as an eye.
  const pitX = 50 + d.f(-3.5, 3.5);
  const pitY = cy + (necked ? up * 0.14 : 0);
  const pit = rx * d.f(0.42, 0.52);
  const neckX = rx * d.f(0.56, 0.64);
  const neckY = up * d.f(0.5, 0.6);
  const skin = d.f(4, 5.5);

  const shapes: Shape[] = [{ d: egg(50, cy, rx, up, down), fill: p.inkDeep }];
  if (necked) {
    shapes.push({
      d: egg(50, cy - up * 0.66, neckX, neckY, neckY),
      fill: p.inkDeep,
    });
  }

  shapes.push({ d: egg(50, cy, rx - skin, up - skin, down - skin), fill: p.ink });
  if (necked) {
    shapes.push({
      d: egg(50, cy - up * 0.66, neckX - skin * 0.8, neckY - skin * 0.6, neckY - skin * 0.6),
      fill: p.ink,
    });
  }

  if (hollow) {
    // An empty cavity in the plate colour: seeds ring it, the way a papaya cuts.
    shapes.push({ d: disc(pitX, pitY, pit), fill: p.plateTo });
    const seeds = d.i(4, 6);
    for (let i = 0; i < seeds; i++) {
      const a = (d.f(0, 360) + (i / seeds) * 360) * DEG;
      shapes.push({
        d: disc(pitX + Math.cos(a) * pit * 0.6, pitY + Math.sin(a) * pit * 0.6, d.f(2.4, 3.2)),
        fill: p.inkDeep,
      });
    }
  } else {
    shapes.push({ d: disc(pitX, pitY, pit), fill: p.spark, opacity: 0.9 });
    shapes.push({
      d: arc(pitX, pitY, pit * 0.72, pit * 0.72, 30, 150),
      stroke: p.plateTo,
      width: 2.4,
      opacity: 0.4,
    });
  }

  shapes.push({
    d: arc(pitX, pitY, pit + d.f(5, 8), pit + d.f(5, 8), 196, 344),
    stroke: p.plateTo,
    width: 2.2,
    opacity: 0.35,
  });
  return shapes;
};

export const FRUIT: readonly Draw[] = [
  segmented,
  wedge,
  pome,
  stone,
  cluster,
  berry,
  curved,
  striped,
  crowned,
  spiked,
  star,
  halved,
];

/**
 * The forms a recognisable fruit is allowed to take.
 *
 * Every other family's silhouettes are abstract, so the hash hands them out
 * freely — a fan and a rosette are both honest for chard. These twelve are not
 * abstract: a crescent *means* banana and a bract crown *means* pineapple, so
 * letting the hash give the crescent to an apple states something false.
 *
 * Fruit a shopper can already picture therefore names the forms that stay true
 * for it, and the hash still chooses inside that set — which is what keeps
 * thirty round berries from collapsing into one drawing. Fruit nobody can
 * picture anyway (abiu, canistel, safou) keeps all twelve, because for those
 * any plausible form is honest.
 *
 * Order matters: the first keyword found in the name wins, so the specific
 * entries sit above the general ones they contain.
 */
const TRUE_FORMS: readonly (readonly [readonly string[], readonly Draw[]])[] = [
  // Substrings of a later keyword, so they have to be tested first.
  [["pineapple"], [crowned]],
  [
    ["custard apple", "sugar apple"],
    [spiked, crowned],
  ],
  [
    ["rose apple", "water apple"],
    [pome, berry],
  ],
  [["prickly pear"], [spiked, halved]],
  [["mangosteen"], [spiked]],
  [["grapefruit"], [segmented, wedge]],
  [["watermelon"], [striped, halved]],

  // Citrus reads as either the cut face or a single wedge.
  [
    ["lemon", "lime", "orange", "mandarin", "tangerine", "clementine", "satsuma", "pomelo"],
    [segmented, wedge],
  ],
  [
    ["yuzu", "kumquat", "citron", "bergamot", "calamansi"],
    [segmented, wedge],
  ],

  // Pome and stone: a body with a stalk, or a body with a cleft.
  [
    ["apple", "pear", "quince", "medlar", "loquat"],
    [pome, halved],
  ],
  [["peach", "nectarine", "apricot", "plum", "damson", "greengage", "mirabelle"], [stone]],
  [
    ["cherry", "sloe", "date", "acerola"],
    [stone, cluster],
  ],
  [
    ["jujube", "persimmon", "tamarillo"],
    [pome, halved],
  ],

  // Berries split by how they are carried: singly, or on a bunch.
  [["strawberry", "physalis"], [berry]],
  [
    ["raspberry", "blackberry", "mulberry", "boysenberry", "loganberry", "tayberry"],
    [berry, cluster],
  ],
  [
    ["cloudberry", "goji", "aronia", "honeyberry", "guava"],
    [berry, cluster],
  ],
  [
    ["blueberry", "bilberry", "cranberry", "lingonberry"],
    [cluster, berry],
  ],
  [["currant", "elderberry", "grape", "jabuticaba", "rowan", "serviceberry"], [cluster]],
  [["sea buckthorn", "acai"], [cluster]],

  // The unmistakable outlines.
  [["banana"], [curved]],
  [
    ["melon", "cantaloupe", "piel de sapo"],
    [striped, halved],
  ],
  [["star fruit", "carambola", "bilimbi"], [star]],
  [["dragon fruit", "salak", "rambutan", "pulasan", "durian"], [spiked]],
  [["jackfruit", "chempedak", "marang", "soursop"], [spiked]],
  [
    ["lychee", "longan"],
    [spiked, cluster],
  ],
  [
    ["cherimoya", "atemoya", "biriba"],
    [spiked, crowned],
  ],

  // Fruit whose identity is the cut face: a stone in flesh, or seeds in a cavity.
  [
    ["mango", "papaya", "pomegranate", "fig"],
    [halved, wedge],
  ],
  [["kiwi"], [segmented, halved]],
  [
    ["passion fruit", "granadilla", "maracuya"],
    [halved, berry],
  ],
];

/** The pool for `name`, or `null` when every form in the family stays honest. */
export function fruitForms(name: string): readonly Draw[] | null {
  const key = name.toLowerCase();
  for (const [words, forms] of TRUE_FORMS) {
    if (words.some((word) => key.includes(word))) return forms;
  }
  return null;
}
