import { isStepStatus } from '@/utils/status'

import { DomainError } from '../shared/errors'

import { StepStatus } from './status'

/**
 * Represents a Step in a Mission Phase, a single workflow dispatch to a specifc GitHub repository.
 */
export class Step {
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
   * Creates a new {@link Step}.
   * @param repository - The GitHub repository of the {@link Step} to create.
   * @param workflowId - The GitHub Workflow ID of the {@link Step} to create.
   * @param workflowOutcome - The GitHub Workflow outcome of the {@link Step} to create.
   * @param workflowInputs - The GitHub Workflow inputs of the {@link Step} to create.
   */
  constructor(
    repository: string,
    workflowId: string,
    workflowOutcome: StepStatus,
    workflowInputs?: Record<string, string>
  ) {
    if (!repository) {
      throw new DomainError('A Step needs a repository!')
    }

    if (!workflowId) {
      throw new DomainError('A Step needs a workflow ID!')
    }

    if (workflowInputs && typeof workflowInputs != 'object') {
      throw new DomainError('A Step needs valid workflow inputs!')
    }

    if (!isStepStatus(workflowOutcome)) {
      throw new DomainError('A Step needs a valid outcome!')
    }

    this.repository = repository
    this.workflowId = workflowId
    this.workflowOutcome = workflowOutcome
    this.workflowInputs = workflowInputs || {}
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
      typeof candidate.repository === 'string' &&
      typeof candidate.workflowId === 'string' &&
      isStepStatus(candidate.workflowOutcome) &&
      (typeof candidate.workflowInputs === 'object' || candidate.workflowInputs === null)
    )
  }
}
