/**
 * The log and everything derived from it.
 *
 * The app tracks one thing: which *different* plants you ate, per day and
 * per week. So an entry is a tally mark, not a measurement — no amounts, no
 * portions. That makes a day a set of plants, which is why logging is a
 * toggle: tapping something already on today's list takes it off again rather
 * than adding a meaningless second copy.
 *
 * Every rollup is a computed built in one pass over the flat entry list. Days
 * aggregate first, then weeks fold from days: cheap enough to recompute on every
 * change, and impossible to leave stale.
 */

import { computed, reactive, watch } from "vue";
import { plantById } from "../data/catalog.ts";
import type { Plant } from "../data/plant.ts";
import { plantName } from "../i18n/index.ts";
import { currentDay, currentWeek } from "../lib/clock.ts";
import { addDays, dayKey, fromDayKey, mondayOf, weekKey } from "../lib/date.ts";
import { settings } from "./settings.ts";

export type Entry = {
  id: string;
  /** Catalogue id. May be missing from a future build — always resolve it. */
  plantId: string;
  /** Epoch ms. The day/week bucket is derived, never stored. */
  at: number;
};

const KEY = "veggr.log.v1";

/**
 * Two shapes predate the current one, and both are read rather than discarded:
 * entries written when the catalogue was vegetables-only name the id `vegId`,
 * and ones written before amounts were dropped also carry `grams`. The id is
 * accepted under either name, `grams` is simply not read, and the first save
 * after this rewrites the whole list in the current shape.
 */
function load(): Entry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry): Entry[] => {
      const plantId: unknown = entry?.plantId ?? entry?.vegId;
      if (typeof entry?.id !== "string") return [];
      if (typeof plantId !== "string" || typeof entry?.at !== "number") return [];
      return [{ id: entry.id, plantId, at: entry.at }];
    });
  } catch {
    return [];
  }
}

export const entries = reactive<Entry[]>(load());

watch(
  entries,
  (value) => {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify(value.map(({ id, plantId, at }) => ({ id, plantId, at }))),
      );
    } catch {
      // Private mode or a full quota. Nothing useful to do but keep running.
    }
  },
  { deep: true },
);

/* ------------------------------------------------------------- mutations */

export function isLogged(plantId: string, day: string): boolean {
  return entries.some((entry) => entry.plantId === plantId && dayKey(entry.at) === day);
}

/**
 * Put a plant on a day's list, or take it off. Returns the state it landed
 * in, so callers can word their confirmation correctly.
 *
 * Removal drops *every* entry for that plant on that day. A day is a set of
 * kinds, so "remove spinach from today" can only mean all of it — and it tidies
 * up the duplicates that amount-era builds were able to write.
 */
export function toggleLog(plantId: string, day: string = currentDay.value): boolean {
  const existing = entries.filter((entry) => entry.plantId === plantId && dayKey(entry.at) === day);
  if (existing.length > 0) {
    for (const entry of existing) {
      const at = entries.indexOf(entry);
      if (at >= 0) entries.splice(at, 1);
    }
    return false;
  }
  // Land a backdated entry at midday so it cannot drift into a neighbouring day.
  const at = day === dayKey(Date.now()) ? Date.now() : new Date(`${day}T12:00:00`).getTime();
  entries.push({
    id: `${at.toString(36)}-${Math.floor(Math.random() * 0xfffff).toString(36)}`,
    plantId,
    at,
  });
  return true;
}

/** Wipe everything. Only reachable behind a two-tap confirmation. */
export function clearLog(): void {
  entries.splice(0, entries.length);
}

/* ------------------------------------------------------------ aggregates */

export type DayStats = {
  key: string;
  /** Midnight of the day, for formatting. */
  at: number;
  /** Distinct plants — the only number this app reports. */
  variety: number;
  /** Newest logged first. */
  items: Plant[];
  /** Newest first. One per item, since a day is a set. */
  entries: Entry[];
};

/** How many days of a week one plant turned up on. */
export type WeekItem = { plant: Plant; days: number };

export type WeekStats = {
  key: string;
  start: number;
  variety: number;
  /** Most frequent first, then alphabetical. */
  items: WeekItem[];
  /** Monday to Sunday, always seven, empty days included. */
  days: DayStats[];
  /** Days that reached the daily variety target. */
  daysOnTarget: number;
};

function emptyDay(key: string): DayStats {
  return { key, at: fromDayKey(key).getTime(), variety: 0, items: [], entries: [] };
}

