import { DomainError, isValidDate, Mission } from '@liftoff/domain'

import { PhaseDto } from '../phases/dto'

/**
 * Represents a Mission DTO.
 */
export class MissionDto {
  /**
   * The ID of this Mission.
   */
  readonly id: string
  /**
   * The correlation ID of this Mission, used for idempotency.
   */
  readonly correlationId: string
  /**
   * The ID of the Flight Plan that this Mission is based on.
   */
  readonly flightPlanId: string | null
  /**
   * The GitHub workflow branch name that this Mission's targets.
   */
  readonly workflowBranch: string
  /**
   * The environmnent that this Mission targets.
   */
  readonly environment: string
  /**
   * The names of the services that this Mission targets.
   */
  readonly services: string[]
  /**
   * The person who launched this Mission.
   */
  readonly director: string
  /**
   *  The status of this Mission.
   */
  readonly status: string
  /**
   * The date of this Mission's launch.
   */
  readonly launchedAt: Date | null
  /**
   * The phases of this Mission.
   */
  readonly phases: PhaseDto[] | null
  /**
   * The moment this Mission was created.
   */
  readonly createdAt: Date
  /**
   * The moment this Mission was last updated.
   */
  readonly lastUpdatedAt: Date | null
  /**
   * The date this Mission was completed.
   */
  readonly completedAt: Date | null

  /**
   * Creates a new {@link MissionDto}.
   * @param model - The Mission to create this {@link MissionDto} with.
   * @throws {DomainError}
   */
  static from(model: Mission): MissionDto {
    try {
      if (!Mission.isValid(model)) {
        throw new DomainError('The provided Mission is not valid!')
      }

      return new MissionDto(
        model.id,
        model.correlationId,
        model.flightPlanId,
        model.createdAt,
        model.lastUpdatedAt,
        model.workflowBranch,
        model.environment,
        model.services,
        model.director,
        model.phases ? model.phases.map(PhaseDto.from) : null,
        model.status,
        model.launchedAt,
        model.completedAt
      )
    } catch (error) {
      throw new DomainError('Failed to create a Mission DTO!', {
        cause: error
      })
    }
  }

  /**
   * Creates a new Mission DTO.
   * @param id - The ID of the Mission to create.
   * @param correlationId - The correlation ID of the Mission to create.
   * @param flightPlanId - The ID of the Flight Plan that the Mission to create is based on.
   * @param createdAt - The moment the Mission to create was created.
   * @param lastUpdatedAt - The moment the Mission to create was last updated.
   * @param workflowBranch - The branch name of the workflow that will be run by the Mission to create.
   * @param environment - The environment that the Mission to create targets.
   * @param services - The names of what the Mission to create targets.
   * @param director - The person who executed the Mission to create.
   * @param phases - The phases of the Mission to create.
   * @param status - The status of the Mission to create.
   * @param launchedAt - The date of the Mission's launch to create.
   * @param completedAt - The date this Mission to create was completed.
   * @throws {DomainError}
   */
  private constructor(
    id: string,
    correlationId: string,
    flightPlanId: string | null,
    createdAt: Date,
    lastUpdatedAt: Date | null,
    workflowBranch: string,
    environment: string,
    services: string[],
    director: string,
    phases: PhaseDto[] | null,
    status: string,
    launchedAt: Date | null,
    completedAt: Date | null
  ) {
    this.id = id
    this.correlationId = correlationId
    this.flightPlanId = flightPlanId
    this.createdAt = createdAt
    this.lastUpdatedAt = lastUpdatedAt || null
    this.workflowBranch = workflowBranch
    this.environment = environment
    this.services = services
    this.director = director
    this.phases = phases
    this.status = status
    this.launchedAt = launchedAt || null
    this.completedAt = completedAt || null
  }
}
