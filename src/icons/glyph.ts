/**
 * The icon engine.
 *
 * Four hundred-odd plants need four hundred-odd icons, and hand-drawing them is
 * not a thing anyone should do. Instead each plant's id seeds a small PRNG, its
 * category picks a family of silhouettes, and its hue builds the palette. Same
 * id in, same glyph out, forever — so an icon is a stable visual name.
 *
 * Variety comes from four independent axes, which matters because a category
 * like `leafy` holds dozens of entries that are all green:
 *
 *   1. silhouette — each family offers several (see families/*.ts)
 *   2. hue drift  — separates neighbours that share an authored hue
 *   3. plate      — six background shapes, readable even at 32px
 *   4. pose       — a small rotation and scale, so no two are stamped alike
 *
 * The forms stay abstract on purpose: a bulb is concentric arcs with a gap, a
 * pod is a lens with seed dots. Nobody has to recognise a botanical portrait,
 * they only have to tell the icons apart at a glance.
 */

import type { PlantCategory, Plant } from "../data/plant.ts";
import { palette } from "../lib/color.ts";
import { dice } from "../lib/hash.ts";
import { BRASSICA, HERB, LEAFY, SEA, SPROUT } from "./families/greens.ts";
import { FRUITING, LEGUME, SQUASH } from "./families/fruits.ts";
import { FRUIT, fruitForms } from "./families/fruit.ts";
import { ALLIUM, MUSHROOM, ROOT, STEM, TUBER } from "./families/roots.ts";
import { GRAIN, NUT, SEED, SPICE, SWEET } from "./families/pantry.ts";
import { roundRect } from "./shapes.ts";
import type { Draw, Shape } from "./spec.ts";

export type { Shape } from "./spec.ts";

const FAMILIES: Record<PlantCategory, readonly Draw[]> = {
  leafy: LEAFY,
  brassica: BRASSICA,
  herb: HERB,
  sprout: SPROUT,
  sea: SEA,
  root: ROOT,
  tuber: TUBER,
  allium: ALLIUM,
  fruiting: FRUITING,
  fruit: FRUIT,
  legume: LEGUME,
  squash: SQUASH,
  stem: STEM,
  mushroom: MUSHROOM,
  nut: NUT,
  seed: SEED,
  grain: GRAIN,
  spice: SPICE,
  sweet: SWEET,
};

/** Per-corner radii, clockwise from top-left, in the icon's 100-unit box. */
type Corners = [number, number, number, number];

const PLATE_INSET = 3;
const PLATE_SIDE = 100 - PLATE_INSET * 2;

/**
 * How far the selection ring sits outside the plate.
 *
 * Concentric rounded rects need `outer_r = inner_r + gap`; give both the same
 * radius and the corners bow away from each other. A single CSS `border-radius`
 * could satisfy neither that rule nor six different plates, which is why the
 * ring is generated here instead.
 */
const RING_GAP = 7;

/**
 * The silhouette behind the glyph. Varying it gives the set a difference that
 * survives being shrunk to a list row, where the inner detail is already gone.
 *
 * Corners rather than finished paths, because the ring has to be built from the
 * plate's own numbers to be the same shape as it.
 */
const PLATE_CORNERS: Corners[] = [
  [30, 30, 30, 30],
  [47, 47, 47, 47],
  [16, 16, 16, 16],
  [44, 16, 44, 16],
  [16, 44, 16, 44],
  [47, 47, 20, 20],
];

function grow(corners: Corners, by: number): Corners {
  return [corners[0] + by, corners[1] + by, corners[2] + by, corners[3] + by];
}

const PLATES = PLATE_CORNERS.map((corners) =>
  roundRect(PLATE_INSET, PLATE_INSET, PLATE_SIDE, PLATE_SIDE, corners),
);

/**
 * The plate grown by `RING_GAP` on every side. The 47-radius plate is a circle,
 * and 47 + 7 is exactly half of its grown box, so it stays one.
 */
const RINGS = PLATE_CORNERS.map((corners) =>
  roundRect(
    PLATE_INSET - RING_GAP,
    PLATE_INSET - RING_GAP,
    PLATE_SIDE + RING_GAP * 2,
    PLATE_SIDE + RING_GAP * 2,
    grow(corners, RING_GAP),
  ),
);

/** Gradient directions for the plate, so identical shapes still catch light differently. */
const GRADIENTS = [
  [0, 0, 0.85, 1],
  [0, 0.2, 1, 0.8],
  [0.15, 0, 0.85, 1],
  [1, 0, 0, 1],
] as const;

export type IconSpec = {
  /** Background silhouette path. */
  plate: string;
  /** The plate grown outwards, for a selection ring that matches its shape. */
  ring: string;
  plateFrom: string;
  plateTo: string;
  /** Gradient vector as `[x1, y1, x2, y2]` in objectBoundingBox units. */
  gradient: readonly [number, number, number, number];
  /** SVG transform for the glyph group: a slight rotation and scale. */
  pose: string;
  /** Flat colour for chips, bars and rings outside the icon. */
  tint: string;
  shapes: Shape[];
};

const cache = new Map<string, IconSpec>();

/**
 * Icons render in long scrolling lists, so specs are memoised by id: the trig
 * and path building happens once per plant per session.
 */
export function plantIcon(plant: Plant): IconSpec {
  const cached = cache.get(plant.id);
  if (cached) return cached;

  const d = dice(plant.id);
  // ±24° separates the 47 near-identical greens without turning a brown
  // mushroom pink, which ±30° did.
  const p = palette(plant.hue, d.f(-24, 24));
  const family = FAMILIES[plant.category];
  // Fruit is the one family whose silhouettes portray a specific fruit instead
  // of an abstract form, so a recognisable name narrows the pool before the
  // hash picks from it. The three `d.i` draws stay in place, so nothing else moves.
  const pool = (plant.category === "fruit" ? fruitForms(plant.name) : null) ?? family;
  const tilt = d.f(-9, 9);
  const scale = d.f(0.92, 1.06);

  // Drawn before the literal so the plate index can feed both paths. It stays
  // the first `d.i` of the three, which is what keeps every existing icon
  // identical to the build before this change.
  const plate = d.i(0, PLATES.length - 1);

  const spec: IconSpec = {
    plate: PLATES[plate]!,
    ring: RINGS[plate]!,
    plateFrom: p.plateFrom,
    plateTo: p.plateTo,
    gradient: GRADIENTS[d.i(0, GRADIENTS.length - 1)]!,
    pose: `translate(50 50) rotate(${tilt.toFixed(1)}) scale(${scale.toFixed(3)}) translate(-50 -50)`,
    tint: p.tint,
    shapes: pool[d.i(0, pool.length - 1)]!(d, p),
  };
  cache.set(plant.id, spec);
  return spec;
}
