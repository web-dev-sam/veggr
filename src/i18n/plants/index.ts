/**
 * Translated catalogue names, assembled from the same group files the English
 * catalogue is authored in.
 *
 * `en` has no table on purpose: `Plant.name` *is* the English name, so the
 * absence of an entry is the fallback rather than a missing translation.
 */

import type { Locale, PlantLocale } from "../locale.ts";
import { FRUITING_DE } from "./fruiting.de.ts";
import { GREENS_DE } from "./greens.de.ts";
import { HERBS_DE } from "./herbs.de.ts";
import { NUTS_DE } from "./nuts.de.ts";
import { ORCHARD_DE } from "./orchard.de.ts";
import { ROOTS_DE } from "./roots.de.ts";
import { SEEDS_DE } from "./seeds.de.ts";
import { SPICES_DE } from "./spices.de.ts";
import { STEMS_DE } from "./stems.de.ts";
import { TROPICAL_DE } from "./tropical.de.ts";

const DE: PlantLocale = {
  ...GREENS_DE,
  ...HERBS_DE,
  ...ROOTS_DE,
  ...FRUITING_DE,
  ...STEMS_DE,
  ...NUTS_DE,
  ...SEEDS_DE,
  ...SPICES_DE,
  ...ORCHARD_DE,
  ...TROPICAL_DE,
};

export const PLANT_NAMES: Record<Locale, PlantLocale | null> = { en: null, de: DE };
