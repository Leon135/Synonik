<script setup lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { listen } from "@tauri-apps/api/event";
  import { useTheme } from "./composables/useTheme";
  import { onMounted, onUnmounted, ref } from "vue";
  import AboutPanel from "./components/AboutSection.vue";
  import Titlebar from "./components/Titlebar.vue";
  import SettingsPanel from "./components/SettingsPanel.vue";
  import SearchContainer from "./components/SearchContainer.vue";

  type View = "lookup" | "settings";

  const { theme, set: setTheme } = useTheme();

  const view = ref<View>("lookup");
  const shortcut = ref("Ctrl+F2");
  let unlistenShortcutInput: (() => void) | undefined;

  function navigateTo(next: View) {
    view.value = next;
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
    <Titlebar :view="view" :on-navigate="navigateTo" />
    <main class="syn-main">
      <div v-show="view === 'lookup'">
        <SearchContainer />
      </div>
      <div v-show="view === 'settings'">
        <AboutPanel :global-shortcut="shortcut" />
        <SettingsPanel
          :global-shortcut="shortcut"
          :theme="theme"
          :on-select-theme="setTheme"
        />
      </div>
    </main>
  </div>
</template>
