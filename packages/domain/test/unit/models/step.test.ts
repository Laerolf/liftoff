import { describe, test, expect } from 'bun:test'

import { createExampleStepData } from '@test/fixtures/data'
import { EXAMPLE_VALUES } from '@test/fixtures/values'
import { v7 as uuidv7 } from 'uuid'

import { StepStatus } from '@/models/status'
import { Step } from '@/models/step'
import { DomainError } from '@/shared/errors'

describe('Step', () => {
  describe('restore', () => {
    test('can be restored', () => {
      // Given
      const {
        repositoryName: repository,
        workflowId,
        steps: { workflowOutcome: outcome, exposedWorkflowInputs, workflowInputs }
      } = EXAMPLE_VALUES

      let id = uuidv7()
      const creationDate = new Date()
      const lastUpdateDate = new Date()
      const startDate = new Date()
      const completionDate = new Date()

      // When
      const step = Step.restore(
        id,
        repository,
        workflowId,
        creationDate,
        lastUpdateDate,
        startDate,
        completionDate,
        outcome,
        exposedWorkflowInputs,
        workflowInputs
      )

      // Then
      expect(step.id).toBe(id)
      expect(step.repository).toBe(repository)
      expect(step.workflowId).toBe(workflowId)
      expect(step.createdAt).toBe(creationDate)
      expect(step.lastUpdatedAt).toBe(lastUpdateDate)
      expect(step.startedAt).toBe(startDate)
      expect(step.completedAt).toBe(completionDate)
      expect(step.workflowOutcome).toBe(outcome)
      expect(step.exposedWorkflowInputs).toStrictEqual(exposedWorkflowInputs)
      expect(step.workflowInputs).toStrictEqual(workflowInputs)
    })

    test('needs an ID', () => {
      // Given
      const {
        repositoryName: repository,
        workflowId,
        steps: { workflowOutcome: outcome },
        date
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Step needs an ID!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs an ID.
        Step.restore(null, repository, workflowId, date, null, null, null, outcome)
      ).toThrow(expectedError)
    })

    test('needs a repository', () => {
      // Given
      const {
        workflowId,
        steps: { workflowOutcome: outcome },
        date,
        id
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Step needs a repository!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs a repository.
        Step.restore(id, null, workflowId, date, null, null, null, outcome)
      ).toThrow(expectedError)
    })

    test('needs a workflow ID', () => {
      // Given
      const {
        repositoryName: repository,
        steps: { workflowOutcome: outcome },
        date,
        id
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Step needs a workflow ID!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs a workflow ID.
        Step.restore(id, repository, null, date, null, null, null, outcome)
      ).toThrow(expectedError)
    })

    test('needs a valid creation date', () => {
      // Given
      const {
        repositoryName: repository,
        workflowId,
        steps: { workflowOutcome: outcome },
        id
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Step needs a valid creation date!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs a valid creation date.
        Step.restore(id, repository, workflowId, null, null, null, null, outcome)
      ).toThrow(expectedError)
      expect(() =>
        // @ts-expect-error A Step needs a valid creation date.
        Step.restore(id, repository, workflowId, 'test', null, null, null, outcome)
      ).toThrow(expectedError)
    })

    test('needs a valid last update date', () => {
      // Given
      const {
        repositoryName: repository,
        workflowId,
        steps: { workflowOutcome: outcome },
        date,
        id
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Step needs a valid last update date!')

      // When + Then
      expect(() =>
        Step.restore(
          id,
          repository,
          workflowId,
          date,
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
      const {
        repositoryName: repository,
        workflowId,
        steps: { workflowOutcome: outcome },
        date,
        id
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Step needs a valid start date!')

      // When + Then
      expect(() =>
        Step.restore(
          id,
          repository,
          workflowId,
          date,
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
      const {
        repositoryName: repository,
        workflowId,
        steps: { workflowOutcome: outcome },
        date,
        id
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Step needs a valid completion date!')

      // When + Then
      expect(() =>
        Step.restore(
          id,
          repository,
          workflowId,
          date,
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
      const { repositoryName: repository, workflowId, date, id } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Step needs a valid outcome!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Step needs a valid outcome.
        Step.restore(id, repository, workflowId, date, null, null, null, null)
      ).toThrow(expectedError)
      expect(() =>
        Step.restore(
          id,
          repository,
          workflowId,
          date,
          null,
          null,
          null,
          // @ts-expect-error A Step needs a valid outcome.
          'test'
        )
      ).toThrow(expectedError)
    })

    test('needs valid exposed workflow inputs', () => {
      // Given
      const {
        repositoryName: repository,
        workflowId,
        steps: { workflowOutcome: outcome },
        date,
        id
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Step needs valid exposed workflow inputs!')

      // When + Then
      expect(() =>
        Step.restore(
          id,
          repository,
          workflowId,
          date,
          null,
          null,
          null,
          outcome,
          // @ts-expect-error A Step needs valid exposed workflow inputs.
          'test'
        )
      ).toThrow(expectedError)
      expect(() =>
        Step.restore(
          id,
          repository,
          workflowId,
          date,
          null,
          null,
          null,
          outcome,
          // @ts-expect-error A Step needs valid exposed workflow inputs.
          null
        )
      ).not.toThrow()
    })

    test('needs valid workflow inputs', () => {
      // Given
      const {
        repositoryName: repository,
        workflowId,
        steps: { workflowOutcome: outcome },
        date,
        id
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Step needs valid workflow inputs!')

      // When + Then
      expect(() =>
        Step.restore(
          id,
          repository,
          workflowId,
          date,
          null,
          null,
          null,
          outcome,
          undefined,
          // @ts-expect-error A Step needs valid workflow inputs.
          'test'
        )
      ).toThrow(expectedError)
      expect(() =>
        Step.restore(
          id,
          repository,
          workflowId,
          date,
          null,
          null,
          null,
          outcome,
          undefined,
          // @ts-expect-error A Step needs valid workflow inputs.
          null
        )
      ).not.toThrow()
    })
  })

  describe('create', () => {
    test('can be created', () => {
      // Given
      const {
        repositoryName: repository,
        workflowId,
        steps: { exposedWorkflowInputs }
      } = EXAMPLE_VALUES

      // When
      const step = Step.create(repository, workflowId, exposedWorkflowInputs)

      // Then
      expect(step.id).toBeDefined()
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
      const { repositoryName: repository, workflowId } = EXAMPLE_VALUES

      const step = Step.create(repository, workflowId)

      // When + Then
      expect(Step.isValid(step)).toBeTruthy()
    })

    test('needs a valid last update date', () => {
      // When + Then
      expect(Step.isValid(createExampleStepData({ lastUpdatedAt: 'test' }))).toBeFalsy()
    })

    test('needs a valid start date', () => {
      // When + Then
      expect(Step.isValid(createExampleStepData({ startedAt: 'test' }))).toBeFalsy()
    })

    test('needs a valid completion date', () => {
      // When + Then
      expect(Step.isValid(createExampleStepData({ completedAt: 'test' }))).toBeFalsy()
    })

    test('can have exposed inputs', () => {
      // When + Then
      expect(Step.isValid(createExampleStepData({ exposedWorkflowInputs: null }))).toBeTruthy()
      expect(Step.isValid(createExampleStepData({ exposedWorkflowInputs: {} }))).toBeTruthy()
      expect(Step.isValid(createExampleStepData({ exposedWorkflowInputs: 'test' }))).toBeFalsy()
    })

    test('can have inputs', () => {
      // When + Then
      expect(Step.isValid(createExampleStepData({ workflowInputs: null }))).toBeTruthy()
      expect(Step.isValid(createExampleStepData({ workflowInputs: {} }))).toBeTruthy()
      expect(Step.isValid(createExampleStepData({ workflowInputs: 'test' }))).toBeFalsy()
    })

    test('needs a valid outcome', () => {
      // When + Then
      expect(Step.isValid(createExampleStepData({ workflowOutcome: 'test' }))).toBeFalsy()
      expect(Step.isValid(createExampleStepData({ workflowOutcome: 'WAITING' }))).toBeTruthy()
      expect(Step.isValid(createExampleStepData({ workflowOutcome: null }))).toBeFalsy()
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
