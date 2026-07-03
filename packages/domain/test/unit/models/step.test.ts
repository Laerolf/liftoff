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

      const creationDate = new Date()
      const lastUpdateDate = new Date()

      // When
      const step = Step.restore(repository, workflowId, creationDate, lastUpdateDate, outcome, {})

      // Then
      expect(step.repository).toBe(repository)
      expect(step.workflowId).toBe(workflowId)
      expect(step.createdAt).toBe(creationDate)
      expect(step.lastUpdatedAt).toBe(lastUpdateDate)
      expect(step.workflowOutcome).toBe(outcome)
      expect(step.workflowInputs).toStrictEqual({})
    })

    test('needs a repository', () => {
      // Given
      const { workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a repository!')

      // When + Then
      // @ts-expect-error A Step needs a repository.
      expect(() => Step.restore(null, workflowId, new Date(), null, outcome)).toThrow(expectedError)
    })

    test('needs a workflow ID', () => {
      // Given
      const { repository, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a workflow ID!')

      // When + Then
      // @ts-expect-error A Step needs a workflow ID.
      expect(() => Step.restore(repository, null, new Date(), null, outcome)).toThrow(expectedError)
    })

    test('needs a valid creation date', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a valid creation date!')

      // When + Then
      // @ts-expect-error A Step needs a valid creation date.
      expect(() => Step.restore(repository, workflowId, null, null, outcome)).toThrow(expectedError)
      // @ts-expect-error A Step needs a valid creation date.
      expect(() => Step.restore(repository, workflowId, 'test', null, outcome)).toThrow(
        expectedError
      )
    })

    test('needs a valid last update date', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a valid last update date!')

      // When + Then
      // @ts-expect-error A Step needs a valid last update date.
      expect(() => Step.restore(repository, workflowId, new Date(), 'test', outcome)).toThrow(
        expectedError
      )
    })

    test('needs a valid outcome', () => {
      // Given
      const { repository, workflowId } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a valid outcome!')

      // When + Then
      // @ts-expect-error A Step needs a valid outcome.
      expect(() => Step.restore(repository, workflowId, new Date(), null, null)).toThrow(
        expectedError
      )
      // @ts-expect-error A Step needs a valid outcome.
      expect(() => Step.restore(repository, workflowId, new Date(), null, 'test')).toThrow(
        expectedError
      )
    })

    test('needs valid workflow inputs', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs valid workflow inputs!')

      // When + Then
      // @ts-expect-error A Step needs valid workflow inputs.
      expect(() => Step.restore(repository, workflowId, new Date(), null, outcome, 'test')).toThrow(
        expectedError
      )
      expect(() =>
        // @ts-expect-error A Step needs valid workflow inputs.
        Step.restore(repository, workflowId, new Date(), null, outcome, null)
      ).not.toThrow()
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
      expect(step.createdAt).toBeDefined()
      expect(step.lastUpdatedAt).toBeNull()
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

    test('needs a valid last update date', () => {
      // When + Then
      expect(
        Step.isValid({
          repository: 'test',
          workflowId: '6666',
          workflowOutcome: 'WAITING',
          workflowInputs: {},
          createdAt: new Date(),
          lastUpdatedAt: 'test'
        })
      ).toBeFalsy()
    })

    test('can have exposed inputs', () => {
      // Given
      const { repository, workflowId } = EXAMPLE_STEP_VALUES

      // When + Then
      expect(
        Step.isValid({
          repository: repository,
          workflowId: workflowId,
          createdAt: new Date(),
          workflowOutcome: 'WAITING',
          workflowInputs: null
        })
      ).toBeTruthy()
      expect(
        Step.isValid({
          repository: repository,
          workflowId: workflowId,
          createdAt: new Date(),
          workflowOutcome: 'WAITING',
          workflowInputs: {}
        })
      ).toBeTruthy()
      expect(
        Step.isValid({
          repository: repository,
          workflowId: workflowId,
          createdAt: new Date(),
          workflowOutcome: 'WAITING',
          workflowInputs: 'test'
        })
      ).toBeFalsy()
    })

    test('needs a valid outcome', () => {
      // Given
      const { repository, workflowId } = EXAMPLE_STEP_VALUES

      // When + Then
      expect(
        Step.isValid({
          repository: repository,
          workflowId: workflowId,
          createdAt: new Date(),
          workflowOutcome: 'test',
          workflowInputs: null
        })
      ).toBeFalsy()
      expect(
        Step.isValid({
          repository: repository,
          workflowId: workflowId,
          createdAt: new Date(),
          workflowOutcome: 'WAITING',
          workflowInputs: null
        })
      ).toBeTruthy()
      expect(
        Step.isValid({
          repository: repository,
          createdAt: new Date(),
          workflowId: workflowId,
          workflowOutcome: null,
          workflowInputs: null
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
