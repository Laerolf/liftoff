<template>
  <l-grid rows class="l-page">
    <l-grid class="l-page-header" rows>
      <h1 class="l-page-title">{{ $route.meta.title }}</h1>

      <l-grid v-if="$slots.actions" class="l-page-actions">
        <slot name="actions" />
      </l-grid>
    </l-grid>

    <l-grid class="l-page-content">
      <slot />
    </l-grid>
  </l-grid>
</template>

<style scoped>
.l-page {
  grid-template-rows: repeat(2, max-content);
  padding: var(--spacing-none) var(--spacing-4);
  row-gap: var(--spacing-8);
  margin-bottom: var(--spacing-4);

  .l-page-header {
    row-gap: var(--spacing-4);
  }
}
</style>
