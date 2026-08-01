import { InferSelectModel, InferInsertModel } from 'drizzle-orm'

import { DatabaseConnection } from '@/db'
import { phasesTable, phaseStepsTable } from '@/db/schema'

import { StepSelectEntity } from '../steps/repository'

export type PhaseSelectEntity = InferSelectModel<typeof phasesTable> & {
  phaseSteps: PhaseStepSelectEntity[]
}
export type PhaseInsertEntity = InferInsertModel<typeof phasesTable>

export type PhaseStepSelectEntity = InferSelectModel<typeof phaseStepsTable> & {
  step: StepSelectEntity | null
}
export type PhaseStepInsertEntity = InferInsertModel<typeof phaseStepsTable>

/**
 * Represents the repository for Phases.
 */
export class PhaseRepository {
  /**
   * Gets all the {@link Phase[] | Phases} matching the provided IDs.
   * @param ids - The IDs to search with.
   * @param dbConnection - The database connection to use.
   */
  async getAllByIds(ids: string[], dbConnection: DatabaseConnection): Promise<PhaseSelectEntity[]> {
    try {
      if (!ids || !ids.length) {
        return []
      }

      return await dbConnection.query.phases.findMany({
        where: { id: { in: ids } },
        with: {
          phaseSteps: { with: { step: true } }
        }
      })
    } catch (error) {
      console.error(
        'Failed to get all existing Phase entities for the provided IDs from the database.',
        error
      )
      throw new Error(
        'Failed to get all existing Phase entities for the provided IDs from the database.',
        {
          cause: error
        }
      )
    }
  }

  /**
   * Inserts new {@link PhaseInsertEntity[] | Phase entities} in the database.
   * @param models - The models to insert.
   * @param dbConnection - The database connection to use.
   */
  async insertMany(
    models: PhaseInsertEntity[],
    dbConnection: DatabaseConnection
  ): Promise<PhaseInsertEntity[]> {
    try {
      if (!models.length) {
        return []
      }

      return await dbConnection.insert(phasesTable).values(models).returning()
    } catch (error) {
      console.error('Failed to insert new Phase entities in the database.', error)
      throw new Error('Failed to insert new Phase entities in the database.', {
        cause: error
      })
    }
  }

  /**
   * Updates many {@link PhaseInsertEntity[] | Phase entities} in the database.
   * @param models - The models to update.
   * @param dbConnection - The database connection to use.
   */
  async updateMany(
    models: PhaseInsertEntity[],
    dbConnection: DatabaseConnection
  ): Promise<PhaseInsertEntity[]> {
    try {
      if (!models.length) {
        return []
      }

      return await Promise.all(
        models.map((model) =>
          dbConnection
            .update(phasesTable)
            .set(model)
            .returning()
            .then((result) => result[0])
        )
      )
    } catch (error) {
      console.error('Failed to update Phase entities in the database.', error)
      throw new Error('Failed to update Phase entities in the database.', {
        cause: error
      })
    }
  }
}

/**
 * Represents the repository for Phase Steps.
 */
export class PhaseStepRepository {
  /**
   * Inserts new {@link PhaseInsertEntity[] | Phase Step entities} in the database.
   * @param models - The models to insert.
   * @param dbConnection - The database connection to use.
   */
  async insertMany(
    models: PhaseStepInsertEntity[],
    dbConnection: DatabaseConnection
  ): Promise<PhaseStepInsertEntity[]> {
    try {
      if (!models.length) {
        return []
      }

      return await dbConnection.insert(phaseStepsTable).values(models).returning()
    } catch (error) {
      console.error('Failed to insert new Phase Step entities in the database.', error)
      throw new Error('Failed to insert new Phase Step entities in the database.', {
        cause: error
      })
    }
  }
}
