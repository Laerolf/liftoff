import { ID_MAX_LENGTH } from '@liftoff/domain'
import { object, string, array } from 'zod'

import { PhaseCreationForm } from '../phases/form'
import { exampleValues } from '../shared/openapi'

/**
 * Represents a form to create a new {@link Mission} from scratch.
 */
export class MissionFromScratchCreationForm {
  /**
   * Gets the validation schema of a {@link MissionFromScratchCreationForm}.
   */
  static get schema() {
    return object({
      workflowBranch: string().max(ID_MAX_LENGTH).openapi({
        description: 'The targeted GitHub workflow branch of the Mission to create.',
        example: exampleValues.branchName
      }),
      environment: string().max(ID_MAX_LENGTH).openapi({
        description: 'The targeted GitHub environment of the Mission to create.',
        example: exampleValues.environmentName
      }),
      services: array(string().max(ID_MAX_LENGTH)).openapi({
        description: 'The targeted services of the Mission to create.',
        example: exampleValues.serviceIds
      }),
      director: string().max(ID_MAX_LENGTH).openapi({
        description: 'The name of the director of the Mission to create.',
        example: exampleValues.director.name
      }),
      phases: array(PhaseCreationForm.schema).openapi({
        description: 'The Phases to create for the Flight Plan to create.'
      })
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
