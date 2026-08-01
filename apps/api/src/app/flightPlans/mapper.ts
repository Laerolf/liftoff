import { FlightPlan, Phase } from '@liftoff/domain'

import {
  FlightPlanInsertEntity,
  FlightPlanPhaseInsertEntity,
  FlightPlanSelectEntity
} from './repository'

/**
 * Represents a mapper for FlightPlans.
 */
export class FlightPlanMapper {
  /**
   * Maps a {@link FlightPlanSelectEntity} to a {@link FlightPlan}.
   * @param entity - The {@link FlightPlanSelectEntity} to map.
   */
  static toFlightPlan(entity: FlightPlanSelectEntity): FlightPlan
  /**
   * Maps a {@link FlightPlanInsertEntity} to a {@link FlightPlan}.
   * @param entity - The {@link FlightPlanInsertEntity} to map.
   * @param phases - The {@link Phase[] | Phases} of the {@link FlightPlan} to map.
   */
  static toFlightPlan(entity: FlightPlanInsertEntity, phases: Phase[]): FlightPlan
  static toFlightPlan(
    entity: FlightPlanSelectEntity | FlightPlanInsertEntity,
    phases?: Phase[]
  ): FlightPlan {
    try {
      const createdAt: Date = new Date(entity.createdAt)
      const lastUpdatedAt: Date | null = entity.lastUpdatedAt
        ? new Date(entity.lastUpdatedAt)
        : null

      return FlightPlan.restore(
        entity.id,
        entity.name,
        createdAt,
        lastUpdatedAt,
        entity.workflowBranch,
        entity.environment,
        entity.services ?? [],
        phases ?? []
      )
    } catch (error) {
      throw new Error('Failed to map an entity to a Flight Plan.', { cause: error })
    }
  }

  /**
   * Maps a {@link FlightPlan} to a {@link FlightPlanInsertEntity}.
   * @param flightPlan - The {@link FlightPlan} to map.
   */
  static toFlightPlanInsertEntity(flightPlan: FlightPlan): FlightPlanInsertEntity {
    try {
      if (!FlightPlan.isValid(flightPlan)) {
        throw new Error('The provided Flight Plan is invalid!')
      }

      return {
        id: flightPlan.id,
        name: flightPlan.name,
        createdAt: flightPlan.createdAt.toISOString(),
        lastUpdatedAt: flightPlan.lastUpdatedAt?.toISOString() || null,
        workflowBranch: flightPlan.workflowBranch,
        environment: flightPlan.environment,
        services: flightPlan.services
      }
    } catch (error) {
      throw new Error('Failed to map a Flight Plan to a Flight Plan insert entity.', {
        cause: error
      })
    }
  }
}

/**
 * Represents a mapper for Flight Plan Phases.
 */
export class FlightPlanPhaseMapper {
  /**
   * Maps a {@link FlightPlan} to a {@link FlightPlanPhaseInsertEntity[]}.
   * @param flightPlan - The {@link FlightPlan} to map.
   */
  static toFlightPlanPhaseInsertEntities(flightPlan: FlightPlan): FlightPlanPhaseInsertEntity[] {
    try {
      if (!FlightPlan.isValid(flightPlan)) {
        throw new Error('The provided Flight Plan is invalid!')
      }

      return (flightPlan.phases || []).map((phase, index) => ({
        flightPlanId: flightPlan.id,
        phaseId: phase.id,
        order: index
      }))
    } catch (error) {
      throw new Error('Failed to map a Flight Plan to a Flight Plan Phase insert entities.', {
        cause: error
      })
    }
  }
}
