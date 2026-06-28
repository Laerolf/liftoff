import { describe, test, expect } from '@jest/globals'
import { EXAMPLE_STEP_VALUES } from '@test/fixtures'

import { DomainError } from '@/shared/errors'
import { Step } from '@/step'

describe('Step', () => {
  test('can be created', () => {
    // Given
    const { repository, workflowId } = EXAMPLE_STEP_VALUES

    // When + Then
    expect(() => new Step(repository, workflowId, [], 'OK')).not.toThrow()
  })

  test('needs a repository', () => {
    // Given
    const { workflowId } = EXAMPLE_STEP_VALUES

    const expectedError = new DomainError('A Step needs a repository!')

    // When + Then
    // @ts-expect-error A Phase needs a repository.
    expect(() => new Step(null, workflowId)).toThrow(expectedError)
  })

  test('needs a workflow ID', () => {
    // Given
    const { repository } = EXAMPLE_STEP_VALUES

    const expectedError = new DomainError('A Step needs a workflow ID!')

    // When + Then
    // @ts-expect-error A Phase needs a workflow ID.
    expect(() => new Step(repository, null)).toThrow(expectedError)
  })

  test('needs valid workflow inputs', () => {
    // Given
    const { repository, workflowId } = EXAMPLE_STEP_VALUES

    const expectedError = new DomainError('A Step needs valid workflow inputs!')

    // When + Then
    // @ts-expect-error A Phase needs valid workflow inputs.
    expect(() => new Step(repository, workflowId, 'test')).toThrow(expectedError)
    // @ts-expect-error A Phase needs valid workflow inputs.
    expect(() => new Step(repository, workflowId, null)).not.toThrow()
  })
})
