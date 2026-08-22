<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

import useLocale from '@/composables/useLocale'
import { useFlightPlanStore } from '@/stores/flightPlanStore'
import { format } from '@/utils/dates'

import type { LTableHeader } from '@/components/global/structure/LTable.vue'

const flightPlanStore = useFlightPlanStore()
const { allFlightPlans } = storeToRefs(flightPlanStore)

const { translateInScope } = useLocale('pages.flightPlans.overview')

const flightPlanTableHeaders = computed<LTableHeader[]>(() => [
  { label: translateInScope('table.headers.name'), key: 'name' },
  { label: translateInScope('table.headers.services'), key: 'services' },
  { label: translateInScope('table.headers.environment'), key: 'environment' },
  { label: translateInScope('table.headers.workflowBranch'), key: 'workflowBranch' },
  { label: translateInScope('table.headers.createdAt'), key: 'createdAt' }
])

onMounted(async () => {
  try {
    await flightPlanStore.fetchAll()
  } catch (error) {
    console.error(`Failed to load the FlightPlan overview page: ${(error as Error).message}`)
  }
})
</script>

<template>
  <l-page>
    <template #actions>
      <router-link :to="{ name: 'flightPlanCreation' }">
        {{ translateInScope('actions.create') }}
      </router-link>
    </template>

    <l-table class="flight-plan-table" :headers="flightPlanTableHeaders" :items="allFlightPlans">
      <template #item-services="{ item }">{{ item.services.join(' + ') }}</template>
      <template #item-createdAt="{ item }">{{ format(item.createdAt) }}</template>
    </l-table>
  </l-page>
</template>
