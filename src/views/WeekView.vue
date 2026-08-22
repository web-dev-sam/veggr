<script setup lang="ts">
/**
 * The week is where variety lives. A day asks for a handful of different
 * plants; a week asks for thirty, so this screen makes the target
 * physical: thirty slots, and you can see the empty ones.
 */
import { computed, ref } from "vue";
import ProgressRing from "../components/ProgressRing.vue";
import UiIcon from "../components/UiIcon.vue";
import PlantIcon from "../components/PlantIcon.vue";
import { t, plantName } from "../i18n/index.ts";
import { currentDay } from "../lib/clock.ts";
import {
  addDays,
  dayLabel,
  dayLabelCasual,
  shortDate,
  weekKey,
  weekLabel,
  weekdayShort,
} from "../lib/date.ts";
import { kinds, pct } from "../lib/format.ts";
import { firstLogged, statsForWeek, thisWeek } from "../stores/log.ts";
import { settings } from "../stores/settings.ts";
import { openPicker } from "../stores/ui.ts";

/** Weeks back from the current one — lets the screen double as a week browser. */
const back = ref(0);

const week = computed(() =>
  back.value === 0
    ? thisWeek.value
    : statsForWeek(weekKey(addDays(thisWeek.value.start, -7 * back.value))),
);

/** "This week" / "Last week" / the date range, same wording History uses. */
const title = computed(() => weekLabel(week.value.key));

/**
 * The subline says something the title does not: a date range when the title is
 * relative, and how far back you are when the title is already a date range.
 */
const subline = computed(() =>
  back.value <= 1
    ? `${shortDate(week.value.start)} – ${shortDate(addDays(week.value.start, 6))}`
    : t("week.weeksAgo", { n: back.value }),
);

/** The week's high-water mark. Always seven days, so the spread is never empty. */
const bestDay = computed(() => Math.max(...week.value.days.map((day) => day.variety)));

/** Bars are relative to the widest day, but never shorter than the target line. */
const scale = computed(() =>
  Math.max(settings.dailyVariety, ...week.value.days.map((day) => day.variety)),
);

/** Empty slots are the point: they are the ones still to fill. */
const slots = computed(() => {
  const goal = Math.max(settings.weeklyVariety, week.value.variety);
  return Array.from({ length: goal }, (_, i) => week.value.items[i]?.plant ?? null);
});

/** Plants tried for the very first time inside this week. */
const firsts = computed(() => {
  const from = week.value.start;
  const to = addDays(from, 7).getTime();
  return week.value.items.filter((item) => {
    const at = firstLogged.value.get(item.plant.id);
    return at !== undefined && at >= from && at < to;
  });
});

const selected = ref<string | null>(null);

const selectedDay = computed(
  () => week.value.days.find((day) => day.key === selected.value) ?? null,
);
</script>

