import { v7 as uuidv7 } from 'uuid'

import { isValidDate } from '@/utils/date'
import { isMissionStatus } from '@/utils/status'

import { DomainError } from '../shared/errors'

import FlightPlan from './flightPlan'
import Phase from './phase'
import { MissionStatus } from './status'

/**
 * Represents a single execution of a {@link FlightPlan}.
 */
export default class Mission {
  /**
   * The ID of this {@link Mission}.
   */
  readonly id: string
  /**
   * The correlation ID of this {@link Mission}, used for idempotency.
   */
  readonly correlationId: string
  /**
   * The ID of the Flight Plan that this {@link Mission} is based on.
   */
  readonly flightPlanId: string | null
  /**
   * The GitHub workflow branch name that this {@link Mission} targets.
   */
  readonly workflowBranch: string
  /**
   * The environmnent that this {@link Mission} targets.
   */
  readonly environment: string
  /**
   * The names of the services that this {@link Mission} targets.
   */
  readonly services: string[]
  /**
   * The person who launched this {@link Mission}.
   */
  readonly director: string
  /**
   *  The status of this {@link Mission}.
   */
  private _status: MissionStatus
  /**
   * The date of this {@link Mission}'s launch.
   */
  readonly launchedAt: Date | null
  /**
   * The phases of this {@link Mission}.
   */
  readonly phases: Phase[]

  /**
   * Creates a new {@link Mission}.
   * @param id - The ID of the {@link Mission} to create.
   * @param correlationId - The correlation ID of the {@link Mission} to create.
   * @param flightPlanId - The ID of the Flight Plan that the {@link Mission} to create is based on.
   * @param workflowBranch - The branch name of the workflow that will be run by the {@link Mission} to create.
   * @param environment - The environment that the {@link Mission} to create targets.
   * @param services - The names of what the {@link Mission} to create targets.
   * @param director - The person who executed the {@link Mission} to create.
   * @param phases - The phases of the {@link Mission} to create.
   * @param status - The status of the {@link Mission} to create.
   * @param launchedAt - The date of the {@link Mission}'s launch to create.
   * @throws {DomainError}
   */
  private constructor(
    id: string,
    correlationId: string,
    flightPlanId: string | null,
    workflowBranch: string,
    environment: string,
    services: string[],
    director: string,
    phases: Phase[],
    status: MissionStatus,
    launchedAt: Date | null
  ) {
    if (!id) {
      throw new DomainError('A Mission needs an ID!')
    }

    if (!correlationId) {
      throw new DomainError('A Mission needs a correlation ID!')
    }

    if (!workflowBranch) {
      throw new DomainError('A Mission needs a target workflow branch name!')
    }

    if (!environment) {
      throw new DomainError('A Mission needs a target environment!')
    }

    if (!services || !Array.isArray(services) || services.length <= 0) {
      throw new DomainError('A Mission needs valid target service IDs!')
    }

    if (!director) {
      throw new DomainError('A Mission needs a director!')
    }

    if (!isMissionStatus(status)) {
      throw new DomainError('A Mission needs a valid status!')
    }

    if (launchedAt && !isValidDate(launchedAt)) {
      throw new DomainError('A Mission needs a valid launch date!')
    }

    if (!phases || !Array.isArray(phases) || phases.length <= 0) {
      throw new DomainError('A Mission needs valid phases!')
    }

    this.id = id
    this.correlationId = correlationId
    this.flightPlanId = flightPlanId
    this.workflowBranch = workflowBranch
    this.environment = environment
    this.services = services
    this.director = director
    this.phases = phases
    this._status = status
    this.launchedAt = launchedAt
  }

  /**
   * Restores a {@link Mission}.
   * @param id - The ID of the {@link Mission} to create.
   * @param correlationId - The correlation ID of the {@link Mission} to create.
   * @param flightPlanId - The ID of the Flight Plan that the {@link Mission} to create is based on.
   * @param workflowBranch - The branch name of the workflow that will be run by the {@link Mission} to create.
   * @param environment - The environment that the {@link Mission} to create targets.
   * @param services - The names of what the {@link Mission} to create targets.
   * @param director - The person who executed the {@link Mission} to create.
   * @param status - The status of the {@link Mission} to create.
   * @param phases - The phases of the {@link Mission} to create.
   * @param launchedAt - The date of the {@link Mission}'s launch to create.
   * @throws {DomainError}
   */
  static restore(
    id: string,
    correlationId: string,
    flightPlanId: string | null,
    workflowBranch: string,
    environment: string,
    services: string[],
    director: string,
    phases: Phase[],
    status: MissionStatus,
    launchedAt: Date | null
  ): Mission {
    return new Mission(
      id,
      correlationId,
      flightPlanId,
      workflowBranch,
      environment,
      services,
      director,
      phases,
      status,
      launchedAt
    )
  }

  /**
   * Creates a new {@link Mission} from scratch.
   * @param workflowBranch - The branch name of the workflow that will be run by the {@link Mission} to create.
   * @param environment - The environment that the {@link Mission} to create targets.
   * @param services - The names of what the {@link Mission} to create targets.
   * @param director - The person who executed the {@link Mission} to create.
   * @param phases - The phases of the {@link Mission} to create.
   * @throws {DomainError}
   */
  static fromScratch(
    workflowBranch: string,
    environment: string,
    services: string[],
    director: string,
    phases: Phase[]
  ): Mission {
    return new Mission(
      uuidv7(),
      uuidv7(),
      null,
      workflowBranch,
      environment,
      services,
      director,
      phases,
      MissionStatus.Launching,
      null
    )
  }

  /**
   * Creates a new {@link Mission} based on a {@link FlightPlan} and a director.
   * @param flightPlan - The base of the {@link Mission} to create.
   * @param director - The director of the {@link Mission} to create.
   * @throws {DomainError}
   */
  static from(flightPlan: FlightPlan, director: string): Mission {
    if (!FlightPlan.isValid(flightPlan)) {
      throw new DomainError('The provided FlightPlan is not valid!')
    }

    if (!director) {
      throw new DomainError('The provided director is not valid!')
    }

    return new Mission(
      uuidv7(),
      uuidv7(),
      flightPlan.id,
      flightPlan.workflowBranch,
      flightPlan.environment,
      flightPlan.services,
      director,
      flightPlan.phases,
      MissionStatus.Launching,
      null
    )
  }

  get status(): MissionStatus {
    return this._status
  }

  /**
   * Launches a {@link Mission}.
   * @throws {DomainError}
   */
  launch(): Mission {
    if (this.status !== MissionStatus.Launching) {
      throw new DomainError('The Mission has already been launched.')
    }

    this._status = MissionStatus.InOrbit

    return this
  }
}
