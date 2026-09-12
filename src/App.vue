<script setup lang="ts">
  import { listen } from "@tauri-apps/api/event";
  import { onMounted, onUnmounted, ref } from "vue";
  import AppFooter, { type AppView } from "./components/AppFooter.vue";
  import TitleBar from "./components/TitleBar.vue";
  import { loadSystemAccent } from "./composables/useAccent";
  import { useGlobalShortcut } from "./composables/useGlobalShortcut";
  import { useTheme } from "./composables/useTheme";
  import { useUiScale } from "./composables/useUiScale";
  import AboutView from "./views/AboutView.vue";
  import SearchView from "./views/SearchView.vue";
  import SettingsView from "./views/SettingsView.vue";

  const { theme, set: setTheme } = useTheme();

  const view = ref<AppView>("search");
  const { restore: restoreUiScale } = useUiScale();
  const { load: loadShortcut } = useGlobalShortcut();

  let unlistenViewSwitch: (() => void) | undefined;

  onMounted(async () => {
    restoreUiScale();
    await loadShortcut();
    await loadSystemAccent();
    try {
      unlistenViewSwitch = await listen("shortcut-pressed-input", () => {
        view.value = "search";
      });
    } catch (error) {
      console.error("[Synonik] Failed to listen for view switch:", error);
    }
  });

  onUnmounted(() => {
    unlistenViewSwitch?.();
  });
</script>

<template>
  <div class="app-shell">
    <TitleBar />
    <main class="views">
      <div class="view-inner">
        <SearchView v-show="view === 'search'" />
        <SettingsView v-show="view === 'settings'" :theme="theme" :set-theme="setTheme" />
        <AboutView v-show="view === 'about'" />
      </div>
    </main>
    <AppFooter :view="view" @navigate="view = $event" />
  </div>
</template>
