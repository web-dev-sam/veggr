/**
 * Transient confirmations.
 *
 * Logging is one tap, so the only safety net is an undo that lives as long as
 * the toast does. That is the entire reason this exists.
 */

import { reactive } from "vue";

export type Toast = {
  id: number;
  text: string;
  undo?: () => void;
};

export const toasts = reactive<Toast[]>([]);

let nextId = 1;

export function dismiss(id: number): void {
  const at = toasts.findIndex((toast) => toast.id === id);
  if (at >= 0) toasts.splice(at, 1);
}

export function notify(text: string, undo?: () => void): void {
  const id = nextId++;
  // One at a time: a stack of toasts over a bottom tab bar is just clutter.
  toasts.splice(0, toasts.length);
  toasts.push({ id, text, undo });
  setTimeout(() => dismiss(id), 4200);
}
