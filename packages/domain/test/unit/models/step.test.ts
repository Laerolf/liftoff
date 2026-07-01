import { describe, test, expect } from '@jest/globals'
import { EXAMPLE_STEP_VALUES } from '@test/fixtures'

import { Step } from '@/models/step'
import { DomainError } from '@/shared/errors'

describe('Step', () => {
  test('can be created', () => {
    // Given
    const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

    // When + Then
    expect(() => new Step(repository, workflowId, outcome, {})).not.toThrow()
  })

  test('needs a repository', () => {
    // Given
    const { workflowId, outcome } = EXAMPLE_STEP_VALUES

    const expectedError = new DomainError('A Step needs a repository!')

    // When + Then
    // @ts-expect-error A Step needs a repository.
    expect(() => new Step(null, workflowId, outcome)).toThrow(expectedError)
  })

  test('needs a workflow ID', () => {
    // Given
    const { repository, outcome } = EXAMPLE_STEP_VALUES

    const expectedError = new DomainError('A Step needs a workflow ID!')

    // When + Then
    // @ts-expect-error A Step needs a workflow ID.
    expect(() => new Step(repository, null, outcome)).toThrow(expectedError)
  })

  test('needs valid workflow inputs', () => {
    // Given
    const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

    const expectedError = new DomainError('A Step needs valid workflow inputs!')

    // When + Then
    // @ts-expect-error A Step needs valid workflow inputs.
    expect(() => new Step(repository, workflowId, outcome, 'test')).toThrow(expectedError)
    // @ts-expect-error A Step needs valid workflow inputs.
    expect(() => new Step(repository, workflowId, outcome, null)).not.toThrow()
  })

  test('needs a valid outcome', () => {
    // Given
    const { repository, workflowId } = EXAMPLE_STEP_VALUES

    const expectedError = new DomainError('A Step needs a valid outcome!')

    // When + Then
    // @ts-expect-error A Step needs a valid outcome.
    expect(() => new Step(repository, workflowId, null)).toThrow(expectedError)
    // @ts-expect-error A Step needs a valid outcome.
    expect(() => new Step(repository, workflowId, 'test')).toThrow(expectedError)
  })

  describe('isValid', () => {
    test('can be valid', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const step = new Step(repository, workflowId, outcome)

      // When + Then
      expect(Step.isValid(step)).toBeTruthy()
    })

    test('can have exposed inputs', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      // When + Then
      expect(Step.isValid(new Step(repository, workflowId, outcome, {}))).toBeTruthy()
      // @ts-expect-error A Step's exposed inputs can be null.
      expect(Step.isValid(new Step(repository, workflowId, outcome, null))).toBeTruthy()
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
