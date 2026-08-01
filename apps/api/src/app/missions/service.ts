import { Mission, Phase } from '@liftoff/domain'

import { DatabaseConnection } from '@/db'

import { PhaseCreationForm } from '../phases/form'
import { PhaseMapper } from '../phases/mapper'
import { PhaseCommandService } from '../phases/service'
import { StepMapper } from '../steps/mapper'

import { MissionFromScratchCreationForm } from './form'
import { MissionMapper, MissionPhaseMapper } from './mapper'
import { MissionInsertEntity, MissionPhaseRepository, MissionRepository } from './repository'

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
      return (await this.repository.getAll(dbConnection)).map((entity) => {
        const phases = (entity?.missionPhases || [])
          .map(({ phase }) => phase)
          .filter((phase) => !!phase)
          .map((phase) => {
            const steps = phase.phaseSteps
              .flatMap(({ step }) => step)
              .filter((step) => !!step)
              .map(StepMapper.toStep)
            return PhaseMapper.toPhase(phase, steps)
          })

        return MissionMapper.toMission(entity, phases)
      })
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
      const phases = (entity?.missionPhases || [])
        .map(({ phase }) => phase)
        .filter((phase) => !!phase)
        .map((phase) => {
          const steps = phase.phaseSteps
            .flatMap(({ step }) => step)
            .filter((step) => !!step)
            .map(StepMapper.toStep)
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
   * @param missionId - The Mission ID to search with.
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
  private missionPhaseRepository: MissionPhaseRepository
  private missionQueryService: MissionQueryService
  private phaseCommandService: PhaseCommandService

  /**
   * Creates a new {@link MissionCommandService}.
   * @param repository - The {@link MissionRepository} to use.
   * @param missionPhaseRepository - The {@link MissionPhaseRepository} to use.
   * @param missionQueryService - The {@link MissionQueryService} to use.
   * @param phaseCommandService - The {@link PhaseCommandService} to use.
   */
  constructor(
    repository: MissionRepository,
    missionPhaseRepository: MissionPhaseRepository,
    missionQueryService: MissionQueryService,
    phaseCommandService: PhaseCommandService
  ) {
    if (!repository || !(repository instanceof MissionRepository)) {
      throw new Error('The provided Mission repository is invalid!')
    }

    if (!missionPhaseRepository || !(missionPhaseRepository instanceof MissionPhaseRepository)) {
      throw new Error('The provided Mission Phase repository is invalid!')
    }

    if (!missionQueryService || !(missionQueryService instanceof MissionQueryService)) {
      throw new Error('The provided Mission query service is invalid!')
    }

    if (!phaseCommandService || !(phaseCommandService instanceof PhaseCommandService)) {
      throw new Error('The provided Phase command service is invalid!')
    }

    this.repository = repository
    this.missionPhaseRepository = missionPhaseRepository
    this.missionQueryService = missionQueryService
    this.phaseCommandService = phaseCommandService
  }

  /**
   * Creates a new {@link Mission} from scratch and prepares it for launch.
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

      await this.repository.insert(MissionMapper.toMissionInsertEntity(model), dbConnection)

      return this.prepareForLaunch(model, form.phases, dbConnection)
    } catch (error) {
      console.error('Failed to create a new Mission.', error)
      throw new Error('Failed to create a new Mission.', { cause: error })
    }
  }

  /**
   * Prepares a {@link Mission} for launch.
   * @param model - The {@link Mission} to prepare for launch.
   * @param phaseCreationForms - The form used to create the {@link Phase[] | Phases} of the {@link Mission}.
   * @param dbConnection - The database connection to use.
   */
  private async prepareForLaunch(
    model: Mission,
    phaseCreationForms: PhaseCreationForm[],
    dbConnection: DatabaseConnection
  ): Promise<Mission> {
    try {
      const phaseModels: Phase[] = await this.phaseCommandService.createMany(
        phaseCreationForms,
        dbConnection
      )

      model.prepare(phaseModels)

      await this.missionPhaseRepository.insertMany(
        MissionPhaseMapper.toMissionPhaseInsertEntities(model),
        dbConnection
      )

      const entity: MissionInsertEntity = await this.repository.update(
        MissionMapper.toMissionInsertEntity(model),
        dbConnection
      )

      return await this.missionQueryService.getById(entity.id, dbConnection)
    } catch (error) {
      console.error('Failed to prepare a Mission for launch.', error)
      throw new Error('Failed to prepare a Mission for launch.', { cause: error })
    }
  }
}
