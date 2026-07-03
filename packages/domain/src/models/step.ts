import { v7 as uuidv7 } from 'uuid'

import { DomainElement } from '@/shared/domainElement'
import { isValidDate } from '@/utils/date'
import { isStepStatus } from '@/utils/status'

import { DomainError } from '../shared/errors'

import { StepStatus } from './status'

/**
 * Represents a Step in a Mission Phase, a single workflow dispatch to a specifc GitHub repository.
 */
export class Step implements DomainElement {
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
   * @param completedAt - The date this {@link Step} to create was completed.
   * @param workflowOutcome - The GitHub Workflow outcome of the {@link Step} to create.
   * @param workflowInputs - The GitHub Workflow inputs of the {@link Step} to create.
   */
  private constructor(
    id: string,
    repository: string,
    workflowId: string,
    createdAt: Date,
    lastUpdatedAt: Date | null,
    completedAt: Date | null,
    workflowOutcome: StepStatus,
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

    if (completedAt && !isValidDate(completedAt)) {
      throw new DomainError('A Step needs a valid completion date!')
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
    this.completedAt = completedAt || null
    this.workflowOutcome = workflowOutcome
    this.workflowInputs = workflowInputs || {}
  }

  /**
   * Restores a {@link Step}.
   * @param id - The ID of the {@link Phase} to create.
   * @param repository - The GitHub repository of the {@link Step} to create.
   * @param workflowId - The GitHub Workflow ID of the {@link Step} to create.
   * @param createdAt - The moment the {@link Step} to create was created.
   * @param lastUpdatedAt - The moment the {@link Step} to create was last updated.
   * @param completedAt - The date this {@link Step} to create was completed.
   * @param workflowOutcome - The GitHub Workflow outcome of the {@link Step} to create.
   * @param workflowInputs - The GitHub Workflow inputs of the {@link Step} to create.
   */
  static restore(
    id: string,
    repository: string,
    workflowId: string,
    createdAt: Date,
    lastUpdatedAt: Date | null,
    completedAt: Date | null,
    workflowOutcome: StepStatus,
    workflowInputs?: Record<string, string>
  ): Step {
    return new Step(
      id,
      repository,
      workflowId,
      createdAt,
      lastUpdatedAt,
      completedAt,
      workflowOutcome,
      workflowInputs
    )
  }

  /**
   * Creates a new {@link Step}.
   * @param repository - The GitHub repository of the {@link Step} to create.
   * @param workflowId - The GitHub Workflow ID of the {@link Step} to create.
   * @param workflowInputs - The GitHub Workflow inputs of the {@link Step} to create.
   */
  static create(
    repository: string,
    workflowId: string,
    workflowInputs?: Record<string, string>
  ): Step {
    return new Step(
      uuidv7(),
      repository,
      workflowId,
      new Date(),
      null,
      null,
      StepStatus.Waiting,
      workflowInputs
    )
  }

  /**
   * Tests whether the provided value is a valid {@link Step}.
   * @param value - The value to test.
   */
  static isValid(value: unknown): value is Step {
    if (typeof value !== 'object' || value === null) {
      return false
    }

    const candidate = value as Record<string, unknown>

    return (
      typeof candidate.id === 'string' &&
      typeof candidate.repository === 'string' &&
      typeof candidate.workflowId === 'string' &&
      isValidDate(candidate.createdAt) &&
      (!candidate.lastUpdatedAt || isValidDate(candidate.lastUpdatedAt)) &&
      (!candidate.completedAt || isValidDate(candidate.completedAt)) &&
      isStepStatus(candidate.workflowOutcome) &&
      (typeof candidate.workflowInputs === 'object' || candidate.workflowInputs === null)
    )
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
