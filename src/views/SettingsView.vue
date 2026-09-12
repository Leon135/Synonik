<script setup lang="ts">
  import { useGlobalShortcut } from "../composables/useGlobalShortcut";
  import type { Theme } from "../composables/useTheme";
  import { useUiScale, uiScalePresets } from "../composables/useUiScale";

  const props = defineProps<{ theme: Theme; setTheme: (value: Theme) => void }>();

  const { uiScale, apply: applyUiScale } = useUiScale();
  const { shortcutKeys, shortcutError, shortcutSaved, isShortcutLoaded, recordKey, clear, save } =
    useGlobalShortcut();

  function setThemeChoice(value: Theme): void {
    props.setTheme(value);
  }
</script>

<template>
  <section aria-label="Ustawienia">
    <h1 class="page-title">Ustawienia</h1>

    <div class="settings-section">
      <h2 class="section-title">Motyw</h2>
      <div class="theme-row" role="group" aria-label="Wybór motywu">
        <button
          type="button"
          :class="['theme-btn', { 'theme-btn--active': theme === 'system' }]"
          @click="setThemeChoice('system')"
        >
          Systemowy
        </button>
        <button
          type="button"
          :class="['theme-btn', { 'theme-btn--active': theme === 'light' }]"
          @click="setThemeChoice('light')"
        >
          Jasny
        </button>
        <button
          type="button"
          :class="['theme-btn', { 'theme-btn--active': theme === 'dark' }]"
          @click="setThemeChoice('dark')"
        >
          Ciemny
        </button>
      </div>
    </div>

    <div class="settings-section">
      <h2 class="section-title">Skala interfejsu</h2>
      <div class="theme-row scale-buttons" role="group" aria-label="Skala interfejsu">
        <button
          v-for="preset in uiScalePresets"
          :key="preset"
          type="button"
          :class="['theme-btn', { 'theme-btn--active': uiScale === preset }]"
          @click="applyUiScale(preset)"
        >
          {{ preset }}%
        </button>
      </div>
    </div>

    <div class="settings-section">
      <h2 class="section-title">Globalny skrót</h2>
      <form v-if="isShortcutLoaded" class="search-row" @submit.prevent="save">
        <div class="search-field">
          <input
            class="search-input"
            type="text"
            readonly
            :value="shortcutKeys.join('+')"
            placeholder="Naciśnij klawisze w polu, aby ustawić nowy skrót globalny"
            aria-label="Nowy globalny skrót — naciśnij klawisze w polu"
            autocomplete="off"
            spellcheck="false"
            @keydown="recordKey"
          />
          <button
            v-if="shortcutKeys.length > 0"
            type="button"
            class="search-clear"
            aria-label="Wyczyść skrót"
            @click="clear"
          >
            ×
          </button>
        </div>
        <button type="submit" class="search-submit" :disabled="shortcutKeys.length === 0">
          Zapisz
        </button>
      </form>
      <p v-if="shortcutError" class="search-status search-status--error" role="alert">
        {{ shortcutError }}
      </p>
      <p v-if="shortcutSaved" class="search-status" role="status">Zapisano skrót.</p>
    </div>
  </section>
</template>
