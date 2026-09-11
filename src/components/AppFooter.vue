<script setup lang="ts">
  export type AppView = "search" | "settings" | "about";

  defineProps<{ view: AppView }>();

  const emit = defineEmits<{ (event: "navigate", view: AppView): void }>();
</script>

<template>
  <footer class="app-footer">
    <button
      type="button"
      :class="['footer-link', { 'footer-link--active': view === 'search' }]"
      @click="emit('navigate', 'search')"
    >
      Szukaj
    </button>
    <button
      type="button"
      :class="['footer-link', { 'footer-link--active': view === 'settings' }]"
      @click="emit('navigate', 'settings')"
    >
      Ustawienia
    </button>
    <button
      type="button"
      :class="['footer-link', { 'footer-link--active': view === 'about' }]"
      @click="emit('navigate', 'about')"
    >
      O programie
    </button>
  </footer>
</template>
