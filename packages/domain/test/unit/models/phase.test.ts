import { describe, test, expect } from '@jest/globals'
import { EXAMPLE_PHASE_VALUES, EXAMPLE_STEP_VALUES } from '@test/fixtures'
import { v7 as uuidv7 } from 'uuid'

import Phase, { PhaseExecution } from '@/models/phase'
import { PhaseStatus } from '@/models/status'
import { Step } from '@/models/step'
import { DomainError } from '@/shared/errors'

describe('Phase', () => {
  describe('restore', () => {
    test('can be restored', () => {
      // Given
      const { status, execution, steps } = EXAMPLE_PHASE_VALUES

      const id = uuidv7()
      const creationDate = new Date()
      const lastUpdateDate = new Date()
      const startedAt = new Date()
      const completedAt = new Date()

      // When
      const phase = Phase.restore(
        id,
        status,
        execution,
        steps,
        creationDate,
        lastUpdateDate,
        startedAt,
        completedAt
      )

      // Then
      expect(phase.id).toBe(id)
      expect(phase.status).toBe(status)
      expect(phase.execution).toBe(execution)
      expect(phase.steps).toStrictEqual(steps)
      expect(phase.createdAt).toBe(creationDate)
      expect(phase.lastUpdatedAt).toStrictEqual(lastUpdateDate)
      expect(phase.startedAt).toBe(startedAt)
      expect(phase.completedAt).toBe(completedAt)
    })

    test('needs an ID', () => {
      // Given
      const { status, execution, steps } = EXAMPLE_PHASE_VALUES

      const expectedError = new DomainError('A Phase needs an ID!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Phase needs an ID.
        Phase.restore(null, status, execution, steps, new Date(), null, null, null)
      ).toThrow(expectedError)
    })

    test('needs a valid status', () => {
      // Given
      const { execution, steps } = EXAMPLE_PHASE_VALUES

      const expectedError = new DomainError('A Phase needs a valid status!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Phase needs a status.
        Phase.restore(uuidv7(), null, execution, steps, new Date(), null, null, null)
      ).toThrow(expectedError)
      expect(() =>
        // @ts-expect-error A Phase needs a status.
        Phase.restore(uuidv7(), 'test', execution, steps, new Date(), null, null, null)
      ).toThrow(expectedError)
    })

    test('needs an execution method', () => {
      // Given
      const { status, steps } = EXAMPLE_PHASE_VALUES

      const expectedError = new DomainError('A Phase needs an execution method!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Phase needs an execution method.
        Phase.restore(uuidv7(), status, null, steps, new Date(), null, null, null)
      ).toThrow(expectedError)
    })

    test('needs valid steps', () => {
      // Given
      const { status, execution } = EXAMPLE_PHASE_VALUES

      const expectedError = new DomainError('A Phase needs valid steps!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Phase needs valid steps.
        Phase.restore(uuidv7(), status, execution, null, new Date(), null, null, null)
      ).toThrow(expectedError)
      expect(() =>
        // @ts-expect-error A Phase needs valid steps.
        Phase.restore(uuidv7(), status, execution, 'test', new Date(), null, null, null)
      ).toThrow(expectedError)
      expect(() =>
        Phase.restore(uuidv7(), status, execution, [], new Date(), null, null, null)
      ).toThrow(expectedError)
    })

    test('needs a valid creation date', () => {
      // Given
      const { status, execution, steps } = EXAMPLE_PHASE_VALUES

      const expectedError = new DomainError('A Phase needs a valid creation date!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Phase needs a valid creation date.
        Phase.restore(uuidv7(), status, execution, steps, null, null, null, null)
      ).toThrow(expectedError)
      expect(() =>
        // @ts-expect-error A Phase needs a valid creation date.
        Phase.restore(uuidv7(), status, execution, steps, 'test', null, null, null)
      ).toThrow(expectedError)
    })

    test('needs a valid last update date', () => {
      // Given
      const { status, execution, steps } = EXAMPLE_PHASE_VALUES

      const expectedError = new DomainError('A Phase needs a valid last update date!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Phase needs a valid last update date.
        Phase.restore(uuidv7(), status, execution, steps, new Date(), 'test', null, null)
      ).toThrow(expectedError)
    })

    test('needs a valid start date', () => {
      // Given
      const { status, execution, steps } = EXAMPLE_PHASE_VALUES

      const expectedError = new DomainError('A Phase needs a valid start date!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Phase needs a valid start date.
        Phase.restore(uuidv7(), status, execution, steps, new Date(), null, 'test', null)
      ).toThrow(expectedError)
    })

    test('needs a valid completion date', () => {
      // Given
      const { status, execution, steps } = EXAMPLE_PHASE_VALUES

      const expectedError = new DomainError('A Phase needs a valid completion date!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Phase needs a valid completion date.
        Phase.restore(uuidv7(), status, execution, steps, new Date(), null, null, 'test')
      ).toThrow(expectedError)
    })
  })

  describe('create', () => {
    test('can be created', () => {
      // Given
      const { execution, steps } = EXAMPLE_PHASE_VALUES

      // When
      const phase = Phase.create(execution, steps)

      // Then
      expect(phase.id).toBeDefined()
      expect(phase.status).toBe(PhaseStatus.Waiting)
      expect(phase.startedAt).toBeNull()
      expect(phase.completedAt).toBeNull()
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
          id: uuidv7(),
          status: 'WAITING',
          execution: 'PARALLEL',
          steps: [
            {
              id: uuidv7(),
              repository: 'test',
              workflowId: '6666',
              workflowOutcome: 'WAITING',
              workflowInputs: {},
              createdAt: new Date(),
              lastUpdatedAt: null
            }
          ],
          createdAt: new Date(),
          lastUpdatedAt: 'test',
          completedAt: null
        })
      ).toBeFalsy()
    })

    test('needs a valid start date', () => {
      // When + Then
      expect(
        Phase.isValid({
          id: uuidv7(),
          status: 'WAITING',
          execution: 'PARALLEL',
          steps: [
            {
              id: uuidv7(),
              repository: 'test',
              workflowId: '6666',
              workflowOutcome: 'WAITING',
              workflowInputs: {},
              createdAt: new Date(),
              lastUpdatedAt: null
            }
          ],
          createdAt: new Date(),
          lastUpdatedAt: null,
          startedAt: 'test'
        })
      ).toBeFalsy()
    })

    test('needs a valid completion date', () => {
      // When + Then
      expect(
        Phase.isValid({
          id: uuidv7(),
          status: 'WAITING',
          execution: 'PARALLEL',
          steps: [
            {
              id: uuidv7(),
              repository: 'test',
              workflowId: '6666',
              workflowOutcome: 'WAITING',
              workflowInputs: {},
              createdAt: new Date(),
              lastUpdatedAt: null
            }
          ],
          createdAt: new Date(),
          lastUpdatedAt: null,
          completedAt: 'test'
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
