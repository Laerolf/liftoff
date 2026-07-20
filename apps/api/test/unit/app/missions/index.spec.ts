import { jest, describe, test, expect } from '@jest/globals'
import {
  createExampleMissionEntity,
  createExamplePhaseEntity,
  createExampleStepEntity
} from '@test/fixtures/data'
import { createExampleMissionDto } from '@test/fixtures/dto'
import { createExampleMissionFromScratchCreationForm } from '@test/fixtures/forms'
import status from 'http-status'

import app from '@/app'
import { MissionRepository } from '@/app/missions/repository'
import { PhaseRepository } from '@/app/phases/repository'
import { StepRepository } from '@/app/steps/repository'

jest.mock('@/app/missions/repository')
jest.mock('@/app/phases/repository')
jest.mock('@/app/steps/repository')

const mockedStepRepository = jest.mocked(StepRepository)
const mockedPhaseRepository = jest.mocked(PhaseRepository)
const mockedMissionRepository = jest.mocked(MissionRepository)

describe('/missions', () => {
  describe('GET /missions', () => {
    test('should return a list of Missions', async () => {
      // Given
      mockedMissionRepository.prototype.getAll.mockResolvedValueOnce([])

      // When
      const response = await app.request('/missions')

      // Then
      expect(response.status).toBe(status.OK)
      expect(await response.json()).toStrictEqual([])
    })

    test('should throw an error if something went wrong', async () => {
      // Given
      mockedMissionRepository.prototype.getAll.mockRejectedValueOnce(new Error('TEST'))

      const expectedErrorMessage = 'Failed to get all Missions.'

      // When
      const response = await app.request('/missions')

      // Then
      expect(response.status).toBe(status.INTERNAL_SERVER_ERROR)
      expect(await response.text()).toBe(expectedErrorMessage)
    })
  })

  describe('POST /missions', () => {
    test('should be able to create a new Mission', async () => {
      // Given
      const expectedMissionEntity = createExampleMissionEntity()
      const expectedPhaseEntity = createExamplePhaseEntity()
      const expectedStepEntity = createExampleStepEntity()

      const expectedMissionDto = createExampleMissionDto()

      mockedMissionRepository.prototype.insert.mockResolvedValueOnce(expectedMissionEntity)
      mockedMissionRepository.prototype.findById.mockResolvedValueOnce(expectedMissionEntity)

      mockedPhaseRepository.prototype.insert.mockResolvedValueOnce([expectedPhaseEntity])
      mockedPhaseRepository.prototype.getAllByIds.mockResolvedValueOnce([expectedPhaseEntity])
      mockedPhaseRepository.prototype.getAllByMissionId.mockResolvedValueOnce([expectedPhaseEntity])

      mockedStepRepository.prototype.insert.mockResolvedValueOnce([expectedStepEntity])
      mockedStepRepository.prototype.getAllByIds.mockResolvedValueOnce([expectedStepEntity])
      mockedStepRepository.prototype.getAllByPhaseId.mockResolvedValueOnce([expectedStepEntity])

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

    test('should throw an error if the creation form is invalid', async () => {
      // Given
      const expectedErrorMessage = {
        errors: [
          { field: 'environment', message: 'Invalid input: expected string, received null' }
        ],
        message: 'Invalid request body'
      }

      // When
      const response = await app.request('/missions', {
        method: 'POST',
        body: JSON.stringify(createExampleMissionFromScratchCreationForm({ environment: null })),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })

      // Then
      expect(response.status).toBe(status.UNPROCESSABLE_ENTITY)
      expect(await response.json()).toStrictEqual(expectedErrorMessage)
    })

    test('should throw an error if something went wrong', async () => {
      // Given
      const expectedErrorMessage = 'Failed to create a new Mission.'

      mockedMissionRepository.prototype.insert.mockRejectedValueOnce(new Error('TEST'))

      // When
      const response = await app.request('/missions', {
        method: 'POST',
        body: JSON.stringify(createExampleMissionFromScratchCreationForm()),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })

      // Then
      expect(response.status).toBe(status.INTERNAL_SERVER_ERROR)
      expect(await response.text()).toStrictEqual(expectedErrorMessage)
    })
  })
})
