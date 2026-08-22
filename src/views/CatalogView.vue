<script setup lang="ts">
/**
 * The catalogue: every vegetable as one browsable wall of generated icons,
 * and the shortest path to logging something you have never eaten.
 *
 * Search and the category chips compose, because "herbs starting with s" is a
 * real question. With no query the wall keeps its alphabetical order under
 * sticky category headings, so a thumb scroll still knows where it is; a query
 * collapses it to one flat grid instead, since grouping would fight the ranking
 * search already applied.
 */
import { computed, ref } from "vue";
import UiIcon from "../components/UiIcon.vue";
import VegIcon from "../components/VegIcon.vue";
import { VEGETABLES, searchVegetables } from "../data/catalog.ts";
import { CATEGORY_IDS, type VegCategory, type Vegetable } from "../data/vegetable.ts";
import { categoryLabel, t, vegName } from "../i18n/index.ts";
import { vegIcon } from "../icons/glyph.ts";
import { pct } from "../lib/format.ts";
import { discovered, firstLogged, today, toggleLog } from "../stores/log.ts";
import { notify } from "../stores/toast.ts";

/** One grid of tiles. A label means it gets a sticky heading above it. */
type Block = { key: string; label: string | null; items: Vegetable[] };

const query = ref("");
const category = ref<VegCategory | "all">("all");
const showFilters = ref(true);
const input = ref<HTMLInputElement | null>(null);

const searching = computed(() => query.value.trim().length > 0);

const matches = computed(() => {
  const found = searchVegetables(query.value);
  const pick = category.value;
  return pick === "all" ? found : found.filter((veg) => veg.category === pick);
});

/** The catalogue is alphabetical, so every bucket comes out sorted for free. */
const grouped = computed<Block[]>(() => {
  const buckets = new Map<VegCategory, Vegetable[]>();
  for (const veg of matches.value) {
    const bucket = buckets.get(veg.category);
    if (bucket) bucket.push(veg);
    else buckets.set(veg.category, [veg]);
  }

  const blocks: Block[] = [];
  for (const id of CATEGORY_IDS) {
    const items = buckets.get(id);
    if (items) blocks.push({ key: id, label: categoryLabel(id), items });
  }
  return blocks;
});

const blocks = computed<Block[]>(() => {
  if (matches.value.length === 0) return [];
  return searching.value ? [{ key: "matches", label: null, items: matches.value }] : grouped.value;
});

const triedPct = computed(() => pct(discovered.value, VEGETABLES.length));
const untried = computed(() => VEGETABLES.length - discovered.value);

const hint = computed(() => {
  if (discovered.value === 0) return t("catalog.hintNone");
  if (untried.value === 0) return t("catalog.hintAll");
  return t("catalog.hintSome", { n: untried.value });
});

const countLabel = computed(() => {
  const total = matches.value.length;
  const count = t("catalog.matches", { n: total });
  const pick = category.value;
  return pick === "all" ? count : t("catalog.matchesIn", { count, category: categoryLabel(pick) });
});

const emptyLine = computed(() => {
  const text = query.value.trim();
  const pick = category.value;
  if (text && pick !== "all") {
    return t("catalog.emptyInCategory", { category: categoryLabel(pick), query: text });
  }
  if (text) return t("catalog.emptyQuery", { query: text });
  return t("catalog.emptyFilters");
});

/**
 * Today's ids in one pass. `isLogged` walks the whole log per call, and the
 * wall renders every vegetable at once, so the tiles read a set instead.
 */
const onToday = computed(() => new Set(today.value.items.map((veg) => veg.id)));

/** One tap is the whole interaction: on the list, or off it again. */
function tap(veg: Vegetable): void {
  const added = toggleLog(veg.id);
  const name = vegName(veg);
  const text = added ? t("toast.addedToday", { name }) : t("toast.removedToday", { name });
  notify(text, () => {
    toggleLog(veg.id);
  });
}

