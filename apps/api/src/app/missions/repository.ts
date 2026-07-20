import { InferSelectModel } from 'drizzle-orm'

import { DatabaseConnection } from '@/db'
import { missionsTable, phasesTable, stepsTable } from '@/db/schema'

export type MissionSelectEntity = InferSelectModel<typeof missionsTable> & {
  phases: (InferSelectModel<typeof phasesTable> & {
    steps: InferSelectModel<typeof stepsTable>[]
  })[]
}
export type MissionInsertEntity = typeof missionsTable.$inferInsert

/**
 * Represents the repository for Missions.
 */
export class MissionRepository {
  /**
   * Gets all the Missions entities from the database.
   * @param dbConnection - The database connection to use.
   */
  async getAll(dbConnection: DatabaseConnection): Promise<MissionSelectEntity[]> {
    try {
      return await dbConnection.query.missions.findMany({
        with: { phases: { with: { steps: true } } }
      })
    } catch (error) {
      console.error('Failed to get all existing Missions entities from the database.', error)
      throw new Error('Failed to get all existing Missions entities from the database.', {
        cause: error
      })
    }
  }

  /**
   * Finds a Mission with the provided ID.
   * @param id - The ID to search with.
   * @param dbConnection - The database connection to use.
   */
  async findById(
    id: string,
    dbConnection: DatabaseConnection
  ): Promise<MissionSelectEntity | undefined> {
    try {
      if (!id) {
        throw new Error('The provided Mission ID is invalid.')
      }

      return await dbConnection.query.missions.findFirst({
        where: { id },
        with: { phases: { with: { steps: true } } }
      })
    } catch (error) {
      console.error('Failed to find a Mission with the provided ID.', error)
      throw new Error('Failed to find a Mission with the provided ID.', {
        cause: error
      })
    }
  }

  /**
   * Inserts a new Mission entity in the database.
   * @param model - The model to persist.
   * @param dbConnection - The database connection to use.
   */
  async insert(
    model: MissionInsertEntity,
    dbConnection: DatabaseConnection
  ): Promise<MissionInsertEntity> {
    try {
      const [result] = await dbConnection.insert(missionsTable).values(model).returning()
      return result
    } catch (error) {
      console.error('Failed to insert a new Mission entity in the database.', error)
      throw new Error('Failed to insert a new Mission entity in the database.', {
        cause: error
      })
    }
  }
}
