import { describe, test, expect } from '@jest/globals'
import { EXAMPLE_STEP_VALUES } from '@test/fixtures'

import { StepStatus } from '@/models/status'
import { Step } from '@/models/step'
import { DomainError } from '@/shared/errors'

describe('Step', () => {
  describe('restore', () => {
    test('can be restored', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      // When + Then
      expect(() => Step.restore(repository, workflowId, outcome, {})).not.toThrow()
    })

    test('needs a repository', () => {
      // Given
      const { workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a repository!')

      // When + Then
      // @ts-expect-error A Step needs a repository.
      expect(() => Step.restore(null, workflowId, outcome)).toThrow(expectedError)
    })

    test('needs a workflow ID', () => {
      // Given
      const { repository, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a workflow ID!')

      // When + Then
      // @ts-expect-error A Step needs a workflow ID.
      expect(() => Step.restore(repository, null, outcome)).toThrow(expectedError)
    })

    test('needs valid workflow inputs', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs valid workflow inputs!')

      // When + Then
      // @ts-expect-error A Step needs valid workflow inputs.
      expect(() => Step.restore(repository, workflowId, outcome, 'test')).toThrow(expectedError)
      // @ts-expect-error A Step needs valid workflow inputs.
      expect(() => Step.restore(repository, workflowId, outcome, null)).not.toThrow()
    })

    test('needs a valid outcome', () => {
      // Given
      const { repository, workflowId } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a valid outcome!')

      // When + Then
      // @ts-expect-error A Step needs a valid outcome.
      expect(() => Step.restore(repository, workflowId, null)).toThrow(expectedError)
      // @ts-expect-error A Step needs a valid outcome.
      expect(() => Step.restore(repository, workflowId, 'test')).toThrow(expectedError)
    })
  })

  describe('create', () => {
    test('can be created', () => {
      // Given
      const { repository, workflowId } = EXAMPLE_STEP_VALUES

      // When
      const step = Step.create(repository, workflowId, {})

      // Then
      expect(step.workflowOutcome).toBe(StepStatus.Waiting)
    })
  })

  describe('isValid', () => {
    test('can be valid', () => {
      // Given
      const { repository, workflowId } = EXAMPLE_STEP_VALUES

      const step = Step.create(repository, workflowId)

      // When + Then
      expect(Step.isValid(step)).toBeTruthy()
    })

    test('can have exposed inputs', () => {
      // Given
      const { repository, workflowId } = EXAMPLE_STEP_VALUES

      // When + Then
      expect(Step.isValid(Step.create(repository, workflowId, {}))).toBeTruthy()
      // @ts-expect-error A Step's exposed inputs can be null.
      expect(Step.isValid(Step.create(repository, workflowId, null))).toBeTruthy()
      expect(
        Step.isValid({
          repository: 'test',
          workflowId: '6666',
          workflowOutcome: 'WAITING',
          workflowInputs: 'test'
        })
      ).toBeFalsy()
    })

    test('needs to be defined', () => {
      // When + Then
      expect(Step.isValid(null)).toBeFalsy()
      expect(Step.isValid(undefined)).toBeFalsy()
    })

    test('needs to be an object', () => {
      // When + Then
      expect(Step.isValid([])).toBeFalsy()
      expect(Step.isValid('test')).toBeFalsy()
      expect(Step.isValid(6666)).toBeFalsy()
    })
  })
})