const dayIndex = computed(() => {
  const index = new Map<string, DayStats>();
  for (const entry of entries) {
    // An entry whose id has left the catalogue cannot be rendered or counted.
    if (!plantById(entry.plantId)) continue;
    const key = dayKey(entry.at);
    let day = index.get(key);
    if (!day) {
      day = emptyDay(key);
      index.set(key, day);
    }
    day.entries.push(entry);
  }
  for (const day of index.values()) {
    // A day is a set of kinds, so `entries` and `items` are one-to-one and in
    // the same order: newest mention first, duplicates from amount-era builds
    // dropped. Anything that renders a day's list therefore shows each
    // plant exactly once, however the stored data got there.
    const seen = new Set<string>();
    const unique: Entry[] = [];
    for (const entry of day.entries.sort((a, b) => b.at - a.at)) {
      if (seen.has(entry.plantId)) continue;
      seen.add(entry.plantId);
      unique.push(entry);
    }
    day.entries = unique;
    day.items = day.entries.map((entry) => plantById(entry.plantId)!);
    day.variety = day.items.length;
  }
  return index;
});

const weekIndex = computed(() => {
  const index = new Map<string, WeekStats>();
  const target = settings.dailyVariety;

  for (const day of dayIndex.value.values()) {
    const key = weekKey(day.at);
    let week = index.get(key);
    if (!week) {
      const [year, num] = key.split("-W");
      week = {
        key,
        start: mondayOf(Number(year), Number(num)).getTime(),
        variety: 0,
        items: [],
        days: [],
        daysOnTarget: 0,
      };
      index.set(key, week);
    }
    week.days.push(day);
    if (day.variety >= target) week.daysOnTarget += 1;
    for (const plant of day.items) {
      const found = week.items.find((item) => item.plant.id === plant.id);
      if (found) found.days += 1;
      else week.items.push({ plant, days: 1 });
    }
  }

  for (const week of index.values()) {
    week.variety = week.items.length;
    week.items.sort(
      (a, b) => b.days - a.days || plantName(a.plant).localeCompare(plantName(b.plant)),
    );
    // Pad to a full Mon-Sun so charts always render seven columns.
    const logged = new Map(week.days.map((day) => [day.key, day]));
    week.days = Array.from({ length: 7 }, (_, i) => {
      const key = dayKey(addDays(week.start, i));
      return logged.get(key) ?? emptyDay(key);
    });
  }
  return index;
});

/** Days with at least one entry, newest first. */
export const loggedDays = computed(() =>
  [...dayIndex.value.values()].sort((a, b) => b.key.localeCompare(a.key)),
);

/** Weeks with at least one entry, newest first. */
export const loggedWeeks = computed(() =>
  [...weekIndex.value.values()].sort((a, b) => b.start - a.start),
);

export function statsForDay(key: string): DayStats {
  return dayIndex.value.get(key) ?? emptyDay(key);
}

export function statsForWeek(key: string): WeekStats {
  const existing = weekIndex.value.get(key);
  if (existing) return existing;
  const [year, num] = key.split("-W");
  const start = mondayOf(Number(year), Number(num)).getTime();
  return {
    key,
    start,
    variety: 0,
    items: [],
    days: Array.from({ length: 7 }, (_, i) => emptyDay(dayKey(addDays(start, i)))),
    daysOnTarget: 0,
  };
}

export const today = computed(() => statsForDay(currentDay.value));

export const thisWeek = computed(() => statsForWeek(currentWeek.value));

/** First time each plant was ever logged — powers "new to you" badges. */
export const firstLogged = computed(() => {
  const seen = new Map<string, number>();
  for (const entry of entries) {
    const at = seen.get(entry.plantId);
    if (at === undefined || entry.at < at) seen.set(entry.plantId, entry.at);
  }
  return seen;
});

/** Distinct plants ever logged, out of the whole catalogue. */
export const discovered = computed(() => firstLogged.value.size);

/** Plants logged for the first time ever on the given day. */
export function firstsOn(key: string): Plant[] {
  return statsForDay(key).items.filter((plant) => {
    const at = firstLogged.value.get(plant.id);
    return at !== undefined && dayKey(at) === key;
  });
}

/**
 * Consecutive days that hit the variety target, counting back from today.
 * Today not being finished yet is not a broken streak, so an empty today keeps
 * yesterday's run alive and simply does not extend it.
 */
export const streak = computed(() => {
  const target = settings.dailyVariety;
  let days = 0;
  let cursor = fromDayKey(currentDay.value);
  if (statsForDay(dayKey(cursor)).variety < target) cursor = addDays(cursor, -1);
  while (statsForDay(dayKey(cursor)).variety >= target) {
    days += 1;
    cursor = addDays(cursor, -1);
  }
  return days;
});

/** Most-logged plants all time, by number of days — the usual suspects. */
export const favourites = computed(() => {
  const totals = new Map<string, WeekItem>();
  for (const day of dayIndex.value.values()) {
    for (const plant of day.items) {
      const row = totals.get(plant.id);
      if (row) row.days += 1;
      else totals.set(plant.id, { plant, days: 1 });
    }
  }
  return [...totals.values()].sort(
    (a, b) => b.days - a.days || plantName(a.plant).localeCompare(plantName(b.plant)),
  );
});
