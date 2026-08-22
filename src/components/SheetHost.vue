<script setup lang="ts">
/**
 * One place that turns sheet state into sheets. A narrowed computed instead of
 * `v-if` on the union keeps the child props type-safe.
 */
import { computed } from "vue";
import { t } from "../i18n/index.ts";
import { dayLabelCasual } from "../lib/date.ts";
import { closeSheet, sheet } from "../stores/ui.ts";
import BottomSheet from "./BottomSheet.vue";
import SettingsSheet from "./SettingsSheet.vue";
import PlantPicker from "./PlantPicker.vue";

const picker = computed(() => (sheet.value.kind === "picker" ? sheet.value : null));

/** "Add to today" / "Zu heute hinzufügen" — the day reads mid-sentence. */
const pickerTitle = computed(() =>
  picker.value ? t("common.addTo", { day: dayLabelCasual(picker.value.day) }) : "",
);
</script>

<template>
  <BottomSheet :open="!!picker" tall :title="pickerTitle" @close="closeSheet">
    <PlantPicker v-if="picker" :day="picker.day" />
  </BottomSheet>

  <BottomSheet :open="sheet.kind === 'settings'" :title="t('sheet.targets')" @close="closeSheet">
    <SettingsSheet v-if="sheet.kind === 'settings'" />
  </BottomSheet>
</template>
