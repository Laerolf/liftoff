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

      const creationDate = new Date()
      const lastUpdateDate = new Date()

      // When
      const phase = Phase.restore(status, execution, steps, creationDate, lastUpdateDate)

      // Then
      expect(phase.status).toBe(status)
      expect(phase.execution).toBe(execution)
      expect(phase.steps).toStrictEqual(steps)
      expect(phase.createdAt).toBe(creationDate)
      expect(phase.lastUpdatedAt).toStrictEqual(lastUpdateDate)
    })

    test('needs a valid status', () => {
      // Given
      const { execution, steps } = EXAMPLE_PHASE_VALUES

      const expectedError = new DomainError('A Phase needs a valid status!')

      // When + Then
      // @ts-expect-error A Phase needs a status.
      expect(() => Phase.restore(null, execution, steps, new Date(), null)).toThrow(expectedError)
      // @ts-expect-error A Phase needs a status.
      expect(() => Phase.restore('test', execution, steps, new Date(), null)).toThrow(expectedError)
    })

    test('needs an execution method', () => {
      // Given
      const { status, steps } = EXAMPLE_PHASE_VALUES

      const expectedError = new DomainError('A Phase needs an execution method!')

      // When + Then
      // @ts-expect-error A Phase needs an execution method.
      expect(() => Phase.restore(status, null, steps, new Date(), null)).toThrow(expectedError)
    })

    test('needs valid steps', () => {
      // Given
      const { status, execution } = EXAMPLE_PHASE_VALUES

      const expectedError = new DomainError('A Phase needs valid steps!')

      // When + Then
      // @ts-expect-error A Phase needs valid steps.
      expect(() => Phase.restore(status, execution, null, new Date(), null)).toThrow(expectedError)
      // @ts-expect-error A Phase needs valid steps.
      expect(() => Phase.restore(status, execution, 'test', new Date(), null)).toThrow(
        expectedError
      )
      expect(() => Phase.restore(status, execution, [], new Date(), null)).toThrow(expectedError)
    })

    test('needs a valid creation date', () => {
      // Given
      const { status, execution, steps } = EXAMPLE_PHASE_VALUES

      const expectedError = new DomainError('A Phase needs a valid creation date!')

      // When + Then
      // @ts-expect-error A Phase needs a valid creation date.
      expect(() => Phase.restore(status, execution, steps, null, null)).toThrow(expectedError)
      // @ts-expect-error A Phase needs a valid creation date.
      expect(() => Phase.restore(status, execution, steps, 'test', null)).toThrow(expectedError)
    })

    test('needs a valid last update date', () => {
      // Given
      const { status, execution, steps } = EXAMPLE_PHASE_VALUES

      const expectedError = new DomainError('A Phase needs a valid last update date!')

      // When + Then
      // @ts-expect-error A Phase needs a valid last update date.
      expect(() => Phase.restore(status, execution, steps, new Date(), 'test')).toThrow(
        expectedError
      )
    })
  })

  describe('create', () => {
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

    test('needs a valid last update date', () => {
      // When + Then
      expect(
        Phase.isValid({
          status: 'WAITING',
          execution: 'PARALLEL',
          steps: [
            {
              repository: 'test',
              workflowId: '6666',
              workflowOutcome: 'WAITING',
              workflowInputs: {},
              createdAt: new Date(),
              lastUpdatedAt: null
            }
          ],
          createdAt: new Date(),
          lastUpdatedAt: 'test'
        })
      ).toBeFalsy()
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
