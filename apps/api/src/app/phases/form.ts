import { PhaseExecution } from '@liftoff/domain'
import { object, enum as zEnum, array } from 'zod'

import { exampleValues } from '../shared/openapi'
import { StepCreationForm } from '../steps/form'

/**
 * Represents a form to create a new {@link Phase}.
 */
export class PhaseCreationForm {
  /**
   * Gets the validation schema of a {@link PhaseCreationForm}.
   */
  static get schema() {
    return object({
      execution: zEnum(PhaseExecution).openapi({
        description: 'The execution method of the Phase to create.',
        example: exampleValues.phase.executionMethod
      }),
      steps: array(StepCreationForm.schema).openapi({
        description: 'The Steps to create for the Phase to create.'
      })
    })
  }

  execution: PhaseExecution
  steps: StepCreationForm[]

  /**
   * Creates a new {@link PhaseCreationForm}.
   * @param execution - The execution method of the {@link Phase} to create.
   * @param steps - The Step creation forms of the {@link Phase} to create.
   */
  constructor(execution: PhaseExecution, steps: StepCreationForm[]) {
    this.execution = execution
    this.steps = steps
  }
}
