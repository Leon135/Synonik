<template>
  <div class="syn-error">
    <h4 class="syn-error__title">Wystąpił błąd:</h4>
    <p class="syn-error__text">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    error: string;
  }>();
</script>

<style lang="css" scoped>
  .syn-error {
    margin-top: var(--size-5);
    background: var(--error-bg);
    border: 1px solid var(--error-border);
    border-radius: var(--radius-2);
    padding: var(--size-3) var(--size-4);
    margin-bottom: var(--size-5);
  }

  .syn-error__title {
    margin: 0 0 var(--size-1);
    color: var(--error);
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-6);
  }

  .syn-error__text {
    margin: 0;
    color: var(--text-2);
    font-size: var(--font-size-1);
    line-height: var(--font-lineheight-3);
  }
</style>
