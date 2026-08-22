<script setup lang="ts">
/**
 * The archive: every logged day and every logged week, newest first.
 *
 * Both modes are the same shape — a header button that expands one row at a
 * time — so the two lists read as one component with two lenses rather than as
 * two screens sharing a route.
 */
import { computed, ref } from "vue";
import UiIcon from "../components/UiIcon.vue";
import PlantIcon from "../components/PlantIcon.vue";
import { PLANTS } from "../data/catalog.ts";
import { t, plantName } from "../i18n/index.ts";
import { dayLabel, weekLabel, weekdayShort } from "../lib/date.ts";
import { kinds, pct } from "../lib/format.ts";
import { discovered, firstsOn, loggedDays, loggedWeeks, streak } from "../stores/log.ts";
import { settings } from "../stores/settings.ts";
import { openPicker } from "../stores/ui.ts";

/** Icons shown inline on a collapsed day row before the "+N" overflow chip. */
const STRIP_MAX = 6;
/** Top plants listed when a week is expanded. */
const WEEK_ITEMS_MAX = 10;
/** Tallest mini-chart column, in px. Heights stay proportional. */
const BAR_SPAN = 44;
/** An empty day still gets a tick, so a week always has seven columns. */
const BAR_MIN = 3;

const mode = ref<"days" | "weeks">("days");
/** Only one row is ever open, per mode, keyed by day or week key. */
const openDay = ref<string | null>(null);
const openWeek = ref<string | null>(null);

const discoveredPct = computed(() => pct(discovered.value, PLANTS.length));

/** A day row plus how many of its plants were first-evers. */
const dayRows = computed(() =>
  loggedDays.value.map((day) => ({ day, news: firstsOn(day.key).length })),
);

type WeekColumn = { key: string; height: number; color: string; initial: string };

/**
 * Columns are scaled against the busiest day *of their own week*, so a quiet
 * week still shows shape instead of seven flat ticks. A week with a single
 * logged day gives that day the full span and the rest the floor.
 */
const weekRows = computed(() =>
  loggedWeeks.value.map((week) => {
    const peak = week.days.reduce((max, day) => Math.max(max, day.variety), 0);
    const columns: WeekColumn[] = week.days.map((day) => ({
      key: day.key,
      height: peak > 0 ? BAR_MIN + (BAR_SPAN - BAR_MIN) * (day.variety / peak) : BAR_MIN,
      // Empty never borrows the target colour, however low the target is set.
      color:
        day.variety === 0
          ? "var(--surface-hi)"
          : day.variety >= settings.dailyVariety
            ? "var(--accent)"
            : "var(--bar-low)",
      initial: weekdayShort(day.at).slice(0, 1),
    }));
    return { week, columns, peak, varietyPct: pct(week.variety, settings.weeklyVariety) };
  }),
);

function toggleDay(key: string): void {
  openDay.value = openDay.value === key ? null : key;
}

function toggleWeek(key: string): void {
  openWeek.value = openWeek.value === key ? null : key;
}
</script>

