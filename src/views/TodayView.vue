<script setup lang="ts">
/**
 * The default screen, and the one that has to work in three seconds while
 * standing at a chopping board: how many different vegetables so far, tap to
 * tick off the usual ones, and a correctable list of what is on today.
 */
import { computed } from "vue";
import { RouterLink } from "vue-router";
import ProgressRing from "../components/ProgressRing.vue";
import UiIcon from "../components/UiIcon.vue";
import VegIcon from "../components/VegIcon.vue";
import { vegetable } from "../data/catalog.ts";
import type { Vegetable } from "../data/vegetable.ts";
import { t, vegName } from "../i18n/index.ts";
import { currentDay } from "../lib/clock.ts";
import { clockTime, fromDayKey, shortDate, weekdayShort } from "../lib/date.ts";
import { kinds, pct } from "../lib/format.ts";
import { entries, firstsOn, isLogged, streak, thisWeek, today, toggleLog } from "../stores/log.ts";
import { settings } from "../stores/settings.ts";
import { notify } from "../stores/toast.ts";
import { openPicker, openSettings } from "../stores/ui.ts";

/** Seeds the one-tap row before there is any history to learn from. */
const STARTERS = [
  "spinach",
  "carrot",
  "tomato",
  "broccoli",
  "cucumber",
  "yellow-onion",
  "red-bell-pepper",
  "button-mushroom",
];

const date = computed(() => {
  const day = fromDayKey(currentDay.value);
  return `${weekdayShort(day)} ${shortDate(day)}`;
});

/**
 * Most recently used first, topped up with starters. Recency beats frequency
 * here: what you ate yesterday is the best guess for what is in the fridge.
 */
const quick = computed(() => {
  const picks: Vegetable[] = [];
  const add = (veg: Vegetable | undefined): void => {
    if (veg && picks.length < 10 && !picks.some((seen) => seen.id === veg.id)) picks.push(veg);
  };
  for (const entry of [...entries].sort((a, b) => b.at - a.at)) add(vegetable(entry.vegId));
  for (const id of STARTERS) add(vegetable(id));
  return picks;
});

const remaining = computed(() => Math.max(0, settings.dailyVariety - today.value.variety));

const newToday = computed(() => firstsOn(currentDay.value).length);

/**
 * Entries paired with their vegetable. The store already drops entries whose id
 * has left the catalogue, but resolving once here keeps the template free of
 * non-null assertions.
 */
const logLines = computed(() =>
  today.value.entries.flatMap((entry) => {
    const veg = vegetable(entry.vegId);
    return veg ? [{ entry, veg }] : [];
  }),
);

/**
 * The quick row and the list differ on purpose: a tile visibly turns on or off,
 * so it needs no toast, while a row that vanishes from the list does.
 *
 * Removing works on the kind, not the entry — the list holds one row per kind,
 * so there is nothing else it could mean.
 */
function drop(veg: Vegetable): void {
  toggleLog(veg.id, currentDay.value);
  notify(t("toast.removed", { name: vegName(veg) }), () => toggleLog(veg.id, currentDay.value));
}
</script>

