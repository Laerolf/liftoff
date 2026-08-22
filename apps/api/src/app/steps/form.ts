import { STRING_MAX_LENGTH } from '@liftoff/domain'
import { object, string } from 'zod'

import { exampleValues } from '../shared/openapi'

/**
 * Represents a form to create a new {@link Step}.
 */
export class StepCreationForm {
  /**
   * Gets the validation schema of a {@link StepCreationForm}.
   */
  static get schema() {
    return object({
      repository: string().max(STRING_MAX_LENGTH).openapi({
        description: 'The targeted GitHub repository of the Step to create.',
        example: exampleValues.repositoryName
      }),
      workflowId: string().max(STRING_MAX_LENGTH).openapi({
        description: 'The targeted GitHub workflow ID of the Step to create.',
        example: exampleValues.workflowId
      }),
      exposedWorkflowInputs: object().nullable().optional().openapi({
        description: 'The exposed inputs of the targeted GitHub workflow of the Step to create.',
        example: exampleValues.step.exposedWorkflowInputs
      }),
      workflowInputs: object().nullable().optional().openapi({
        description: 'All inputs of the targeted GitHub workflow of the Step to create.',
        example: exampleValues.step.workflowInputs
      })
    }).openapi('StepCreationForm')
  }

  repository: string
  workflowId: string
  exposedWorkflowInputs: Record<string, string>
  workflowInputs: Record<string, string>

  /**
   * Creates a new {@link StepCreationForm}.
   * @param repository - The GitHub repository name of the {@link Step} to create.
   * @param workflowId - The GitHub Workflow ID of the {@link Step} to create.
   * @param exposedWorkflowInputs - The exposed GitHub Workflow inputs of the {@link Step} to create.
   * @param workflowInputs - The GitHub Workflow inputs of the {@link Step} to create.
   */
  constructor(
    repository: string,
    workflowId: string,
    exposedWorkflowInputs?: Record<string, string>,
    workflowInputs?: Record<string, string>
  ) {
    this.repository = repository
    this.workflowId = workflowId
    this.exposedWorkflowInputs = exposedWorkflowInputs || {}
    this.workflowInputs = workflowInputs || {}
  }
}
