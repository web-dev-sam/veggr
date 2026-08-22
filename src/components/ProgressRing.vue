<script setup lang="ts">
/**
 * A dial for one number against its target. Over-target keeps filling a second,
 * brighter lap instead of clamping, because eating more plants than planned
 * deserves to look like something.
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    value: number;
    max: number;
    size?: number;
    thickness?: number;
    color?: string;
  }>(),
  { size: 148, thickness: 13, color: "var(--accent)" },
);

const radius = computed(() => (props.size - props.thickness) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const ratio = computed(() => (props.max > 0 ? props.value / props.max : 0));
const lap = computed(() => Math.min(1, ratio.value));
const overflow = computed(() => Math.min(1, Math.max(0, ratio.value - 1)));
</script>

<template>
  <div class="ring" :style="{ width: `${props.size}px`, height: `${props.size}px` }">
    <svg :width="props.size" :height="props.size" aria-hidden="true">
      <g :transform="`rotate(-90 ${props.size / 2} ${props.size / 2})`" fill="none">
        <circle
          :cx="props.size / 2"
          :cy="props.size / 2"
          :r="radius"
          stroke="var(--surface-hi)"
          :stroke-width="props.thickness"
        />
        <circle
          class="arc"
          :cx="props.size / 2"
          :cy="props.size / 2"
          :r="radius"
          :stroke="props.color"
          :stroke-width="props.thickness"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="circumference * (1 - lap)"
        />
        <circle
          v-if="overflow > 0"
          class="arc"
          :cx="props.size / 2"
          :cy="props.size / 2"
          :r="radius"
          stroke="var(--text)"
          :stroke-width="props.thickness * 0.42"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="circumference * (1 - overflow)"
        />
      </g>
    </svg>
    <div class="ring__label">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.ring {
  position: relative;
  flex: none;
}

.arc {
  transition: stroke-dashoffset 0.5s var(--ease);
}

.ring__label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  text-align: center;
}
</style>
