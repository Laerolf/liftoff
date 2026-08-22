<script setup lang="ts">
type Props = {
  /**
   * The legend of this fieldset.
   */
  legend?: string
}

defineProps<Props>()
</script>

<template>
  <fieldset class="l-fieldset">
    <legend class="l-fieldset-legend" v-if="legend">{{ legend }}</legend>

    <l-grid class="l-fieldset-fields" rows>
      <slot />
    </l-grid>
  </fieldset>
</template>

<style scoped>
.l-fieldset {
  width: var(--spacing-all);

  .l-fieldset-legend {
    font-weight: bold;
    margin-bottom: var(--spacing-2);
  }

  .l-fieldset-fields {
    row-gap: var(--spacing-2);
  }
}
</style>
