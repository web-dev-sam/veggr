/**
 * The two bits of shared wording. Everything the app displays is a count of
 * different vegetables, so this is all the formatting there is.
 */

import { t } from "../i18n/index.ts";

/** "1 kind" / "7 kinds" / "7 Sorten" — the unit the whole app counts in. */
export function kinds(count: number): string {
  return t("common.kinds", { n: count });
}

/** Percentage of a target, clamped for display only. */
export function pct(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
}
