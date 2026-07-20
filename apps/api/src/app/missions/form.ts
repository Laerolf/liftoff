import { object, string, array } from 'zod'

import { PhaseCreationForm } from '../phases/form'

/**
 * Represents a form to create a new {@link Mission} from scratch.
 */
export class MissionFromScratchCreationForm {
  /**
   * Gets the validation schema of a {@link MissionFromScratchCreationForm}.
   */
  static get schema() {
    return object({
      workflowBranch: string(),
      environment: string(),
      services: array(string()),
      director: string(),
      phases: array(PhaseCreationForm.schema)
    })
  }

  readonly workflowBranch: string
  readonly environment: string
  readonly services: string[]
  readonly director: string
  readonly phases: PhaseCreationForm[]

  /**
   * Creates a new {@link MissionFromScratchCreationForm}.
   * @param workflowBranch - The branch name of the workflow that will be run by the {@link Mission} to create.
   * @param environment - The environment that the {@link Mission} to create targets.
   * @param services - The names of what the {@link Mission} to create targets.
   * @param director - The person who executed the {@link Mission} to create.
   * @param phases - The Phase creation forms of the {@link Mission} to create.
   */
  constructor(
    workflowBranch: string,
    environment: string,
    services: string[],
    director: string,
    phases: PhaseCreationForm[]
  ) {
    this.workflowBranch = workflowBranch
    this.environment = environment
    this.services = services
    this.director = director
    this.phases = phases
  }
}
