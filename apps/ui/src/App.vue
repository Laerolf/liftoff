<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'

import TheNotifications from '@/components/TheNotifications.vue'

const route = useRoute()

useHead({
  titleTemplate: '%s | Liftoff',
  title: () => route.meta.title
})
</script>

<template>
  <router-view />

  <the-notifications />
</template>
