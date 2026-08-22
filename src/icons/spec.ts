/**
 * The glyph vocabulary's type layer, separate from the engine so the family
 * modules and `glyph.ts` can share it without importing each other.
 */

import type { Palette } from "../lib/color.ts";
import type { Dice } from "../lib/hash.ts";

/** One drawn element. Either filled or stroked, never both. */
export type Shape = {
  d: string;
  fill?: string;
  stroke?: string;
  width?: number;
  opacity?: number;
};

/**
 * One silhouette within a family, on a 100x100 canvas.
 *
 * Every category owns several of these. Varying counts and angles inside a
 * single silhouette is not enough: at 54px, forty leafy vegetables drawn as the
 * same fan of leaves in the same green read as forty copies. Different
 * silhouettes are what actually make them tellable apart, so each family offers
 * a handful and the vegetable's hash picks one.
 */
export type Draw = (d: Dice, p: Palette) => Shape[];

export const TAU = Math.PI * 2;
export const DEG = Math.PI / 180;
