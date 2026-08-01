import { object, string } from 'zod'

/**
 * Represents a form to create a new {@link Step}.
 */
export class StepCreationForm {
  /**
   * Gets the validation schema of a {@link StepCreationForm}.
   */
  static get schema() {
    return object({
      repository: string(),
      workflowId: string(),
      exposedWorkflowInputs: object().optional(),
      workflowInputs: object().optional()
    })
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
