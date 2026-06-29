import Phase from './phase'
import { DomainError } from './shared/errors'
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
  readonly status: MissionStatus
  /**
   * The date of this {@link Mission}'s launch.
   */
  readonly launchedAt: Date
  /**
   * The phases of this {@link Mission}.
   */
  readonly phases: Phase[]

  /**
   * Creates a new {@link Mission}.
   * @param id - The ID of the {@link Mission} to create.
   * @param correlationId - The correlation ID of the {@link Mission} to create.
   * @param workflowBranch - The branch name of the workflow that will be run by the {@link Mission} to create.
   * @param environment - The environment that the {@link Mission} to create targets.
   * @param services - The names of what the {@link Mission} to create targets.
   * @param director - The person who executed the {@link Mission} to create.
   * @param status - The status of the {@link Mission} to create.
   * @param launchedAt - The date of the {@link Mission}'s launch to create.
   * @param phases - The phases of the {@link Mission} to create.
   * @throws {DomainError}
   */
  constructor(
    id: string,
    correlationId: string,
    workflowBranch: string,
    environment: string,
    services: string[],
    director: string,
    status: MissionStatus,
    launchedAt: Date,
    phases: Phase[]
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

    if (!status) {
      throw new DomainError('A Mission needs a status!')
    }

    if (!launchedAt) {
      throw new DomainError('A Mission needs a valid launch date!')
    }

    if (!phases || !Array.isArray(phases) || phases.length <= 0) {
      throw new DomainError('A Mission requires valid phases!')
    }

    this.id = id
    this.correlationId = correlationId
    this.workflowBranch = workflowBranch
    this.environment = environment
    this.services = services
    this.director = director
    this.status = status
    this.launchedAt = launchedAt
    this.phases = phases
  }
}
