import { Mission, Phase } from '@liftoff/domain'

import { DatabaseConnection } from '@/db'

import { PhaseMapper } from '../phases/mapper'
import { PhaseCommandService } from '../phases/service'
import { StepMapper } from '../steps/mapper'

import { MissionFromScratchCreationForm } from './form'
import { MissionMapper } from './mapper'
import { MissionInsertEntity, MissionRepository } from './repository'

/**
 * Represents a query service for Missions.
 */
export class MissionQueryService {
  private repository: MissionRepository

  /**
   * Creates a new {@link MissionQueryService}.
   * @param repository - The {@link MissionRepository} to use.
   */
  constructor(repository: MissionRepository) {
    if (!repository || !(repository instanceof MissionRepository)) {
      throw new Error('The provided Mission repository is invalid!')
    }

    this.repository = repository
  }

  /**
   * Gets all the existing Missions.
   * @param dbConnection - The database connection to use.
   */
  async getAll(dbConnection: DatabaseConnection): Promise<Mission[]> {
    try {
      return (await this.repository.getAll(dbConnection)).map(MissionMapper.toMission)
    } catch (error) {
      console.error('Failed to get all the existing Missions.', error)
      throw new Error('Failed to get all the existing Missions.', { cause: error })
    }
  }

  /**
   * Finds a {@link Mission} with the provided ID.
   * @param missionId - The Mission ID to search with.
   * @param dbConnection - The database connection to use.
   */
  async findById(
    missionId: string,
    dbConnection: DatabaseConnection
  ): Promise<Mission | undefined> {
    try {
      if (!missionId) {
        throw new Error('The provided Mission ID is invalid!')
      }

      const entity = await this.repository.findById(missionId, dbConnection)
      const phases = (entity?.phases || []).map((phase) => {
        const steps = phase.steps.map(StepMapper.toStep)
        return PhaseMapper.toPhase(phase, steps)
      })

      return entity ? MissionMapper.toMission(entity, phases) : undefined
    } catch (error) {
      console.error('Failed to find a Mission with the provided ID.', error)
      throw new Error('Failed to find a Mission with the provided ID.', { cause: error })
    }
  }

  /**
   * Gets a {@link Mission} with the provided ID.
   * @missionId - The Mission ID to search with.
   * @param dbConnection - The database connection to use.
   */
  async getById(missionId: string, dbConnection: DatabaseConnection): Promise<Mission> {
    try {
      if (!missionId) {
        throw new Error('The provided Mission ID is invalid!')
      }

      const model = await this.findById(missionId, dbConnection)

      if (!model) {
        throw new Error('No Mission with the provided ID exists!')
      }

      return model
    } catch (error) {
      console.error('Failed to get a Mission with the provided ID.', error)
      throw new Error('Failed to get a Mission with the provided ID.', { cause: error })
    }
  }
}

/**
 * Represents a command service for Missions.
 */
export class MissionCommandService {
  private repository: MissionRepository
  private missionQueryService: MissionQueryService
  private phaseCommandService: PhaseCommandService

  /**
   * Creates a new {@link MissionCommandService}.
   * @param repository - The {@link MissionRepository} to use.
   * @param missionQueryService - The {@link MissionQueryService} to use.
   * @param phaseCommandService - The {@link PhaseCommandService} to use.
   */
  constructor(
    repository: MissionRepository,
    missionQueryService: MissionQueryService,
    phaseCommandService: PhaseCommandService
  ) {
    if (!repository || !(repository instanceof MissionRepository)) {
      throw new Error('The provided Mission repository is invalid!')
    }

    if (!missionQueryService || !(missionQueryService instanceof MissionQueryService)) {
      throw new Error('The provided Mission query service is invalid!')
    }

    if (!phaseCommandService || !(phaseCommandService instanceof PhaseCommandService)) {
      throw new Error('The provided Phase command service is invalid!')
    }

    this.repository = repository
    this.missionQueryService = missionQueryService
    this.phaseCommandService = phaseCommandService
  }

  /**
   * Creates a new {@link Mission} from scratch.
   * @param form - The form used to create the new {@link Mission}.
   * @param dbConnection - The database connection to use.
   */
  async createFromScratch(
    form: MissionFromScratchCreationForm,
    dbConnection: DatabaseConnection
  ): Promise<Mission> {
    try {
      const model: Mission = Mission.fromScratch(
        form.workflowBranch,
        form.environment,
        form.services,
        form.director
      )

      const phaseModels: Phase[] = await this.phaseCommandService.createForMission(
        model.id,
        form.phases,
        dbConnection
      )

      model.prepare(phaseModels)

      const entity: MissionInsertEntity = await this.repository.insert(
        MissionMapper.toMissionInsertEntity(model),
        dbConnection
      )

      return await this.missionQueryService.getById(entity.id, dbConnection)
    } catch (error) {
      console.error('Failed to create a new Mission.', error)
      throw new Error('Failed to create a new Mission.', { cause: error })
    }
  }
}
