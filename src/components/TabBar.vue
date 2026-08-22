<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { type LabelKey, t } from "../i18n/index.ts";
import UiIcon, { type UiIconName } from "./UiIcon.vue";

/**
 * Labels are message *keys*, translated in the template. Resolving them here
 * would freeze the tab bar in whatever language the app started in.
 */
const TABS: { to: string; label: LabelKey; icon: UiIconName }[] = [
  { to: "/", label: "tab.today", icon: "leaf" },
  { to: "/week", label: "tab.week", icon: "chart" },
  { to: "/history", label: "tab.history", icon: "clock" },
  { to: "/plants", label: "tab.plants", icon: "grid" },
];

const route = useRoute();
</script>

<template>
  <nav class="tabs">
    <RouterLink
      v-for="tab in TABS"
      :key="tab.to"
      :to="tab.to"
      class="tab"
      :class="{ 'tab--on': route.path === tab.to }"
    >
      <UiIcon :name="tab.icon" :size="23" />
      {{ t(tab.label) }}
    </RouterLink>
  </nav>
</template>