/** The tile's name plus both states its badges carry visually. */
function tileLabel(veg: Vegetable): string {
  const name = vegName(veg);
  if (onToday.value.has(veg.id)) return t("plant.onList", { name });
  if (firstLogged.value.has(veg.id)) return t("plant.triedTapAdd", { name });
  return t("plant.tapAdd", { name });
}

function clearQuery(): void {
  query.value = "";
  input.value?.focus();
}

function clearFilters(): void {
  category.value = "all";
  clearQuery();
}

function toggleFilters(): void {
  showFilters.value = !showFilters.value;
  // A filter you cannot see is a filter you cannot undo, so collapsing resets it.
  if (!showFilters.value) category.value = "all";
}
</script>

<template>
  <header class="topline">
    <h1>{{ t("catalog.title") }}</h1>
    <button
      class="btn btn--icon btn--ghost"
      :aria-label="t('catalog.filters')"
      :aria-pressed="showFilters"
      @click="toggleFilters"
    >
      <UiIcon name="tune" />
    </button>
  </header>

  <main class="view">
    <section class="card tally">
      <div class="row tally__head">
        <p class="grow tally__line">
          <span class="num tally__count">{{ discovered }}</span>
          <span class="dim tally__of">{{ t("catalog.ofTried", { n: VEGETABLES.length }) }}</span>
        </p>
        <span class="num faint tally__pct">{{ triedPct }}%</span>
      </div>
      <div class="tally__bar">
        <span class="tally__fill" :style="{ width: `${triedPct}%` }" />
      </div>
      <p class="faint tally__hint">{{ hint }}</p>
    </section>

    <div class="stack">
      <div class="field">
        <UiIcon name="search" :size="19" />
        <input
          ref="input"
          v-model="query"
          type="search"
          :placeholder="t('catalog.search', { n: VEGETABLES.length })"
          :aria-label="t('catalog.searchAria')"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          enterkeyhint="search"
          @keydown.esc="clearQuery"
        />
        <button
          v-if="query"
          class="clear"
          :aria-label="t('catalog.clearSearch')"
          @click="clearQuery"
        >
          <UiIcon name="close" :size="15" />
        </button>
      </div>

      <Transition name="fade">
        <div
          v-if="showFilters"
          class="scroller"
          role="group"
          :aria-label="t('catalog.filterGroup')"
        >
          <button class="chip" :aria-pressed="category === 'all'" @click="category = 'all'">
            {{ t("catalog.all") }}
          </button>
          <button
            v-for="id in CATEGORY_IDS"
            :key="id"
            class="chip"
            :aria-pressed="category === id"
            @click="category = id"
          >
            {{ categoryLabel(id) }}
          </button>
        </div>
      </Transition>
    </div>

    <div v-if="blocks.length === 0" class="empty">
      <UiIcon name="search" :size="26" />
      <p class="miss">{{ emptyLine }}</p>
      <button class="btn btn--sm btn--ghost" @click="clearFilters">
        {{ t("catalog.clearFilters") }}
      </button>
    </div>

    <p v-else-if="searching" class="faint count num">{{ countLabel }}</p>

    <section v-for="block in blocks" :key="block.key" class="group">
      <div v-if="block.label" class="group__head">
        <span class="eyebrow">{{ block.label }}</span>
        <span class="num faint group__count">{{ block.items.length }}</span>
      </div>
      <div class="grid">
        <button
          v-for="veg in block.items"
          :key="veg.id"
          class="tile"
          :class="{ 'tile--on': onToday.has(veg.id) }"
          :aria-label="tileLabel(veg)"
          :aria-pressed="onToday.has(veg.id)"
          @click="tap(veg)"
        >
          <span class="tile__art">
            <VegIcon :veg="veg" :size="54" :selected="onToday.has(veg.id)" aria-hidden="true" />
            <span
              v-if="firstLogged.has(veg.id)"
              class="tile__mark"
              :style="{ background: vegIcon(veg).tint }"
            />
            <span v-if="onToday.has(veg.id)" class="tile__check">
              <UiIcon name="check" :size="12" />
            </span>
          </span>
          <span class="tile__name">{{ vegName(veg) }}</span>
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* ------------------------------------------------------------- discovery */

