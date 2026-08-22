/**
 * Silhouettes for the botanical fruits we eat as vegetables, plus pods and
 * gourds: orbs, pods, ribbed bodies.
 */

import { DEG, TAU, type Draw, type Shape } from "../spec.ts";
import { arc, bar, blob, curve, disc, dome, leaf, lens, onQuad } from "../shapes.ts";

/* --------------------------------------------------------------- fruiting */

/** An orb on a stem — tomato, pepper, aubergine, avocado. */
const orb: Draw = (d, p) => {
  const cy = d.f(52, 58);
  const r = d.f(23, 28);
  const lobes = d.i(3, 4);
  const body = d.odds(0.45) ? blob(50, cy, r * 1.04, r, lobes, 0.07, d) : disc(50, cy, r);

  const shapes: Shape[] = [
    {
      d: bar(50, cy - r + 3, 50 + d.f(-6, 6), cy - r - d.f(8, 14)),
      stroke: p.inkDeep,
      width: d.f(4, 6),
    },
    { d: leaf(50, cy - r + 2, -90 + d.f(-64, -28), d.f(12, 18), d.f(4, 6)), fill: p.inkDeep },
    { d: leaf(50, cy - r + 2, -90 + d.f(28, 64), d.f(12, 18), d.f(4, 6)), fill: p.inkDeep },
    { d: body, fill: p.ink },
    {
      d: arc(50, cy, r * 0.62, r * 0.62, 196, 262),
      stroke: p.spark,
      width: d.f(3, 4.4),
      opacity: 0.5,
    },
  ];
  if (d.odds(0.4)) {
    const seeds = d.i(3, 5);
    for (let i = 0; i < seeds; i++) {
      const a = (i / seeds) * TAU + d.f(0, 1);
      shapes.push({
        d: disc(50 + Math.cos(a) * r * 0.42, cy + Math.sin(a) * r * 0.42, 2.4),
        fill: p.plateTo,
        opacity: 0.55,
      });
    }
  }
  return shapes;
};

/** A long body on a short stem — cucumber, courgette, aubergine, okra, bitter melon. */
const elongated: Draw = (d, p) => {
  const stretched = d.odds(0.35);
  const angle = -90 + (stretched ? d.f(-4, 4) : d.f(-15, 15));
  const length = d.f(52, 62);
  const half = length / 2;
  const width = d.f(16, 21);
  const cy = 54;
  const dx = Math.cos(angle * DEG);
  const dy = Math.sin(angle * DEG);
  const nx = -dy;
  const ny = dx;
  const topX = 50 + dx * half;
  const topY = cy + dy * half;
  const stem = d.f(5, 8);
  const bandT = d.f(0.6, 0.7);

  const shapes: Shape[] = [
    {
      d: bar(topX - dx * 3, topY - dy * 3, topX + dx * stem, topY + dy * stem),
      stroke: p.inkDeep,
      width: d.f(4, 5.4),
    },
    {
      d: stretched
        ? blob(50, cy, width * 0.5, half, d.i(7, 9), 0.05, d)
        : lens(50, cy, angle, length, width),
      fill: p.ink,
    },
    {
      d: bar(
        50 + dx * half * bandT - nx * width * 0.2,
        cy + dy * half * bandT - ny * width * 0.2,
        50 + dx * half * bandT + nx * width * 0.2,
        cy + dy * half * bandT + ny * width * 0.2,
      ),
      stroke: p.inkDeep,
      width: d.f(4, 5),
    },
  ];

  const streaks = d.i(1, 2);
  for (let i = 0; i < streaks; i++) {
    const off = width * (i === 0 ? 0.26 : -0.26);
    shapes.push({
      d: bar(
        50 + nx * off - dx * half * 0.44,
        cy + ny * off - dy * half * 0.44,
        50 + nx * off + dx * half * 0.5,
        cy + ny * off + dy * half * 0.5,
      ),
      stroke: p.spark,
      width: d.f(1.8, 2.4),
      opacity: 0.4,
    });
  }

  if (d.odds(0.35)) {
    const warts = d.i(3, 4);
    for (let i = 0; i < warts; i++) {
      const t = ((i + 0.5) / warts - 0.5) * 1.3;
      shapes.push({
        d: disc(
          50 + dx * half * t + nx * width * 0.12,
          cy + dy * half * t + ny * width * 0.12,
          2.2,
        ),
        fill: p.plateTo,
        opacity: 0.5,
      });
    }
  }
  return shapes;
};

