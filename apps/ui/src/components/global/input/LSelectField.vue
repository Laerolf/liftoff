<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed } from 'vue'

export type LSelectOption = {
  /**
   * The value of the option.
   */
  value: string
  /**
   * The label of the option.
   */
  label: string
}

type Props = {
  /**
   * The name of the select field.
   */
  name: string
  /**
   * The options of the select field.
   */
  options: LSelectOption[]
}

const props = defineProps<Props>()

const { value, errorMessage, handleBlur } = useField(() => props.name)

const classes = computed(() => ({ error: !!errorMessage.value }))
</script>

<template>
  <l-input :name="name">
    <template #label>
      <slot />
    </template>

    <select v-bind="$attrs" class="l-select-field" :class="classes" :id="name" :name="name" v-model="value"
      @blur="handleBlur">
      <option v-for="(option, index) in options" :key="`${name}-${index}`" :value="option.value">{{ option.label }}
      </option>
    </select>

    <template #append>
      <slot name="append" />
    </template>

    <template #error>{{ errorMessage }}</template>
  </l-input>
</template>

<style scoped>
.l-select-field {
  width: var(--spacing-all);
  border: var(--border-default);

  &.error {
    border-color: var(--color-error);
  }
}
</style>
