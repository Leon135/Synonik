<script setup lang="ts">
  import { useGlobalShortcut } from "../composables/useGlobalShortcut";
  import type { Theme } from "../composables/useTheme";
  import { useUiScale, uiScalePresets } from "../composables/useUiScale";

  const props = defineProps<{ theme: Theme; setTheme: (value: Theme) => void }>();

  const { uiScale, apply: applyUiScale } = useUiScale();
  const {
    shortcutKeys,
    shortcutError,
    shortcutSaved,
    isShortcutLoaded,
    isManualShortcutMode,
    isGnomeDesktop,
    detectedDesktopEnvironment,
    manualToggleCommand,
    manualCommandCopied,
    recordKey,
    clear,
    save,
    copyToggleCommand,
    resetManualCommandCopied,
  } = useGlobalShortcut();

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
      <div v-if="isManualShortcutMode && isShortcutLoaded" class="manual-shortcut">
        <p class="text-status">
          Wayland nie pozwala aplikacjom przechwytywać klawiszy globalnie. Dodaj skrót ręcznie w
          systemie:
        </p>
        <div class="manual-command-row">
          <p class="manual-command">{{ manualToggleCommand }}</p>
          <button
            type="button"
            :class="['theme-btn', { 'theme-btn--active': manualCommandCopied }]"
            @click="copyToggleCommand"
            @mouseleave="resetManualCommandCopied"
          >
            {{ manualCommandCopied ? "Skopiowano" : "Kopiuj" }}
          </button>
        </div>
        <ol v-if="isGnomeDesktop" class="shortcuts-list">
          <li class="shortcuts-item">
            Otwórz Ustawienia → Klawiatura → Pokaż i dostosuj skróty → Własne skróty.
          </li>
          <li class="shortcuts-item">
            Dodaj nowy skrót, wklej skopiowaną komendę i wybierz klawisze.
          </li>
          <li class="shortcuts-item">
            Zaznacz tekst przed użyciem skrótu (czytany jest schowek PRIMARY, wymagany pakiet
            wl-clipboard).
          </li>
        </ol>
        <div v-else>
          <p class="text-status text-status--hint">
            <template v-if="detectedDesktopEnvironment !== 'unknown'">
              Wykryto środowisko: {{ detectedDesktopEnvironment }}.
            </template>
            Dodaj własny skrót w ustawieniach systemu wskazujący na powyższą komendę.
          </p>
          <ol class="shortcuts-list">
            <li class="shortcuts-item">Wklej skopiowaną komendę jako akcję skrótu.</li>
            <li class="shortcuts-item">
              Zaznacz tekst przed użyciem skrótu (czytany jest schowek PRIMARY, wymagany pakiet
              wl-clipboard).
            </li>
          </ol>
        </div>
      </div>
      <form v-else-if="isShortcutLoaded" class="search-row" @submit.prevent="save">
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
      <p v-if="shortcutError" class="text-status text-status--error" role="alert">
        {{ shortcutError }}
      </p>
      <p v-if="shortcutSaved" class="text-status" role="status">Zapisano skrót.</p>
    </div>
  </section>
</template>
