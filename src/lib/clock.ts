/**
 * The current day, reactively.
 *
 * A tracker gets left open on a kitchen counter. Without this, a computed that
 * calls `Date.now()` would keep insisting it is still yesterday and the user
 * would log breakfast into the wrong day.
 */

import { computed, ref } from "vue";
import { dayKey, fromDayKey, weekKey } from "./date.ts";

export const currentDay = ref(dayKey(Date.now()));

export const currentWeek = computed(() => weekKey(fromDayKey(currentDay.value)));

setInterval(() => {
  const key = dayKey(Date.now());
  if (key !== currentDay.value) currentDay.value = key;
}, 30_000);
