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

import { type Locale, locale, plantName, plantSearchTerms } from "../i18n/index.ts";
import type { Plant } from "./plant.ts";
import { FRUITING } from "./plants/fruiting.ts";
import { GREENS } from "./plants/greens.ts";
import { HERBS } from "./plants/herbs.ts";
import { NUTS } from "./plants/nuts.ts";
import { ORCHARD } from "./plants/orchard.ts";
import { ROOTS } from "./plants/roots.ts";
import { SEEDS } from "./plants/seeds.ts";
import { SPICES } from "./plants/spices.ts";
import { STEMS } from "./plants/stems.ts";
import { TROPICAL } from "./plants/tropical.ts";

/** Canonical order, by English name — a stable identity for the whole set. */
export const PLANTS: readonly Plant[] = [
  ...GREENS,
  ...HERBS,
  ...ROOTS,
  ...FRUITING,
  ...STEMS,
  ...NUTS,
  ...SEEDS,
  ...SPICES,
  ...ORCHARD,
  ...TROPICAL,
].sort((a, b) => a.name.localeCompare(b.name));

const byId = new Map(PLANTS.map((plant) => [plant.id, plant]));

/**
 * Stored entries reference ids, so a log written by an older release can point
 * at an id this build no longer ships. Callers get `undefined` and skip it
 * rather than crashing on someone's history.
 */
export function plantById(id: string): Plant | undefined {
  return byId.get(id);
}

/** Alphabetical in the *reading* language: Aubergine sorts under A, Eierfrucht under E. */
const alphabetical = new Map<Locale, Plant[]>();

function byName(): Plant[] {
  const key = locale.value;
  let list = alphabetical.get(key);
  if (!list) {
    list = [...PLANTS].sort((a, b) => plantName(a).localeCompare(plantName(b), key));
    alphabetical.set(key, list);
  }
  return list;
}

/**
 * Search-normalised text. `expand` spells German umlauts the way a keyboard
 * without them does, and it has to run *before* the diacritic strip: let "ö"
 * collapse to "o" first and "moehre" stops matching Möhre. Stripping afterwards
 * is what lets "chicoree" find Chicorée and "jalapeno" find Jalapeño.
 */
function fold(text: string, expand: boolean): string {
  const lower = text.toLowerCase();
  return (expand ? lower.replaceAll("ä", "ae").replaceAll("ö", "oe").replaceAll("ü", "ue") : lower)
    .replaceAll("ß", "ss")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

/**
 * Both spellings of one term, deduplicated.
 *
 * Expansion alone is not enough: Kürbiskerne gets typed "kuerbiskerne" on a
 * layout that follows the convention and "kurbiskerne" on one that just drops
 * the dots, and expanding only ever produces the first. So a term is indexed
 * under both and the query is folded once — whichever way it was typed, it
 * lands on one of them. Most of the catalogue carries no diacritic at all, so
 * the two spellings are usually the same string and only one is kept.
 */
function foldBoth(text: string): string[] {
  const expanded = fold(text, true);
  const bare = fold(text, false);
  return expanded === bare ? [expanded] : [expanded, bare];
}

/**
 * Folded haystack per plant, built once per language — search runs on every
 * keypress. The terms include both languages' names and aliases, so typing
 * "kale" still finds Grünkohl.
 */
type Haystack = { terms: string; names: string[] };

const haystacks = new Map<Locale, Map<string, Haystack>>();

function haystack(): Map<string, Haystack> {
  const key = locale.value;
  let built = haystacks.get(key);
  if (!built) {
    built = new Map(
      PLANTS.map((plant) => [
        plant.id,
        {
          terms: foldBoth(plantSearchTerms(plant).join(" ")).join(" "),
          names: foldBoth(plantName(plant)),
        },
      ]),
    );
    haystacks.set(key, built);
  }
  return built;
}

/**
 * Name-and-alias search. Prefix matches outrank substring matches so typing
 * "cab" puts Cabbage above Napa Cabbage — ranked on the displayed name, since
 * that is the word the user is looking at while typing.
 */
export function searchPlants(query: string): Plant[] {
  const q = fold(query.trim(), true);
  if (!q) return [...byName()];

  const hay = haystack();
  const hits: { plant: Plant; rank: number; length: number }[] = [];
  for (const plant of byName()) {
    const { terms, names } = hay.get(plant.id)!;
    const at = terms.indexOf(q);
    if (at < 0) continue;
    const rank = names.some((name) => name.startsWith(q))
      ? 0
      : at === 0
        ? 1
        : names.some((name) => name.includes(q))
          ? 2
          : 3;
    hits.push({ plant, rank, length: names[0]!.length });
  }
  return hits.sort((a, b) => a.rank - b.rank || a.length - b.length).map((hit) => hit.plant);
}
