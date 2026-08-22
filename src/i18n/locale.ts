/**
 * Locale identity. A leaf module on purpose: the settings store, the message
 * tables and the translated catalogue all need these types, and none of them
 * should have to import the runtime to get them.
 */

export const LOCALES = ["en", "de"] as const;

export type Locale = (typeof LOCALES)[number];

/** Endonyms — a language picker that names languages in English is useless. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Translated names for part of the catalogue, keyed by vegetable id.
 *
 * `aliases` is optional and *additive*: the English aliases stay searchable in
 * every locale, because a German user who types "kale" still means Grünkohl.
 */
export type VegLocale = Record<string, { name: string; aliases?: string[] }>;
