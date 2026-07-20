import { Phase } from '@liftoff/domain'

import { DatabaseConnection } from '@/db'

import { StepCreationForm } from '../steps/form'
import { StepCommandService } from '../steps/service'

import { PhaseCreationForm } from './form'
import { PhaseMapper } from './mapper'
import { PhaseRepository } from './repository'

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
   * Creates new {@link Phase[] | Phases} for a Mission and prepares them for launch.
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
      const models: Phase[] = (
        await this.repository.insertMany(
          forms
            .map((form) => Phase.create(missionId, form.execution))
            .map(PhaseMapper.toPhaseInsertEntity),
          dbConnection
        )
      ).map(PhaseMapper.toPhase)

      const stepFormsByPhaseId: Record<string, StepCreationForm[]> = Object.fromEntries(
        forms.map((form, index) => [models[index].id, form.steps])
      )

      return await this.prepareForLaunch(models, stepFormsByPhaseId, dbConnection)
    } catch (error) {
      console.error('Failed to create new Phases for a Mission.', error)
      throw new Error('Failed to create new Phases for a Mission.', { cause: error })
    }
  }

  /**
   * Prepares {@link Phase[] | Phases} for launch.
   * @param models - The {@link Mission} to prepare for launch.
   * @param stepCreationFormMap - The forms used to create the {@link Record<string, StepCreationForm[]> | Steps} of the {@link Phase[] | Phases}.
   * @param dbConnection - The database connection to use.
   */
  private async prepareForLaunch(
    models: Phase[],
    stepCreationFormMap: Record<string, StepCreationForm[]>,
    dbConnection: DatabaseConnection
  ): Promise<Phase[]> {
    try {
      const preparedModels: Phase[] = await Promise.all(
        models.map(async (model) => {
          const steps = await this.stepCommandService.createForPhase(
            model.id,
            stepCreationFormMap[model.id],
            dbConnection
          )
          return model.prepare(steps)
        })
      )

      const entities = await this.repository.updateMany(
        preparedModels.map(PhaseMapper.toPhaseInsertEntity),
        dbConnection
      )

      return await this.queryService.getAllByIds(
        entities.map(({ id }) => id),
        dbConnection
      )
    } catch (error) {
      console.error('Failed to prepare Phases for launch.', error)
      throw new Error('Failed to prepare Phases for launch.', { cause: error })
    }
  }
}
