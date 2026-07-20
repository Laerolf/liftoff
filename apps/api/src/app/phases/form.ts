import { PhaseExecution } from '@liftoff/domain'
import * as z from 'zod'

import { StepCreationForm } from '../steps/form'

/**
 * Represents a form to create a new {@link Phase}.
 */
export class PhaseCreationForm {
  /**
   * Gets the validation schema of a {@link PhaseCreationForm}.
   */
  static get schema() {
    return z.object({
      execution: z.enum(PhaseExecution),
      steps: z.array(StepCreationForm.schema)
    })
  }

  execution: PhaseExecution
  steps: StepCreationForm[]

  /**
   * Creates a new {@link PhaseCreationForm}.
   * @param execution - The execution method of the {@link Phase} to create.
   * @param steps - The Step creation forms of the {@link Phase} to create.
   */
  constructor(missionId: string, execution: PhaseExecution, steps: StepCreationForm[]) {
    this.execution = execution
    this.steps = steps
  }
}
