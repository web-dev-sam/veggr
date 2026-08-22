/**
 * The catalogue contract.
 *
 * Plants are content, not code: every field exists because some part of the
 * UI needs it and nothing else. `id` is the only load-bearing field — a stored
 * log entry points at one, so ids are append-only forever and never renamed.
 */

/**
 * Category ids, in the order the UI groups them. Display labels live in the
 * message catalogue under `cat.<id>` — these are keys, not words.
 */
export const CATEGORY_IDS = [
  "leafy",
  "brassica",
  "herb",
  "sprout",
  "root",
  "tuber",
  "allium",
  "fruiting",
  "legume",
  "squash",
  "stem",
  "mushroom",
  "sea",
  // Pantry classes last: they are what a spice rack adds to a vegetable
  // drawer, and appending keeps the produce chips in the order they had.
  "nut",
  "seed",
  "spice",
] as const;

export type PlantCategory = (typeof CATEGORY_IDS)[number];

export type Plant = {
  /** Stable kebab-case key. Referenced by stored entries — never rename. */
  id: string;
  /**
   * Common English name, title case, short enough for a list row. This is the
   * fallback and the search anchor in every language; translations live in
   * `src/i18n/plants/` and are looked up by `id`.
   */
  name: string;
  category: PlantCategory;
  /** Real-world hue in degrees (0-359). Anchors the generated icon palette. */
  hue: number;
  /** Extra search terms: regional names, plurals, common alternatives. */
  aliases: string[];
};
