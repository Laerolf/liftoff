<script setup lang="ts">
type Props = {
  /**
   * The input name.
   */
  name: string
  /**
   * The name of the key property, by default 'key'.
   */
  keyProperty?: string
  /**
   * The name of the value property, by default 'value'.
   */
  valueProperty?: string
}

withDefaults(defineProps<Props>(), {
  keyProperty: 'key',
  valueProperty: 'value'
})
</script>

<template>
  <l-grid class="l-map-entry" :class="{ appended: $slots.append }">
    <l-input-field class="l-map-entry-key" :name="`${name}.${keyProperty}`">Key</l-input-field>

    <l-input-field class="l-map-entry-value" :name="`${name}.${valueProperty}`">
      Value
    </l-input-field>

    <slot name="append" />
  </l-grid>
</template>

<style scoped>
.l-map-entry {
  column-gap: var(--spacing-4);
  align-items: center;

  &.appended {
    grid-template-columns: repeat(2, 1fr) max-content;
  }
}
</style>
