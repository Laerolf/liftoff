import { describe, test, expect } from '@jest/globals'
import { EXAMPLE_STEP_VALUES } from '@test/fixtures'
import { v7 as uuidv7 } from 'uuid'

import { StepStatus } from '@/models/status'
import { Step } from '@/models/step'
import { DomainError } from '@/shared/errors'

describe('Step', () => {
  describe('restore', () => {
    test('can be restored', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      let id = uuidv7()
      const creationDate = new Date()
      const lastUpdateDate = new Date()
      const completionDate = new Date()

      // When
      const step = Step.restore(
        id,
        repository,
        workflowId,
        creationDate,
        lastUpdateDate,
        completionDate,
        outcome,
        {}
      )

      // Then
      expect(step.id).toBe(id)
      expect(step.repository).toBe(repository)
      expect(step.workflowId).toBe(workflowId)
      expect(step.createdAt).toBe(creationDate)
      expect(step.lastUpdatedAt).toBe(lastUpdateDate)
      expect(step.completedAt).toBe(completionDate)
      expect(step.workflowOutcome).toBe(outcome)
      expect(step.workflowInputs).toStrictEqual({})
    })

    test('needs an ID', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs an ID!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs an ID.
        Step.restore(null, repository, workflowId, new Date(), null, null, outcome)
      ).toThrow(expectedError)
    })

    test('needs a repository', () => {
      // Given
      const { workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a repository!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs a repository.
        Step.restore(uuidv7(), null, workflowId, new Date(), null, null, outcome)
      ).toThrow(expectedError)
    })

    test('needs a workflow ID', () => {
      // Given
      const { repository, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a workflow ID!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs a workflow ID.
        Step.restore(uuidv7(), repository, null, new Date(), null, null, outcome)
      ).toThrow(expectedError)
    })

    test('needs a valid creation date', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a valid creation date!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs a valid creation date.
        Step.restore(uuidv7(), repository, workflowId, null, null, null, outcome)
      ).toThrow(expectedError)
      expect(() =>
        // @ts-expect-error A Step needs a valid creation date.
        Step.restore(uuidv7(), repository, workflowId, 'test', null, null, outcome)
      ).toThrow(expectedError)
    })

    test('needs a valid last update date', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a valid last update date!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs a valid last update date.
        Step.restore(uuidv7(), repository, workflowId, new Date(), 'test', null, outcome)
      ).toThrow(expectedError)
    })

    test('needs a valid completion date', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a valid completion date!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs a valid completion date.
        Step.restore(uuidv7(), repository, workflowId, new Date(), null, 'test', outcome)
      ).toThrow(expectedError)
    })

    test('needs a valid outcome', () => {
      // Given
      const { repository, workflowId } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a valid outcome!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs a valid outcome.
        Step.restore(uuidv7(), repository, workflowId, new Date(), null, null, null)
      ).toThrow(expectedError)
      expect(() =>
        // @ts-expect-error A Step needs a valid outcome.
        Step.restore(uuidv7(), repository, workflowId, new Date(), null, null, 'test')
      ).toThrow(expectedError)
    })

    test('needs valid workflow inputs', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs valid workflow inputs!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs valid workflow inputs.
        Step.restore(uuidv7(), repository, workflowId, new Date(), null, null, outcome, 'test')
      ).toThrow(expectedError)
      expect(() =>
        // @ts-expect-error A Step needs valid workflow inputs.
        Step.restore(uuidv7(), repository, workflowId, new Date(), null, null, outcome, null)
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
      expect(step.id).toBeDefined()
      expect(step.workflowOutcome).toBe(StepStatus.Waiting)
      expect(step.createdAt).toBeDefined()
      expect(step.lastUpdatedAt).toBeNull()
      expect(step.completedAt).toBeNull()
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
          id: uuidv7(),
          repository: 'test',
          workflowId: '6666',
          workflowOutcome: 'WAITING',
          workflowInputs: {},
          createdAt: new Date(),
          lastUpdatedAt: 'test',
          completedAt: null
        })
      ).toBeFalsy()
    })

    test('needs a valid completion date', () => {
      // When + Then
      expect(
        Step.isValid({
          id: uuidv7(),
          repository: 'test',
          workflowId: '6666',
          workflowOutcome: 'WAITING',
          workflowInputs: {},
          createdAt: new Date(),
          lastUpdatedAt: null,
          completedAt: 'test'
        })
      ).toBeFalsy()
    })

    test('can have exposed inputs', () => {
      // Given
      const { repository, workflowId } = EXAMPLE_STEP_VALUES

      // When + Then
      expect(
        Step.isValid({
          id: 'test',
          repository: repository,
          workflowId: workflowId,
          createdAt: new Date(),
          workflowOutcome: 'WAITING',
          workflowInputs: null
        })
      ).toBeTruthy()
      expect(
        Step.isValid({
          id: 'test',
          repository: repository,
          workflowId: workflowId,
          createdAt: new Date(),
          workflowOutcome: 'WAITING',
          workflowInputs: {}
        })
      ).toBeTruthy()
      expect(
        Step.isValid({
          id: uuidv7(),
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
          id: uuidv7(),
          repository: repository,
          workflowId: workflowId,
          createdAt: new Date(),
          workflowOutcome: 'test',
          workflowInputs: null
        })
      ).toBeFalsy()
      expect(
        Step.isValid({
          id: uuidv7(),
          repository: repository,
          workflowId: workflowId,
          createdAt: new Date(),
          workflowOutcome: 'WAITING',
          workflowInputs: null
        })
      ).toBeTruthy()
      expect(
        Step.isValid({
          id: uuidv7(),
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
