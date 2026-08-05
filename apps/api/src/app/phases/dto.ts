import {
  DomainError,
  ID_MAX_LENGTH,
  Phase,
  PhaseExecution,
  PhaseStatus,
  Step
} from '@liftoff/domain'
import { array, date, object, string, enum as zEnum } from 'zod'

import { exampleValues } from '../shared/openapi'
import { StepDto } from '../steps/dto'

/**
 * Represents a Phase DTO.
 */
export class PhaseDto {
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
   * Returns the schema for a valid {@link PhaseDto}.
   */
  static get schema() {
    return object({
      id: string()
        .max(ID_MAX_LENGTH)
        .openapi({ description: 'The ID of the Phase.', example: exampleValues.id }),
      status: zEnum(PhaseStatus).openapi({
        description: 'The status of the Phase.',
        example: exampleValues.phase.status
      }),
      execution: zEnum(PhaseExecution).openapi({
        description: 'The execution method of the Phase.',
        example: exampleValues.phase.executionMethod
      }),
      steps: array(Step.schema).nullable().openapi({ description: 'The Steps of the Phase.' }),
      createdAt: date().openapi({
        description: 'The creation date of the Phase.',
        example: exampleValues.date
      }),
      lastUpdatedAt: date()
        .nullable()
        .openapi({ description: 'The date of the last update of the Phase.', example: null }),
      startedAt: date()
        .nullable()
        .openapi({ description: 'The start date of the Phase.', example: null }),
      completedAt: date()
        .nullable()
        .openapi({ description: 'The date of completion of the Phase.', example: null })
    })
  }

  /**
   * The ID of this Phase.
   */
  readonly id: string
  /**
   * The status of this Phase.
   */
  readonly status: PhaseStatus
  /**
   * The execution method of this Phase.
   */
  readonly execution: PhaseExecution
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
   * Creates a new Phase DTO.
   * @param id - The ID of the Phase to create.
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
    status: PhaseStatus,
    execution: PhaseExecution,
    steps: StepDto[] | null,
    createdAt: Date,
    lastUpdatedAt: Date | null,
    startedAt: Date | null,
    completedAt: Date | null
  ) {
    this.id = id
    this.status = status
    this.execution = execution
    this.steps = steps
    this.createdAt = createdAt
    this.lastUpdatedAt = lastUpdatedAt
    this.startedAt = startedAt
    this.completedAt = completedAt
  }
}
