/**
 * Path primitives for the generated glyphs.
 *
 * Everything is authored on a 100x100 canvas so a spec is resolution free: the
 * same numbers render at 28px in a list row and at 160px in a detail sheet.
 * These builders are the whole vocabulary — the archetypes in `glyph.ts` only
 * combine them, they never emit path syntax of their own.
 */

import type { Dice } from "../lib/hash.ts";

/** Path data stays short: one decimal is below a pixel at any icon size. */
export function num(value: number): string {
  return value.toFixed(1);
}

const RAD = Math.PI / 180;

/** Unit direction and its left normal for an angle in degrees (0 = right, 90 = down). */
function axes(angle: number): [number, number, number, number] {
  const a = angle * RAD;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  return [dx, dy, -dy, dx];
}

/** Straight segment — stroke it with a round cap to get a capsule. */
export function bar(x1: number, y1: number, x2: number, y2: number): string {
  return `M${num(x1)} ${num(y1)}L${num(x2)} ${num(y2)}`;
}

/** Full circle. The spec renders paths only, so circles are paths too. */
export function disc(cx: number, cy: number, r: number): string {
  const w = num(r * 2);
  return `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${w} 0a${num(r)} ${num(r)} 0 1 0 -${w} 0Z`;
}

/** Single quadratic — bent stems, ribs, shoots. */
export function curve(
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
): string {
  return `M${num(x0)} ${num(y0)}Q${num(cx)} ${num(cy)} ${num(x1)} ${num(y1)}`;
}

/**
 * Tapering body: a broad rounded shoulder at `y0` narrowing to a point at
 * `y1`. Carrots, parsnips, radishes — the whole root family is this curve with
 * different proportions.
 */
export function taper(
  cx: number,
  y0: number,
  y1: number,
  halfWidth: number,
  shoulder: number,
): string {
  const span = y1 - y0;
  const waist = num(y0 + span * 0.45);
  const near = num(y1 - span * 0.18);
  return (
    `M${num(cx - halfWidth)} ${num(y0)}` +
    `C${num(cx - halfWidth)} ${waist} ${num(cx - halfWidth * 0.34)} ${near} ${num(cx)} ${num(y1)}` +
    `C${num(cx + halfWidth * 0.34)} ${near} ${num(cx + halfWidth)} ${waist} ${num(cx + halfWidth)} ${num(y0)}` +
    `Q${num(cx)} ${num(y0 - shoulder)} ${num(cx - halfWidth)} ${num(y0)}Z`
  );
}

/**
 * Teardrop rooted at (x, y) pointing along `angle`: the workhorse for
 * anything leafy. `width` is the half-width at the widest point.
 */
export function leaf(x: number, y: number, angle: number, length: number, width: number): string {
  const [dx, dy, px, py] = axes(angle);
  const tipX = x + dx * length;
  const tipY = y + dy * length;
  const belly = 0.46 * length;
  const mx = x + dx * belly;
  const my = y + dy * belly;
  return (
    `M${num(x)} ${num(y)}` +
    `Q${num(mx + px * width)} ${num(my + py * width)} ${num(tipX)} ${num(tipY)}` +
    `Q${num(mx - px * width)} ${num(my - py * width)} ${num(x)} ${num(y)}Z`
  );
}

/** Pointed at both ends — pods, seeds, petals. `length` is tip to tip. */
export function lens(cx: number, cy: number, angle: number, length: number, width: number): string {
  const [dx, dy, px, py] = axes(angle);
  const half = length / 2;
  const ax = cx - dx * half;
  const ay = cy - dy * half;
  const bx = cx + dx * half;
  const by = cy + dy * half;
  return (
    `M${num(ax)} ${num(ay)}` +
    `Q${num(cx + px * width)} ${num(cy + py * width)} ${num(bx)} ${num(by)}` +
    `Q${num(cx - px * width)} ${num(cy - py * width)} ${num(ax)} ${num(ay)}Z`
  );
}

/** Open elliptical arc, degrees, clockwise when `to > from`. */
export function arc(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  from: number,
  to: number,
): string {
  const x0 = cx + rx * Math.cos(from * RAD);
  const y0 = cy + ry * Math.sin(from * RAD);
  const x1 = cx + rx * Math.cos(to * RAD);
  const y1 = cy + ry * Math.sin(to * RAD);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  const sweep = to > from ? 1 : 0;
  return `M${num(x0)} ${num(y0)}A${num(rx)} ${num(ry)} 0 ${large} ${sweep} ${num(x1)} ${num(y1)}`;
}