<template>
  <header class="topline">
    <h1>{{ t("history.title") }}</h1>
  </header>

  <main class="view">
    <section v-if="loggedDays.length === 0" class="card empty">
      <UiIcon name="leaf" :size="30" />
      <p>{{ t("history.empty") }}</p>
      <button class="btn btn--primary" type="button" @click="openPicker()">
        {{ t("common.logPlant") }}
      </button>
    </section>

    <template v-else>
      <section class="card">
        <div class="row">
          <div class="grow">
            <p class="eyebrow">{{ t("history.allTime") }}</p>
            <p class="sum__figure">
              <span class="sum__count num">{{ loggedDays.length }}</span>
              <span class="dim">{{ t("history.daysLogged", { n: loggedDays.length }) }}</span>
            </p>
          </div>
          <span v-if="streak > 0" class="chip sum__streak">
            <UiIcon name="flame" :size="15" />
            <span class="num">{{ streak }}</span>
            <span>{{ t("history.dayStreak", { n: streak }) }}</span>
          </span>
        </div>

        <div class="sum__meter">
          <div class="row sum__meterhead">
            <span class="grow dim">{{ t("history.tried") }}</span>
            <span class="num">{{ discovered }} / {{ PLANTS.length }}</span>
          </div>
          <span
            class="bar"
            role="progressbar"
            :aria-label="t('history.triedAria')"
            aria-valuemin="0"
            :aria-valuemax="PLANTS.length"
            :aria-valuenow="discovered"
          >
            <span class="bar__fill" :style="{ width: `${discoveredPct}%` }" />
          </span>
        </div>
      </section>

      <div class="row seg">
        <button class="chip" type="button" :aria-pressed="mode === 'days'" @click="mode = 'days'">
          {{ t("history.modeDays") }}
        </button>
        <button class="chip" type="button" :aria-pressed="mode === 'weeks'" @click="mode = 'weeks'">
          {{ t("history.modeWeeks") }}
        </button>
        <span class="grow faint num seg__count">
          {{ mode === "days" ? loggedDays.length : loggedWeeks.length }}
        </span>
      </div>

      <section v-if="mode === 'days'" class="stack">
        <article v-for="row in dayRows" :key="row.day.key" class="card card--flush">
          <button
            class="rowbtn"
            type="button"
            :aria-expanded="openDay === row.day.key"
            @click="toggleDay(row.day.key)"
          >
            <span class="rowbtn__main">
              <span class="rowbtn__title">{{ dayLabel(row.day.key) }}</span>
              <span v-if="row.news > 0" class="faint rowbtn__sub">
                {{ t("history.newCount", { n: row.news }) }}
              </span>
              <span class="strip">
                <PlantIcon
                  v-for="plant in row.day.items.slice(0, STRIP_MAX)"
                  :key="plant.id"
                  :plant="plant"
                  :size="26"
                />
                <span v-if="row.day.items.length > STRIP_MAX" class="chip strip__more num">
                  +{{ row.day.items.length - STRIP_MAX }}
                </span>
              </span>
            </span>
            <span class="rowbtn__end">
              <span class="num rowbtn__metric">{{ kinds(row.day.variety) }}</span>
              <UiIcon :name="openDay === row.day.key ? 'down' : 'right'" :size="18" />
            </span>
          </button>

          <Transition name="fade">
            <div v-if="openDay === row.day.key" class="panel">
              <div class="divider" />
              <ul class="items">
                <li v-for="plant in row.day.items" :key="plant.id" class="row items__row">
                  <PlantIcon :plant="plant" :size="34" />
                  <span class="grow truncate">{{ plantName(plant) }}</span>
                </li>
              </ul>
              <div class="panel__foot">
                <button
                  class="btn btn--sm btn--ghost"
                  type="button"
                  @click="openPicker(row.day.key)"
                >
                  <UiIcon name="plus" :size="16" />
                  <span>{{ t("history.addToDay") }}</span>
                </button>
              </div>
            </div>
          </Transition>
        </article>
      </section>

      <section v-else class="stack">
        <article v-for="row in weekRows" :key="row.week.key" class="card card--flush">
          <button
            class="rowbtn"
            type="button"
            :aria-expanded="openWeek === row.week.key"
            @click="toggleWeek(row.week.key)"
          >
            <span class="rowbtn__main">
              <span class="rowbtn__title">{{ weekLabel(row.week.key) }}</span>
              <span class="wk__metric num">
                {{ t("history.weekKinds", { n: row.week.variety, max: settings.weeklyVariety }) }}
              </span>
              <span class="bar" aria-hidden="true">
                <span class="bar__fill" :style="{ width: `${row.varietyPct}%` }" />
              </span>

              <span class="wk__chart" aria-hidden="true">
                <span v-for="col in row.columns" :key="col.key" class="wk__col">
                  <span
                    class="wk__bar"
                    :style="{
                      height: `${col.height}px`,
                      background: col.color,
                    }"
                  />
                  <span class="wk__day faint">{{ col.initial }}</span>
                </span>
              </span>

              <span class="row wk__foot faint">
                <span class="num">{{ t("history.onTarget", { n: row.week.daysOnTarget }) }}</span>
                <span class="wk__dot">·</span>
                <span class="num">{{ t("history.best", { n: row.peak }) }}</span>
              </span>
            </span>
            <span class="rowbtn__end rowbtn__end--top">
              <UiIcon :name="openWeek === row.week.key ? 'down' : 'right'" :size="18" />
            </span>
          </button>

          <Transition name="fade">
            <div v-if="openWeek === row.week.key" class="panel">
              <div class="divider" />
              <p class="eyebrow panel__head">{{ t("common.mostDays") }}</p>
              <ul class="items">
                <li
                  v-for="item in row.week.items.slice(0, WEEK_ITEMS_MAX)"
                  :key="item.plant.id"
                  class="row items__row"
                >
                  <PlantIcon :plant="item.plant" :size="30" />
                  <span class="grow truncate">{{ plantName(item.plant) }}</span>
                  <span class="num dim">{{ item.days }}/7</span>
                </li>
              </ul>
            </div>
          </Transition>
        </article>
      </section>
    </template>
  </main>
