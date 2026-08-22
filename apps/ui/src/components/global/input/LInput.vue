<script setup lang="ts">
import { computed, useSlots } from 'vue'

type Props = {
  /**
   * The name of the input.
   */
  name: string
}

const props = defineProps<Props>()

const slots = useSlots()

const errorMessageClasses = computed(() => ({
  visible: !!slots.error
}))
</script>

<template>
  <l-grid rows class="l-input">
    <l-grid rows class="l-input-content">
      <label v-if="$slots.label" :for="name">
        <slot name="label" />
      </label>

      <l-grid class="l-input-fields">
        <slot />
        <slot name="append" />
      </l-grid>
    </l-grid>

    <p class="l-input-error" :class="errorMessageClasses">
      <slot name="error" />
    </p>
  </l-grid>
</template>

<style scoped>
.l-input {
  gap: var(--spacing-none);

  .l-input-content {
    gap: var(--spacing-1);
  }

  .l-input-fields {
    column-gap: var(--spacing-4);
    grid-template-columns: auto max-content;

    &:has(> *:only-child) {
      grid-template-columns: auto;
    }
  }

  .l-input-error {
    width: var(--spacing-all);
    color: var(--color-error);
    min-height: 1lh;
    visibility: hidden;

    &.visible {
      visibility: visible;
    }
  }
}
</style>