/** A lobed body wider than tall — bell pepper, tomatillo, sweet romano pepper. */
const lantern: Draw = (d, p) => {
  const rx = d.f(26, 31);
  const ry = d.f(19, 23);
  const cy = d.f(56, 60);
  const lean = d.f(-4, 4);
  const stem = d.f(9, 13);

  const shapes: Shape[] = [
    {
      d: bar(50 + lean * 0.4, cy - ry + 2, 50 + lean * 2, cy - ry - stem),
      stroke: p.inkDeep,
      width: d.f(5.5, 7.5),
    },
    { d: blob(50, cy, rx, ry, d.i(5, 7), 0.07, d), fill: p.ink },
  ];

  const lobes = d.i(2, 3);
  for (let i = 0; i < lobes; i++) {
    const off = ((i + 0.5) / lobes - 0.5) * rx * 1.4;
    shapes.push({
      d: curve(
        50 + off * 0.42,
        cy - ry * 0.82,
        50 + off,
        cy + ry * 0.1,
        50 + off * 0.6,
        cy + ry * 0.86,
      ),
      stroke: p.inkDeep,
      width: d.f(2.6, 3.4),
      opacity: 0.6,
    });
  }

  shapes.push({
    d: dome(50 + lean * 0.4, cy - ry + 4, d.f(8, 11), d.f(4.5, 6.5)),
    fill: p.inkDeep,
  });
  shapes.push({
    d: arc(50, cy, rx * 0.66, ry * 0.66, 198, 262),
    stroke: p.spark,
    width: d.f(2.6, 3.6),
    opacity: 0.45,
  });
  return shapes;
};

/** A narrow body curving to a point — chilli, jalapeno, habanero, padron. */
const spike: Draw = (d, p) => {
  const bend = d.f(-20, 20);
  const topY = d.f(30, 34);
  const tipY = d.f(68, 74);
  const topX = 50 - bend * 0.4;
  const tipX = 50 + bend * 0.4;
  const ctrlX = 50 + bend * 1.15;
  const ctrlY = (topY + tipY) / 2;
  const width = d.f(15, 19);
  const segs = d.i(6, 8);
  const span = Math.hypot(tipX - topX, tipY - topY);
  const stem = d.f(7, 10);

  const shapes: Shape[] = [
    {
      d: bar(topX, topY - width * 0.3, topX + d.f(-5, 5), topY - width * 0.3 - stem),
      stroke: p.inkDeep,
      width: d.f(3.4, 4.6),
    },
    { d: disc(topX, topY, width * 0.48), fill: p.ink },
  ];

  // Overlapping lenses along the spine: the union curves where a single lens cannot.
  for (let i = 0; i < segs; i++) {
    const t = (i + 0.5) / segs;
    const at = onQuad(topX, topY, ctrlX, ctrlY, tipX, tipY, t);
    shapes.push({
      d: lens(at.x, at.y, at.angle, (span / segs) * 2.6, Math.max(2.6, width * (1 - t * 0.94))),
      fill: p.ink,
    });
  }

  const off = width * 0.16 * (d.odds(0.5) ? 1 : -1);
  const nx = -((tipY - topY) / span) * off;
  const ny = ((tipX - topX) / span) * off;
  const a = onQuad(topX, topY, ctrlX, ctrlY, tipX, tipY, 0.2);
  const m = onQuad(topX, topY, ctrlX, ctrlY, tipX, tipY, 0.4);
  const b = onQuad(topX, topY, ctrlX, ctrlY, tipX, tipY, 0.6);
  shapes.push({
    d: curve(
      a.x + nx,
      a.y + ny,
      2 * m.x - (a.x + b.x) / 2 + nx,
      2 * m.y - (a.y + b.y) / 2 + ny,
      b.x + nx,
      b.y + ny,
    ),
    stroke: p.spark,
    width: d.f(1.8, 2.2),
    opacity: 0.4,
  });
  return shapes;
};

