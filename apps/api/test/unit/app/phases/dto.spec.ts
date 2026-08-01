import { describe, expect, test } from 'bun:test'

import { DomainError, Phase, Step } from '@liftoff/domain'
import { EXAMPLE_VALUES } from '@test/fixtures/values'

import { PhaseDto } from '@/app/phases/dto'
import { StepDto } from '@/app/steps/dto'

describe('PhaseDto', () => {
  describe('from', () => {
    test('should take the properties from a draft Phase model', () => {
      // Given
      const model = Phase.create(EXAMPLE_VALUES.phases.executionMethod)

      // When
      const dto = PhaseDto.from(model)

      // Then
      expect(dto.id).toBe(model.id)
      expect(dto.status).toBe(model.status)
      expect(dto.execution).toBe(model.execution)
      expect(dto.steps).toStrictEqual(model.steps)
      expect(dto.createdAt).toBe(model.createdAt)
      expect(dto.lastUpdatedAt).toBe(model.lastUpdatedAt)
      expect(dto.startedAt).toBe(model.startedAt)
      expect(dto.completedAt).toBe(model.completedAt)
    })

    test('should take the properties from a prepared Phase model', () => {
      // Given
      const model = Phase.create(EXAMPLE_VALUES.phases.executionMethod)
      model.prepare([
        Step.create(
          EXAMPLE_VALUES.repositoryName,
          EXAMPLE_VALUES.workflowId,
          EXAMPLE_VALUES.steps.exposedWorkflowInputs
        )
      ])

      const expectedStepDtos = (model.steps || []).map(StepDto.from)

      // When
      const dto = PhaseDto.from(model)

      // Then
      expect(dto.status).toBe(model.status)
      expect(dto.steps).toStrictEqual(expectedStepDtos)
    })

    test('needs a valid Phase model', () => {
      // Given
      const expectedError = new DomainError('Failed to create a Phase DTO!', {
        cause: new DomainError('The provided Phase is not valid!')
      })

      // When + then
      // @ts-expect-error The provided Phase is not valid!
      expect(() => PhaseDto.from(null)).toThrow(expectedError)
      // @ts-expect-error The provided Phase is not valid!
      expect(() => PhaseDto.from({})).toThrow(expectedError)
    })
  })
})
