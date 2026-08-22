<script setup lang="ts">
/**
 * Modal sheet chrome: backdrop, rounded panel, escape, scroll lock.
 * Content is entirely the caller's business.
 */
import { onBeforeUnmount, watch } from "vue";
import { t } from "../i18n/index.ts";
import UiIcon from "./UiIcon.vue";
const props = defineProps<{ open: boolean; title?: string; tall?: boolean }>();
const emit = defineEmits<{ close: [] }>();

function onKey(event: KeyboardEvent): void {
  if (event.key === "Escape") emit("close");
}

watch(
  () => props.open,
  (open) => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) window.addEventListener("keydown", onKey);
    else window.removeEventListener("keydown", onKey);
  },
);

onBeforeUnmount(() => {
  document.body.style.overflow = "";
  window.removeEventListener("keydown", onKey);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="props.open" class="scrim" @click="emit('close')" />
    </Transition>
    <Transition name="sheet">
      <div
        v-if="props.open"
        class="sheet"
        :class="{ 'sheet--tall': props.tall }"
        role="dialog"
        aria-modal="true"
        :aria-label="props.title"
      >
        <header class="sheet__top">
          <div class="sheet__grip" />
          <div class="row">
            <h2 class="grow truncate">{{ props.title }}</h2>
            <button
              class="btn btn--icon btn--ghost"
              :aria-label="t('sheet.close')"
              @click="emit('close')"
            >
              <UiIcon name="close" :size="20" />
            </button>
          </div>
        </header>
        <div class="sheet__body">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: oklch(0.08 0.01 150 / 0.68);
  backdrop-filter: blur(3px);
}

.sheet {
  position: fixed;
  z-index: 41;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 100%;
  max-width: var(--shell);
  max-height: 86dvh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  border: 1px solid var(--line);
  border-bottom: 0;
  border-radius: var(--r-xl) var(--r-xl) 0 0;
  box-shadow: var(--shadow-lift);
}

.sheet--tall {
  height: 86dvh;
}

.sheet__top {
  padding: 8px var(--pad) 6px;
}

.sheet__top h2 {
  font-size: 17px;
  font-weight: 620;
  letter-spacing: -0.01em;
}

.sheet__grip {
  width: 40px;
  height: 4px;
  border-radius: 999px;
  background: var(--line);
  margin: 0 auto 10px;
}

.sheet__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px var(--pad) calc(20px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* The sheet slides, the scrim only fades. */
.sheet-enter-from,
.sheet-leave-to {
  transform: translate(-50%, 100%);
}

.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.3s var(--ease);
}
</style>
