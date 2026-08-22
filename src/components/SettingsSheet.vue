<script setup lang="ts">
/**
 * Two targets and a language. Anything more would be a preferences screen, and
 * a vegetable tracker does not need one.
 */
import { ref } from "vue";
import { LOCALE_NAMES, LOCALES, setLocale, t } from "../i18n/index.ts";
import { clearLog, entries } from "../stores/log.ts";
import { settings } from "../stores/settings.ts";
import { notify } from "../stores/toast.ts";
import { closeSheet } from "../stores/ui.ts";
import UiIcon from "./UiIcon.vue";

const armed = ref(false);

function step(key: "dailyVariety" | "weeklyVariety", by: number): void {
  const bounds = key === "dailyVariety" ? { min: 1, max: 15 } : { min: 5, max: 60 };
  settings[key] = Math.min(bounds.max, Math.max(bounds.min, settings[key] + by));
}

function erase(): void {
  if (!armed.value) {
    armed.value = true;
    return;
  }
  clearLog();
  notify(t("toast.erased"));
  closeSheet();
}
</script>

<template>
  <div class="card stack">
    <div class="row">
      <div class="grow">
        <p class="eyebrow">{{ t("settings.dailyVariety") }}</p>
        <p class="faint">{{ t("settings.dailyVarietyHint") }}</p>
      </div>
      <button
        class="btn btn--icon"
        :aria-label="t('settings.fewerPerDay')"
        @click="step('dailyVariety', -1)"
      >
        <UiIcon name="minus" :size="18" />
      </button>
      <strong class="num val">{{ settings.dailyVariety }}</strong>
      <button
        class="btn btn--icon"
        :aria-label="t('settings.morePerDay')"
        @click="step('dailyVariety', 1)"
      >
        <UiIcon name="plus" :size="18" />
      </button>
    </div>

    <div class="divider" />

    <div class="row">
      <div class="grow">
        <p class="eyebrow">{{ t("settings.weeklyVariety") }}</p>
        <p class="faint">{{ t("settings.weeklyVarietyHint") }}</p>
      </div>
      <button
        class="btn btn--icon"
        :aria-label="t('settings.fewerPerWeek')"
        @click="step('weeklyVariety', -5)"
      >
        <UiIcon name="minus" :size="18" />
      </button>
      <strong class="num val">{{ settings.weeklyVariety }}</strong>
      <button
        class="btn btn--icon"
        :aria-label="t('settings.morePerWeek')"
        @click="step('weeklyVariety', 5)"
      >
        <UiIcon name="plus" :size="18" />
      </button>
    </div>

    <div class="divider" />

    <div class="row">
      <div class="grow">
        <p class="eyebrow">{{ t("settings.language") }}</p>
        <p class="faint">{{ t("settings.languageHint") }}</p>
      </div>
      <!-- Endonyms, never translated: a picker that offers "German" to someone
           who only reads German has failed at the one thing it does. -->
      <div class="row langs">
        <button
          v-for="code in LOCALES"
          :key="code"
          class="chip"
          type="button"
          :lang="code"
          :aria-pressed="settings.locale === code"
          @click="setLocale(code)"
        >
          {{ LOCALE_NAMES[code] }}
        </button>
      </div>
    </div>
  </div>

  <button class="btn btn--ghost btn--danger" @click="erase">
    <UiIcon name="trash" :size="18" />
    {{ armed ? t("settings.eraseArmed") : t("settings.erase", { n: entries.length }) }}
  </button>

  <p class="faint tiny">{{ t("settings.privacy") }}</p>
</template>

<style scoped>
.val {
  min-width: 34px;
  text-align: center;
  font-size: 19px;
  font-weight: 640;
}

.langs {
  gap: 6px;
}

.tiny {
  font-size: 12px;
  text-align: center;
}
</style>
