<script setup lang="ts">
/**
 * Choosing what went in. Since a day is a *set* of plants, every row is a
 * toggle and the sheet deliberately stays open: recalling a meal means ticking
 * off four or five things in a row, not four or five separate trips.
 *
 * That also means no confirmation toasts here — the tick is the feedback and
 * tapping again is the undo.
 */
import { computed, ref } from "vue";
import { PLANTS, searchPlants, plantById } from "../data/catalog.ts";
import { type Plant } from "../data/plant.ts";
import { categoryLabel, t, plantName } from "../i18n/index.ts";
import { kinds } from "../lib/format.ts";
import {
  entries,
  favourites,
  firstLogged,
  isLogged,
  statsForDay,
  toggleLog,
} from "../stores/log.ts";
import UiIcon from "./UiIcon.vue";
import PlantIcon from "./PlantIcon.vue";

const props = defineProps<{ day: string }>();

const query = ref("");

const results = computed(() => searchPlants(query.value));

const dayStats = computed(() => statsForDay(props.day));

/** Distinct plants from the newest entries — what they reached for lately. */
const recent = computed(() => {
  const picks: Plant[] = [];
  for (const entry of [...entries].sort((a, b) => b.at - a.at)) {
    if (picks.length >= 10) break;
    if (picks.some((plant) => plant.id === entry.plantId)) continue;
    const plant = plantById(entry.plantId);
    if (plant) picks.push(plant);
  }
  return picks;
});

const regulars = computed(() =>
  favourites.value
    .filter((row) => row.days > 1 && !recent.value.some((plant) => plant.id === row.plant.id))
    .slice(0, 8)
    .map((row) => row.plant),
);

/** Never logged, in the current result order — the nudge towards the other 200-odd. */
const untried = computed(() => results.value.filter((plant) => !firstLogged.value.has(plant.id)));

function on(plant: Plant): boolean {
  return isLogged(plant.id, props.day);
}
</script>

<template>
  <div class="field">
    <UiIcon name="search" :size="19" />
    <input
      v-model="query"
      type="search"
      enterkeyhint="search"
      autocomplete="off"
      :placeholder="t('catalog.search', { n: PLANTS.length })"
    />
    <button
      v-if="query"
      class="btn btn--icon btn--ghost"
      :aria-label="t('picker.clear')"
      @click="query = ''"
    >
      <UiIcon name="close" :size="18" />
    </button>
  </div>

  <p class="tally">
    <UiIcon name="check" :size="16" />
    {{ t("picker.tally", { count: kinds(dayStats.variety) }) }}
  </p>

  <template v-if="!query">
    <section v-if="recent.length" class="stack">
      <p class="eyebrow">{{ t("picker.again") }}</p>
      <div class="scroller">
        <button
          v-for="plant in recent"
          :key="plant.id"
          class="quick"
          :class="{ 'quick--on': on(plant) }"
          :aria-pressed="on(plant)"
          @click="toggleLog(plant.id, props.day)"
        >
          <span class="quick__art">
            <PlantIcon :plant="plant" :size="46" :selected="on(plant)" />
            <span v-if="on(plant)" class="quick__tick"><UiIcon name="check" :size="12" /></span>
          </span>
          <span class="truncate">{{ plantName(plant) }}</span>
        </button>
      </div>
    </section>

    <section v-if="regulars.length" class="stack">
      <p class="eyebrow">{{ t("picker.regulars") }}</p>
      <div class="scroller">
        <button
          v-for="plant in regulars"
          :key="plant.id"
          class="quick"
          :class="{ 'quick--on': on(plant) }"
          :aria-pressed="on(plant)"
          @click="toggleLog(plant.id, props.day)"
        >
          <span class="quick__art">
            <PlantIcon :plant="plant" :size="46" :selected="on(plant)" />
            <span v-if="on(plant)" class="quick__tick"><UiIcon name="check" :size="12" /></span>
          </span>
          <span class="truncate">{{ plantName(plant) }}</span>
        </button>
      </div>
    </section>
  </template>

  <section class="stack">
    <p class="eyebrow">
      {{
        query
          ? t("catalog.matches", { n: results.length })
          : t("picker.allUntried", { n: results.length, untried: untried.length })
      }}
    </p>
    <div class="card card--flush">
      <button
        v-for="plant in results"
        :key="plant.id"
        class="pick"
        :class="{ 'pick--on': on(plant) }"
        :aria-pressed="on(plant)"
        @click="toggleLog(plant.id, props.day)"
      >
        <PlantIcon :plant="plant" :size="38" />
        <span class="grow truncate">{{ plantName(plant) }}</span>
        <span v-if="!firstLogged.has(plant.id)" class="tag">{{ t("picker.new") }}</span>
        <span v-else class="faint cat">{{ categoryLabel(plant.category) }}</span>
        <span class="box" :class="{ 'box--on': on(plant) }">
          <UiIcon v-if="on(plant)" name="check" :size="15" />
        </span>
      </button>
      <p v-if="!results.length" class="empty">{{ t("picker.noMatch", { query }) }}</p>
    </div>
  </section>
</template>

<style scoped>
.tally {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: -4px;
  font-size: 12.5px;
  color: var(--accent);
}

.quick {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 66px;
  font-size: 11px;
  color: var(--dim);
  scroll-snap-align: start;
  transition: transform 0.12s var(--ease);
}

.quick span {
  max-width: 100%;
}

.quick:active {
  transform: scale(0.94);
}

.quick--on {
  color: var(--accent);
}

.quick__art {
  position: relative;
  display: block;
}

.quick__tick {
  position: absolute;
  right: -5px;
  bottom: -5px;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-ink);
  border: 2px solid var(--bg);
}

.pick {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 9px 12px;
  text-align: left;
  border-bottom: 1px solid var(--line-soft);
}

.pick:last-of-type {
  border-bottom: 0;
}

.pick:active {
  background: var(--surface-hi);
}

.pick--on {
  background: color-mix(in oklab, var(--accent) 9%, transparent);
}

.cat {
  font-size: 11.5px;
}

.box {
  display: grid;
  place-items: center;
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  border: 1.5px solid var(--line);
}

.box--on {
  background: var(--accent);
  border-color: transparent;
  color: var(--accent-ink);
}

.tag {
  font-size: 10px;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent-ink);
  background: var(--accent);
  border-radius: 999px;
  padding: 2px 7px;
}
</style>
