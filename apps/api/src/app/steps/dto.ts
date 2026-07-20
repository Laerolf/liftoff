import { DomainError, Step } from '@liftoff/domain'

/**
 * Represents a Step DTO.
 */
export class StepDto {
  /**
   * The ID of this Step.
   */
  readonly id: string
  /**
   * The ID of the Phase that this Step belongs to.
   */
  readonly phaseId: string
  /**
   * The GitHub repository of this Step.
   */
  readonly repository: string
  /**
   * The GitHub Workflow ID of this Step.
   */
  readonly workflowId: string
  /**
   * The GitHub Workflow outcome of this Step.
   */
  readonly workflowOutcome: string
  /**
   * The GitHub Workflow inputs of this Step.
   */
  readonly workflowInputs: Record<string, string>
  /**
   * The moment this Step was created.
   */
  readonly createdAt: Date
  /**
   * The moment this Step was last updated.
   */
  readonly lastUpdatedAt: Date | null
  /**
   * The date this Step was started.
   */
  readonly startedAt: Date | null
  /**
   * The date this Step was completed.
   */
  readonly completedAt: Date | null

  /**
   * Creates a new {@link StepDto}.
   * @param model - The Step to create this {@link StepDto} with.
   * @throws {DomainError}
   */
  static from(model: Step): StepDto {
    try {
      if (!Step.isValid(model)) {
        throw new DomainError('The provided Step is not valid!')
      }

      return new StepDto(
        model.id,
        model.phaseId,
        model.repository,
        model.workflowId,
        model.createdAt,
        model.lastUpdatedAt,
        model.startedAt,
        model.completedAt,
        model.workflowOutcome,
        model.workflowInputs
      )
    } catch (error) {
      throw new DomainError('Failed to create a Step DTO!', {
        cause: error
      })
    }
  }

  /**
   * Creates a new Step DTO.
   * @param id - The ID of the Step to create.
   * @param phaseId - The ID of the Phase that the Step to create belongs to.
   * @param repository - The GitHub repository of the Step to create.
   * @param workflowId - The GitHub Workflow ID of the Step to create.
   * @param createdAt - The moment the Step to create was created.
   * @param lastUpdatedAt - The moment the Step to create was last updated.
   * @param startedAt - The date this Step to create was started.
   * @param completedAt - The date this Step to create was completed.
   * @param workflowOutcome - The GitHub Workflow outcome of the Step to create.
   * @param workflowInputs - The GitHub Workflow inputs of the Step to create.
   */
  private constructor(
    id: string,
    phaseId: string,
    repository: string,
    workflowId: string,
    createdAt: Date,
    lastUpdatedAt: Date | null,
    startedAt: Date | null,
    completedAt: Date | null,
    workflowOutcome: string,
    workflowInputs: Record<string, string>
  ) {
    this.id = id
    this.phaseId = phaseId
    this.repository = repository
    this.workflowId = workflowId
    this.createdAt = createdAt
    this.lastUpdatedAt = lastUpdatedAt || null
    this.startedAt = startedAt || null
    this.completedAt = completedAt || null
    this.workflowOutcome = workflowOutcome
    this.workflowInputs = workflowInputs
  }
}