<template>
  <header class="topline">
    <div>
      <h1>{{ title }}</h1>
      <p class="faint num">{{ subline }}</p>
    </div>
    <div class="row nav">
      <button class="btn btn--icon btn--ghost" :aria-label="t('week.prev')" @click="back += 1">
        <UiIcon name="right" :size="19" class="flip" />
      </button>
      <button
        class="btn btn--icon btn--ghost"
        :aria-label="t('week.next')"
        :disabled="back === 0"
        :style="{ opacity: back === 0 ? 0.3 : 1 }"
        @click="back = Math.max(0, back - 1)"
      >
        <UiIcon name="right" :size="19" />
      </button>
    </div>
  </header>

  <main class="view">
    <section class="card hero">
      <ProgressRing :value="week.variety" :max="settings.weeklyVariety" :size="150">
        <strong class="num">{{ week.variety }}</strong>
        <span class="faint num">{{ t("common.ofKinds", { n: settings.weeklyVariety }) }}</span>
      </ProgressRing>
      <div class="facts">
        <div class="fact">
          <UiIcon name="chart" :size="18" />
          <div>
            <strong class="num">{{ week.daysOnTarget }} / 7</strong>
            <span class="faint">{{ t("week.daysOnTarget") }}</span>
          </div>
        </div>
        <div class="fact">
          <UiIcon name="target" :size="18" />
          <div>
            <strong class="num">{{ bestDay }}</strong>
            <span class="faint">{{ t("week.bestDay") }}</span>
          </div>
        </div>
        <div class="fact">
          <UiIcon name="spark" :size="18" />
          <div>
            <strong class="num">{{ firsts.length }}</strong>
            <span class="faint">{{ t("common.newToYou") }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="stack">
      <div class="section-head">
        <h2>{{ t("week.fill", { n: settings.weeklyVariety }) }}</h2>
        <span class="faint num">{{
          t("week.toGo", { n: Math.max(0, settings.weeklyVariety - week.variety) })
        }}</span>
      </div>
      <div class="card slots">
        <template v-for="(plant, i) in slots" :key="i">
          <PlantIcon v-if="plant" :plant="plant" :size="34" />
          <span v-else class="slot" />
        </template>
      </div>
    </section>

    <section class="stack">
      <div class="section-head">
        <h2>{{ t("week.eachDay") }}</h2>
        <span class="faint num">{{ t("week.targetKinds", { n: settings.dailyVariety }) }}</span>
      </div>
      <div class="card chart">
        <div class="bars">
          <button
            v-for="day in week.days"
            :key="day.key"
            class="col"
            :class="{ 'col--on': selected === day.key }"
            :aria-label="`${dayLabel(day.key)}, ${kinds(day.variety)}`"
            @click="selected = selected === day.key ? null : day.key"
          >
            <span class="track">
              <span
                class="fill"
                :class="{
                  'fill--hit': day.variety >= settings.dailyVariety,
                  'fill--none': day.variety === 0,
                }"
                :style="{ height: `${Math.max(3, (day.variety / scale) * 100)}%` }"
              />
            </span>
            <span class="wd" :class="{ 'wd--today': day.key === currentDay }">
              {{ weekdayShort(day.at).slice(0, 1) }}
            </span>
          </button>
        </div>
        <div
          class="target"
          :style="{
            top: `calc(var(--pad) + var(--track) * ${1 - settings.dailyVariety / scale})`,
          }"
        />
      </div>

      <Transition name="fade">
        <div v-if="selectedDay" class="card day">
          <div class="row">
            <strong class="grow">{{ dayLabel(selectedDay.key) }}</strong>
            <span class="faint num">{{ kinds(selectedDay.variety) }}</span>
          </div>
          <div v-if="selectedDay.items.length" class="stack rows">
            <div v-for="plant in selectedDay.items" :key="plant.id" class="row">
              <PlantIcon :plant="plant" :size="30" />
              <span class="grow truncate">{{ plantName(plant) }}</span>
            </div>
          </div>
          <p v-else class="faint">{{ t("week.nothingLogged") }}</p>
          <button class="btn btn--sm" @click="openPicker(selectedDay.key)">
            <UiIcon name="plus" :size="16" />
            {{ t("common.addTo", { day: dayLabelCasual(selectedDay.key) }) }}
          </button>
        </div>
      </Transition>
    </section>

    <section v-if="firsts.length" class="stack">
      <div class="section-head">
        <h2>{{ t("week.firstTime") }}</h2>
      </div>
      <div class="scroller">
        <div v-for="item in firsts" :key="item.plant.id" class="new">
          <PlantIcon :plant="item.plant" :size="46" />
          <span class="truncate">{{ plantName(item.plant) }}</span>
        </div>
      </div>
    </section>

    <section v-if="week.items.length" class="stack">
      <div class="section-head">
        <h2>{{ t("common.mostDays") }}</h2>
        <span class="faint num">{{ t("common.kinds", { n: week.variety }) }}</span>
      </div>
      <div class="card stack">
        <div v-for="item in week.items.slice(0, 12)" :key="item.plant.id" class="top">
          <PlantIcon :plant="item.plant" :size="32" />
          <div class="grow">
            <div class="row tight">
              <span class="grow truncate">{{ plantName(item.plant) }}</span>
              <span class="faint num">{{ item.days }}/7</span>
            </div>
            <div class="bar">
              <span :style="{ width: `${pct(item.days, 7)}%` }" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="!week.items.length" class="empty">
      <UiIcon name="leaf" :size="30" />
      <p>{{ t("week.empty") }}</p>
      <button class="btn btn--primary" @click="openPicker()">{{ t("week.logFirst") }}</button>
    </div>
  </main>
</template>

<style scoped>
.nav {
  gap: 0;
}

.flip {
  transform: rotate(180deg);
}

.hero {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hero strong {
  font-size: 34px;
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
}

.fact strong {
  font-size: 16px;
  font-weight: 620;
  color: var(--text);
}

.fact span {
  font-size: 11.5px;
  white-space: nowrap;
}

.slots {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  justify-content: flex-start;
}

.slot {
  width: 34px;
  height: 34px;
  border-radius: 11px;
  border: 1.5px dashed var(--line);
}

.chart {
  --track: 92px;
  position: relative;
  padding-bottom: 10px;
}

.bars {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  align-items: end;
}

.col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.track {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: var(--track);
  border-radius: var(--r-sm);
  background: color-mix(in oklab, var(--surface-hi) 70%, transparent);
  overflow: hidden;
}

.fill {
  width: 100%;
  border-radius: var(--r-sm);
  background: var(--bar-low);
  transition: height 0.4s var(--ease);
}

.fill--hit {
  background: var(--accent);
}

.fill--none {
  background: var(--surface-hi);
}

.wd {
  font-size: 11px;
  color: var(--faint);
}

.wd--today {
  color: var(--accent);
  font-weight: 650;
}

.col--on .track {
  outline: 1.5px solid var(--accent);
  outline-offset: 2px;
}

.target {
  position: absolute;
  left: var(--pad);
  right: var(--pad);
  height: 1px;
  background: var(--line);
  pointer-events: none;
}

.day {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
}

.day .btn {
  align-self: flex-start;
}

.rows {
  gap: 8px;
}

.new {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 66px;
  font-size: 11px;
  color: var(--dim);
}

.new span {
  max-width: 100%;
}

.top {
  display: flex;
  align-items: center;
  gap: 11px;
}

.tight {
  gap: 8px;
  font-size: 13.5px;
}

.bar {
  margin-top: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--surface-hi);
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--accent-deep);
  transition: width 0.4s var(--ease);
}
</style>
