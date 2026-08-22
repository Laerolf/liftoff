<script setup lang="ts">
import { useField } from 'vee-validate'
import { computed } from 'vue'

type Props = {
  /**
   * The name of the input field.
   */
  name: string
  /**
   * Should the input field value be masked?
   */
  secret?: boolean
}

const props = defineProps<Props>()

const { value, errorMessage, handleBlur } = useField(() => props.name)

const type = computed(() => (props.secret ? 'password' : 'text'))

const classes = computed(() => ({ error: !!errorMessage.value }))
</script>

<template>
  <l-input :name="name">
    <template #label>
      <slot />
    </template>

    <input v-bind="$attrs" class="l-input-field" :class="classes" :id="name" :name="name" v-model="value"
      @blur="handleBlur" :type="type" />

    <template #append>
      <slot name="append" />
    </template>

    <template #error>{{ errorMessage }}</template>
  </l-input>
</template>

<style scoped>
.l-input-field {
  width: var(--spacing-all);
  border: var(--border-default);

  &.error {
    border-color: var(--color-error);
  }
}
</style>
