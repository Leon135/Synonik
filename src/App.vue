<script setup lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { listen } from "@tauri-apps/api/event";
  import { useTheme } from "./composables/useTheme";
  import { onMounted, onUnmounted, ref } from "vue";
  import AboutPanel from "./components/AboutSection.vue";
  import SettingsPanel from "./components/SettingsPanel.vue";
  import SearchContainer from "./components/SearchContainer.vue";
  import WinScrollView from "./winui/components/WinScrollView.vue";

  type View = "lookup" | "settings";

  const { theme, set: setTheme } = useTheme();

  const view = ref<View>("lookup");
  const shortcut = ref("Ctrl+F2");
  let unlistenShortcutInput: (() => void) | undefined;

  function navigateTo(next: View) {
    view.value = next;
  }

  function openSettings() {
    navigateTo("settings");
  }

  onMounted(async () => {
    unlistenShortcutInput = await listen("shortcut-pressed-input", () => {
      view.value = "lookup";
    });
    try {
      shortcut.value = await invoke<string>("get_shortcut");
    } catch (error) {
      console.error("[Synonik] Failed to get shortcut:", error);
    }
  });

  onUnmounted(() => {
    unlistenShortcutInput?.();
  });
</script>

<template>
  <div class="syn-app">
    <WinScrollView class="syn-scroll" ContentOrientation="Vertical">
      <main class="syn-main">
        <div v-show="view === 'lookup'">
          <SearchContainer :on-open-settings="openSettings" />
        </div>
        <div v-show="view === 'settings'">
          <div class="syn-back-row">
            <button
              type="button"
              class="syn-icon-btn syn-icon-btn--labeled"
              title="Powrót do strony wyszukiwania"
              aria-label="Powrót do strony wyszukiwania"
              @click="navigateTo('lookup')"
            >
              <span class="syn-icon-btn__glyph">&#xE72B;</span>
              <span class="syn-icon-btn__label">Powrót do strony wyszukiwania</span>
            </button>
          </div>
          <AboutPanel :global-shortcut="shortcut" />
          <SettingsPanel :global-shortcut="shortcut" :theme="theme" :on-select-theme="setTheme" />
        </div>
      </main>
    </WinScrollView>
  </div>
</template>
