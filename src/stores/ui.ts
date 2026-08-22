/**
 * Sheet routing.
 *
 * Logging has to be reachable from every screen — today, a past day, the
 * catalogue — so sheet state lives here instead of inside one view. The picker
 * carries the day it writes to, which is what makes "add to yesterday" work
 * without a second code path.
 *
 * There is no amount sheet: picking a plant *is* logging it.
 */

import { ref } from "vue";
import { currentDay } from "../lib/clock.ts";

export type Sheet = { kind: "none" } | { kind: "picker"; day: string } | { kind: "settings" };

export const sheet = ref<Sheet>({ kind: "none" });

export function openPicker(day: string = currentDay.value): void {
  sheet.value = { kind: "picker", day };
}

export function openSettings(): void {
  sheet.value = { kind: "settings" };
}

export function closeSheet(): void {
  sheet.value = { kind: "none" };
}
