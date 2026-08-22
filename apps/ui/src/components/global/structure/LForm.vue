<template>
  <form class="l-form">
    <l-grid class="content" rows>
      <l-grid class="fields" rows>
        <slot />
      </l-grid>

      <l-grid v-if="$slots.actions" class="actions">
        <slot name="actions" />
      </l-grid>
    </l-grid>
  </form>
</template>

<style scoped>
.l-form {
  width: var(--spacing-all);

  .content {
    row-gap: var(--spacing-4);

    .fields {
      row-gap: var(--spacing-2);
    }

    .actions {
      grid-auto-columns: max-content;
      align-items: center;
      column-gap: var(--spacing-2);
    }
  }
}
</style>
