<script setup lang="ts">
import { t } from "../i18n/index.ts";
import { dismiss, toasts } from "../stores/toast.ts";
import UiIcon from "./UiIcon.vue";
</script>

<template>
  <div class="toasts" aria-live="polite">
    <TransitionGroup name="sheet">
      <div v-for="toast in toasts" :key="toast.id" class="toast">
        <span class="grow truncate">{{ toast.text }}</span>
        <button
          v-if="toast.undo"
          class="undo"
          @click="
            toast.undo?.();
            dismiss(toast.id);
          "
        >
          <UiIcon name="undo" :size="16" />
          {{ t("common.undo") }}
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toasts {
  position: fixed;
  z-index: 30;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(76px + env(safe-area-inset-bottom));
  width: min(100% - 24px, calc(var(--shell) - 24px));
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: auto;
  padding: 10px 10px 10px 16px;
  border-radius: 999px;
  background: var(--surface-hi);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-lift);
  font-size: 13.5px;
}

.undo {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-ink);
  font-size: 12.5px;
  font-weight: 620;
}
</style>
