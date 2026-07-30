import { describe, expect, test } from 'bun:test'

import { DomainError, Mission, Phase } from '@liftoff/domain'
import { EXAMPLE_VALUES } from '@test/fixtures/values'

import { MissionDto } from '@/app/missions/dto'
import { PhaseDto } from '@/app/phases/dto'

describe('MissionDto', () => {
  describe('from', () => {
    test('should take the properties from a draft Mission model', () => {
      // Given
      const model = Mission.fromScratch(
        EXAMPLE_VALUES.branchName,
        EXAMPLE_VALUES.environmentName,
        EXAMPLE_VALUES.serviceIds,
        EXAMPLE_VALUES.director.name
      )

      // When
      const dto = MissionDto.from(model)

      // Then
      expect(dto.id).toBe(model.id)
      expect(dto.correlationId).toBe(model.correlationId)
      expect(dto.flightPlanId).toBe(model.flightPlanId)
      expect(dto.workflowBranch).toBe(model.workflowBranch)
      expect(dto.environment).toBe(model.environment)
      expect(dto.services).toStrictEqual(model.services)
      expect(dto.director).toBe(model.director)
      expect(dto.status).toBe(model.status)
      expect(dto.launchedAt).toBe(model.launchedAt)
      expect(dto.phases).toStrictEqual(model.phases)
      expect(dto.createdAt).toBe(model.createdAt)
      expect(dto.lastUpdatedAt).toBe(model.lastUpdatedAt)
      expect(dto.completedAt).toBe(model.completedAt)
    })

    test('should take the properties from a prepared Mission model', () => {
      // Given
      const model = Mission.fromScratch(
        EXAMPLE_VALUES.branchName,
        EXAMPLE_VALUES.environmentName,
        EXAMPLE_VALUES.serviceIds,
        EXAMPLE_VALUES.director.name
      )
      model.prepare([Phase.create(EXAMPLE_VALUES.phases.executionMethod)])

      const expectedPhaseDtos = (model.phases || []).map(PhaseDto.from)

      // When
      const dto = MissionDto.from(model)

      // Then
      expect(dto.status).toBe(model.status)
      expect(dto.phases).toStrictEqual(expectedPhaseDtos)
    })

    test('needs a valid Mission model', () => {
      // Given
      const expectedError = new DomainError('Failed to create a Mission DTO!', {
        cause: new DomainError('The provided Mission is not valid!')
      })

      // When + then
      // @ts-expect-error The provided Mission is not valid!
      expect(() => MissionDto.from(null)).toThrow(expectedError)
      // @ts-expect-error The provided Mission is not valid!
      expect(() => MissionDto.from({})).toThrow(expectedError)
    })
  })
})
