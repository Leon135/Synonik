<template>
  <div class="syn-about">
    <div
      class="syn-collapse-header"
      role="button"
      tabindex="0"
      @click="toggle"
      @keydown="onKeyDown"
    >
      <span>O programie</span>
      <span class="syn-collapse-chevron">{{ aboutOpened ? "▴" : "▾" }}</span>
    </div>
    <div v-if="aboutOpened" class="syn-about__body syn-panel">
      <p><strong>Synonik</strong> to podręczny i lekki słownik synonimów.</p>
      <h4>Jak używać?</h4>
      <p class="syn-about__usage">
        Wpisz słowo w pole wyszukiwania i kliknij <strong>Szukaj</strong>, albo zaznacz tekst w
        dowolnej aplikacji i naciśnij skrót klawiszowy.
      </p>

      <h4>Skróty klawiszowe</h4>
      <table class="syn-about__shortcuts">
        <thead>
          <tr>
            <th>Skrót</th>
            <th>Działanie</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <kbd>{{ globalShortcut }}</kbd>
            </td>
            <td>Przechwyć zaznaczony tekst i wyszukaj synonimy</td>
          </tr>
          <tr>
            <td><kbd>Ctrl+L</kbd> lub <kbd>/</kbd></td>
            <td>Zaznacz pole wyszukiwania</td>
          </tr>
          <tr>
            <td><kbd>→</kbd> <kbd>←</kbd></td>
            <td>Nawigacja między grupami synonimów</td>
          </tr>
          <tr>
            <td><kbd>Enter</kbd></td>
            <td>Wyszukaj synonimy dla wpisanego słowa</td>
          </tr>
        </tbody>
      </table>
      <p class="syn-about__footer">Wersja beta <a href="https://leon135.xyz">@Leon135</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  defineProps<{
    globalShortcut: string;
  }>();

  const aboutOpened = ref(false);

  function toggle() {
    aboutOpened.value = !aboutOpened.value;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  }
</script>

<style lang="css" scoped>
  .syn-about {
    margin-bottom: var(--size-5);
  }

  .syn-about__body {
    color: var(--text-2);
    font-size: var(--font-size-1);
    line-height: var(--font-lineheight-3);
  }

  .syn-about__body p {
    margin: 0 0 var(--size-2);
  }

  .syn-about__body h4 {
    margin: 0 0 var(--size-1);
    color: var(--text-1);
    font-weight: var(--font-weight-7);
    font-size: var(--font-size-1);
  }

  .syn-about__usage {
    margin: 0 0 var(--size-2);
  }

  .syn-about__shortcuts {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-size-1);
  }

  .syn-about__shortcuts th,
  .syn-about__shortcuts td {
    text-align: left;
    padding: var(--size-1);
    vertical-align: middle;
  }

  .syn-about__shortcuts th {
    font-weight: var(--font-weight-7);
    color: var(--text-1);
    padding-bottom: var(--size-0);
    border-bottom: 1px solid var(--surface-4);
  }

  .syn-about__shortcuts tr {
    line-height: var(--font-lineheight-5);
  }

  .syn-about__shortcuts td:first-child {
    white-space: nowrap;
    padding-right: var(--size-3);
  }

  .syn-about__body kbd {
    background: var(--surface-4);
    padding: var(--size-1);
    border-radius: var(--radius-1);
    font-size: var(--font-size-0);
  }

  .syn-about__footer {
    margin-top: var(--size-2);
    padding-top: var(--size-2);
    border-top: 1px solid var(--surface-4);
    font-size: var(--font-size-0);
  }
</style>
