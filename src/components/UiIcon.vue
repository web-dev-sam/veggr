<script setup lang="ts">
/**
 * The interface icon set — one stroke path each, drawn on a 24px grid.
 * Plant icons come from the generator; these are the chrome around it.
 */

const PATHS = {
  leaf: "M4.5 20C4 11 10 4.5 20 4c.6 9.7-5.5 16.3-15.5 16Zm0 0 8.5-8.5",
  chart: "M4 20V11m5 9V5m5 15v-6m5 6V8",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13.5V12l3 2",
  grid: "M4 4.5h6v6H4zM14 4.5h6v6h-6zM4 14.5h6v6H4zM14 14.5h6v6h-6z",
  plus: "M12 5.5v13M5.5 12h13",
  minus: "M5.5 12h13",
  search: "M11 18.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm5.6-2 4 4",
  close: "M6.5 6.5l11 11m0-11-11 11",
  right: "m9.5 5.5 7 6.5-7 6.5",
  down: "m5.5 9.5 6.5 6 6.5-6",
  trash: "M5 7.5h14M9.5 7.5V5h5v2.5m-8 0 .9 13h9.2l.9-13",
  check: "m4.5 12.5 5 5 10-11",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
  flame: "M12 21c4 0 6-2.7 6-6.2 0-4.6-5-7-4-12.3C11 4 6 7.6 6 14.8 6 18.3 8 21 12 21Z",
  spark: "M12 3.5 14 10l6.5 2-6.5 2-2 6.5-2-6.5L3.5 12 10 10l2-6.5Z",
  tune: "M4 8h9m5 0h2M4 16h3m5 0h8M13 8a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0ZM7 16a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z",
  undo: "M9.5 14.5 4.5 9.5l5-5M4.5 9.5h9a5.5 5.5 0 0 1 0 11h-2.5",
} as const;

export type UiIconName = keyof typeof PATHS;

const props = withDefaults(defineProps<{ name: UiIconName; size?: number; width?: number }>(), {
  size: 22,
  width: 1.8,
});
</script>

<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke-width="props.width"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="PATHS[props.name]" />
  </svg>
</template>
