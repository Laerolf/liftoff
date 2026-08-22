<script setup lang="ts">
import { computed, ref, Teleport } from 'vue'

type Props = {
  /**
   * The title to display in the header of the modal.
   */
  title: string
  /**
   * The text used for the trigger button of the modal.
   */
  triggerText?: string
}

withDefaults(defineProps<Props>(), {
  triggerText: 'Open'
})

const isOpen = ref(false)

/**
 * Toggles this modal's visibility.
 */
function toggle(): void {
  isOpen.value = !isOpen.value
}

/**
 * Closes this modal.
 */
function close(): void {
  isOpen.value = false
}
</script>

<template>
  <slot name="trigger" v-bind="{ toggle }">
    <l-button class="l-modal-trigger" @click="toggle">{{ triggerText }}</l-button>
  </slot>

  <teleport v-if="isOpen" to="body">
    <l-card class="l-modal" :title="title">
      <template #header="{ title }">
        <l-grid class="l-modal-header-actions">
          <span>{{ title }}</span>
          <l-button @click="close">X</l-button>
        </l-grid>
      </template>

      <slot />
    </l-card>
  </teleport>
</template>

<style scoped>
.l-modal {
  position: fixed;
  top: 25vh;
  left: 40vw;
  z-index: 666;
  width: 25vw;
  height: max-content;
  background-color: white;

  .l-modal-header-actions {
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
