import { defineStore } from 'pinia'
import { computed, inject, reactive, ref } from 'vue'

import { getApiMissions } from '@/api/sdk.gen'
import { apiClientKey } from '@/plugins/api'

import type { MissionDto } from '@/api'
import type { ActionState } from '@/shared/stores'

/**
 * Represents a store for Missions.
 */
export const useMissionStore = defineStore('missionStore', () => {
  const client = inject(apiClientKey)

  const missions = ref<MissionDto[]>([])

  const getAllMissionsState = reactive<ActionState>({ isLoading: false })

  const allMissions = computed<MissionDto[]>(() => missions.value)

  /**
   * Fetch all Missions from the API.
   */
  async function fetchAllMissions(): Promise<void> {
    getAllMissionsState.isLoading = true

    try {
      const response = await getApiMissions({ client })
      missions.value = response.data || []
    } catch (error) {
      throw new Error(`Failed to get all Missions from the API: ${(error as Error).message}`, {
        cause: error
      })
    } finally {
      getAllMissionsState.isLoading = false
    }
  }

  return {
    allMissions,
    getAllMissionsState,
    fetchAllMissions
  }
})
