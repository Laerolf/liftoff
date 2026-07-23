import { DomainError, Phase } from '@liftoff/domain'

import { StepDto } from '../steps/dto'

/**
 * Represents a Phase DTO.
 */
export class PhaseDto {
  /**
   * The ID of this Phase.
   */
  readonly id: string
  /**
   * The ID of the Mission that this Phase belongs to.
   */
  readonly missionId: string
  /**
   * The status of this Phase.
   */
  readonly status: string
  /**
   * The execution method of this Phase.
   */
  readonly execution: string
  /**
   * The steps of this Phase.
   */
  readonly steps: StepDto[] | null
  /**
   * The moment this Phase was created.
   */
  readonly createdAt: Date
  /**
   * The moment this Phase was last updated.
   */
  readonly lastUpdatedAt: Date | null
  /**
   * The date this Phase was started.
   */
  readonly startedAt: Date | null
  /**
   * The date this Phase was completed.
   */
  readonly completedAt: Date | null

  /**
   * Creates a new {@link PhaseDto}.
   * @param model - The Phase to create this {@link PhaseDto} with.
   * @throws {DomainError}
   */
  static from(model: Phase): PhaseDto {
    try {
      if (!Phase.isValid(model)) {
        throw new DomainError('The provided Phase is not valid!')
      }

      return new PhaseDto(
        model.id,
        model.missionId,
        model.status,
        model.execution,
        model.steps ? model.steps.map(StepDto.from) : null,
        model.createdAt,
        model.lastUpdatedAt,
        model.startedAt,
        model.completedAt
      )
    } catch (error) {
      throw new DomainError('Failed to create a Phase DTO!', {
        cause: error
      })
    }
  }

  /**
   * Creates a new Phase DTO.
   * @param id - The ID of the Phase to create.
   * @param missionId - The Mission ID that the Phase to create belongs to.
   * @param status - The status of the Phase to create.
   * @param execution - The execution of the Phase to create.
   * @param steps - The steps of the Phase to create.
   * @param createdAt - The moment the Phase to create was created.
   * @param lastUpdatedAt - The moment the Phase to create was last updated.
   * @param startedAt - The date this Phase to create was started.
   * @param completedAt - The date this Phase to create was completed.
   * @throws {DomainError}
   */
  private constructor(
    id: string,
    missionId: string,
    status: string,
    execution: string,
    steps: StepDto[] | null,
    createdAt: Date,
    lastUpdatedAt: Date | null,
    startedAt: Date | null,
    completedAt: Date | null
  ) {
    this.id = id
    this.missionId = missionId
    this.status = status
    this.execution = execution
    this.steps = steps
    this.createdAt = createdAt
    this.lastUpdatedAt = lastUpdatedAt
    this.startedAt = startedAt
    this.completedAt = completedAt
  }
}
