<script setup lang="ts">
  import { getCurrentWindow } from "@tauri-apps/api/window";

  async function minimizeWindow(): Promise<void> {
    await getCurrentWindow().minimize();
  }

  async function toggleMaximizeWindow(): Promise<void> {
    await getCurrentWindow().toggleMaximize();
  }

  async function closeWindow(): Promise<void> {
    await getCurrentWindow().close();
  }
</script>

<template>
  <header class="titlebar" data-tauri-drag-region>
    <span class="titlebar-brand">
      <img src="/logo.png" alt="" class="titlebar-logo" />
      <span class="titlebar-title">Synonik</span>
    </span>
    <div class="titlebar-controls">
      <button type="button" class="titlebar-btn" aria-label="Minimalizuj" @click="minimizeWindow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="4 14 10 14 10 20" />
          <polyline points="20 10 14 10 14 4" />
          <line x1="14" y1="10" x2="21" y2="3" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </button>
      <button
        type="button"
        class="titlebar-btn"
        aria-label="Maksymalizuj"
        @click="toggleMaximizeWindow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </button>
      <button
        type="button"
        class="titlebar-btn titlebar-btn--close"
        aria-label="Zamknij"
        @click="closeWindow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </header>
</template>
