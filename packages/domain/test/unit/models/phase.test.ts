import { describe, test, expect } from '@jest/globals'
import { EXAMPLE_PHASE_VALUES, EXAMPLE_STEP_VALUES } from '@test/fixtures'

import Phase, { PhaseExecution } from '@/models/phase'
import { PhaseStatus } from '@/models/status'
import { Step } from '@/models/step'
import { DomainError } from '@/shared/errors'

describe('Phase', () => {
  test('can be created', () => {
    // Given
    const { status, execution, steps } = EXAMPLE_PHASE_VALUES

    // When + Then
    expect(() => new Phase(status, execution, steps)).not.toThrow()
  })

  test('needs a valid status', () => {
    // Given
    const { execution, steps } = EXAMPLE_PHASE_VALUES

    const expectedError = new DomainError('A Phase needs a valid status!')

    // When + Then
    // @ts-expect-error A Phase needs a status.
    expect(() => new Phase(null, execution, steps)).toThrow(expectedError)
    // @ts-expect-error A Phase needs a status.
    expect(() => new Phase('test', execution, steps)).toThrow(expectedError)
  })

  test('needs an execution method', () => {
    // Given
    const { status, steps } = EXAMPLE_PHASE_VALUES

    const expectedError = new DomainError('A Phase needs an execution method!')

    // When + Then
    // @ts-expect-error A Phase needs an execution method.
    expect(() => new Phase(status, null, steps)).toThrow(expectedError)
  })

  test('needs valid steps', () => {
    // Given
    const { status, execution } = EXAMPLE_PHASE_VALUES

    const expectedError = new DomainError('A Phase needs valid steps!')

    // When + Then
    // @ts-expect-error A Phase needs valid steps.
    expect(() => new Phase(status, execution, null)).toThrow(expectedError)
    // @ts-expect-error A Phase needs valid steps.
    expect(() => new Phase(status, execution, 'test')).toThrow(expectedError)
    expect(() => new Phase(status, execution, [])).toThrow(expectedError)
  })

  describe('isValid', () => {
    test('can be valid', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const phase = new Phase(PhaseStatus.Waiting, PhaseExecution.Parallel, [
        new Step(repository, workflowId, outcome)
      ])

      // When + Then
      expect(Phase.isValid(phase)).toBeTruthy()
    })

    test('needs to be defined', () => {
      // When + Then
      expect(Phase.isValid(null)).toBeFalsy()
      expect(Phase.isValid(undefined)).toBeFalsy()
    })

    test('needs to be an object', () => {
      // When + Then
      expect(Phase.isValid([])).toBeFalsy()
      expect(Phase.isValid('test')).toBeFalsy()
      expect(Phase.isValid(6666)).toBeFalsy()
    })
  })
})