export const FRUITING: readonly Draw[] = [orb, elongated, lantern, spike];

/* ----------------------------------------------------------------- legume */

/** A pod with seeds inside — beans, peas, edamame. */
const pod: Draw = (d, p) => {
  const angle = d.f(-36, 42);
  const length = d.f(52, 66);
  const width = d.f(10, 15);
  const dx = Math.cos(angle * DEG);
  const dy = Math.sin(angle * DEG);
  const shapes: Shape[] = [
    {
      d: bar(
        50 - dx * length * 0.5,
        52 - dy * length * 0.5,
        50 - dx * (length * 0.5 + 8),
        52 - dy * (length * 0.5 + 8),
      ),
      stroke: p.inkDeep,
      width: 3.5,
    },
    { d: lens(50, 52, angle, length, width), fill: p.ink },
  ];
  const seeds = d.i(3, 5);
  for (let i = 0; i < seeds; i++) {
    const t = ((i + 0.5) / seeds - 0.5) * 0.78;
    shapes.push({
      d: disc(50 + dx * length * t, 52 + dy * length * t, Math.min(width * 0.42, 5.2)),
      fill: p.plateTo,
      opacity: 0.8,
    });
  }
  shapes.push({
    d: bar(
      50 - dx * length * 0.34 - dy * width * 0.5,
      52 - dy * length * 0.34 + dx * width * 0.5,
      50 + dx * length * 0.34 - dy * width * 0.5,
      52 + dy * length * 0.34 + dx * width * 0.5,
    ),
    stroke: p.spark,
    width: 1.8,
    opacity: 0.35,
  });
  return shapes;
};

/** Seeds with no pod at all — lentils, chickpeas, kidney beans, black-eyed peas. */
const loose: Draw = (d, p) => {
  const count = d.i(3, 5);
  const spin = d.f(0, TAU);
  const shapes: Shape[] = [];

  for (let i = 0; i < count; i++) {
    const a = spin + (i / count) * TAU + d.f(-0.3, 0.3);
    const rr = d.f(12, 20);
    const cx = 50 + Math.cos(a) * rr;
    const cy = 52 + Math.sin(a) * rr * 0.9;
    const size = d.f(19, 25);
    const tilt = d.f(0, 360);
    const round = d.odds(0.3);
    shapes.push({
      d: round
        ? blob(cx, cy, size * 0.46, size * 0.42, d.i(5, 7), 0.1, d)
        : lens(cx, cy, tilt, size, size * d.f(0.9, 1.2)),
      fill: i % 2 === 0 ? p.ink : p.inkDeep,
    });
    shapes.push(
      round
        ? {
            d: disc(cx + size * 0.1, cy - size * 0.08, 2.2),
            fill: p.plateTo,
            opacity: 0.5,
          }
        : {
            d: bar(
              cx - Math.cos(tilt * DEG) * size * 0.3,
              cy - Math.sin(tilt * DEG) * size * 0.3,
              cx + Math.cos(tilt * DEG) * size * 0.3,
              cy + Math.sin(tilt * DEG) * size * 0.3,
            ),
            stroke: p.plateTo,
            width: 1.7,
            opacity: 0.5,
          },
    );
  }
  return shapes;
};

