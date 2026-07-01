import { describe, test, expect } from '@jest/globals'
import { EXAMPLE_PHASE_VALUES, EXAMPLE_STEP_VALUES } from '@test/fixtures'

import Phase, { PhaseExecution } from '@/models/phase'
import { PhaseStatus } from '@/models/status'
import { Step } from '@/models/step'
import { DomainError } from '@/shared/errors'

describe('Phase', () => {
  describe('restore', () => {
    test('can be restored', () => {
      // Given
      const { status, execution, steps } = EXAMPLE_PHASE_VALUES

      // When + Then
      expect(() => Phase.restore(status, execution, steps)).not.toThrow()
    })

    test('needs a valid status', () => {
      // Given
      const { execution, steps } = EXAMPLE_PHASE_VALUES

      const expectedError = new DomainError('A Phase needs a valid status!')

      // When + Then
      // @ts-expect-error A Phase needs a status.
      expect(() => Phase.restore(null, execution, steps)).toThrow(expectedError)
      // @ts-expect-error A Phase needs a status.
      expect(() => Phase.restore('test', execution, steps)).toThrow(expectedError)
    })

    test('needs an execution method', () => {
      // Given
      const { status, steps } = EXAMPLE_PHASE_VALUES

      const expectedError = new DomainError('A Phase needs an execution method!')

      // When + Then
      // @ts-expect-error A Phase needs an execution method.
      expect(() => Phase.restore(status, null, steps)).toThrow(expectedError)
    })

    test('needs valid steps', () => {
      // Given
      const { status, execution } = EXAMPLE_PHASE_VALUES

      const expectedError = new DomainError('A Phase needs valid steps!')

      // When + Then
      // @ts-expect-error A Phase needs valid steps.
      expect(() => Phase.restore(status, execution, null)).toThrow(expectedError)
      // @ts-expect-error A Phase needs valid steps.
      expect(() => Phase.restore(status, execution, 'test')).toThrow(expectedError)
      expect(() => Phase.restore(status, execution, [])).toThrow(expectedError)
    })
  })

  describe('restore', () => {
    test('can be created', () => {
      // Given
      const { execution, steps } = EXAMPLE_PHASE_VALUES

      // When
      const phase = Phase.create(execution, steps)

      // Then
      expect(phase.status).toBe(PhaseStatus.Waiting)
    })
  })

  describe('isValid', () => {
    test('can be valid', () => {
      // Given
      const { repository, workflowId } = EXAMPLE_STEP_VALUES

      const phase = Phase.create(PhaseExecution.Parallel, [Step.create(repository, workflowId)])

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
