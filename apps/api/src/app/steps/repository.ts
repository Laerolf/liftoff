import { DatabaseConnection } from '@/db'
import { stepsTable } from '@/db/schema'

export type StepSelectEntity = typeof stepsTable.$inferSelect
export type StepInsertEntity = typeof stepsTable.$inferInsert

/**
 * Represents the repository for Steps.
 */
export class StepRepository {
  /**
   * Gets all the {@link Step[] | Steps} matching the provided Step IDs.
   * @param ids - The Step IDs to search with.
   * @param dbConnection - The database connection to use.
   */
  async getAllByIds(ids: string[], dbConnection: DatabaseConnection): Promise<StepSelectEntity[]> {
    try {
      if (!ids.length) {
        return []
      }

      return await dbConnection.query.steps.findMany({
        where: { id: { in: ids } }
      })
    } catch (error) {
      console.error(
        'Failed to get all existing Step entities with the provided Step IDs from the database.',
        error
      )
      throw new Error(
        'Failed to get all existing Step entities with the provided Step IDs from the database.',
        {
          cause: error
        }
      )
    }
  }

  /**
   * Gets all the {@link Step[] | Steps} matching the provided Phase ID.
   * @param phaseId - The Phase ID to search with.
   * @param dbConnection - The database connection to use.
   */
  async getAllByPhaseId(
    phaseId: string,
    dbConnection: DatabaseConnection
  ): Promise<StepSelectEntity[]> {
    try {
      if (!phaseId) {
        throw new Error('The provided Phase ID is invalid!')
      }

      return await dbConnection.query.steps.findMany({ where: { phaseId } })
    } catch (error) {
      console.error(
        'Failed to get all existing Step entities with the provided Phase ID from the database.',
        error
      )
      throw new Error(
        'Failed to get all existing Step entities with the provided Phase ID from the database.',
        {
          cause: error
        }
      )
    }
  }

  /**
   * Inserts new {@link StepInsertEntity[] | Steps} entities in the database.
   * @param models - The models to insert.
   * @param dbConnection - The database connection to use.
   */
  async insertMany(
    models: StepInsertEntity[],
    dbConnection: DatabaseConnection
  ): Promise<StepInsertEntity[]> {
    try {
      return await dbConnection.insert(stepsTable).values(models).returning()
    } catch (error) {
      console.error('Failed to insert new Step entities in the database.', error)
      throw new Error('Failed to insert new Step entities in the database.', {
        cause: error
      })
    }
  }
}
