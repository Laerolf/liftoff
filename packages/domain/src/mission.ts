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
   * @param director - The person who executed the {@link Mission} to create.
   * @param status - The status of the {@link Mission} to create.
   * @param launchedAt - The date of the {@link Mission}'s launch to create.
   * @param phases - The phases of the {@link Mission} to create.
   * @throws {DomainError}
   */
  constructor(
    id: string,
    director: string,
    status: MissionStatus,
    launchedAt: Date,
    phases: Phase[]
  ) {
    if (!id) {
      throw new DomainError('A Mission needs an ID!')
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
    this.director = director
    this.status = status
    this.launchedAt = launchedAt
    this.phases = phases
  }
}
