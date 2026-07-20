import { Phase, Step } from '@liftoff/domain'

import { DatabaseConnection } from '@/db'

import { StepCommandService, StepQueryService } from '../steps/service'

import { PhaseCreationForm } from './form'
import { PhaseMapper } from './mapper'
import { PhaseInsertEntity, PhaseRepository } from './repository'

/**
 * Represents a query service for Phases.
 */
export class PhaseQueryService {
  private repository: PhaseRepository

  /**
   * Creates a new {@link PhaseQueryService}.
   * @param repository - The {@link PhaseRepository} to use.
   */
  constructor(repository: PhaseRepository) {
    if (!repository || !(repository instanceof PhaseRepository)) {
      throw new Error('The provided Phase repository is invalid!')
    }

    this.repository = repository
  }

  /**
   * Gets all the existing Phases for the provided IDs.
   * @param ids - The IDs to search with.
   * @param dbConnection - The database connection to use.
   */
  async getAllByIds(ids: string[], dbConnection: DatabaseConnection): Promise<Phase[]> {
    try {
      return (await this.repository.getAllByIds(ids, dbConnection)).map(PhaseMapper.toPhase)
    } catch (error) {
      console.error('Failed to get all the existing Phases for the provided IDs.', error)
      throw new Error('Failed to get all the existing Phases for the provided IDs.', {
        cause: error
      })
    }
  }

  /**
   * Gets all the existing Phases for the provided Mission ID.
   * @param missionId - The Mission ID to search with.
   * @param dbConnection - The database connection to use.
   */
  async getAllByMissionId(missionId: string, dbConnection: DatabaseConnection): Promise<Phase[]> {
    try {
      return (await this.repository.getAllByMissionId(missionId, dbConnection)).map(
        PhaseMapper.toPhase
      )
    } catch (error) {
      console.error('Failed to get all the existing Phases for the provided Mission ID.', error)
      throw new Error('Failed to get all the existing Phases for the provided Mission ID.', {
        cause: error
      })
    }
  }
}

/**
 * Represents a command service for Phases.
 */
export class PhaseCommandService {
  private repository: PhaseRepository
  private queryService: PhaseQueryService
  private stepCommandService: StepCommandService

  /**
   * Creates a new {@link PhaseCommandService}.
   * @param repository - The {@link PhaseRepository} to use.
   * @param queryService - The {@link PhaseQueryService} to use.
   * @param stepCommandService - The {@link StepCommandService} to use.
   */
  constructor(
    repository: PhaseRepository,
    queryService: PhaseQueryService,
    stepCommandService: StepCommandService
  ) {
    if (!repository || !(repository instanceof PhaseRepository)) {
      throw new Error('The provided Phase repository is invalid!')
    }

    if (!queryService || !(queryService instanceof PhaseQueryService)) {
      throw new Error('The provided Phase command service is invalid!')
    }

    if (!stepCommandService || !(stepCommandService instanceof StepCommandService)) {
      throw new Error('The provided Step command service is invalid!')
    }

    this.repository = repository
    this.queryService = queryService
    this.stepCommandService = stepCommandService
  }

  /**
   * Creates new {@link Phase[] | Phases} for a Mission.
   * @param missionId - The ID of the Mission that the new {@link Phase[] | Phases} will belong to.
   * @param forms - The forms used to create the new {@link Phase[] | Phases}.
   * @param dbConnection - The database connection to use.
   */
  async createForMission(
    missionId: string,
    forms: PhaseCreationForm[],
    dbConnection: DatabaseConnection
  ): Promise<Phase[]> {
    try {
      const models: Phase[] = await Promise.all(
        forms.map(async (form) => {
          const model = Phase.create(missionId, form.execution)

          const stepModels: Step[] = await this.stepCommandService.createForPhase(
            model.id,
            form.steps,
            dbConnection
          )

          return model.prepare(stepModels)
        })
      )

      const entities: PhaseInsertEntity[] = await this.repository.insert(
        models.map(PhaseMapper.toPhaseInsertEntity),
        dbConnection
      )

      return await this.queryService.getAllByIds(
        entities.map(({ id }) => id),
        dbConnection
      )
    } catch (error) {
      console.error('Failed to create new Phases for a Mission.', error)
      throw new Error('Failed to create new Phases for a Mission.', { cause: error })
    }
  }
}
