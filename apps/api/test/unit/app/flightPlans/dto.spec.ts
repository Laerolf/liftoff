import { describe, expect, test } from 'bun:test'

import { DomainError, FlightPlan, Phase } from '@liftoff/domain'
import { EXAMPLE_VALUES } from '@test/fixtures/values'

import { FlightPlanDto } from '@/app/flightPlans/dto'
import { PhaseDto } from '@/app/phases/dto'

describe('FlightPlanDto', () => {
  describe('from', () => {
    test('should take the properties from a draft Flight Plan model', () => {
      // Given
      const model = FlightPlan.create(
        EXAMPLE_VALUES.flightPlans.name,
        EXAMPLE_VALUES.branchName,
        EXAMPLE_VALUES.environmentName,
        EXAMPLE_VALUES.serviceIds
      )

      // When
      const dto = FlightPlanDto.from(model)

      // Then
      expect(dto.id).toBe(model.id)
      expect(dto.workflowBranch).toBe(model.workflowBranch)
      expect(dto.environment).toBe(model.environment)
      expect(dto.services).toStrictEqual(model.services)
      expect(dto.phases).toStrictEqual(model.phases)
      expect(dto.createdAt).toBe(model.createdAt)
      expect(dto.lastUpdatedAt).toBe(model.lastUpdatedAt)
    })

    test('should take the properties from a prepared Flight Plan model', () => {
      // Given
      const model = FlightPlan.create(
        EXAMPLE_VALUES.flightPlans.name,
        EXAMPLE_VALUES.branchName,
        EXAMPLE_VALUES.environmentName,
        EXAMPLE_VALUES.serviceIds
      )
      model.prepare([Phase.create(EXAMPLE_VALUES.phases.executionMethod)])

      const expectedPhaseDtos = (model.phases || []).map(PhaseDto.from)

      // When
      const dto = FlightPlanDto.from(model)

      // Then
      expect(dto.phases).toStrictEqual(expectedPhaseDtos)
    })

    test('needs a valid Flight Plan model', () => {
      // Given
      const expectedError = new DomainError(
        'Failed to create a new Flight Plan DTO from a Flight Plan.',
        {
          cause: new DomainError('The provided Flight Plan is not valid!')
        }
      )

      // When + then
      // @ts-expect-error The provided Flight Plan is not valid!
      expect(() => FlightPlanDto.from(null)).toThrow(expectedError)
      // @ts-expect-error The provided Flight Plan is not valid!
      expect(() => FlightPlanDto.from({})).toThrow(expectedError)
    })
  })
})
