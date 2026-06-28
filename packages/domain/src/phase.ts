import { DomainError } from './shared/errors'
import { PhaseStatus } from './status'
import { Step } from './step'

/**
 * Represents the ways a Phase can be executed.
 */
export enum PhaseExecution {
  /**
   * The Phase can be run simultaneously with other Phases.
   */
  Parallel = 'PARALLEL',
  /**
   * The Phase cannot be run simultaneously with other Phases.
   */
  Sequential = 'SEQUENTIAL'
}

/**
 * Represents a stage in a Mission.
 */
export default class Phase {
  /**
   * The status of this {@link Phase}.
   */
  readonly status: PhaseStatus
  /**
   * The execution method of this {@link Phase}.
   */
  readonly execution: PhaseExecution
  /**
   * The steps of this {@link Phase}.
   */
  readonly steps: Step[]

  /**
   * Creates a new {@link Phase}.
   * @param status - The status of the {@link Phase} to create.
   * @param execution - The execution of the {@link Phase} to create.
   * @param steps - The steps of the {@link Phase} to create.
   * @throws {DomainError}
   */
  constructor(status: PhaseStatus, execution: PhaseExecution, steps: Step[]) {
    if (!status) {
      throw new DomainError('A Phase needs a status!')
    }

    if (!execution) {
      throw new DomainError('A Phase needs an execution method!')
    }

    if (!steps || !Array.isArray(steps) || steps.length <= 0) {
      throw new DomainError('A Phase needs valid steps!')
    }

    this.status = status
    this.execution = execution
    this.steps = steps
  }
}
