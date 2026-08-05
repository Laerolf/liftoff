import { FlightPlan, ID_MAX_LENGTH, Phase, STRING_MAX_LENGTH } from '@liftoff/domain'
import { array, date, object, string } from 'zod'

import { PhaseDto } from '../phases/dto'
import { exampleValues } from '../shared/openapi'

/***
 * Represents a FlightPlan DTO.
 */
export class FlightPlanDto {
  /**
   * Creates a new {@link FlightPlanDto} based on a {@link FlightPlan}.
   * @param model - The base of the {@link FlightPlanDto} to create.
   * @throws {Error}
   */
  static from(model: FlightPlan): FlightPlanDto {
    try {
      if (!FlightPlan.isValid(model)) {
        throw new Error('The provided Flight Plan is invalid!')
      }

      return new FlightPlanDto(
        model.id,
        model.name,
        model.workflowBranch,
        model.environment,
        model.services,
        model.phases ? model.phases.map(PhaseDto.from) : null,
        model.createdAt,
        model.lastUpdatedAt
      )
    } catch (error) {
      throw new Error('Failed to create a new Flight Plan DTO from a Flight Plan.', {
        cause: error
      })
    }
  }

  /**
   * Returns the schema for a valid {@link FlightPlanDto}.
   */
  static get schema() {
    return object({
      id: string()
        .max(ID_MAX_LENGTH)
        .openapi({ description: 'The ID of the Flight Plan.', example: exampleValues.id }),
      name: string().max(STRING_MAX_LENGTH).openapi({
        description: 'The name of the Flight Plan.',
        example: exampleValues.flightPlan.name
      }),
      workflowBranch: string().max(STRING_MAX_LENGTH).openapi({
        description: 'The GitHub workflow branch targeted by the Flight Plan.',
        example: exampleValues.branchName
      }),
      environment: string().max(STRING_MAX_LENGTH).openapi({
        description: 'The GitHub environment targeted by the Flight Plan.',
        example: exampleValues.environmentName
      }),
      services: array(string().max(STRING_MAX_LENGTH)).openapi({
        description: 'The services targeted by the Flight Plan.',
        example: exampleValues.serviceIds
      }),
      phases: array(Phase.schema)
        .nullable()
        .openapi({ description: 'The Phases of the Flight Plan.' }),
      createdAt: date().openapi({
        description: 'The creation date of the Flight Plan.',
        example: exampleValues.date
      }),
      lastUpdatedAt: date().nullable().openapi({
        description: 'The date of the last update of the Flight Plan.',
        example: null
      })
    })
  }

  /**1
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
  readonly phases: PhaseDto[] | null
  /**
   * The moment this {@link FlightPlan} was created.
   */
  readonly createdAt: Date
  /**
   * The moment this {@link FlightPlan} was last updated.
   */
  readonly lastUpdatedAt: Date | null

  /**
   * Creates a new {@link FlightPlanDto}.
   * @param id - The ID of the {@link FlightPlanDto} to create.
   * @param name - The name of the {@link FlightPlanDto} to create.
   * @param workflowBranch - The GitHub Workflow branch of the {@link FlightPlanDto} to create.
   * @param environment - The target environment of the {@link FlightPlanDto} to create.
   * @param services - The target service IDs of the {@link FlightPlanDto} to create.
   * @param phases - The {@link PhaseDto[] | Phases} of the {@link FlightPlanDto} to create.
   * @param createdAt - The creation date of the {@link FlightPlanDto} to create.
   * @param lastUpdatedAt - The date of the last update of the {@link FlightPlanDto} to create.
   */
  private constructor(
    id: string,
    name: string,
    workflowBranch: string,
    environment: string,
    services: string[],
    phases: PhaseDto[] | null,
    createdAt: Date,
    lastUpdatedAt: Date | null
  ) {
    this.id = id
    this.name = name
    this.workflowBranch = workflowBranch
    this.environment = environment
    this.services = services
    this.phases = phases
    this.createdAt = createdAt
    this.lastUpdatedAt = lastUpdatedAt
  }
}
