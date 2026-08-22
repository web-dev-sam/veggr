/**
 * Local-time day and week keys.
 *
 * Everything is keyed on the user's own calendar: a salad at 23:30 belongs to
 * that evening, not to UTC tomorrow. Weeks are ISO weeks (Monday start), which
 * is what makes "this week" a stable bucket that never shifts under a stored
 * history.
 *
 * Keys are language-independent; every *label* built from one is not, so the
 * display helpers read the message catalogue rather than hardcoding English.
 */

import { t, tList } from "../i18n/index.ts";

/** `YYYY-MM-DD` in local time — the day bucket key and a sortable string. */
export function dayKey(at: number | Date): string {
  const d = at instanceof Date ? at : new Date(at);
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function fromDayKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y!, m! - 1, d!);
}

/** Midnight on the Monday of that date's week. */
export function startOfWeek(at: number | Date): Date {
  const d = at instanceof Date ? new Date(at) : new Date(at);
  d.setHours(0, 0, 0, 0);
  // getDay(): 0 = Sunday, so Sunday is 6 days into a Monday-start week.
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

/**
 * `YYYY-Www` using the Monday of the week. Not strictly ISO 8601 week
 * numbering — it is the Monday's own date, which sorts correctly and never
 * disagrees with `startOfWeek`.
 */
export function weekKey(at: number | Date): string {
  const monday = startOfWeek(at);
  const jan1 = new Date(monday.getFullYear(), 0, 1);
  const days = Math.round((monday.getTime() - jan1.getTime()) / 86_400_000);
  const week = Math.floor((days + ((jan1.getDay() + 6) % 7)) / 7) + 1;
  return `${monday.getFullYear()}-W${`${week}`.padStart(2, "0")}`;
}

export function addDays(at: number | Date, days: number): Date {
  const d = at instanceof Date ? new Date(at) : new Date(at);
  d.setDate(d.getDate() + days);
  return d;
}

/** Monday-indexed short weekday name. */
export function weekdayShort(at: number | Date): string {
  const d = at instanceof Date ? at : new Date(at);
  return tList("date.weekdays")[(d.getDay() + 6) % 7]!;
}

/** `18 Aug` / `18. Aug` — short enough for a list row, unambiguous in a year. */
export function shortDate(at: number | Date): string {
  const d = at instanceof Date ? at : new Date(at);
  return t("date.dayMonth", { day: d.getDate(), month: tList("date.months")[d.getMonth()]! });
}

/** "Today" / "Yesterday" / "Mon 18 Aug" — the label a person expects. */
export function dayLabel(key: string, now = Date.now()): string {
  if (key === dayKey(now)) return t("date.today");
  if (key === dayKey(addDays(now, -1))) return t("date.yesterday");
  const d = fromDayKey(key);
  return t("date.weekdayDate", { weekday: weekdayShort(d), date: shortDate(d) });
}

/**
 * The same label for mid-sentence use, as in "Add to today". Only the relative
 * words change case — an absolute date keeps its capitals in both languages,
 * and German would be wrong to lowercase the month at all.
 */
export function dayLabelCasual(key: string, now = Date.now()): string {
  if (key === dayKey(now)) return t("date.todayCasual");
  if (key === dayKey(addDays(now, -1))) return t("date.yesterdayCasual");
  return dayLabel(key, now);
}

/** "This week" / "Last week" / "11 - 17 Aug" / "27 Jul - 2 Aug". */
export function weekLabel(key: string, now = Date.now()): string {
  if (key === weekKey(now)) return t("date.thisWeek");
  if (key === weekKey(addDays(startOfWeek(now), -1))) return t("date.lastWeek");
  const [year, week] = key.split("-W");
  const monday = mondayOf(Number(year), Number(week));
  const sunday = addDays(monday, 6);
  // A week straddling two months needs both, or "27 - 2 Aug" reads as nonsense.
  const from =
    monday.getMonth() === sunday.getMonth()
      ? t("date.dayOnly", { day: monday.getDate() })
      : shortDate(monday);
  return `${from} - ${shortDate(sunday)}`;
}

/**
 * Inverse of `weekKey`. Week 1 is the week containing 1 January, so its Monday
 * can sit in the previous December — the same convention `weekKey` counts with.
 */
export function mondayOf(year: number, week: number): Date {
  return addDays(startOfWeek(new Date(year, 0, 1)), (week - 1) * 7);
}

/** `HH:MM` in local time. */
export function clockTime(at: number): string {
  const d = new Date(at);
  return `${`${d.getHours()}`.padStart(2, "0")}:${`${d.getMinutes()}`.padStart(2, "0")}`;
}
