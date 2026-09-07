<template>
  <div class="syn-about">
    <h3 class="syn-about__title">O programie</h3>
    <div class="syn-about__body syn-panel">
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
  defineProps<{
    globalShortcut: string;
  }>();
</script>

<style lang="css" scoped>
  .syn-about {
    font-size: 14px;
    margin-bottom: var(--syn-space-6);
  }

  .syn-about__title {
    margin: 0;
    color: var(--text-1);
    font-weight: var(--syn-weight-semibold);
  }

  .syn-about__body {
    color: var(--text-2);
    line-height: var(--syn-lineheight-body);
  }

  .syn-about__body p {
    margin: 0 0 var(--syn-space-2);
  }

  .syn-about__body h4 {
    margin: var(--syn-space-3) 0 var(--syn-space-1);
    color: var(--text-1);
    font-weight: var(--syn-weight-semibold);
  }

  .syn-about__body h4:first-of-type {
    margin-top: 0;
  }

  .syn-about__usage {
    margin: 0 0 var(--syn-space-2);
  }

  .syn-about__shortcuts {
    width: 100%;
    border: none;
    border-collapse: collapse;
  }

  .syn-about__shortcuts th,
  .syn-about__shortcuts td {
    text-align: left;
    padding: var(--syn-space-1) var(--syn-space-2);
    vertical-align: middle;
  }

  .syn-about__shortcuts th {
    font-weight: var(--font-weight-7);
    color: var(--text-1);
    padding-bottom: var(--syn-space-1);
    border-bottom: 1px solid var(--surface-4);
  }

  .syn-about__shortcuts tr {
    line-height: 1.4;
  }

  .syn-about__shortcuts td:first-child {
    white-space: nowrap;
    padding-right: var(--syn-space-3);
  }

  .syn-about__body kbd {
    background: var(--surface-4);
    padding: 1px 5px;
    border-radius: var(--radius-1);
    font-size: 13px;
    font-family: inherit;
  }

  .syn-about__footer {
    margin-top: var(--syn-space-1);
    padding-top: var(--syn-space-2);
    font-size: 13px;
  }
</style>
