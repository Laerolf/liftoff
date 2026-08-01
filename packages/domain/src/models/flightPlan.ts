import { v7 as uuidv7 } from 'uuid'

import { DomainElement } from '../shared/domainElement'
import { DomainError } from '../shared/errors'
import { isValidDate } from '../utils/date'

import { Phase } from './phase'

/**
 * Represents a plan for {@link Mission}.
 */
export class FlightPlan implements DomainElement {
  /**
   * The ID of this {@link FlightPlan}.
   */
  readonly id: string
  /**
   * The name of this {@link FlightPlan}.
   */
  readonly name: string
  /**
   * The GitHub workflow branch name that this {@link FlightPlan} targets.
   */
  readonly workflowBranch: string
  /**
   * The environmnent that this {@link FlightPlan} targets.
   */
  readonly environment: string
  /**
   * The names of the services that this {@link FlightPlan} targets.
   */
  readonly services: string[]
  /**
   * The phases of this {@link FlightPlan}.
   */
  private _phases: Phase[] | null
  /**
   * The moment this {@link FlightPlan} was created.
   */
  private _createdAt: Date
  /**
   * The moment this {@link FlightPlan} was last updated.
   */
  private _lastUpdatedAt: Date | null

  /**
   * Restores a {@link FlightPlan}.
   * @param id - The ID of the {@link FlightPlan} to create.
   * @param name - The name of the {@link FlightPlan} to create.
   * @param createdAt - The moment the {@link FlightPlan} to create was created.
   * @param lastUpdatedAt - The moment the {@link FlightPlan} to create was last updated.
   * @param workflowBranch - The branch name of the workflow that will be run by the {@link FlightPlan} to create.
   * @param environment - The environment that the {@link FlightPlan} to create targets.
   * @param services - The names of what the {@link FlightPlan} to create targets.
   * @param phases - The phases of the {@link FlightPlan} to create.
   * @throws {DomainError}
   */
  static restore(
    id: string,
    name: string,
    createdAt: Date,
    lastUpdatedAt: Date | null,
    workflowBranch: string,
    environment: string,
    services: string[],
    phases: Phase[] | null
  ): FlightPlan {
    return new FlightPlan(
      id,
      name,
      createdAt,
      lastUpdatedAt,
      workflowBranch,
      environment,
      services,
      phases
    )
  }

  /**
   * Creates a new {@link FlightPlan}.
   * @param name - The name of the {@link FlightPlan} to create.
   * @param workflowBranch - The branch name of the workflow that will be run by the {@link FlightPlan} to create.
   * @param environment - The environment that the {@link FlightPlan} to create targets.
   * @param services - The names of what the {@link FlightPlan} to create targets.
   * @throws {DomainError}
   */
  static create(
    name: string,
    workflowBranch: string,
    environment: string,
    services: string[]
  ): FlightPlan {
    return new FlightPlan(
      uuidv7(),
      name,
      new Date(),
      null,
      workflowBranch,
      environment,
      services,
      null
    )
  }

  /**
   * Tests whether the provided value is a valid {@link FlightPlan}.
   * @param value - The value to test.
   */
  static isValid(value: unknown): value is FlightPlan {
    if (typeof value !== 'object' || value === null) {
      return false
    }

    const candidate = value as Record<string, unknown>

    return (
      typeof candidate.id === 'string' &&
      typeof candidate.name === 'string' &&
      isValidDate(candidate.createdAt) &&
      (!candidate.lastUpdatedAt || isValidDate(candidate.lastUpdatedAt)) &&
      typeof candidate.workflowBranch === 'string' &&
      typeof candidate.environment === 'string' &&
      Array.isArray(candidate.services) &&
      candidate.services.every((service) => typeof service === 'string') &&
      (!candidate.phases ||
        (Array.isArray(candidate.phases) && candidate.phases.every(Phase.isValid)))
    )
  }

  /**
   * Creates a new {@link FlightPlan}.
   * @param id - The ID of the {@link FlightPlan} to create.
   * @param name - The name of the {@link FlightPlan} to create.
   * @param createdAt - The moment the {@link FlightPlan} to create was created.
   * @param lastUpdatedAt - The moment the {@link FlightPlan} to create was last updated.
   * @param workflowBranch - The branch name of the workflow that will be run by the {@link FlightPlan} to create.
   * @param environment - The environment that the {@link FlightPlan} to create targets.
   * @param services - The names of what the {@link FlightPlan} to create targets.
   * @param phases - The phases of the {@link FlightPlan} to create.
   * @throws {DomainError}
   */
  private constructor(
    id: string,
    name: string,
    createdAt: Date,
    lastUpdatedAt: Date | null,
    workflowBranch: string,
    environment: string,
    services: string[],
    phases: Phase[] | null
  ) {
    if (!id) {
      throw new DomainError('A Flight Plan needs an ID!')
    }

    if (!name) {
      throw new DomainError('A Flight Plan needs a name!')
    }

    if (!isValidDate(createdAt)) {
      throw new DomainError('A Flight Plan needs a valid creation date!')
    }

    if (lastUpdatedAt && !isValidDate(lastUpdatedAt)) {
      throw new DomainError('A Flight Plan needs a valid last update date!')
    }

    if (!workflowBranch) {
      throw new DomainError('A Flight Plan needs a target workflow branch name!')
    }

    if (!environment) {
      throw new DomainError('A Flight Plan needs a target environment!')
    }

    if (!services || !Array.isArray(services) || services.length <= 0) {
      throw new DomainError('A Flight Plan needs valid target service IDs!')
    }

    this.id = id
    this.name = name
    this._createdAt = createdAt
    this._lastUpdatedAt = lastUpdatedAt || null
    this.workflowBranch = workflowBranch
    this.environment = environment
    this.services = services
    this._phases = phases
  }

  /**
   * Prepares the {@link FlightPlan} for usage.
   * @param phases - The Phases to prepare this {@link FlightPlan} with.
   * @throws {DomainError}
   */
  prepare(phases: Phase[]): FlightPlan {
    try {
      if (!phases || !phases.some(Phase.isValid)) {
        throw new DomainError('The provided Flight Plan Phases are invalid!')
      }

      this._phases = phases
      this._lastUpdatedAt = new Date()

      return this
    } catch (error) {
      throw new DomainError('Failed to prepare a Flight Plan!', { cause: error })
    }
  }

  /***
   * The {@link Phase[] | Phases} of this {@link FlightPlan}.
   */
  get phases(): Phase[] | null {
    return this._phases
  }

  /**
   * The moment this {@link FlightPlan} was created.
   */
  get createdAt(): Date {
    return this._createdAt
  }

  /**
   * The moment this {@link FlightPlan} was last updated.
   */
  get lastUpdatedAt(): Date | null {
    return this._lastUpdatedAt
  }
}
