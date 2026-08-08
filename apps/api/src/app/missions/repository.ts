import { InferSelectModel, InferInsertModel, eq } from 'drizzle-orm'

import { DatabaseConnection } from '@/db'
import { missionPhasesTable, missionsTable } from '@/db/schema'

import { PhaseSelectEntity } from '../phases/repository'

export type MissionSelectEntity = InferSelectModel<typeof missionsTable> & {
  missionPhases: MissionPhaseSelectEntity[]
}
export type MissionInsertEntity = InferInsertModel<typeof missionsTable>

export type MissionPhaseSelectEntity = InferSelectModel<typeof missionPhasesTable> & {
  phase: PhaseSelectEntity | null
}
export type MissionPhaseInsertEntity = InferInsertModel<typeof missionPhasesTable>

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
        with: {
          missionPhases: { with: { phase: { with: { phaseSteps: { with: { step: true } } } } } }
        }
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
        with: {
          missionPhases: { with: { phase: { with: { phaseSteps: { with: { step: true } } } } } }
        }
      })
    } catch (error) {
      console.error('Failed to find a Mission with the provided ID.', error)
      throw new Error('Failed to find a Mission with the provided ID.', {
        cause: error
      })
    }
  }

  /**
   * Inserts a new {@link MissionInsertEntity | Mission entity} in the database.
   * @param model - The model to insert.
   * @param dbConnection - The database connection to use.
   */
  async insert(
    model: MissionInsertEntity,
    dbConnection: DatabaseConnection
  ): Promise<MissionInsertEntity> {
    try {
      return (await dbConnection.insert(missionsTable).values(model).returning())[0]
    } catch (error) {
      console.error('Failed to insert a new Mission entity in the database.', error)
      throw new Error('Failed to insert a new Mission entity in the database.', {
        cause: error
      })
    }
  }

  /**
   * Updates a {@link MissionInsertEntity | Mission entity} in the database.
   * @param model - The model to update.
   * @param dbConnection - The database connection to use.
   */
  async update(
    model: MissionInsertEntity,
    dbConnection: DatabaseConnection
  ): Promise<MissionInsertEntity> {
    try {
      return (
        await dbConnection
          .update(missionsTable)
          .set(model)
          .where(eq(missionsTable.id, model.id))
          .returning()
      )[0]
    } catch (error) {
      console.error('Failed to update a Mission entity in the database.', error)
      throw new Error('Failed to update a Mission entity in the database.', {
        cause: error
      })
    }
  }
}

/**
 * Represents the repository for Mission Phases.
 */
export class MissionPhaseRepository {
  /**
   * Inserts new {@link MissionPhaseInsertEntity[] | Mission Phase insert entities} in the database.
   * @param models - The models to insert.
   * @param dbConnection - The database connection to use.
   */
  async insertMany(
    models: MissionPhaseInsertEntity[],
    dbConnection: DatabaseConnection
  ): Promise<MissionPhaseInsertEntity[]> {
    try {
      return await dbConnection.insert(missionPhasesTable).values(models).returning()
    } catch (error) {
      console.error('Failed to insert new Mission Phase entities in the database.', error)
      throw new Error('Failed to insert new Mission Phase entities in the database.', {
        cause: error
      })
    }
  }
}
