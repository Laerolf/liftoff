<script setup lang="ts" generic="T">
import { useFieldArray } from 'vee-validate'

const props = defineProps<{
  legend?: string
  name: string
  newValue: () => T
}>()

const { fields, push, remove } = useFieldArray<T>(() => props.name)

function add(): void {
  push(props.newValue())
}
</script>

<template>
  <l-grid rows class="l-input-repeater">
    <l-fieldset :legend="legend">
      <l-grid rows class="l-input-repeater-items">
        <l-grid class="l-input-repeater-item" v-for="(field, index) in fields" :key="field.key">
          <slot v-bind="{
            name: `${name}[${index}]`,
            index,
            isLast: index + 1 === fields.length,
            remove: () => remove(index),
            add
          }" />
        </l-grid>
      </l-grid>
    </l-fieldset>
  </l-grid>
</template>

<style scoped>
.l-input-repeater {
  row-gap: var(--spacing-1);
}

.l-input-repeater-items {
  row-gap: var(--spacing-2);
}

.l-input-repeater-item {
  grid-template-columns: auto var(--spacing-6);
  column-gap: var(--spacing-2);
  align-items: end;

  &:has(> *:only-child) {
    grid-template-columns: auto;
  }
}
</style>
