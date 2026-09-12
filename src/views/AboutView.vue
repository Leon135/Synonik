<script setup lang="ts">
  import { useGlobalShortcut } from "../composables/useGlobalShortcut";

  const { globalShortcut, isShortcutLoaded } = useGlobalShortcut();
</script>

<template>
  <section aria-label="O programie">
    <h1 class="page-title">O programie</h1>
    <p class="search-status">
      Synonik to lekki słownik synonimów języka polskiego. Szybkie wyszukiwanie z lokalnej bazy,
      globalny skrót, motyw systemowy.
    </p>
    <p class="search-status search-status--hint">Licencja: Apache 2.0.</p>

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
