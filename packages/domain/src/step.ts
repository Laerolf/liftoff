import { DomainError } from './shared/errors'

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
   * The GitHub Workflow inputs of this {@link Step}.
   */
  readonly workflowInputs: string[]
  /**
   * The GitHub Workflow outcome of this {@link Step}.
   */
  readonly workflowOutcome?: string

  /**
   * Creates a new {@link Step}.
   * @param repository - The GitHub repository of the {@link Step} to create.
   * @param workflowId - The GitHub Workflow ID of the {@link Step} to create.
   * @param workflowInputs - The GitHub Workflow inputs of the {@link Step} to create.
   * @param workflowOutcome - The GitHub Workflow outcome of the {@link Step} to create.
   */
  constructor(
    repository: string,
    workflowId: string,
    workflowInputs?: string[],
    workflowOutcome?: string
  ) {
    if (!repository) {
      throw new DomainError('A Step needs a repository!')
    }

    if (!workflowId) {
      throw new DomainError('A Step needs a workflow ID!')
    }

    if (workflowInputs && !Array.isArray(workflowInputs)) {
      throw new DomainError('A Step needs valid workflow inputs!')
    }

    this.repository = repository
    this.workflowId = workflowId
    this.workflowInputs = workflowInputs || []
    this.workflowOutcome = workflowOutcome
  }
}
