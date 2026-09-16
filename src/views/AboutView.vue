<script setup lang="ts">
  import { useGlobalShortcut } from "../composables/useGlobalShortcut";
  import { openUrl } from "@tauri-apps/plugin-opener";

  const { globalShortcut, isShortcutLoaded } = useGlobalShortcut();
</script>

<template>
  <section aria-label="O programie">
    <h1 class="page-title">O programie</h1>
    <p class="text-status">
      Synonik to lekki i szybki słownik synonimów języka polskiego. Wyszukiwanie na bazie lokalnej
      bazy danych sqlite z globalnym skrótem klawiszowym.
    </p>
    <p>
      Autor: <a @click="() => openUrl('https://leon135.xyz')">Leon135</a> <br />
      Repozytorium: <a @click="() => openUrl('https://github.com/Leon135/synonik')">GitHub</a>
    </p>
    <p class="text-status text-status--hint">Licencja: Apache 2.0.</p>

    <h2 class="section-title">Skróty klawiszowe</h2>
    <ul class="shortcuts-list">
      <li class="shortcuts-item"><kbd>Enter</kbd> - szukaj</li>
      <li class="shortcuts-item">
        <kbd>Ctrl</kbd>+<kbd>L</kbd> lub <kbd>/</kbd> - fokus pola wyszukiwania
      </li>
      <li v-if="isShortcutLoaded" class="shortcuts-item">
        <kbd>{{ globalShortcut }}</kbd> - otwórz popup z zaznaczonym tekstem
      </li>
    </ul>
  </section>
</template>

<style>
  a {
    text-decoration: underline;
    cursor: pointer;
    color: var(--syn-accent);
  }
</style>