/** Two slender pods off one stem — green beans, yardlong beans, runner beans, flat beans. */
const podPair: Draw = (d, p) => {
  const angle = -90 + d.f(-22, 22);
  const dx = Math.cos(angle * DEG);
  const dy = Math.sin(angle * DEG);
  const nx = -dy;
  const ny = dx;
  const gap = d.f(16, 22);
  const width = d.f(10, 13);
  const pods = [
    { length: d.f(48, 56), shift: d.f(-4, 2), side: -1, fill: p.inkDeep },
    { length: d.f(44, 52), shift: d.f(-2, 4), side: 1, fill: p.ink },
  ];
  const laid = pods.map((q) => {
    const cx = 50 + nx * gap * 0.5 * q.side + dx * q.shift;
    const cy = 48 + ny * gap * 0.5 * q.side + dy * q.shift;
    return { ...q, cx, cy, bx: cx - dx * q.length * 0.5, by: cy - dy * q.length * 0.5 };
  });
  const jx = (laid[0]!.bx + laid[1]!.bx) / 2;
  const jy = (laid[0]!.by + laid[1]!.by) / 2;
  const stem = d.f(6, 9);

  const shapes: Shape[] = [
    { d: bar(jx, jy, jx - dx * stem, jy - dy * stem), stroke: p.inkDeep, width: d.f(3.6, 4.8) },
  ];
  for (const q of laid) {
    shapes.push({ d: bar(jx, jy, q.bx, q.by), stroke: p.inkDeep, width: 2.8 });
  }
  for (const q of laid) {
    shapes.push({ d: lens(q.cx, q.cy, angle, q.length, width), fill: q.fill });
    shapes.push({
      d: bar(
        q.cx - dx * q.length * 0.3 + nx * width * 0.16,
        q.cy - dy * q.length * 0.3 + ny * width * 0.16,
        q.cx + dx * q.length * 0.3 + nx * width * 0.16,
        q.cy + dy * q.length * 0.3 + ny * width * 0.16,
      ),
      stroke: p.spark,
      width: 1.8,
      opacity: 0.32,
    });
  }
  return shapes;
};

/** An open crescent cradling its seeds — garden peas, broad beans, edamame. */
const openPod: Draw = (d, p) => {
  const cy = d.f(44, 50);
  const rx = d.f(23, 27);
  const ry = d.f(20, 25);
  const from = d.f(-8, 22);
  const to = from + d.f(140, 172);
  const thick = d.f(7, 9.5);
  const stem = d.f(6, 8);
  const mouth = from * DEG;

  const shapes: Shape[] = [
    {
      d: bar(
        50 + Math.cos(mouth) * rx,
        cy + Math.sin(mouth) * ry,
        50 + Math.cos(mouth) * (rx + stem),
        cy + Math.sin(mouth) * (ry + stem),
      ),
      stroke: p.inkDeep,
      width: d.f(3.2, 4.2),
    },
    { d: arc(50, cy, rx, ry, from, to), stroke: p.inkDeep, width: thick },
    {
      d: arc(50, cy, rx - thick * 0.4, ry - thick * 0.4, from + 12, to - 12),
      stroke: p.spark,
      width: 1.8,
      opacity: 0.3,
    },
  ];

  const seeds = d.i(3, 4);
  const seedR = d.f(5.6, 7);
  const inset = thick * 0.5 + seedR * 0.72;
  for (let i = 0; i < seeds; i++) {
    const a = (from + ((to - from) * (i + 0.5)) / seeds) * DEG;
    shapes.push({
      d: disc(50 + Math.cos(a) * (rx - inset), cy + Math.sin(a) * (ry - inset), seedR),
      fill: p.ink,
    });
  }
  return shapes;
};

export const LEGUME: readonly Draw[] = [pod, loose, podPair, openPod];

/* ----------------------------------------------------------------- squash */

/** A ribbed gourd — pumpkin, kabocha, patty pan. */
const gourd: Draw = (d, p) => {
  const rx = d.f(25, 30);
  const ry = d.f(22, 27);
  const cy = 56;
  const shapes: Shape[] = [
    {
      d: bar(50, cy - ry + 2, 50 + d.f(-4, 4), cy - ry - d.f(8, 13)),
      stroke: p.spark,
      width: d.f(5, 7),
    },
    { d: blob(50, cy, rx, ry, d.i(7, 9), 0.06, d), fill: p.ink },
  ];
  const ribs = d.i(3, 5);
  for (let i = 0; i < ribs; i++) {
    const off = ((i + 0.5) / ribs - 0.5) * rx * 1.5;
    shapes.push({
      d: curve(50 + off * 0.3, cy - ry * 0.88, 50 + off, cy, 50 + off * 0.3, cy + ry * 0.88),
      stroke: p.inkDeep,
      width: 2.2,
      opacity: 0.5,
    });
  }
  return shapes;
};

