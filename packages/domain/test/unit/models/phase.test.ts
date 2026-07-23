import { describe, test, expect } from 'bun:test'

import { createExamplePhaseData } from '@test/fixtures/data'
import { EXAMPLE_STEP, EXAMPLE_VALUES } from '@test/fixtures/values'
import { v7 as uuidv7 } from 'uuid'

import { Phase, PhaseExecution } from '@/models/phase'
import { PhaseStatus } from '@/models/status'
import { DomainError } from '@/shared/errors'

describe('Phase', () => {
  describe('restore', () => {
    test('can be restored', () => {
      // Given
      const {
        phases: { status, executionMethod }
      } = EXAMPLE_VALUES

      const id = uuidv7()
      const missionId = uuidv7()
      const creationDate = new Date()
      const lastUpdateDate = new Date()
      const startedAt = new Date()
      const completedAt = new Date()

      // When
      const phase = Phase.restore(
        id,
        missionId,
        status,
        executionMethod,
        [EXAMPLE_STEP],
        creationDate,
        lastUpdateDate,
        startedAt,
        completedAt
      )

      // Then
      expect(phase.id).toBe(id)
      expect(phase.missionId).toBe(missionId)
      expect(phase.status).toBe(status)
      expect(phase.execution).toBe(executionMethod)
      expect(phase.steps).toStrictEqual([EXAMPLE_STEP])
      expect(phase.createdAt).toBe(creationDate)
      expect(phase.lastUpdatedAt).toStrictEqual(lastUpdateDate)
      expect(phase.startedAt).toBe(startedAt)
      expect(phase.completedAt).toBe(completedAt)
    })

    test('needs an ID', () => {
      // Given
      const {
        phases: { status, executionMethod },
        id,
        date
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Phase needs an ID!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Phase needs an ID.
        Phase.restore(null, id, status, executionMethod, [EXAMPLE_STEP], date, null, null, null)
      ).toThrow(expectedError)
    })

    test('needs a Mission ID', () => {
      // Given
      const {
        phases: { status, executionMethod },
        id,
        date
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Phase needs a Mission ID!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Phase needs a Mission ID.
        Phase.restore(id, null, status, executionMethod, [EXAMPLE_STEP], date, null, null, null)
      ).toThrow(expectedError)
    })

    test('needs a valid status', () => {
      // Given
      const {
        phases: { executionMethod },
        id,
        date
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Phase needs a valid status!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Phase needs a status.
        Phase.restore(id, id, null, executionMethod, [EXAMPLE_STEP], date, null, null, null)
      ).toThrow(expectedError)
      expect(() =>
        // @ts-expect-error A Phase needs a status.
        Phase.restore(id, id, 'test', executionMethod, [EXAMPLE_STEP], date, null, null, null)
      ).toThrow(expectedError)
    })

    test('needs an execution method', () => {
      // Given
      const {
        phases: { status },
        id,
        date
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Phase needs an execution method!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Phase needs an execution method.
        Phase.restore(id, id, status, null, [EXAMPLE_STEP], date, null, null, null)
      ).toThrow(expectedError)
    })

    test('needs a valid creation date', () => {
      // Given
      const {
        phases: { status, executionMethod },
        id
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Phase needs a valid creation date!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Phase needs a valid creation date.
        Phase.restore(id, id, status, executionMethod, [EXAMPLE_STEP], null, null, null, null)
      ).toThrow(expectedError)
      expect(() =>
        // @ts-expect-error A Phase needs a valid creation date.
        Phase.restore(id, id, status, executionMethod, [EXAMPLE_STEP], 'test', null, null, null)
      ).toThrow(expectedError)
    })

    test('needs a valid last update date', () => {
      // Given
      const {
        phases: { status, executionMethod },
        id,
        date
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Phase needs a valid last update date!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Phase needs a valid last update date.
        Phase.restore(id, id, status, executionMethod, [EXAMPLE_STEP], date, 'test', null, null)
      ).toThrow(expectedError)
    })

    test('needs a valid start date', () => {
      // Given
      const {
        phases: { status, executionMethod },
        id,
        date
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Phase needs a valid start date!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Phase needs a valid start date.
        Phase.restore(id, id, status, executionMethod, [EXAMPLE_STEP], date, null, 'test', null)
      ).toThrow(expectedError)
    })

    test('needs a valid completion date', () => {
      // Given
      const {
        phases: { status, executionMethod },
        id,
        date
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Phase needs a valid completion date!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Phase needs a valid completion date.
        Phase.restore(id, id, status, executionMethod, [EXAMPLE_STEP], date, null, null, 'test')
      ).toThrow(expectedError)
    })
  })

  describe('create', () => {
    test('can be created', () => {
      // Given
      const {
        phases: { executionMethod },
        id
      } = EXAMPLE_VALUES

      // When
      const phase = Phase.create(id, executionMethod)

      // Then
      expect(phase.id).toBeDefined()
      expect(phase.missionId).toBe(id)
      expect(phase.status).toBe(PhaseStatus.Draft)
      expect(phase.startedAt).toBeNull()
      expect(phase.completedAt).toBeNull()
    })
  })

  describe('isValid', () => {
    test('can be valid', () => {
      // Given
      const phase = Phase.create(uuidv7(), PhaseExecution.Parallel)

      // When + Then
      expect(Phase.isValid(phase)).toBeTruthy()
    })

    test('needs a valid last update date', () => {
      // When + Then
      expect(Phase.isValid(createExamplePhaseData({ lastUpdatedAt: 123456 }))).toBeFalsy()
    })

    test('needs a valid start date', () => {
      // When + Then
      expect(Phase.isValid(createExamplePhaseData({ startedAt: 123456 }))).toBeFalsy()
    })

    test('needs a valid completion date', () => {
      // When + Then
      expect(Phase.isValid(createExamplePhaseData({ completedAt: 123456 }))).toBeFalsy()
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

  describe('prepare', () => {
    test('can be prepared', () => {
      // Given
      const {
        phases: { executionMethod },
        id
      } = EXAMPLE_VALUES

      const phase = Phase.create(id, executionMethod)

      // When
      phase.prepare([EXAMPLE_STEP])

      // Then
      expect(phase.status).toBe(PhaseStatus.Waiting)
      expect(phase.lastUpdatedAt).toBeDefined()
    })

    test('can not be prepared twice', () => {
      // Given
      const {
        phases: { executionMethod },
        id
      } = EXAMPLE_VALUES

      const phase = Phase.create(id, executionMethod).prepare([EXAMPLE_STEP])

      const expectedError = new DomainError('The Phase has already been prepared.')

      // When + Then
      expect(() => phase.prepare([EXAMPLE_STEP])).toThrow(expectedError)
    })

    test('can not be prepared without steps', () => {
      // Given
      const {
        phases: { executionMethod },
        id
      } = EXAMPLE_VALUES

      const phase = Phase.create(id, executionMethod)

      const expectedError = new DomainError('The Phase needs valid Steps to be prepared to launch.')

      // When + Then
      expect(() => phase.prepare([])).toThrow(expectedError)
      // @ts-expect-error The Phase needs valid Steps to be prepared to launch.
      expect(() => phase.prepare(['test'])).toThrow(expectedError)
      // @ts-expect-error The Phase needs valid Steps to be prepared to launch.
      expect(() => phase.prepare([null])).toThrow(expectedError)
    })
  })
})
