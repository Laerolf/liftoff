import { isStepStatus, Step } from '@liftoff/domain'

import { StepInsertEntity, StepSelectEntity } from './repository'

/**
 * Represents a mapper for Steps.
 */
export class StepMapper {
  /**
   * Maps a {@link StepSelectEntity} to a {@link Step}.
   * @param entity - The {@link StepSelectEntity} to map.
   */
  static toStep(entity: StepSelectEntity): Step
  /**
   * Maps a {@link StepInsertEntity} to a {@link Phase}.
   * @param entity - The {@link StepInsertEntity} to map.
   */
  static toStep(entity: StepInsertEntity): Step
  static toStep(entity: StepSelectEntity | StepInsertEntity): Step {
    try {
      if (!isStepStatus(entity.workflowOutcome)) {
        throw new Error('The Phase entity status is not a valid Phase status!')
      }

      const createdAt: Date = new Date(entity.createdAt)
      const lastUpdatedAt: Date | null = entity.lastUpdatedAt
        ? new Date(entity.lastUpdatedAt)
        : null
      const startedAt: Date | null = entity.startedAt ? new Date(entity.startedAt) : null
      const completedAt: Date | null = entity.completedAt ? new Date(entity.completedAt) : null

      return Step.restore(
        entity.id,
        entity.phaseId,
        entity.repository,
        entity.workflowId,
        createdAt,
        lastUpdatedAt,
        startedAt,
        completedAt,
        entity.workflowOutcome,
        entity.workflowInputs
      )
    } catch (error) {
      throw new Error('Failed to map an entity to a Step.', { cause: error })
    }
  }

  /**
   * Maps a {@link Step} to a {@link StepInsertEntity}.
   * @param step - The {@link Step} to map.
   */
  static toStepInsertEntity(step: Step): StepInsertEntity {
    try {
      if (!Step.isValid(step)) {
        throw new Error('The provided Step is invalid!')
      }

      return {
        id: step.id,
        phaseId: step.phaseId,
        repository: step.repository,
        workflowId: step.workflowId,
        createdAt: step.createdAt?.toISOString(),
        lastUpdatedAt: step.lastUpdatedAt?.toISOString(),
        startedAt: step.startedAt?.toISOString(),
        completedAt: step.completedAt?.toISOString(),
        workflowOutcome: step.workflowOutcome,
        workflowInputs: step.workflowInputs
      }
    } catch (error) {
      throw new Error('Failed to map a Step to a Step insert entity.', { cause: error })
    }
  }
}
