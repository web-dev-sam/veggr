/**
 * The assembled catalogue.
 *
 * The group files are split for authoring sanity only; nothing outside this
 * module should import them directly.
 *
 * Everything user-visible here is language-dependent: the alphabet a list is
 * sorted by and the words a search matches both change with the locale, so both
 * are memoised per language rather than computed once at module load.
 */

import { type Locale, locale, vegName, vegSearchTerms } from "../i18n/index.ts";
import type { Vegetable } from "./vegetable.ts";
import { FRUITING } from "./veg/fruiting.ts";
import { GREENS } from "./veg/greens.ts";
import { HERBS } from "./veg/herbs.ts";
import { NUTS } from "./veg/nuts.ts";
import { ROOTS } from "./veg/roots.ts";
import { SEEDS } from "./veg/seeds.ts";
import { SPICES } from "./veg/spices.ts";
import { STEMS } from "./veg/stems.ts";

/** Canonical order, by English name — a stable identity for the whole set. */
export const VEGETABLES: readonly Vegetable[] = [
  ...GREENS,
  ...HERBS,
  ...ROOTS,
  ...FRUITING,
  ...STEMS,
  ...NUTS,
  ...SEEDS,
  ...SPICES,
].sort((a, b) => a.name.localeCompare(b.name));

const byId = new Map(VEGETABLES.map((veg) => [veg.id, veg]));

/**
 * Stored entries reference ids, so a log written by an older release can point
 * at an id this build no longer ships. Callers get `undefined` and skip it
 * rather than crashing on someone's history.
 */
export function vegetable(id: string): Vegetable | undefined {
  return byId.get(id);
}

/** Alphabetical in the *reading* language: Aubergine sorts under A, Eierfrucht under E. */
const alphabetical = new Map<Locale, Vegetable[]>();

function byName(): Vegetable[] {
  const key = locale.value;
  let list = alphabetical.get(key);
  if (!list) {
    list = [...VEGETABLES].sort((a, b) => vegName(a).localeCompare(vegName(b), key));
    alphabetical.set(key, list);
  }
  return list;
}

/**
 * Search-normalised text: lowercased, with German umlauts expanded the way a
 * keyboard without them types them, then any remaining diacritic stripped.
 *
 * The expansion has to run *before* the strip, or "ö" collapses to "o" and
 * "moehre" stops matching Möhre — which is most of the point. Stripping
 * afterwards is what lets "chicoree" find Chicorée and "jalapeno" find Jalapeño.
 */
function fold(text: string): string {
  return text
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

/**
 * Folded haystack per vegetable, built once per language — search runs on every
 * keypress. The terms include both languages' names and aliases, so typing
 * "kale" still finds Grünkohl.
 */
const haystacks = new Map<Locale, Map<string, string>>();

function haystack(): Map<string, string> {
  const key = locale.value;
  let built = haystacks.get(key);
  if (!built) {
    built = new Map(VEGETABLES.map((veg) => [veg.id, fold(vegSearchTerms(veg).join(" "))]));
    haystacks.set(key, built);
  }
  return built;
}

/**
 * Name-and-alias search. Prefix matches outrank substring matches so typing
 * "cab" puts Cabbage above Napa Cabbage — ranked on the displayed name, since
 * that is the word the user is looking at while typing.
 */
export function searchVegetables(query: string): Vegetable[] {
  const q = fold(query.trim());
  if (!q) return [...byName()];

  const hay = haystack();
  const hits: { veg: Vegetable; rank: number; length: number }[] = [];
  for (const veg of byName()) {
    const at = hay.get(veg.id)!.indexOf(q);
    if (at < 0) continue;
    const name = fold(vegName(veg));
    const rank = name.startsWith(q) ? 0 : at === 0 ? 1 : name.includes(q) ? 2 : 3;
    hits.push({ veg, rank, length: name.length });
  }
  return hits.sort((a, b) => a.rank - b.rank || a.length - b.length).map((hit) => hit.veg);
}