<template>
  <header class="topline">
    <div>
      <h1>{{ t("today.title") }}</h1>
      <p class="faint num">{{ date }}</p>
    </div>
    <button
      class="btn btn--icon btn--ghost"
      :aria-label="t('today.openTargets')"
      @click="openSettings"
    >
      <UiIcon name="tune" />
    </button>
  </header>

  <main class="view">
    <section class="card hero">
      <ProgressRing :value="today.variety" :max="settings.dailyVariety" :size="152">
        <strong class="num">{{ today.variety }}</strong>
        <span class="faint num">{{ t("common.ofKinds", { n: settings.dailyVariety }) }}</span>
      </ProgressRing>

      <div class="facts">
        <div class="fact">
          <UiIcon name="chart" :size="18" />
          <div>
            <strong class="num">{{ thisWeek.variety }} / {{ settings.weeklyVariety }}</strong>
            <span class="faint">{{ t("today.thisWeek") }}</span>
          </div>
        </div>
        <div class="fact">
          <UiIcon name="flame" :size="18" />
          <div>
            <strong class="num">{{ streak }}</strong>
            <span class="faint">{{ t("today.dayStreak", { n: streak }) }}</span>
          </div>
        </div>
        <div class="fact">
          <UiIcon name="spark" :size="18" />
          <div>
            <strong class="num">{{ newToday }}</strong>
            <span class="faint">{{ t("common.newToYou") }}</span>
          </div>
        </div>
      </div>
    </section>

    <p v-if="remaining > 0" class="faint nudge">{{ t("today.nudge", { n: remaining }) }}</p>
    <p v-else class="hit">
      <UiIcon name="check" :size="18" />
      {{ t("today.reached") }}
    </p>

    <button class="btn btn--primary add" @click="openPicker()">
      <UiIcon name="plus" :size="20" />
      {{ t("common.logPlant") }}
    </button>

    <section class="stack">
      <p class="eyebrow">{{ t("today.oneTap") }}</p>
      <div class="scroller">
        <button
          v-for="veg in quick"
          :key="veg.id"
          class="quick"
          :class="{ 'quick--on': isLogged(veg.id, currentDay) }"
          :aria-pressed="isLogged(veg.id, currentDay)"
          :aria-label="
            isLogged(veg.id, currentDay)
              ? t('plant.onList', { name: vegName(veg) })
              : t('plant.tapAdd', { name: vegName(veg) })
          "
          @click="toggleLog(veg.id)"
        >
          <span class="quick__art">
            <VegIcon :veg="veg" :size="52" :selected="isLogged(veg.id, currentDay)" />
            <span v-if="isLogged(veg.id, currentDay)" class="quick__tick">
              <UiIcon name="check" :size="13" />
            </span>
          </span>
          <span class="truncate">{{ vegName(veg) }}</span>
        </button>
      </div>
    </section>

    <section class="stack">
      <div class="section-head">
        <h2>{{ t("today.listTitle") }}</h2>
        <span v-if="today.variety" class="faint num">{{ kinds(today.variety) }}</span>
      </div>

      <div v-if="today.items.length" class="strip">
        <VegIcon v-for="veg in today.items" :key="veg.id" :veg="veg" :size="30" />
      </div>

      <div v-if="logLines.length" class="card card--flush">
        <div v-for="line in logLines" :key="line.entry.id" class="line">
          <VegIcon :veg="line.veg" :size="38" />
          <span class="grow truncate">{{ vegName(line.veg) }}</span>
          <span class="faint num time">{{ clockTime(line.entry.at) }}</span>
          <button
            class="btn btn--icon btn--ghost drop"
            :aria-label="t('plant.remove', { name: vegName(line.veg) })"
            @click="drop(line.veg)"
          >
            <UiIcon name="close" :size="17" />
          </button>
        </div>
      </div>

      <div v-else class="card empty">
        <UiIcon name="leaf" :size="30" />
        <p>{{ t("today.empty") }}</p>
        <button class="btn btn--sm" @click="openPicker()">{{ t("today.startGreen") }}</button>
      </div>
    </section>

    <RouterLink to="/week" class="card peek">
      <div class="grow">
        <p class="eyebrow">{{ t("date.thisWeek") }}</p>
        <strong class="num">
          {{ t("today.weekPeek", { n: thisWeek.variety, max: settings.weeklyVariety }) }}
        </strong>
        <div class="bar">
          <span :style="{ width: `${pct(thisWeek.variety, settings.weeklyVariety)}%` }" />
        </div>
      </div>
      <UiIcon name="right" :size="18" class="faint" />
    </RouterLink>
  </main>
</template>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  gap: 18px;
}

.hero strong {
  font-size: 40px;
  font-weight: 650;
  letter-spacing: -0.03em;
  line-height: 1;
}

.hero .faint {
  font-size: 12px;
}

.facts {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.fact {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--accent);
}

.fact div {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  min-width: 0;
}

.fact strong {
  font-size: 17px;
  font-weight: 620;
  color: var(--text);
  letter-spacing: -0.01em;
}

.fact span {
  font-size: 11.5px;
  white-space: nowrap;
}

.nudge,
.hit {
  font-size: 13px;
  text-align: center;
  margin-top: -6px;
}

.hit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: var(--accent);
}

.add {
  height: 52px;
  font-size: 16px;
}

.quick {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 72px;
  font-size: 11px;
  color: var(--dim);
  scroll-snap-align: start;
  transition: transform 0.12s var(--ease);
}

.quick span {
  max-width: 100%;
}

.quick:active {
  transform: scale(0.93);
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
  width: 19px;
  height: 19px;
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-ink);
  border: 2px solid var(--bg);
}

.strip {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.line {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 7px 8px 7px 12px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 14px;
}

.line:last-child {
  border-bottom: 0;
}

.time {
  font-size: 11.5px;
}

.drop {
  color: var(--faint);
}

.drop:active {
  color: var(--danger);
}

.peek {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}

.peek strong {
  font-size: 15px;
  font-weight: 580;
}

.bar {
  margin-top: 8px;
  height: 6px;
  border-radius: 999px;
  background: var(--surface-hi);
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--accent);
  transition: width 0.4s var(--ease);
}
</style>
