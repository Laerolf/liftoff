import { v7 as uuidv7 } from 'uuid'

import { DomainElement } from '../shared/domainElement'
import { DomainError } from '../shared/errors'
import { isValidDate } from '../utils/date'
import { isPhaseStatus } from '../utils/status'

import { PhaseStatus } from './status'
import { Step } from './step'

/**
 * Represents a stage in a Mission.
 */
export class Phase implements DomainElement {
  /**
   * The ID of this {@link Phase}.
   */
  readonly id: string
  /**
   * The ID of the Mission that this {@link Phase} belongs to.
   */
  readonly missionId: string
  /**
   * The status of this {@link Phase}.
   */
  private _status: PhaseStatus
  /**
   * The execution method of this {@link Phase}.
   */
  readonly execution: PhaseExecution
  /**
   * The steps of this {@link Phase}.
   */
  private _steps: Step[] | null
  /**
   * The moment this {@link Phase} was created.
   */
  private _createdAt: Date
  /**
   * The moment this {@link Phase} was last updated.
   */
  private _lastUpdatedAt: Date | null
  /**
   * The date this {@link Phase} was started.
   */
  readonly startedAt: Date | null
  /**
   * The date this {@link Phase} was completed.
   */
  readonly completedAt: Date | null

  /**
   * Restores a {@link Phase}.
   * @param id - The ID of the {@link Phase} to create.
   * @param missionId - The Mission ID that the {@link Phase} to create belongs to.
   * @param status - The status of the {@link Phase} to create.
   * @param execution - The execution of the {@link Phase} to create.
   * @param steps - The steps of the {@link Phase} to create.
   * @param createdAt - The moment the {@link Phase} to create was created.
   * @param lastUpdatedAt - The moment the {@link Phase} to create was last updated.
   * @param startedAt - The date this {@link Phase} to create was started.
   * @param completedAt - The date this {@link Phase} to create was completed.
   * @throws {DomainError}
   */
  static restore(
    id: string,
    missionId: string,
    status: PhaseStatus,
    execution: PhaseExecution,
    steps: Step[],
    createdAt: Date,
    lastUpdatedAt: Date | null,
    startedAt: Date | null,
    completedAt: Date | null
  ): Phase {
    return new Phase(
      id,
      missionId,
      status,
      execution,
      steps,
      createdAt,
      lastUpdatedAt,
      startedAt,
      completedAt
    )
  }

  /**
   * Creates a new {@link Phase}.
   * @param missionId - The Mission ID that the {@link Phase} to create belongs to.
   * @param execution - The execution of the {@link Phase} to create.
   * @throws {DomainError}
   */
  static create(missionId: string, execution: PhaseExecution): Phase {
    return new Phase(
      uuidv7(),
      missionId,
      PhaseStatus.Draft,
      execution,
      null,
      new Date(),
      null,
      null,
      null
    )
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
      typeof candidate.missionId === 'string' &&
      isPhaseStatus(candidate.status) &&
      isPhaseExecution(candidate.execution) &&
      (!candidate.steps ||
        (Array.isArray(candidate.steps) && candidate.steps.every(Step.isValid))) &&
      isValidDate(candidate.createdAt) &&
      (!candidate.lastUpdatedAt || isValidDate(candidate.lastUpdatedAt)) &&
      (!candidate.startedAt || isValidDate(candidate.startedAt)) &&
      (!candidate.completedAt || isValidDate(candidate.completedAt))
    )
  }

  /**
   * Creates a new {@link Phase}.
   * @param id - The ID of the {@link Phase} to create.
   * @param missionId - The Mission ID that the {@link Phase} to create belongs to.
   * @param status - The status of the {@link Phase} to create.
   * @param execution - The execution of the {@link Phase} to create.
   * @param steps - The steps of the {@link Phase} to create.
   * @param createdAt - The moment the {@link Phase} to create was created.
   * @param lastUpdatedAt - The moment the {@link Phase} to create was last updated.
   * @param startedAt - The date this {@link Phase} to create was started.
   * @param completedAt - The date this {@link Phase} to create was completed.
   * @throws {DomainError}
   */
  private constructor(
    id: string,
    missionId: string,
    status: PhaseStatus,
    execution: PhaseExecution,
    steps: Step[] | null,
    createdAt: Date,
    lastUpdatedAt: Date | null,
    startedAt: Date | null,
    completedAt: Date | null
  ) {
    if (!id) {
      throw new DomainError('A Phase needs an ID!')
    }

    if (!missionId) {
      throw new DomainError('A Phase needs a Mission ID!')
    }

    if (!isPhaseStatus(status)) {
      throw new DomainError('A Phase needs a valid status!')
    }

    if (!isPhaseExecution(execution)) {
      throw new DomainError('A Phase needs an execution method!')
    }

    if (!isValidDate(createdAt)) {
      throw new DomainError('A Phase needs a valid creation date!')
    }

    if (lastUpdatedAt && !isValidDate(lastUpdatedAt)) {
      throw new DomainError('A Phase needs a valid last update date!')
    }

    if (startedAt && !isValidDate(startedAt)) {
      throw new DomainError('A Phase needs a valid start date!')
    }

    if (completedAt && !isValidDate(completedAt)) {
      throw new DomainError('A Phase needs a valid completion date!')
    }

    this.id = id
    this.missionId = missionId
    this._status = status
    this.execution = execution
    this._steps = steps
    this._createdAt = createdAt
    this._lastUpdatedAt = lastUpdatedAt
    this.startedAt = startedAt
    this.completedAt = completedAt
  }

  /**
   *  The status of this {@link Phase}.
   */
  get status(): PhaseStatus {
    return this._status
  }

  /**
   *  The {@link Step[] | Steps} of this {@link Phase}.
   */
  get steps(): Step[] | null {
    return this._steps
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

  /**
   * Prepares a {@link Phase} to launch.
   * @param steps - The {@link Step[] | Phases} of this {@link Phase}.
   */
  prepare(steps: Step[]): Phase {
    if (this.status !== PhaseStatus.Draft) {
      throw new DomainError('The Phase has already been prepared.')
    }

    if (!steps || !Array.isArray(steps) || steps.length <= 0 || !steps.some(Step.isValid)) {
      throw new DomainError('The Phase needs valid Steps to be prepared to launch.')
    }

    this._steps = steps
    this._status = PhaseStatus.Waiting
    this._lastUpdatedAt = new Date()

    return this
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