.tally {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.tally__head {
  align-items: baseline;
}

.tally__line {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.tally__count {
  font-size: 22px;
  font-weight: 620;
  letter-spacing: -0.02em;
}

.tally__of {
  font-size: 14px;
}

.tally__pct {
  font-size: 12px;
}

.tally__bar {
  height: 5px;
  border-radius: 999px;
  background: var(--surface-hi);
  overflow: hidden;
}

.tally__fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent-deep), var(--accent));
  transition: width 0.45s var(--ease);
}

.tally__hint {
  font-size: 12.5px;
}

/* ---------------------------------------------------------------- search */

.clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 30px;
  height: 30px;
  margin-inline-end: -6px;
  border-radius: 999px;
  background: var(--surface-hi);
  color: var(--faint);
  transition:
    transform 0.12s var(--ease),
    color 0.15s var(--ease);
}

.clear:active {
  transform: scale(0.9);
}

.field input::-webkit-search-cancel-button {
  display: none;
}

.count {
  font-size: 12px;
  padding-inline: 2px;
}

.miss {
  color: var(--dim);
  max-width: 30ch;
}

/* ------------------------------------------------------------------ wall */

.group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/*
 * Full-bleed so tiles cannot peek through the view's side padding as they
 * scroll under a stuck heading. The hairline doubles as section structure when
 * the heading is at rest.
 */
.group__head {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-inline: calc(var(--pad) * -1);
  padding: 8px var(--pad) 7px;
  background: var(--bg);
  border-bottom: 1px solid var(--line-soft);
}

.group__count {
  font-size: 12px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
  gap: 11px;
}

.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 7px 4px 9px;
  border-radius: var(--r);
  transition:
    transform 0.14s var(--ease),
    background 0.18s var(--ease);
}

.tile:active {
  transform: scale(0.93);
}

/*
 * On today's list. The ring around the artwork is drawn by the icon itself,
 * from the plate's own outline — a `border-radius` here could only ever match
 * one of the six silhouettes. This just brightens the label to match.
 */
.tile--on .tile__name {
  color: var(--text);
}

/*
 * Badges sit on the diagonal at 83.2%, not in the box corner.
 *
 * That number is where the roundest plate's edge crosses 45°:
 * 50% + (47/100) * cos45° = 83.2%. On a circle the badge lands exactly on the
 * silhouette; on a squarer plate it lands just inside it. Anchored to the
 * corner instead, a badge floats in the empty space a round plate cuts away.
 */
.tile__art {
  --diag-far: 83.2%;
  --diag-near: 16.8%;

  position: relative;
  line-height: 0;
}

.tile__mark {
  position: absolute;
  left: var(--diag-far);
  top: var(--diag-near);
  width: 10px;
  height: 10px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  box-shadow: 0 0 0 2px var(--bg);
}

/*
 * Opposite end of the diagonal from the dot, because a vegetable on today's
 * list has always been tried: both badges show at once and must not overlap.
 */
.tile__check {
  position: absolute;
  left: var(--diag-far);
  top: var(--diag-far);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-ink);
  box-shadow: 0 0 0 2px var(--bg);
}

/*
 * Two lines, always: a fixed box means "Purple Sprouting Broccoli" sits beside
 * "Kale" without nudging the row below it.
 */
.tile__name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  overflow-wrap: anywhere;
  height: 30px;
  font-size: 12px;
  line-height: 1.25;
  text-align: center;
  color: var(--dim);
  transition: color 0.15s var(--ease);
}

@media (hover: hover) {
  .clear:hover {
    color: var(--text);
  }

  .tile:hover {
    background: var(--surface);
  }

  .tile:hover .tile__name {
    color: var(--text);
  }
}
</style>
