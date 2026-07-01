import { isPhaseStatus } from '@/utils/status'

import { DomainError } from '../shared/errors'

import { PhaseStatus } from './status'
import { Step } from './step'

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
    if (!isPhaseStatus(status)) {
      throw new DomainError('A Phase needs a valid status!')
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

  /**
   * Tests whether the provided value is a valid {@link Phase}.
   * @param value - The value to test.
   */
  static isValid(value: unknown): value is Phase {
    if (typeof value !== 'object' || value === null) {
      return false
    }

    const candidate = value as Record<string, unknown>

    return (
      isPhaseStatus(candidate.status) &&
      isPhaseExecution(candidate.execution) &&
      Array.isArray(candidate.steps) &&
      !!candidate.steps.length &&
      candidate.steps.every(Step.isValid)
    )
  }
}

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

const VALID_PHASE_EXECUTION_METHODS = new Set<unknown>(Object.values(PhaseExecution))

/**
 * Tests whether the provided value is a {@link PhaseExecution}.
 * @param value - The value to test.
 */
export function isPhaseExecution(value: unknown): value is PhaseExecution {
  return VALID_PHASE_EXECUTION_METHODS.has(value)
}
