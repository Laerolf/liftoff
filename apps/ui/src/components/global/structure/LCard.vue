<script setup lang="ts">
type Props = {
  /**
   * The title to display in the header.
   */
  title: string
}

defineProps<Props>()
</script>

<template>
  <l-grid rows class="l-card">
    <l-grid class="l-card-header">
      <slot name="header" v-bind="{ title }">
        <span>{{ title }}</span>
      </slot>
    </l-grid>
    <l-grid class="l-card-content"><slot /></l-grid>
    <l-grid v-if="$slots.footer" class="l-card-footer"><slot name="footer" /></l-grid>
  </l-grid>
</template>

<style scoped>
.l-card {
  border: var(--border-default);

  .l-card-header,
  .l-card-content,
  .l-card-footer {
    padding: var(--spacing-2) var(--spacing-4);
  }

  .l-card-header {
    border-bottom: var(--border-default);
  }
}
</style>
