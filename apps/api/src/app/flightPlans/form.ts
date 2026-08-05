import { ID_MAX_LENGTH } from '@liftoff/domain'
import { object, string, array } from 'zod'

import { PhaseCreationForm } from '../phases/form'
import { exampleValues } from '../shared/openapi'

/**
 * Represents a form to create a new {@link FlightPlan}.
 */
export class FlightPlanCreationForm {
  /**
   * Gets the validation schema of a {@link MissionFromScratchCreationForm}.
   */
  static get schema() {
    return object({
      name: string()
        .max(ID_MAX_LENGTH)
        .openapi({
          description: 'The name of the Flight Plan to create.',
          example: exampleValues.flightPlan.name
        }),
      workflowBranch: string()
        .max(ID_MAX_LENGTH)
        .openapi({
          description: 'The GitHub workflow branch of the Flight Plan to create.',
          example: exampleValues.branchName
        }),
      environment: string()
        .max(ID_MAX_LENGTH)
        .openapi({
          description: 'The targeted GitHub environment of the Flight Plan to create.',
          example: exampleValues.environmentName
        }),
      services: array(string().max(ID_MAX_LENGTH)).openapi({
        description: 'The targeted services of the Flight Plan to create.',
        example: exampleValues.serviceIds
      }),
      phases: array(PhaseCreationForm.schema).openapi({
        description: 'The Phases to create for the Flight Plan to create.'
      })
    })
  }

  readonly name: string
  readonly workflowBranch: string
  readonly environment: string
  readonly services: string[]
  readonly phases: PhaseCreationForm[]

  /***
   * Creates a new {@link FlightPlanCreationForm}.
   * @param name - The name of the {@link FlightPlan} to create.
   * @param workflowBranch - The branch name of the workflow that will be run by the {@link FlightPlan} to create.
   * @param environment - The environment that the {@link FlightPlan} to create targets.
   * @param services - The services that the {@link FlightPlan} to create targets.
   * @param phases - The Phase creation forms of the {@link FlightPlan} to create.
   */
  constructor(
    name: string,
    workflowBranch: string,
    environment: string,
    services: string[],
    phases: PhaseCreationForm[]
  ) {
    this.name = name
    this.workflowBranch = workflowBranch
    this.environment = environment
    this.services = services
    this.phases = phases
  }
}
