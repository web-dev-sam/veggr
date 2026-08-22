/**
 * User preferences: two targets and a language. The targets exist because the
 * app makes exactly two promises — eat several different plants today, and
 * many different ones this week.
 */

import { type Locale, isLocale } from "../i18n/locale.ts";
import { reactive, watch } from "vue";

const KEY = "veggr.settings.v1";

export type Settings = {
  /** Different plants per day. */
  dailyVariety: number;
  /** Different plants per week — the "30 plants" challenge target. */
  weeklyVariety: number;
  /** Interface and plant names. */
  locale: Locale;
};

/**
 * First run follows the browser rather than asking. `de-AT` and `de-CH` are
 * German speakers too, so match on the primary subtag only.
 */
function preferredLocale(): Locale {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const primary = tag.split("-")[0];
    if (isLocale(primary)) return primary;
  }
  return "en";
}

const DEFAULTS: Settings = { dailyVariety: 5, weeklyVariety: 30, locale: "en" };

function load(): Settings {
  const fallback: Settings = { ...DEFAULTS, locale: preferredLocale() };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fallback;
    // Amount-era keys (`dailyPortions`, `unit`) are ignored; `weeklyVariety`
    // was always a variety target and carries straight over.
    const stored = JSON.parse(raw) as Partial<Settings>;
    return {
      dailyVariety:
        typeof stored.dailyVariety === "number" && stored.dailyVariety > 0
          ? stored.dailyVariety
          : fallback.dailyVariety,
      weeklyVariety:
        typeof stored.weeklyVariety === "number" && stored.weeklyVariety > 0
          ? stored.weeklyVariety
          : fallback.weeklyVariety,
      // A settings blob written before this release has no locale, so an
      // existing user gets the browser's language rather than English.
      locale: isLocale(stored.locale) ? stored.locale : fallback.locale,
    };
  } catch {
    return fallback;
  }
}

export const settings = reactive<Settings>(load());

watch(
  settings,
  (value) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(value));
    } catch {
      // Private mode or a full quota. Preferences are not a blocker.
    }
  },
  { deep: true },
);
