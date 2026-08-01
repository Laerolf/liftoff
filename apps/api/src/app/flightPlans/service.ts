import { FlightPlan, Phase } from '@liftoff/domain'

import { DatabaseConnection } from '@/db'

import { MissionFromScratchCreationForm } from '../missions/form'
import { MissionRepository } from '../missions/repository'
import { PhaseCreationForm } from '../phases/form'
import { PhaseMapper } from '../phases/mapper'
import { PhaseCommandService } from '../phases/service'
import { StepMapper } from '../steps/mapper'

import { FlightPlanCreationForm } from './form'
import { FlightPlanMapper, FlightPlanPhaseMapper } from './mapper'
import {
  FlightPlanInsertEntity,
  FlightPlanPhaseRepository,
  FlightPlanRepository
} from './repository'

export class FlightPlanQueryService {
  private repository: FlightPlanRepository

  /**
   * Creates a new {@link FlightPlanQueryService}.
   * @param repository - The {@link FlightPlanRepository} to use.
   */
  constructor(repository: FlightPlanRepository) {
    if (!repository || !(repository instanceof FlightPlanRepository)) {
      throw new Error('The provided Flight Plan repository is invalid!')
    }

    this.repository = repository
  }

  /**
   * Gets all the existing Flight Plans.
   * @param dbConnection - The database connection to use.
   */
  async getAll(dbConnection: DatabaseConnection): Promise<FlightPlan[]> {
    try {
      return (await this.repository.getAll(dbConnection)).map((entity) => {
        const phases = (entity?.flightPlanPhases || [])
          .map(({ phase }) => phase)
          .filter((phase) => !!phase)
          .map((phase) => {
            const steps = phase.phaseSteps
              .flatMap(({ step }) => step)
              .filter((step) => !!step)
              .map(StepMapper.toStep)
            return PhaseMapper.toPhase(phase, steps)
          })

        return FlightPlanMapper.toFlightPlan(entity, phases)
      })
    } catch (error) {
      console.error('Failed to get all the existing Flight Plans.', error)
      throw new Error('Failed to get all the existing Flight Plans.', { cause: error })
    }
  }

  /**
   * Finds a {@link FlightPlan} with the provided ID.
   * @param flightPlanId - The Flight Plan ID to search with.
   * @param dbConnection - The database connection to use.
   */
  async findById(
    flightPlanId: string,
    dbConnection: DatabaseConnection
  ): Promise<FlightPlan | undefined> {
    try {
      if (!flightPlanId) {
        throw new Error('The provided Flight Plan ID is invalid!')
      }

      const entity = await this.repository.findById(flightPlanId, dbConnection)
      const phases = (entity?.flightPlanPhases || [])
        .map(({ phase }) => phase)
        .filter((phase) => !!phase)
        .map((phase) => {
          const steps = phase.phaseSteps
            .flatMap(({ step }) => step)
            .filter((step) => !!step)
            .map(StepMapper.toStep)
          return PhaseMapper.toPhase(phase, steps)
        })

      return entity ? FlightPlanMapper.toFlightPlan(entity, phases) : undefined
    } catch (error) {
      console.error('Failed to find a Flight Plan with the provided ID.', error)
      throw new Error('Failed to find a Flight Plan with the provided ID.', { cause: error })
    }
  }

  /**
   * Gets a {@link FlightPlan} with the provided ID.
   * @param flightPlanId - The Flight Plan ID to search with.
   * @param dbConnection - The database connection to use.
   */
  async getById(flightPlanId: string, dbConnection: DatabaseConnection): Promise<FlightPlan> {
    try {
      if (!flightPlanId) {
        throw new Error('The provided Flight Plan ID is invalid!')
      }

      const model = await this.findById(flightPlanId, dbConnection)

      if (!model) {
        throw new Error('No Flight Plan with the provided ID exists!')
      }

      return model
    } catch (error) {
      console.error('Failed to get a Flight Plan with the provided ID.', error)
      throw new Error('Failed to get a Flight Plan with the provided ID.', { cause: error })
    }
  }
}

