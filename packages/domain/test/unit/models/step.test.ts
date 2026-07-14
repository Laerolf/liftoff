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
      const phaseId = uuidv7()
      const creationDate = new Date()
      const lastUpdateDate = new Date()
      const startDate = new Date()
      const completionDate = new Date()

      // When
      const step = Step.restore(
        id,
        phaseId,
        repository,
        workflowId,
        creationDate,
        lastUpdateDate,
        startDate,
        completionDate,
        outcome,
        {}
      )

      // Then
      expect(step.id).toBe(id)
      expect(step.phaseId).toBe(phaseId)
      expect(step.repository).toBe(repository)
      expect(step.workflowId).toBe(workflowId)
      expect(step.createdAt).toBe(creationDate)
      expect(step.lastUpdatedAt).toBe(lastUpdateDate)
      expect(step.startedAt).toBe(startDate)
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
        Step.restore(null, repository, workflowId, new Date(), null, null, null, outcome)
      ).toThrow(expectedError)
    })

    test('needs a Phase ID', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a Phase ID!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs an ID.
        Step.restore(uuidv7(), null, repository, workflowId, new Date(), null, null, null, outcome)
      ).toThrow(expectedError)
    })

    test('needs a repository', () => {
      // Given
      const { workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a repository!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs a repository.
        Step.restore(uuidv7(), uuidv7(), null, workflowId, new Date(), null, null, null, outcome)
      ).toThrow(expectedError)
    })

    test('needs a workflow ID', () => {
      // Given
      const { repository, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a workflow ID!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs a workflow ID.
        Step.restore(uuidv7(), uuidv7(), repository, null, new Date(), null, null, null, outcome)
      ).toThrow(expectedError)
    })

    test('needs a valid creation date', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a valid creation date!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs a valid creation date.
        Step.restore(uuidv7(), uuidv7(), repository, workflowId, null, null, null, null, outcome)
      ).toThrow(expectedError)
      expect(() =>
        // @ts-expect-error A Step needs a valid creation date.
        Step.restore(uuidv7(), uuidv7(), repository, workflowId, 'test', null, null, null, outcome)
      ).toThrow(expectedError)
    })

    test('needs a valid last update date', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a valid last update date!')

      // When + Then
      expect(() =>
        Step.restore(
          uuidv7(),
          uuidv7(),
          repository,
          workflowId,
          new Date(),
          // @ts-expect-error A Step needs a valid last update date.
          'test',
          null,
          null,
          outcome
        )
      ).toThrow(expectedError)
    })

    test('needs a valid start date', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a valid start date!')

      // When + Then
      expect(() =>
        Step.restore(
          uuidv7(),
          uuidv7(),
          repository,
          workflowId,
          new Date(),
          null,
          // @ts-expect-error A Step needs a valid start date.
          'test',
          null,
          outcome
        )
      ).toThrow(expectedError)
    })

    test('needs a valid completion date', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a valid completion date!')

      // When + Then
      expect(() =>
        Step.restore(
          uuidv7(),
          uuidv7(),
          repository,
          workflowId,
          new Date(),
          null,
          null,
          // @ts-expect-error A Step needs a valid completion date.
          'test',
          outcome
        )
      ).toThrow(expectedError)
    })

    test('needs a valid outcome', () => {
      // Given
      const { repository, workflowId } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs a valid outcome!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs a valid outcome.
        Step.restore(uuidv7(), uuidv7(), repository, workflowId, new Date(), null, null, null, null)
      ).toThrow(expectedError)
      expect(() =>
        Step.restore(
          uuidv7(),
          uuidv7(),
          repository,
          workflowId,
          new Date(),
          null,
          null,
          null,
          // @ts-expect-error A Step needs a valid outcome.
          'test'
        )
      ).toThrow(expectedError)
    })

    test('needs valid workflow inputs', () => {
      // Given
      const { repository, workflowId, outcome } = EXAMPLE_STEP_VALUES

      const expectedError = new DomainError('A Step needs valid workflow inputs!')

      // When + Then
      expect(() =>
        Step.restore(
          uuidv7(),
          uuidv7(),
          repository,
          workflowId,
          new Date(),
          null,
          null,
          null,
          outcome,
          // @ts-expect-error A Step needs valid workflow inputs.
          'test'
        )
      ).toThrow(expectedError)
      expect(() =>
        Step.restore(
          uuidv7(),
          uuidv7(),
          repository,
          workflowId,
          new Date(),
          null,
          null,
          null,
          outcome,
          // @ts-expect-error A Step needs valid workflow inputs.
          null
        )
      ).not.toThrow()
    })
  })

  describe('create', () => {
    test('can be created', () => {
      // Given
      const { repository, workflowId } = EXAMPLE_STEP_VALUES

      const phaseId = uuidv7()

      // When
      const step = Step.create(phaseId, repository, workflowId, {})

      // Then
      expect(step.id).toBeDefined()
      expect(step.phaseId).toBe(phaseId)
      expect(step.workflowOutcome).toBe(StepStatus.Waiting)
      expect(step.createdAt).toBeDefined()
      expect(step.lastUpdatedAt).toBeNull()
      expect(step.startedAt).toBeNull()
      expect(step.completedAt).toBeNull()
    })
  })

  describe('isValid', () => {
    test('can be valid', () => {
      // Given
      const { repository, workflowId } = EXAMPLE_STEP_VALUES

      const step = Step.create(uuidv7(), repository, workflowId)

      // When + Then
      expect(Step.isValid(step)).toBeTruthy()
    })

    test('needs a valid last update date', () => {
      // When + Then
      expect(
        Step.isValid({
          id: uuidv7(),
          phaseId: uuidv7(),
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

    test('needs a valid start date', () => {
      // When + Then
      expect(
        Step.isValid({
          id: uuidv7(),
          phaseId: uuidv7(),
          repository: 'test',
          workflowId: '6666',
          workflowOutcome: 'WAITING',
          workflowInputs: {},
          createdAt: new Date(),
          lastUpdatedAt: null,
          startedAt: 'test'
        })
      ).toBeFalsy()
    })

    test('needs a valid completion date', () => {
      // When + Then
      expect(
        Step.isValid({
          id: uuidv7(),
          phaseId: uuidv7(),
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
          phaseId: uuidv7(),
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
          phaseId: uuidv7(),
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
          phaseId: uuidv7(),
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
          phaseId: uuidv7(),
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
          phaseId: uuidv7(),
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
          phaseId: uuidv7(),
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
