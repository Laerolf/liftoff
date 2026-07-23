import { vi, mock, describe, test, expect, beforeEach } from 'bun:test'

import {
  createExampleMissionEntity,
  createExamplePhaseEntity,
  createExampleStepEntity
} from '@test/fixtures/data'
import { createExampleMissionDto } from '@test/fixtures/dto'
import { createExampleMissionFromScratchCreationForm } from '@test/fixtures/forms'
import { setupMockRepository } from '@test/helpers/mocks'
import status from 'http-status'

import app from '@/app'
import { MissionRepository } from '@/app/missions/repository'
import { PhaseRepository } from '@/app/phases/repository'
import { StepRepository } from '@/app/steps/repository'
import { dbConnection } from '@/db'

mock.module('@/db', () => ({
  dbConnection: {
    transaction: vi.fn((callback) => callback(dbConnection))
  }
}))

describe('/missions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /missions', () => {
    test('should return a list of Missions', async () => {
      // Given
      setupMockRepository(MissionRepository, { getAll: [] })

      // When
      const response = await app.request('/missions')

      // Then
      expect(response.status).toBe(status.OK)
      expect(await response.json()).toStrictEqual([])
    })

    test('should throw an error if something went wrong', async () => {
      // Given
      vi.spyOn(MissionRepository.prototype, 'getAll').mockRejectedValueOnce(new Error('TEST'))

      // When
      const response = await app.request('/missions')

      // Then
      expect(response.status).toBe(status.INTERNAL_SERVER_ERROR)
    })
  })

  describe('POST /missions', () => {
    test('should be able to create a new Mission', async () => {
      // Given
      const expectedMissionEntity = createExampleMissionEntity()
      const expectedPhaseEntity = createExamplePhaseEntity()
      const expectedStepEntity = createExampleStepEntity()
      const expectedMissionDto = createExampleMissionDto()

      setupMockRepository(MissionRepository, {
        insert: expectedMissionEntity,
        findById: expectedMissionEntity,
        update: expectedMissionEntity
      })

      setupMockRepository(PhaseRepository, {
        insertMany: [expectedPhaseEntity],
        getAllByIds: [expectedPhaseEntity],
        getAllByMissionId: [expectedPhaseEntity],
        updateMany: [expectedPhaseEntity]
      })

      setupMockRepository(StepRepository, {
        insertMany: [expectedStepEntity],
        getAllByIds: [expectedStepEntity],
        getAllByPhaseId: [expectedStepEntity]
      })

      // When
      const response = await app.request('/missions', {
        method: 'POST',
        body: JSON.stringify(createExampleMissionFromScratchCreationForm()),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })

      // Then
      expect(response.status).toBe(status.OK)
      expect(await response.json()).toStrictEqual(expectedMissionDto)
    })
  })
})
