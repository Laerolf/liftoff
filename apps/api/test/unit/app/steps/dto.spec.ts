import { describe, expect, test } from '@jest/globals'
import { DomainError, Step } from '@liftoff/domain'
import { EXAMPLE_VALUES } from '@test/fixtures/values'

import { StepDto } from '@/app/steps/dto'

describe('StepDto', () => {
  describe('from', () => {
    test('should take the properties from a Step model', () => {
      // Given
      const model = Step.create(
        EXAMPLE_VALUES.id,
        EXAMPLE_VALUES.repositoryName,
        EXAMPLE_VALUES.workflowId,
        EXAMPLE_VALUES.steps.exposedWorkflowInputs
      )

      // When
      const dto = StepDto.from(model)

      // Then
      expect(dto.id).toBe(model.id)
      expect(dto.phaseId).toBe(model.phaseId)
      expect(dto.repository).toBe(model.repository)
      expect(dto.workflowId).toBe(model.workflowId)
      expect(dto.workflowOutcome).toBe(model.workflowOutcome)
      expect(dto.workflowInputs).toStrictEqual(model.workflowInputs)
      expect(dto.createdAt).toBe(model.createdAt)
      expect(dto.lastUpdatedAt).toBe(model.lastUpdatedAt)
      expect(dto.startedAt).toBe(model.startedAt)
      expect(dto.completedAt).toBe(model.completedAt)
    })

    test('needs a valid Step model', () => {
      // Given
      const expectedError = new DomainError('Failed to create a Step DTO!', {
        cause: new DomainError('The provided Step is not valid!')
      })

      // When + then
      // @ts-expect-error The provided Step is not valid!
      expect(() => StepDto.from(null)).toThrow(expectedError)
      // @ts-expect-error The provided Step is not valid!
      expect(() => StepDto.from({})).toThrow(expectedError)
    })
  })
})
