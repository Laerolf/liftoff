import { defineStore } from 'pinia'
import { computed, inject, reactive, ref } from 'vue'

import { getApiFlightPlans, postApiFlightPlans } from '@/api/sdk.gen'
import { apiClientKey } from '@/plugins/api'

import type { FlightPlanDto, PostApiFlightPlansData } from '@/api'
import type { ActionState } from '@/shared/stores'

/**
 * Represents a store for FlightPlans.
 */
export const useFlightPlanStore = defineStore('flightPlanStore', () => {
  const client = inject(apiClientKey)

  const flightPlans = ref<FlightPlanDto[]>([])

  const getAllState = reactive<ActionState>({ isLoading: false })
  const createState = reactive<ActionState>({ isLoading: false })

  const allFlightPlans = computed<FlightPlanDto[]>(() => flightPlans.value)

  /**
   * Fetch all FlightPlans from the API.
   */
  async function fetchAll(): Promise<void> {
    getAllState.isLoading = true

    try {
      const response = await getApiFlightPlans({ client })
      flightPlans.value = response.data || []
    } catch (error) {
      throw new Error(`Failed to get all FlightPlans from the API: ${(error as Error).message}`, {
        cause: error
      })
    } finally {
      getAllState.isLoading = false
    }
  }

  /**
   * Sends a FlightPlan form to the API to create a new FlightPlan.
   * @param form - The FlightPlan creation form.
   */
  async function create(form: PostApiFlightPlansData['body']): Promise<void> {
    createState.isLoading = true

    try {
      const response = await postApiFlightPlans({ client, body: form })

      if (response.data) {
        flightPlans.value.push(response.data)
      }
    } catch (error) {
      throw new Error(`Failed create new Flight Plan with the API: ${(error as Error).message}`, {
        cause: error
      })
    } finally {
      createState.isLoading = false
    }
  }

  return {
    allFlightPlans,
    getAllState,
    createState,
    fetchAll,
    create
  }
})
