<script setup lang="ts">
/**
 * Renders a generated glyph. The spec is memoised per vegetable in the engine,
 * so mounting hundreds of these in a catalogue grid costs one Map lookup each.
 */
import { computed, useId } from "vue";
import type { Vegetable } from "../data/vegetable.ts";
import { vegName } from "../i18n/index.ts";
import { vegIcon } from "../icons/glyph.ts";

const props = withDefaults(defineProps<{ veg: Vegetable; size?: number; selected?: boolean }>(), {
  size: 44,
  selected: false,
});

const spec = computed(() => vegIcon(props.veg));
// Gradient and clip ids must be unique per instance, not per vegetable.
const uid = useId();
</script>

<template>
  <svg
    class="vicon"
    :width="props.size"
    :height="props.size"
    viewBox="0 0 100 100"
    role="img"
    :aria-label="vegName(props.veg)"
  >
    <defs>
      <linearGradient
        :id="`vgp-${uid}`"
        :x1="spec.gradient[0]"
        :y1="spec.gradient[1]"
        :x2="spec.gradient[2]"
        :y2="spec.gradient[3]"
      >
        <stop offset="0" :stop-color="spec.plateFrom" />
        <stop offset="1" :stop-color="spec.plateTo" />
      </linearGradient>
      <clipPath :id="`vgc-${uid}`">
        <path :d="spec.plate" />
      </clipPath>
    </defs>
    <path :d="spec.plate" :fill="`url(#vgp-${uid})`" />
    <g
      :clip-path="`url(#vgc-${uid})`"
      :transform="spec.pose"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        v-for="(shape, i) in spec.shapes"
        :key="i"
        :d="shape.d"
        :fill="shape.fill ?? 'none'"
        :stroke="shape.stroke"
        :stroke-width="shape.width"
        :opacity="shape.opacity"
      />
    </g>
    <!--
      The selection ring is the plate's own outline grown outwards, so it is the
      same shape as the silhouette it marks — a circular plate gets a circular
      ring. It reaches past the viewBox, hence `overflow: visible`.
    -->
    <path
      v-if="props.selected"
      :d="spec.ring"
      fill="none"
      stroke="var(--accent)"
      stroke-width="3"
    />
  </svg>
</template>

<style scoped>
.vicon {
  display: block;
  flex: none;
  overflow: visible;
}
</style>