/** Closed arc — a filled dome or wedge. */
export function dome(cx: number, cy: number, rx: number, ry: number): string {
  return `${arc(cx, cy, rx, ry, 180, 360)}Z`;
}

/**
 * Organic closed outline: sample `lobes` radii around an ellipse, then join the
 * samples with a closed Catmull-Rom spline converted to cubics. `jitter` is the
 * fraction of the radius the samples may wander, which is what separates a
 * potato from a perfect circle.
 */
export function blob(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  lobes: number,
  jitter: number,
  d: Dice,
): string {
  const pts: [number, number][] = [];
  const spin = d.f(0, 360) * RAD;
  for (let i = 0; i < lobes; i++) {
    const a = spin + (i / lobes) * Math.PI * 2;
    const k = 1 + d.f(-jitter, jitter);
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }

  let path = `M${num(pts[0]![0])} ${num(pts[0]![1])}`;
  for (let i = 0; i < lobes; i++) {
    const p0 = pts[(i - 1 + lobes) % lobes]!;
    const p1 = pts[i]!;
    const p2 = pts[(i + 1) % lobes]!;
    const p3 = pts[(i + 2) % lobes]!;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    path += `C${num(c1x)} ${num(c1y)} ${num(c2x)} ${num(c2y)} ${num(p2[0])} ${num(p2[1])}`;
  }
  return `${path}Z`;
}

/** Sine ribbon across the canvas — seaweed, water, anything that undulates. */
export function wave(
  x0: number,
  x1: number,
  y: number,
  amplitude: number,
  cycles: number,
  phase: number,
): string {
  const steps = 22;
  let path = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x0 + (x1 - x0) * t;
    const py = y + Math.sin(phase + t * cycles * Math.PI * 2) * amplitude;
    path += `${i === 0 ? "M" : "L"}${num(x)} ${num(py)}`;
  }
  return path;
}

/** Archimedean spiral — the unfurling shoot. Returns the path and its end point. */
export function spiral(
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  turns: number,
  phase: number,
): { path: string; endX: number; endY: number; endAngle: number } {
  const steps = 44;
  let path = "";
  let endX = cx;
  let endY = cy;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = phase + t * turns * Math.PI * 2;
    const r = r0 + (r1 - r0) * t;
    endX = cx + Math.cos(a) * r;
    endY = cy + Math.sin(a) * r;
    path += `${i === 0 ? "M" : "L"}${num(endX)} ${num(endY)}`;
  }
  return { path, endX, endY, endAngle: (phase + turns * Math.PI * 2) / RAD + 90 };
}

/** Point and tangent on a quadratic bezier — used to hang leaflets off a stem. */
export function onQuad(
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  t: number,
): { x: number; y: number; angle: number } {
  const u = 1 - t;
  const x = u * u * x0 + 2 * u * t * cx + t * t * x1;
  const y = u * u * y0 + 2 * u * t * cy + t * t * y1;
  const tx = 2 * (u * (cx - x0) + t * (x1 - cx));
  const ty = 2 * (u * (cy - y0) + t * (y1 - cy));
  return { x, y, angle: Math.atan2(ty, tx) / RAD };
}

/** Plate silhouette: rounded rect with per-corner radii, clockwise from top-left. */
export function roundRect(
  x: number,
  y: number,
  w: number,
  h: number,
  [tl, tr, br, bl]: [number, number, number, number],
): string {
  return (
    `M${num(x + tl)} ${num(y)}` +
    `H${num(x + w - tr)}A${num(tr)} ${num(tr)} 0 0 1 ${num(x + w)} ${num(y + tr)}` +
    `V${num(y + h - br)}A${num(br)} ${num(br)} 0 0 1 ${num(x + w - br)} ${num(y + h)}` +
    `H${num(x + bl)}A${num(bl)} ${num(bl)} 0 0 1 ${num(x)} ${num(y + h - bl)}` +
    `V${num(y + tl)}A${num(tl)} ${num(tl)} 0 0 1 ${num(x + tl)} ${num(y)}Z`
  );
}