</template>

<style scoped>
/* ------------------------------------------------------------ summary */

.sum__figure {
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin-top: 4px;
}

.sum__count {
  font-size: 28px;
  font-weight: 620;
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.sum__streak {
  flex: none;
  color: var(--warn);
  background: transparent;
  border-color: var(--line);
}

.sum__meter {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sum__meterhead {
  font-size: 13px;
}

/* --------------------------------------------------------------- bars */

.bar {
  display: block;
  height: 6px;
  border-radius: 999px;
  background: var(--surface-hi);
  overflow: hidden;
}

.bar__fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--accent);
  transition: width 0.45s var(--ease);
}

/* ------------------------------------------------------------ control */

.seg {
  gap: 8px;
}

.seg__count {
  text-align: right;
  font-size: 13px;
}

/* --------------------------------------------------------------- rows */

.rowbtn {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 13px var(--pad);
  text-align: left;
  transition: background 0.15s var(--ease);
}

.rowbtn:active {
  background: var(--surface-hi);
}

/* The flush card clips overflow, so keep the focus ring inside the row. */
.rowbtn:focus-visible {
  outline-offset: -3px;
  border-radius: var(--r-lg);
}

.rowbtn__main {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 0;
}

.rowbtn__title {
  font-weight: 560;
  letter-spacing: -0.01em;
}

.rowbtn__sub {
  font-size: 12.5px;
}

.rowbtn__end {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  color: var(--faint);
}

.rowbtn__end--top {
  align-self: flex-start;
  padding-top: 2px;
}

.rowbtn__metric {
  font-weight: 540;
  color: var(--text);
}

.strip {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 3px;
}

.strip__more {
  height: 26px;
  padding: 0 9px;
  font-size: 12px;
}

/* ------------------------------------------------------------- weeks */

.wk__metric {
  font-size: 13px;
  color: var(--dim);
}

.wk__chart {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  margin-top: 7px;
  min-height: 62px;
}

.wk__col {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.wk__bar {
  display: block;
  width: 100%;
  max-width: 26px;
  border-radius: var(--r-xs) var(--r-xs) 3px 3px;
  transition: height 0.35s var(--ease);
}

.wk__day {
  font-size: 10px;
  font-weight: 560;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.wk__foot {
  gap: 7px;
  font-size: 12.5px;
  margin-top: 5px;
}

.wk__dot {
  opacity: 0.7;
}

/* ------------------------------------------------------------- panel */

.panel__head {
  padding: 12px var(--pad) 2px;
}

.items {
  list-style: none;
  margin: 0;
  padding: 6px 0;
  display: flex;
  flex-direction: column;
}

.items__row {
  padding: 6px var(--pad);
  font-size: 14px;
}

.panel__foot {
  padding: 2px var(--pad) 14px;
}
</style>
