<template>
  <div class="syn-settings">
    <WinRadioButtons
      class="syn-settings__theme-picker"
      Header="Motyw interfejsu"
      :ItemsSource="['Systemowy', 'Jasny', 'Ciemny']"
      :MaxColumns="3"
      :SelectedIndex="themeIndex"
      @update:selected-index="handleThemeChange"
    />

    <WinSettingsCard
      class="syn-settings__card"
      Header="Skrót klawiszowy"
      Description="Naciśnij klawisze w polu, aby ustawić nowy skrót globalny"
      :IsActionIconVisible="false"
    >
      <template #HeaderIcon>
        <span class="syn-settings__card-icon">&#xE765;</span>
      </template>
      <div class="syn-settings__row">
        <div class="syn-settings__field">
          <input
            class="syn-input"
            type="text"
            readonly
            :value="shortcutKeys.join('+')"
            placeholder="Brak skrótu"
            @keydown="handleKeyDown"
          />
          <button
            v-if="shortcutKeys.length > 0"
            type="button"
            class="syn-input-clear"
            aria-label="Wyczyść"
            @click="handleClear"
          >
            <span class="syn-glyph">&#xE8BB;</span>
          </button>
        </div>
        <WinButton
          Style="AccentButtonStyle"
          :Content="isSaved ? 'Zapisano' : 'Zapisz'"
          :IsEnabled="shortcutKeys.length > 0 && !isSaving"
          @click="handleSave"
        />
      </div>
    </WinSettingsCard>

    <WinSettingsCard
      class="syn-settings__card"
      Header="Skala interfejsu"
      Description="Zmień rozmiar całego interfejsu aplikacji"
      :IsActionIconVisible="false"
    >
      <template #HeaderIcon>
        <span class="syn-settings__card-icon">&#xE71D;</span>
      </template>
      <div class="syn-settings__row syn-settings__row--scale">
        <WinSlider
          class="syn-settings__slider"
          :Value="scalePercent"
          :Minimum="50"
          :Maximum="200"
          :StepFrequency="25"
          :TickFrequency="25"
          TickPlacement="Outside"
          SnapsTo="StepValues"
          @update:value="handleScaleChange"
        />
        <span class="syn-settings__scale-value">{{ scalePercent }}%</span>
        <WinButton Content="Reset" @click="handleResetScale" />
      </div>
    </WinSettingsCard>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { invoke } from "@tauri-apps/api/core";
  import type { Theme } from "../composables/useTheme";
  import WinRadioButtons from "../winui/components/WinRadioButtons.vue";
  import WinSettingsCard from "../winui/components/WinSettingsCard.vue";
  import WinButton from "../winui/components/WinButton.vue";
  import WinSlider from "../winui/components/WinSlider.vue";

  const THEME_ORDER: Theme[] = ["system", "light", "dark"];

  const props = defineProps<{
    globalShortcut: string;
    theme: Theme;
    onSelectTheme: (value: Theme) => void;
  }>();

  const shortcutKeys = ref(props.globalShortcut.split("+").filter(Boolean));
  const isSaving = ref(false);
  const isSaved = ref(false);
  const scalePercent = ref(Math.round(Number.parseFloat(document.body.style.zoom || "1") * 100));

  const themeIndex = computed(() => THEME_ORDER.indexOf(props.theme));

  watch(
    () => props.globalShortcut,
    () => {
      shortcutKeys.value = props.globalShortcut.split("+").filter(Boolean);
    },
  );

  function handleThemeChange(index: number) {
    const value = THEME_ORDER[index];
    if (value) props.onSelectTheme(value);
  }

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

  function handleScaleChange(value: number) {
    scalePercent.value = value;
    document.body.style.zoom = String(value / 100);
  }

  function handleResetScale() {
    handleScaleChange(100);
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
    margin-bottom: var(--syn-space-6);
    display: flex;
    flex-direction: column;
    gap: var(--syn-space-1);
  }

  .syn-settings__theme-picker {
    margin-bottom: var(--syn-space-4);
  }

  .syn-settings__theme-picker :deep(.win-radio-button) {
    min-width: 0;
  }

  .syn-settings__theme-picker :deep(.win-radio-buttons-items) {
    column-gap: var(--syn-space-2);
  }

  .syn-settings__card-icon {
    font-family: "WinUIOnWebIcons";
    font-size: 16px;
    line-height: 1;
    color: var(--text-primary);
  }

  .syn-settings__row {
    display: flex;
    align-items: center;
    gap: var(--syn-space-2);
  }

  .syn-settings__row--scale {
    min-width: 280px;
  }

  .syn-settings__field {
    position: relative;
    flex: 1;
    min-width: 0;
  }

  .syn-settings__slider {
    flex: 1;
  }

  .syn-settings__scale-value {
    min-width: 4em;
    font-size: var(--syn-text-body);
    color: var(--text-secondary);
    text-align: right;
    flex-shrink: 0;
  }
</style>
