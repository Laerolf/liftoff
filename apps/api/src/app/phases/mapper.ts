import { Phase, Step, isPhaseExecution, isPhaseStatus } from '@liftoff/domain'

import { PhaseInsertEntity, PhaseSelectEntity } from './repository'

/**
 * Represents a mapper for Phases.
 */
export class PhaseMapper {
  /**
   * Maps a {@link PhaseSelectEntity} to a {@link Phase}.
   * @param entity - The {@link PhaseSelectEntity} to map.
   * @param steps - The {@link Step[] | Steps} to map.
   */
  static toPhase(entity: PhaseSelectEntity, steps: Step[]): Phase
  /**
   * Maps a {@link MissionInsertEntity} to a {@link Phase}.
   * @param entity - The {@link MissionInsertEntity} to map.
   */
  static toPhase(entity: PhaseInsertEntity): Phase
  static toPhase(entity: PhaseSelectEntity | PhaseInsertEntity, steps?: Step[]): Phase {
    try {
      if (!isPhaseStatus(entity.status)) {
        throw new Error('The Phase entity status is not a valid Phase status!')
      }

      if (!isPhaseExecution(entity.execution)) {
        throw new Error('The Phase entity execution method is not a valid Phase execution method!')
      }

      const createdAt: Date = new Date(entity.createdAt)
      const lastUpdatedAt: Date | null = entity.lastUpdatedAt
        ? new Date(entity.lastUpdatedAt)
        : null
      const startedAt: Date | null = entity.startedAt ? new Date(entity.startedAt) : null
      const completedAt: Date | null = entity.completedAt ? new Date(entity.completedAt) : null

      return Phase.restore(
        entity.id,
        entity.missionId,
        entity.status,
        entity.execution,
        steps || [],
        createdAt,
        lastUpdatedAt,
        startedAt,
        completedAt
      )
    } catch (error) {
      throw new Error('Failed to map an entity to a Phase.', { cause: error })
    }
  }

  /**
   * Maps a {@link Phase} to a {@link PhaseInsertEntity}.
   * @param phase - The {@link Phase} to map.
   */
  static toPhaseInsertEntity(phase: Phase): PhaseInsertEntity {
    try {
      if (!Phase.isValid(phase)) {
        throw new Error('The provided Phase is invalid!')
      }

      return {
        id: phase.id,
        missionId: phase.missionId,
        status: phase.status,
        execution: phase.execution,
        startedAt: phase.startedAt?.toISOString(),
        createdAt: phase.createdAt?.toISOString(),
        lastUpdatedAt: phase.lastUpdatedAt?.toISOString(),
        completedAt: phase.completedAt?.toISOString()
      }
    } catch (error) {
      throw new Error('Failed to map a Phase to a Phase insert entity.', { cause: error })
    }
  }
}
