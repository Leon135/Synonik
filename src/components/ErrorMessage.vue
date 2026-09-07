<template>
  <div class="syn-error" role="alert">
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
    margin-top: var(--syn-space-6);
    background: var(--error-bg);
    border: 1px solid var(--error-border);
    border-radius: var(--syn-radius-control);
    padding: var(--syn-space-3) var(--syn-space-4);
    margin-bottom: var(--syn-space-6);
  }

  .syn-error__title {
    margin: 0 0 var(--syn-space-1);
    color: var(--error);
    font-size: var(--syn-text-body);
    font-weight: var(--syn-weight-semibold);
  }

  .syn-error__text {
    margin: 0;
    color: var(--text-2);
    font-size: var(--syn-text-body);
    line-height: var(--syn-lineheight-body);
  }
</style>
