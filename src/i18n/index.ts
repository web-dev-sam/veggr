/**
 * Translation runtime. No dependency: the app needs a flat keyed catalogue,
 * `{placeholder}` interpolation and a two-form plural — which is all of about
 * forty lines — and in exchange `t()` is compile-time checked against `en`,
 * where a library would hand back the key at runtime and shrug.
 *
 * `t()` reads `settings.locale` on every call, so anything that renders a
 * translated string re-renders when the language changes. That only works while
 * translation stays *inside* the render: a `const label = t(...)` at module
 * scope is captured once and silently stops updating.
 */

import { computed, watch } from "vue";
import type { VegCategory, Vegetable } from "../data/vegetable.ts";
import { settings } from "../stores/settings.ts";
import { de } from "./de.ts";
import { type MessageKey, en } from "./en.ts";
import { type Locale, LOCALE_NAMES, LOCALES } from "./locale.ts";
import { VEG_NAMES } from "./veg/index.ts";

export { LOCALE_NAMES, LOCALES, type Locale, type MessageKey };

const TABLES: Record<Locale, Record<MessageKey, string>> = { en, de };

export const locale = computed<Locale>(() => settings.locale);

export function setLocale(next: Locale): void {
  settings.locale = next;
}

type Params = Record<string, string | number>;

/** Messages that are a `|`-separated list of names, not a sentence. */
type ListKey = "date.weekdays" | "date.months";

type HasPair<S> = S extends `${string}|${string}` ? true : false;

/**
 * Keys carrying a `one|other` pair in *either* language, so a count is required
 * to render them at all.
 *
 * Worth deriving rather than listing: `today.dayStreak` is invariant in English
 * and inflected in German, so a developer working in English would never notice
 * the missing `n` — and the message would render as "Tag in Folge|Tage in Folge"
 * only for German users.
 */
type PluralKey = Exclude<
  {
    [K in MessageKey]: HasPair<(typeof en)[K]> extends true
      ? K
      : HasPair<(typeof de)[K]> extends true
        ? K
        : never;
  }[MessageKey],
  ListKey
>;

/** A key that renders on its own, with no count or placeholder to supply. */
export type LabelKey = Exclude<MessageKey, ListKey | PluralKey>;

function message(key: MessageKey): string {
  // `en` is the fallback for its own sake too: a hand-edited locale table that
  // lost a key should degrade to English, not render "undefined".
  return TABLES[settings.locale][key] || en[key];
}

/**
 * Picks the plural form. Both supported languages use the same rule (one for
 * exactly 1, other for everything else), and whether a given message needs two
 * forms at all is a property of the language: "{n} Treffer" is invariant in
 * German where English needs "match|matches".
 */
function pick(raw: string, params: Params | undefined): string {
  if (params?.n === undefined) return raw;
  const split = raw.indexOf("|");
  if (split < 0) return raw;
  return Number(params.n) === 1 ? raw.slice(0, split) : raw.slice(split + 1);
}

/**
 * A message, interpolated and inflected.
 *
 * The overloads make the two ways of getting this wrong unrepresentable: a
 * plural key without `n` would render "1 kind|7 kinds", and a list key would
 * render one weekday, so neither call compiles.
 */
export function t(key: Exclude<MessageKey, ListKey | PluralKey>, params?: Params): string;
export function t(key: PluralKey, params: Params & { n: number }): string;
export function t(key: MessageKey, params?: Params): string {
  const picked = pick(message(key), params);
  if (!params) return picked;
  return picked.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in params ? String(params[name]) : whole,
  );
}

/**
 * The weekday and month name lists. Split once per distinct value — keying the
 * cache on the message itself means a language switch produces a different key
 * and needs no invalidation.
 */
const lists = new Map<string, readonly string[]>();

export function tList(key: ListKey): readonly string[] {
  const raw = message(key);
  let parts = lists.get(raw);
  if (!parts) {
    parts = raw.split("|");
    lists.set(raw, parts);
  }
  return parts;
}

export function categoryLabel(id: VegCategory): string {
  return t(`cat.${id}`);
}

/** The catalogue name in the active language, falling back to English. */
export function vegName(veg: Vegetable): string {
  return VEG_NAMES[settings.locale]?.[veg.id]?.name ?? veg.name;
}

/**
 * Everything a search should match for one vegetable: the translated name plus
 * *both* alias sets and the English name. A German user who learned the word
 * "kale" still means Grünkohl, so localising must never remove a search term.
 */
export function vegSearchTerms(veg: Vegetable): string[] {
  const translated = VEG_NAMES[settings.locale]?.[veg.id];
  const terms = [veg.name, ...veg.aliases];
  if (translated) terms.push(translated.name, ...(translated.aliases ?? []));
  return terms;
}

/** Screen readers and `lang`-aware CSS need the document to agree with the UI. */
watch(
  locale,
  (value) => {
    document.documentElement.lang = value;
  },
  { immediate: true },
);
