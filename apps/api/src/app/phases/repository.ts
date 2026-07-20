import { InferSelectModel } from 'drizzle-orm'

import { DatabaseConnection } from '@/db'
import { phasesTable, stepsTable } from '@/db/schema'

export type PhaseSelectEntity = InferSelectModel<typeof phasesTable> & {
  steps: InferSelectModel<typeof stepsTable>[]
}
export type PhaseInsertEntity = typeof phasesTable.$inferInsert

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
        with: { steps: true }
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
   * Gets all the {@link Phase[] | Phases} matching the provided Mission ID.
   * @param missionId - The Mission ID to search with.
   * @param dbConnection - The database connection to use.
   */
  async getAllByMissionId(
    missionId: string,
    dbConnection: DatabaseConnection
  ): Promise<PhaseSelectEntity[]> {
    try {
      if (!missionId) {
        throw new Error('The provided Mission ID is invalid!')
      }

      return await dbConnection.query.phases.findMany({
        where: { missionId },
        with: { steps: true }
      })
    } catch (error) {
      console.error(
        'Failed to get all existing Phase entities for the provided Mission ID from the database.',
        error
      )
      throw new Error(
        'Failed to get all existing Phase entities for the provided Mission ID from the database.',
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
