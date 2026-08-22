<script setup lang="ts">
import { computed } from 'vue';

type Props = {
  /**
   * The variant of the button.
   */
  variant?: 'standard' | 'text'
  /**
   * The button is active.
   */
  active?: boolean
  /**
   * The button is disabled.
   */
  disabled?: boolean
  /**
   * The button is waiting for something.
   */
  pending?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'standard'
})

const isDisabled = computed<boolean>(() => props.disabled || props.pending)

const classes = computed(() => ({
  standard: props.variant === 'standard',
  text: props.variant === 'text',
  active: props.active,
  pending: props.pending
}))
</script>

<template>
  <button class="l-button" :class="classes" :disabled="isDisabled">
    <span v-if="pending">...</span>
    <slot v-else />
  </button>
</template>

<style scoped>
.l-button {
  cursor: pointer;

  &.standard {
    border: var(--border-default);
  }

  &.text {
    border: none;

    &.active {
      text-decoration: underline;
    }
  }

  &.active {
    font-weight: bold;
  }

  &:disabled {
    cursor: default;
    border-color: grey;
    color: grey
  }
}
</style>
