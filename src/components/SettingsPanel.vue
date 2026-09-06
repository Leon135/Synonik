<template>
  <div class="syn-settings">
    <p class="syn-settings__title">Motyw interfejsu</p>
    <div class="syn-settings__option-btns">
      <button
        type="button"
        :class="['syn-btn', 'syn-btn--option', { 'syn-btn--option-active': theme === 'system' }]"
        @click="onSelectTheme('system')"
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-monitor"
        >
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
        Systemowy
      </button>
      <button
        type="button"
        :class="['syn-btn', 'syn-btn--option', { 'syn-btn--option-active': theme === 'light' }]"
        @click="onSelectTheme('light')"
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-sun-medium-icon lucide-sun-medium"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v1" />
          <path d="M12 20v1" />
          <path d="M3 12h1" />
          <path d="M20 12h1" />
          <path d="m18.364 5.636-.707.707" />
          <path d="m6.343 17.657-.707.707" />
          <path d="m5.636 5.636.707.707" />
          <path d="m17.657 17.657.707.707" />
        </svg>
        Jasny
      </button>
      <button
        type="button"
        :class="['syn-btn', 'syn-btn--option', { 'syn-btn--option-active': theme === 'dark' }]"
        @click="onSelectTheme('dark')"
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-moon-icon lucide-moon"
        >
          <path
            d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
          />
        </svg>
        Ciemny
      </button>
    </div>

    <p class="syn-settings__title">Skrót klawiszowy</p>
    <div class="syn-settings__row">
      <div class="syn-settings__field">
        <input
          class="syn-input"
          type="text"
          readonly
          :value="shortcutKeys.join('+')"
          @keydown="handleKeyDown"
        />
        <button
          v-if="shortcutKeys.length > 0"
          type="button"
          class="syn-input-clear"
          aria-label="Wyczyść"
          @click="handleClear"
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-x"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form class="syn-settings__action" @submit.prevent="handleSave">
        <button
          type="submit"
          :disabled="shortcutKeys.length === 0 || isSaving"
          class="syn-btn"
          aria-label="Zapisz skrót"
        >
          {{ isSaved ? "Zapisano" : "Zapisz" }}
        </button>
      </form>
    </div>

    <p class="syn-settings__title">Skala interfejsu</p>
    <div class="syn-settings__option-btns">
      <button
        v-for="v in ['0.5', '0.75', '1', '1.25', '1.5', '1.75', '2']"
        :key="v"
        type="button"
        :class="['syn-btn', 'syn-btn--option', { 'syn-btn--option-active': scaleFactor === v }]"
        @click="handleScaleChange(v)"
      >
        {{ Number(v) * 100 }}%
      </button>
      <button
        type="button"
        class="syn-btn syn-btn--option"
        style="margin-left: var(--size-4)"
        aria-label="Resetuj skalę"
        @click="handleResetScale"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { ref, watch } from "vue";
  import type { Theme } from "../composables/useTheme";

  const props = defineProps<{
    globalShortcut: string;
    theme: Theme;
    onSelectTheme: (value: Theme) => void;
  }>();

  const shortcutKeys = ref(props.globalShortcut.split("+"));
  const isSaving = ref(false);
  const isSaved = ref(false);
  const scaleFactor = ref(document.body.style.zoom || "1");

  watch(
    () => props.globalShortcut,
    () => {
      shortcutKeys.value = props.globalShortcut.split("+");
    },
  );

  function handleKeyDown(event: KeyboardEvent) {
    isSaved.value = false;
    if (!shortcutKeys.value.includes(event.key)) {
      shortcutKeys.value = [...shortcutKeys.value, event.key];
    }
  }

  function handleClear() {
    shortcutKeys.value = [];
    isSaved.value = false;
  }

  function handleScaleChange(newScale: string) {
    scaleFactor.value = newScale;
    document.body.style.zoom = newScale;
  }

  function handleResetScale() {
    handleScaleChange("1");
  }

  function handleSave() {
    isSaving.value = true;
    invoke("register_shortcut", { shortcut: shortcutKeys.value.join("+") })
      .then(() => {
        isSaving.value = false;
        isSaved.value = true;
        setTimeout(() => {
          isSaved.value = false;
        }, 1500);
      })
      .catch((error: Error) => {
        console.error("[Synonik] Failed to save shortcut:", error);
        isSaving.value = false;
      });
  }
</script>

<style lang="css" scoped>
  .syn-settings {
    margin-bottom: var(--size-5);
  }

  .syn-settings__title {
    margin: 0 0 var(--size-1);
    color: var(--text-1);
    font-weight: var(--font-weight-6);
    font-size: var(--font-size-1);
  }

  .syn-settings__row + .syn-settings__title {
    margin-top: var(--size-4);
  }

  .syn-settings__row {
    display: flex;
    align-items: center;
    gap: var(--size-2);
  }

  .syn-settings__row + .syn-settings__row {
    margin-top: var(--size-3);
  }

  .syn-settings__option-btns {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-1);
  }

  .syn-btn--option {
    padding: var(--size-1) var(--size-2);
    font-size: var(--font-size-0);
    background: var(--surface-3);
    color: var(--text-1);
    margin: 0;
  }

  .syn-btn--option svg {
    width: var(--size-4);
    height: var(--size-4);
  }

  .syn-btn--option:hover:not(:disabled) {
    background: var(--surface-4);
  }

  .syn-btn--option-active {
    background: var(--brand);
    color: var(--gray-0);
  }

  .syn-btn--option-active:hover:not(:disabled) {
    background: var(--brand-hover);
  }

  .syn-settings__field {
    position: relative;
    flex: 1;
  }

  .syn-settings__action {
    display: flex;
    align-items: center;
    gap: var(--size-2);
    min-width: 7em;
  }

  @media (max-width: 500px) {
    .syn-settings__row {
      flex-wrap: wrap;
    }
  }
</style>
