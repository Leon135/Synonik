<script setup lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { useTheme } from "./composables/useTheme";
  import { onMounted, ref } from "vue";
  import AboutPanel from "./components/AboutPanel.vue";
  import Titlebar from "./components/Titlebar.vue";
  import SettingsPanel from "./components/SettingsPanel.vue";
  import SearchContainer from "./components/SearchContainer.vue";

  const { theme, toggle } = useTheme();

  const shortcut = ref("Ctrl+F2");

  onMounted(async () => {
    try {
      shortcut.value = await invoke<string>("get_shortcut");
    } catch {
      // uses default
    }
  });
</script>

<template>
  <div class="syn-app">
    <Titlebar :theme="theme" :on-toggle-theme="toggle" />
    <main class="syn-main">
      <AboutPanel :global-shortcut="shortcut" />
      <SettingsPanel :global-shortcut="shortcut" />
      <SearchContainer />
    </main>
  </div>
</template>
