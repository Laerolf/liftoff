import { v7 as uuidv7 } from 'uuid'

import { DomainElement } from '@/shared/domainElement'
import { isValidDate } from '@/utils/date'
import { isPhaseStatus } from '@/utils/status'

import { DomainError } from '../shared/errors'

import { PhaseStatus } from './status'
import { Step } from './step'

/**
 * Represents a stage in a Mission.
 */
export default class Phase implements DomainElement {
  /**
   * The ID of this {@link Phase}.
   */
  readonly id: string
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
   * The moment this {@link Phase} was created.
   */
  private _createdAt: Date
  /**
   * The moment this {@link Phase} was last updated.
   */
  private _lastUpdatedAt: Date | null

  /**
   * Creates a new {@link Phase}.
   * @param id - The ID of the {@link Phase} to create.
   * @param status - The status of the {@link Phase} to create.
   * @param execution - The execution of the {@link Phase} to create.
   * @param steps - The steps of the {@link Phase} to create.
   * @param createdAt - The moment the {@link Phase} to create was created.
   * @param lastUpdatedAt - The moment the {@link Phase} to create was last updated.
   * @throws {DomainError}
   */
  private constructor(
    id: string,
    status: PhaseStatus,
    execution: PhaseExecution,
    steps: Step[],
    createdAt: Date,
    lastUpdatedAt: Date | null
  ) {
    if (!id) {
      throw new DomainError('A Phase needs an ID!')
    }

    if (!isPhaseStatus(status)) {
      throw new DomainError('A Phase needs a valid status!')
    }

    if (!isPhaseExecution(execution)) {
      throw new DomainError('A Phase needs an execution method!')
    }

    if (!steps || !Array.isArray(steps) || steps.length <= 0) {
      throw new DomainError('A Phase needs valid steps!')
    }

    if (!isValidDate(createdAt)) {
      throw new DomainError('A Phase needs a valid creation date!')
    }

    if (lastUpdatedAt && !isValidDate(lastUpdatedAt)) {
      throw new DomainError('A Phase needs a valid last update date!')
    }

    this.id = id
    this.status = status
    this.execution = execution
    this.steps = steps
    this._createdAt = createdAt
    this._lastUpdatedAt = lastUpdatedAt
  }

  /**
   * Restores a {@link Phase}.
   * @param id - The ID of the {@link Phase} to create.
   * @param status - The status of the {@link Phase} to create.
   * @param execution - The execution of the {@link Phase} to create.
   * @param steps - The steps of the {@link Phase} to create.
   * @param createdAt - The moment the {@link Phase} to create was created.
   * @param lastUpdatedAt - The moment the {@link Phase} to create was last updated.
   * @throws {DomainError}
   */
  static restore(
    id: string,
    status: PhaseStatus,
    execution: PhaseExecution,
    steps: Step[],
    createdAt: Date,
    lastUpdatedAt: Date | null
  ): Phase {
    return new Phase(id, status, execution, steps, createdAt, lastUpdatedAt)
  }

  /**
   * Creates a new {@link Phase}.
   * @param execution - The execution of the {@link Phase} to create.
   * @param steps - The steps of the {@link Phase} to create.
   * @throws {DomainError}
   */
  static create(execution: PhaseExecution, steps: Step[]): Phase {
    return new Phase(uuidv7(), PhaseStatus.Waiting, execution, steps, new Date(), null)
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
      typeof candidate.id === 'string' &&
      isPhaseStatus(candidate.status) &&
      isPhaseExecution(candidate.execution) &&
      Array.isArray(candidate.steps) &&
      !!candidate.steps.length &&
      candidate.steps.every(Step.isValid) &&
      isValidDate(candidate.createdAt) &&
      (!candidate.lastUpdatedAt || isValidDate(candidate.lastUpdatedAt))
    )
  }

  /**
   * The moment this {@link Phase} was created.
   */
  get createdAt(): Date {
    return this._createdAt
  }

  /**
   * The moment this {@link Phase} was last updated.
   */
  get lastUpdatedAt(): Date | null {
    return this._lastUpdatedAt
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
