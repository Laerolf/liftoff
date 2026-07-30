import { Mission, MissionStatus, Phase, isMissionStatus } from '@liftoff/domain'

import { MissionInsertEntity, MissionPhaseInsertEntity, MissionSelectEntity } from './repository'

/**
 * Represents a mapper for Missions.
 */
export class MissionMapper {
  /**
   * Maps a {@link MissionSelectEntity} to a {@link Mission}.
   * @param entity - The {@link MissionSelectEntity} to map.
   */
  static toMission(entity: MissionSelectEntity): Mission
  /**
   * Maps a {@link MissionInsertEntity} to a {@link Mission}.
   * @param entity - The {@link MissionInsertEntity} to map.
   * @param phases - The {@link Phase[] | Phases} of the {@link Mission} to map.
   */
  static toMission(entity: MissionInsertEntity, phases: Phase[]): Mission
  static toMission(entity: MissionSelectEntity | MissionInsertEntity, phases?: Phase[]): Mission {
    try {
      if (!isMissionStatus(entity.status)) {
        throw new Error('The Mission entity status is not a valid Mission status!')
      }

      const createdAt: Date = new Date(entity.createdAt)
      const lastUpdatedAt: Date | null = entity.lastUpdatedAt
        ? new Date(entity.lastUpdatedAt)
        : null
      const launchedAt: Date | null = entity.launchedAt ? new Date(entity.launchedAt) : null
      const completedAt: Date | null = entity.completedAt ? new Date(entity.completedAt) : null

      return Mission.restore(
        entity.id,
        entity.correlationId,
        entity.flightPlanId ?? null,
        createdAt,
        lastUpdatedAt,
        entity.workflowBranch,
        entity.environment,
        entity.services ?? [],
        entity.director,
        phases ?? [],
        entity.status as MissionStatus,
        launchedAt,
        completedAt
      )
    } catch (error) {
      throw new Error('Failed to map an entity to a Mission.', { cause: error })
    }
  }

  /**
   * Maps a {@link Mission} to a {@link MissionInsertEntity}.
   * @param mission - The {@link Mission} to map.
   */
  static toMissionInsertEntity(mission: Mission): MissionInsertEntity {
    try {
      if (!Mission.isValid(mission)) {
        throw new Error('The provided Mission is invalid!')
      }

      return {
        id: mission.id,
        correlationId: mission.correlationId,
        flightPlanId: mission.flightPlanId,
        workflowBranch: mission.workflowBranch,
        environment: mission.environment,
        services: mission.services,
        director: mission.director,
        status: mission.status,
        launchedAt: mission.launchedAt?.toISOString(),
        createdAt: mission.createdAt?.toISOString(),
        lastUpdatedAt: mission.lastUpdatedAt?.toISOString(),
        completedAt: mission.completedAt?.toISOString()
      }
    } catch (error) {
      throw new Error('Failed to map a Mission to a Mission insert entity.', { cause: error })
    }
  }
}

/**
 * Represents a mapper for Mission Phases.
 */
export class MissionPhaseMapper {
  /**
   * Maps a {@link Mission} to a {@link MissionPhaseInsertEntity[]}.
   * @param mission - The {@link Mission} to map.
   */
  static toMissionPhaseInsertEntities(mission: Mission): MissionPhaseInsertEntity[] {
    try {
      if (!Mission.isValid(mission)) {
        throw new Error('The provided Mission is invalid!')
      }

      return (mission.phases || []).map((phase, index) => ({
        missionId: mission.id,
        phaseId: phase.id,
        order: index
      }))
    } catch (error) {
      throw new Error('Failed to map a Mission to a Mission Phase insert entities.', {
        cause: error
      })
    }
  }
}
