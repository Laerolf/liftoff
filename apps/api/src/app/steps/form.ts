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
      workflowInputs: object().optional()
    })
  }

  repository: string
  workflowId: string
  workflowInputs: Record<string, string>

  /**
   * Creates a new {@link StepCreationForm}.
   * @param repository - The GitHub repository name of the {@link Step} to create.
   * @param workflowId - The GitHub Workflow ID of the {@link Step} to create.
   * @param workflowInputs - The provided GitHub Workflow inputs of the {@link Step} to create.
   */
  constructor(repository: string, workflowId: string, workflowInputs?: Record<string, string>) {
    this.repository = repository
    this.workflowId = workflowId
    this.workflowInputs = workflowInputs || {}
  }
}
