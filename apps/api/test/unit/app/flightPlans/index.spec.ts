import { vi, mock, describe, test, expect, beforeEach } from 'bun:test'

import {
  createExampleFlightPlanEntity,
  createExampleFlightPlanPhaseEntity,
  createExamplePhaseEntity,
  createExamplePhaseStepEntity,
  createExampleStepEntity
} from '@test/fixtures/data'
import { createExampleFlightPlanDto } from '@test/fixtures/dto'
import { createExampleFlightPlanCreationForm } from '@test/fixtures/forms'
import { setupMockRepository } from '@test/helpers/mocks'
import status from 'http-status'

import app from '@/app'
import { FlightPlanPhaseRepository, FlightPlanRepository } from '@/app/flightPlans/repository'
import { PhaseRepository, PhaseStepRepository } from '@/app/phases/repository'
import { StepRepository } from '@/app/steps/repository'
import { dbConnection } from '@/db'

mock.module('@/db', () => ({
  dbConnection: {
    transaction: vi.fn((callback) => callback(dbConnection))
  }
}))

describe('/api/flight-plans', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/flight-plans', () => {
    test('should return a list of Flight Plans', async () => {
      // Given
      setupMockRepository(FlightPlanRepository, { getAll: [] })

      // When
      const response = await app.request('/api/flight-plans')

      // Then
      expect(response.status).toBe(status.OK)
      expect(await response.json()).toStrictEqual([])
    })

    test('should throw an error if something went wrong', async () => {
      // Given
      vi.spyOn(FlightPlanRepository.prototype, 'getAll').mockRejectedValueOnce(new Error('TEST'))

      // When
      const response = await app.request('/api/flight-plans')

      // Then
      expect(response.status).toBe(status.INTERNAL_SERVER_ERROR)
    })
  })

  describe('POST /api/flight-plans', () => {
    test('should be able to create a new Flight Plan', async () => {
      // Given
      const expectedFlightPlanEntity = createExampleFlightPlanEntity()
      const expectedPhaseEntity = createExamplePhaseEntity()
      const expectedFlightPlanPhaseEntity = createExampleFlightPlanPhaseEntity()
      const expectedStepEntity = createExampleStepEntity()
      const expectedPhaseStepEntity = createExamplePhaseStepEntity()

      const expectedFlightPlanDto = createExampleFlightPlanDto()

      setupMockRepository(FlightPlanRepository, {
        insert: expectedFlightPlanEntity,
        findById: expectedFlightPlanEntity,
        update: expectedFlightPlanEntity
      })

      setupMockRepository(FlightPlanPhaseRepository, {
        insertMany: [expectedFlightPlanPhaseEntity]
      })

      setupMockRepository(PhaseRepository, {
        insertMany: [expectedPhaseEntity],
        getAllByIds: [expectedPhaseEntity],
        updateMany: [expectedPhaseEntity]
      })

      setupMockRepository(PhaseStepRepository, {
        insertMany: [expectedPhaseStepEntity]
      })

      setupMockRepository(StepRepository, {
        insertMany: [expectedStepEntity],
        getAllByIds: [expectedStepEntity]
      })

      // When
      const response = await app.request('/api/flight-plans', {
        method: 'POST',
        body: JSON.stringify(createExampleFlightPlanCreationForm()),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })

      // Then
      expect(response.status).toBe(status.OK)
      expect(await response.json()).toStrictEqual(expectedFlightPlanDto)
    })
  })
})
