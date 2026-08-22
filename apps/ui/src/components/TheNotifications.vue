<script setup lang="ts">
import useNotifications from '@/composables/useNotifications'

import LNotification from '@/components/LNotification.vue'

const { allNotifications, remove } = useNotifications()
</script>

<template>
  <l-grid rows id="the-notifications">
    <l-notification v-for="notification in allNotifications" :key="`notification-${notification.id}`"
      :notification="notification" @close="remove" />
  </l-grid>
</template>

<style scoped>
#the-notifications {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  padding: var(--spacing-2) var(--spacing-1);
  max-width: 20vw;
  justify-items: end;
  row-gap: var(--spacing-2);
}
</style>