/**
 * Represents a command service for Flight Plans.
 */
export class FlightPlanCommandService {
  private repository: FlightPlanRepository
  private flightPlanPhaseRepository: FlightPlanPhaseRepository
  private flightPlanQueryService: FlightPlanQueryService
  private phaseCommandService: PhaseCommandService

  /**
   * Creates a new {@link FlightPlanCommandService}.
   * @param repository - The {@link MissionRepository} to use.
   * @param flightPlanPhaseRepository - The {@link FlightPlanPhaseRepository} to use.
   * @param flightPlanQueryService - The {@link FlightPlanQueryService} to use.
   * @param phaseCommandService - The {@link PhaseCommandService} to use.
   */
  constructor(
    repository: FlightPlanRepository,
    flightPlanPhaseRepository: FlightPlanPhaseRepository,
    flightPlanQueryService: FlightPlanQueryService,
    phaseCommandService: PhaseCommandService
  ) {
    if (!repository || !(repository instanceof FlightPlanRepository)) {
      throw new Error('The provided Flight Plan repository is invalid!')
    }

    if (
      !flightPlanPhaseRepository ||
      !(flightPlanPhaseRepository instanceof FlightPlanPhaseRepository)
    ) {
      throw new Error('The provided Flight Plan Phase repository is invalid!')
    }

    if (!flightPlanQueryService || !(flightPlanQueryService instanceof FlightPlanQueryService)) {
      throw new Error('The provided Flight Plan query service is invalid!')
    }

    if (!phaseCommandService || !(phaseCommandService instanceof PhaseCommandService)) {
      throw new Error('The provided Phase command service is invalid!')
    }

    this.repository = repository
    this.flightPlanPhaseRepository = flightPlanPhaseRepository
    this.flightPlanQueryService = flightPlanQueryService
    this.phaseCommandService = phaseCommandService
  }

  /**
   * Creates a new {@link FlightPlan}.
   * @param form - The form used to create the new {@link FlightPlan}.
   * @param dbConnection - The database connection to use.
   */
  async create(
    form: FlightPlanCreationForm,
    dbConnection: DatabaseConnection
  ): Promise<FlightPlan> {
    try {
      const model: FlightPlan = FlightPlan.create(
        form.name,
        form.workflowBranch,
        form.environment,
        form.services
      )

      await this.repository.insert(FlightPlanMapper.toFlightPlanInsertEntity(model), dbConnection)

      return this.prepareForUsage(model, form.phases, dbConnection)
    } catch (error) {
      console.error('Failed to create a new Flight Plan.', error)
      throw new Error('Failed to create a new Flight Plan.', { cause: error })
    }
  }

  /**
   * Prepares a {@link FlightPlan} for usage.
   * @param model - The {@link FlightPlan} to prepare for launch.
   * @param phaseCreationForms - The form used to create the {@link Phase[] | Phases} of the {@link FlightPlan}.
   * @param dbConnection - The database connection to use.
   */
  private async prepareForUsage(
    model: FlightPlan,
    phaseCreationForms: PhaseCreationForm[],
    dbConnection: DatabaseConnection
  ): Promise<FlightPlan> {
    try {
      const phaseModels: Phase[] = await this.phaseCommandService.createMany(
        phaseCreationForms,
        dbConnection
      )

      model.prepare(phaseModels)

      await this.flightPlanPhaseRepository.insertMany(
        FlightPlanPhaseMapper.toFlightPlanPhaseInsertEntities(model),
        dbConnection
      )

      const entity: FlightPlanInsertEntity = await this.repository.update(
        FlightPlanMapper.toFlightPlanInsertEntity(model),
        dbConnection
      )

      return await this.flightPlanQueryService.getById(entity.id, dbConnection)
    } catch (error) {
      console.error('Failed to prepare a Flight Plan for usage.', error)
      throw new Error('Failed to prepare a Flight Plan for usage.', { cause: error })
    }
  }
}