/** A bell profile, narrow above and bulbous below — butternut, crown prince, red kuri. */
const pear: Draw = (d, p) => {
  const bulbRx = d.f(17, 21);
  const bulbRy = d.f(15, 18.5);
  const bulbCy = d.f(62, 67);
  const neckTop = d.f(28, 33);
  const neckWidth = d.f(15, 20);
  const lean = d.f(-5, 5);
  const stem = d.f(8, 11);
  const baseY = bulbCy + 4;
  const neckLen = Math.hypot(lean, baseY - neckTop);
  const neckAngle = Math.atan2(neckTop - baseY, lean) / DEG;

  const shapes: Shape[] = [
    {
      d: bar(50 + lean, neckTop + 2, 50 + lean + d.f(-3, 3), neckTop + 2 - stem),
      stroke: p.spark,
      width: d.f(5, 6.5),
    },
    { d: blob(50, bulbCy, bulbRx, bulbRy, d.i(6, 8), 0.05, d), fill: p.ink },
    {
      d: lens(50 + lean * 0.5, (baseY + neckTop) / 2, neckAngle, neckLen, neckWidth),
      fill: p.ink,
    },
  ];

  const ribs = d.i(1, 2);
  for (let i = 0; i < ribs; i++) {
    const off = (i === 0 ? -1 : 1) * bulbRx * d.f(0.38, 0.48);
    shapes.push({
      d: curve(
        50 + off * 0.28,
        neckTop + 10,
        50 + off * 1.05,
        bulbCy - bulbRy * 0.35,
        50 + off * 0.55,
        bulbCy + bulbRy * 0.66,
      ),
      stroke: p.inkDeep,
      width: d.f(2.2, 3),
      opacity: 0.55,
    });
  }

  shapes.push({
    d: arc(50, bulbCy, bulbRx * 0.62, bulbRy * 0.62, 196, 262),
    stroke: p.spark,
    width: d.f(2.6, 3.4),
    opacity: 0.45,
  });
  return shapes;
};

/** A wide scalloped body seen from above — pattypan, turban squash, kabocha, buttercup. */
const flattened: Draw = (d, p) => {
  const rx = d.f(26, 30);
  const ry = d.f(15, 19);
  const cy = d.f(54, 58);
  const shapes: Shape[] = [
    { d: blob(50, cy, rx, ry, d.i(8, 11), d.f(0.12, 0.18), d), fill: p.ink },
  ];

  const ribs = d.i(4, 6);
  const spin = d.f(0, 360);
  for (let i = 0; i < ribs; i++) {
    const a = (spin + (i / ribs) * 360) * DEG;
    shapes.push({
      d: bar(
        50 + Math.cos(a) * rx * 0.26,
        cy + Math.sin(a) * ry * 0.26,
        50 + Math.cos(a) * rx * 0.8,
        cy + Math.sin(a) * ry * 0.8,
      ),
      stroke: p.inkDeep,
      width: d.f(2.2, 2.8),
      opacity: 0.8,
    });
  }

  const nub = d.f(6, 9);
  shapes.push({
    d: arc(50, cy, rx * 0.84, ry * 0.84, 196, 268),
    stroke: p.spark,
    width: d.f(2.4, 3.2),
    opacity: 0.4,
  });
  shapes.push({ d: disc(50, cy, nub * 0.62), fill: p.spark });
  shapes.push({ d: disc(50, cy, nub * 0.26), fill: p.plateTo, opacity: 0.6 });
  return shapes;
};

export const SQUASH: readonly Draw[] = [gourd, pear, flattened];
