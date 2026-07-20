import { Step } from '@liftoff/domain'

import { DatabaseConnection } from '@/db'

import { StepCreationForm } from './form'
import { StepMapper } from './mapper'
import { StepInsertEntity, StepRepository } from './repository'

/**
 * Represents a query service for Steps.
 */
export class StepQueryService {
  private repository: StepRepository

  /**
   * Creates a new {@link StepQueryService}.
   * @param repository - The {@link PhaseRepository} to use.
   */
  constructor(repository: StepRepository) {
    if (!repository || !(repository instanceof StepRepository)) {
      throw new Error('The provided Step repository is invalid!')
    }

    this.repository = repository
  }

  /**
   * Gets all the existing Steps for the provided Step IDs.
   * @param ids - The Step IDs to search with.
   * @param dbConnection - The database connection to use.
   */
  async getAllByIds(ids: string[], dbConnection: DatabaseConnection): Promise<Step[]> {
    try {
      if (!ids.length) {
        return []
      }

      return (await this.repository.getAllByIds(ids, dbConnection)).map(StepMapper.toStep)
    } catch (error) {
      console.error('Failed to get all the existing Steps for the provided Step IDs.', error)
      throw new Error('Failed to get all the existing Steps for the provided Step IDs.', {
        cause: error
      })
    }
  }

  /**
   * Gets all the existing Steps for the provided Phase ID.
   * @param phaseId - The Phase ID to search with.
   * @param dbConnection - The database connection to use.
   */
  async getAllByPhaseId(phaseId: string, dbConnection: DatabaseConnection): Promise<Step[]> {
    try {
      return (await this.repository.getAllByPhaseId(phaseId, dbConnection)).map(StepMapper.toStep)
    } catch (error) {
      console.error('Failed to get all the existing Steps for the provided Phase ID.', error)
      throw new Error('Failed to get all the existing Steps for the provided Phase ID.', {
        cause: error
      })
    }
  }
}

/**
 * Represents a command service for Steps.
 */
export class StepCommandService {
  private repository: StepRepository
  private queryService: StepQueryService

  /**
   * Creates a new {@link StepCommandService}.
   * @param repository - The {@link StepRepository} to use.
   * @param queryService - The {@link StepQueryService} to use.
   */
  constructor(repository: StepRepository, queryService: StepQueryService) {
    if (!repository || !(repository instanceof StepRepository)) {
      throw new Error('The provided Step repository is invalid!')
    }

    if (!queryService || !(queryService instanceof StepQueryService)) {
      throw new Error('The provided Step command service is invalid!')
    }

    this.repository = repository
    this.queryService = queryService
  }

  /**
   * Creates new {@link Step[] | Steps} for a Phase.
   * @param phaseId - The ID of the Phase the new {@link Step[] | Steps} will belong to.
   * @param form - The form used to create the new {@link Step[] | Steps}.
   * @param dbConnection - The database connection to use.
   */
  async createForPhase(
    phaseId: string,
    forms: StepCreationForm[],
    dbConnection: DatabaseConnection
  ): Promise<Step[]> {
    try {
      const models: StepInsertEntity[] = forms
        .map((form) => Step.create(phaseId, form.repository, form.workflowId, form.workflowInputs))
        .map(StepMapper.toStepInsertEntity)

      const entities: StepInsertEntity[] = await this.repository.insertMany(models, dbConnection)

      return this.queryService.getAllByIds(
        entities.map(({ id }) => id),
        dbConnection
      )
    } catch (error) {
      console.error('Failed to create new Steps for a Phase.', error)
      throw new Error('Failed to create new Steps for a Phase.', { cause: error })
    }
  }
}
