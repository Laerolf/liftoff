import { DomainError, ID_MAX_LENGTH, Step, StepStatus, STRING_MAX_LENGTH } from '@liftoff/domain'
import { date, object, string, enum as zEnum } from 'zod'

import { exampleValues } from '../shared/openapi'

/**
 * Represents a Step DTO.
 */
export class StepDto {
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
        model.repository,
        model.workflowId,
        model.createdAt,
        model.lastUpdatedAt,
        model.startedAt,
        model.completedAt,
        model.workflowOutcome,
        model.exposedWorkflowInputs,
        model.workflowInputs
      )
    } catch (error) {
      throw new DomainError('Failed to create a Step DTO!', {
        cause: error
      })
    }
  }

  /**
   * Returns the schema for a valid {@link StepDto}.
   */
  static get schema() {
    return object({
      id: string()
        .max(ID_MAX_LENGTH)
        .openapi({ description: 'The ID of the Step.', example: exampleValues.id }),
      repository: string()
        .max(STRING_MAX_LENGTH)
        .openapi({
          description: 'The targeted GitHub repository of the Step.',
          example: exampleValues.repositoryName
        }),
      workflowId: string()
        .max(STRING_MAX_LENGTH)
        .openapi({
          description: 'The targeted GitHub workflow of the Step.',
          example: exampleValues.workflowId
        }),
      workflowOutcome: zEnum(StepStatus).openapi({
        description: 'The GitHub workflow outcome of the Step.',
        example: exampleValues.step.workflowOutcome
      }),
      exposedWorkflowInputs: object()
        .nullable()
        .openapi({
          description: 'The exposed GitHub workflow inputs of the Step.',
          example: exampleValues.step.exposedWorkflowInputs
        }),
      workflowInputs: object()
        .nullable()
        .openapi({
          description: 'All GitHub workflow inputs of the Step.',
          example: exampleValues.step.workflowInputs
        }),
      createdAt: date().openapi({
        description: 'The creation date of the Step.',
        example: exampleValues.date
      }),
      lastUpdatedAt: date()
        .nullable()
        .openapi({ description: 'The date of the last update of the Step.', example: null }),
      startedAt: date()
        .nullable()
        .openapi({ description: 'The state date of the Step.', example: null }),
      completedAt: date()
        .nullable()
        .openapi({ description: 'The completion date of the Step.', example: null })
    })
  }

  /**
   * The ID of this Step.
   */
  readonly id: string
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
  readonly workflowOutcome: StepStatus
  /**
   * The exposed GitHub Workflow inputs of this Step.
   */
  readonly exposedWorkflowInputs: Record<string, string>
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
   * Creates a new Step DTO.
   * @param id - The ID of the Step to create.
   * @param repository - The GitHub repository of the Step to create.
   * @param workflowId - The GitHub Workflow ID of the Step to create.
   * @param createdAt - The moment the Step to create was created.
   * @param lastUpdatedAt - The moment the Step to create was last updated.
   * @param startedAt - The date this Step to create was started.
   * @param completedAt - The date this Step to create was completed.
   * @param workflowOutcome - The GitHub Workflow outcome of the Step to create.
   * @param exposedWorkflowInputs - The exposed GitHub Workflow inputs of the Step to create.
   * @param workflowInputs - The GitHub Workflow inputs of the Step to create.
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
    exposedWorkflowInputs: Record<string, string>,
    workflowInputs: Record<string, string>
  ) {
    this.id = id
    this.repository = repository
    this.workflowId = workflowId
    this.createdAt = createdAt
    this.lastUpdatedAt = lastUpdatedAt || null
    this.startedAt = startedAt || null
    this.completedAt = completedAt || null
    this.workflowOutcome = workflowOutcome
    this.exposedWorkflowInputs = exposedWorkflowInputs
    this.workflowInputs = workflowInputs
  }
}
