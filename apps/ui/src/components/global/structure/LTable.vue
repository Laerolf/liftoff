<script setup lang="ts">
export type LTableHeader = {
  /**
   * The label to display in the header for this column.
   */
  label: string
  /**
   * The item property to display in an item row for this column.
   */
  key: string
}

type Props = {
  /**
   * The headers to display.
   */
  headers: LTableHeader[]
  /**
   * The items to display in rows.
   */
  items: Record<string, unknown>[]
}

const props = defineProps<Props>()
</script>

<template>
  <table class="l-table">
    <thead>
      <tr>
        <th v-for="header in headers">{{ header.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items">
        <td v-for="header in headers">
          <slot :name="`item-${header.key}`" v-bind="{ key: header.key, item }">
            {{ item[header.key] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.l-table {
  border: var(--border-default);
  border-collapse: collapse;
  width: var(--spacing-all);

  thead {
    border-bottom: var(--border-default);
  }

  tbody tr:nth-child(even) {
    background-color: var(--color-accent);
  }

  th,
  td {
    padding: var(--spacing-none) var(--spacing-3);
  }

  td {
    text-align: center;
  }
}
</style>
