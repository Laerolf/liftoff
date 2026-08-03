import { v7 as uuidv7 } from 'uuid'
import { object, string, date, array, enum as zEnum } from 'zod'

import { ID_MAX_LENGTH } from '@/shared/rules'

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
   * Restores a {@link Phase}.
   * @param id - The ID of the {@link Phase} to create.
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
    status: PhaseStatus,
    execution: PhaseExecution,
    steps: Step[],
    createdAt: Date,
    lastUpdatedAt: Date | null,
    startedAt: Date | null,
    completedAt: Date | null
  ): Phase {
    return new Phase(id, status, execution, steps, createdAt, lastUpdatedAt, startedAt, completedAt)
  }

  /**
   * Creates a new {@link Phase}.
   * @param execution - The execution of the {@link Phase} to create.
   * @throws {DomainError}
   */
  static create(execution: PhaseExecution): Phase {
    return new Phase(uuidv7(), PhaseStatus.Draft, execution, null, new Date(), null, null, null)
  }

  /**
   * Returns the schema for a valid {@link Phase}.
   */
  static get schema() {
    return object({
      id: string().max(ID_MAX_LENGTH),
      status: zEnum(PhaseStatus),
      execution: zEnum(PhaseExecution),
      steps: array(Step.schema).nullable(),
      createdAt: date(),
      lastUpdatedAt: date().nullable(),
      startedAt: date().nullable(),
      completedAt: date().nullable()
    })
  }

  /**
   * Tests whether the provided value is a valid {@link Phase}.
   * @param value - The value to test.
   */
  static isValid(value: unknown): value is Phase {
    const { error, success } = Phase.schema.safeParse(value)

    console.warn('The provided value is not a valid Phase!', error)

    return success
  }

  /**
   * The ID of this {@link Phase}.
   */
  readonly id: string
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
   * Creates a new {@link Phase}.
   * @param id - The ID of the {@link Phase} to create.
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
