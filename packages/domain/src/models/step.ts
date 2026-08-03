import { v7 as uuidv7 } from 'uuid'
import { object, string, date, array, enum as zEnum } from 'zod'

import { ID_MAX_LENGTH, STRING_MAX_LENGTH } from '@/shared/rules'

import { DomainError } from '../shared/errors'
import { isValidDate } from '../utils/date'
import { isStepStatus } from '../utils/status'

import { StepStatus } from './status'

import type { DomainElement } from '../shared/domainElement'

/**
 * Represents a Step in a Mission Phase, a single workflow dispatch to a specifc GitHub repository.
 */
export class Step implements DomainElement {
  /**
   * Restores a {@link Step}.
   * @param id - The ID of the {@link Phase} to create.
   * @param repository - The GitHub repository of the {@link Step} to create.
   * @param workflowId - The GitHub Workflow ID of the {@link Step} to create.
   * @param createdAt - The moment the {@link Step} to create was created.
   * @param lastUpdatedAt - The moment the {@link Step} to create was last updated.
   * @param startedAt - The date this {@link Step} to create was started.
   * @param completedAt - The date this {@link Step} to create was completed.
   * @param workflowOutcome - The GitHub Workflow outcome of the {@link Step} to create.
   * @param exposedWorkflowInputs - The GitHub exposed Workflow inputs of the {@link Step} to create.
   * @param workflowInputs - The GitHub Workflow inputs of the {@link Step} to create.
   */
  static restore(
    id: string,
    repository: string,
    workflowId: string,
    createdAt: Date,
    lastUpdatedAt: Date | null,
    startedAt: Date | null,
    completedAt: Date | null,
    workflowOutcome: StepStatus,
    exposedWorkflowInputs?: Record<string, string>,
    workflowInputs?: Record<string, string>
  ): Step {
    return new Step(
      id,
      repository,
      workflowId,
      createdAt,
      lastUpdatedAt,
      startedAt,
      completedAt,
      workflowOutcome,
      exposedWorkflowInputs,
      workflowInputs
    )
  }

  /**
   * Creates a new {@link Step}.
   * @param repository - The GitHub repository of the {@link Step} to create.
   * @param workflowId - The GitHub Workflow ID of the {@link Step} to create.
   * @param exposedWorkflowInputs - The exposed GitHub Workflow inputs of the {@link Step} to create.
   */
  static create(
    repository: string,
    workflowId: string,
    exposedWorkflowInputs?: Record<string, string>
  ): Step {
    return new Step(
      uuidv7(),
      repository,
      workflowId,
      new Date(),
      null,
      null,
      null,
      StepStatus.Waiting,
      exposedWorkflowInputs
    )
  }

  /**
   * Returns the schema for a valid {@link Phase}.
   */
  static get schema() {
    return object({
      id: string().max(ID_MAX_LENGTH),
      repository: string().max(STRING_MAX_LENGTH),
      workflowId: string().max(STRING_MAX_LENGTH),
      workflowOutcome: zEnum(StepStatus),
      exposedWorkflowInputs: object().nullable(),
      workflowInputs: object().nullable(),
      createdAt: date(),
      lastUpdatedAt: date().nullable(),
      startedAt: date().nullable(),
      completedAt: date().nullable()
    })
  }

  /**
   * Tests whether the provided value is a valid {@link Step}.
   * @param value - The value to test.
   */
  static isValid(value: unknown): value is Step {
    const { error, success } = Step.schema.safeParse(value)

    console.warn('The provided value is not a valid Step!', error)

    return success
  }

  /**
   * The ID of this {@link Step}.
   */
  readonly id: string
  /**
   * The GitHub repository of this {@link Step}.
   */
  readonly repository: string
  /**
   * The GitHub Workflow ID of this {@link Step}.
   */
  readonly workflowId: string
  /**
   * The GitHub Workflow outcome of this {@link Step}.
   */
  readonly workflowOutcome: StepStatus
  /**
   * The exposed GitHub Workflow inputs of this {@link Step}.
   */
  readonly exposedWorkflowInputs: Record<string, string>
  /**
   * The GitHub Workflow inputs of this {@link Step}.
   */
  readonly workflowInputs: Record<string, string>
  /**
   * The moment this {@link Step} was created.
   */
  private _createdAt: Date
  /**
   * The moment this {@link Step} was last updated.
   */
  private _lastUpdatedAt: Date | null
  /**
   * The date this {@link Step} was started.
   */
  readonly startedAt: Date | null
  /**
   * The date this {@link Step} was completed.
   */
  readonly completedAt: Date | null

  /**
   * Creates a new {@link Step}.
   * @param id - The ID of the {@link Step} to create.
   * @param repository - The GitHub repository of the {@link Step} to create.
   * @param workflowId - The GitHub Workflow ID of the {@link Step} to create.
   * @param createdAt - The moment the {@link Step} to create was created.
   * @param lastUpdatedAt - The moment the {@link Step} to create was last updated.
   * @param startedAt - The date this {@link Step} to create was started.
   * @param completedAt - The date this {@link Step} to create was completed.
   * @param workflowOutcome - The GitHub Workflow outcome of the {@link Step} to create.
   * @param exposedWorkflowInputs - The exposed GitHub Workflow inputs of the {@link Step} to create.
   * @param workflowInputs - The GitHub Workflow inputs of the {@link Step} to create.
   */
  private constructor(
    id: string,
    repository: string,
    workflowId: string,
    createdAt: Date,
    lastUpdatedAt: Date | null,
    startedAt: Date | null,
    completedAt: Date | null,
    workflowOutcome: StepStatus,
    exposedWorkflowInputs?: Record<string, string>,
    workflowInputs?: Record<string, string>
  ) {
    if (!id) {
      throw new DomainError('A Step needs an ID!')
    }

    if (!repository) {
      throw new DomainError('A Step needs a repository!')
    }

    if (!workflowId) {
      throw new DomainError('A Step needs a workflow ID!')
    }

    if (!isValidDate(createdAt)) {
      throw new DomainError('A Step needs a valid creation date!')
    }

    if (lastUpdatedAt && !isValidDate(lastUpdatedAt)) {
      throw new DomainError('A Step needs a valid last update date!')
    }

    if (startedAt && !isValidDate(startedAt)) {
      throw new DomainError('A Step needs a valid start date!')
    }

    if (completedAt && !isValidDate(completedAt)) {
      throw new DomainError('A Step needs a valid completion date!')
    }

    if (exposedWorkflowInputs && typeof exposedWorkflowInputs != 'object') {
      throw new DomainError('A Step needs valid exposed workflow inputs!')
    }

    if (workflowInputs && typeof workflowInputs != 'object') {
      throw new DomainError('A Step needs valid workflow inputs!')
    }

    if (!isStepStatus(workflowOutcome)) {
      throw new DomainError('A Step needs a valid outcome!')
    }

    this.id = id
    this.repository = repository
    this.workflowId = workflowId
    this._createdAt = createdAt
    this._lastUpdatedAt = lastUpdatedAt || null
    this.startedAt = startedAt || null
    this.completedAt = completedAt || null
    this.workflowOutcome = workflowOutcome
    this.exposedWorkflowInputs = exposedWorkflowInputs || {}
    this.workflowInputs = workflowInputs || {}
  }

  /**
   * The moment this {@link Step} was created.
   */
  get createdAt(): Date {
    return this._createdAt
  }

  /**
   * The moment this {@link Step} was last updated.
   */
  get lastUpdatedAt(): Date | null {
    return this._lastUpdatedAt
  }
}
