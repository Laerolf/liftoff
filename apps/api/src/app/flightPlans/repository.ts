import { InferSelectModel, InferInsertModel, eq } from 'drizzle-orm'

import { DatabaseConnection } from '@/db'
import { flightPlansTable, flightPlanPhasesTable } from '@/db/schema'

import { PhaseSelectEntity } from '../phases/repository'

export type FlightPlanSelectEntity = InferSelectModel<typeof flightPlansTable> & {
  flightPlanPhases: FlightPlanPhaseSelectEntity[]
}
export type FlightPlanInsertEntity = InferInsertModel<typeof flightPlansTable>

export type FlightPlanPhaseSelectEntity = InferSelectModel<typeof flightPlanPhasesTable> & {
  phase: PhaseSelectEntity | null
}
export type FlightPlanPhaseInsertEntity = typeof flightPlanPhasesTable.$inferInsert

/**
 * Represents the repository for Flight Plans.
 */
export class FlightPlanRepository {
  /**
   * Gets all the Flight Plan entities from the database.
   * @param dbConnection - The database connection to use.
   */
  async getAll(dbConnection: DatabaseConnection): Promise<FlightPlanSelectEntity[]> {
    try {
      return await dbConnection.query.flightPlans.findMany({
        with: {
          flightPlanPhases: { with: { phase: { with: { phaseSteps: { with: { step: true } } } } } }
        }
      })
    } catch (error) {
      console.error('Failed to get all existing Flight Plan entities from the database.', error)
      throw new Error('Failed to get all existing Flight Plan entities from the database.', {
        cause: error
      })
    }
  }

  /**
   * Finds a Flight Plan with the provided ID.
   * @param id - The ID to search with.
   * @param dbConnection - The database connection to use.
   */
  async findById(
    id: string,
    dbConnection: DatabaseConnection
  ): Promise<FlightPlanSelectEntity | undefined> {
    try {
      return await dbConnection.query.flightPlans.findFirst({
        where: { id },
        with: {
          flightPlanPhases: { with: { phase: { with: { phaseSteps: { with: { step: true } } } } } }
        }
      })
    } catch (error) {
      console.error('Failed to find a Flight Plan with the provided ID.', error)
      throw new Error('Failed to find a Flight Plan with the provided ID.', {
        cause: error
      })
    }
  }

  /**
   * Inserts a new {@link FlightPlanInsertEntity | Flight Plan entity} in the database.
   * @param model - The model to insert.
   * @param dbConnection - The database connection to use.
   */
  async insert(
    model: FlightPlanInsertEntity,
    dbConnection: DatabaseConnection
  ): Promise<FlightPlanInsertEntity> {
    try {
      return (await dbConnection.insert(flightPlansTable).values(model).returning())[0]
    } catch (error) {
      console.error('Failed to insert a new Flight Plan entity in the database.', error)
      throw new Error('Failed to insert a new Flight Plan entity in the database.', {
        cause: error
      })
    }
  }

  /**
   * Updates a {@link FlightPlanInsertEntity | Flight Plan entity} in the database.
   * @param model - The model to update.
   * @param dbConnection - The database connection to use.
   */
  async update(
    model: FlightPlanInsertEntity,
    dbConnection: DatabaseConnection
  ): Promise<FlightPlanInsertEntity> {
    try {
      return (
        await dbConnection
          .update(flightPlansTable)
          .set(model)
          .where(eq(flightPlansTable.id, model.id))
          .returning()
      )[0]
    } catch (error) {
      console.error('Failed to update a Flight Plan entity in the database.', error)
      throw new Error('Failed to update a Flight Plan entity in the database.', {
        cause: error
      })
    }
  }
}

/**
 * Represents the repository for Flight Plan Phases.
 */
export class FlightPlanPhaseRepository {
  /**
   * Inserts new {@link FlightPlanPhaseInsertEntity[] | Flight Plan insert entities} in the database.
   * @param models - The models to insert.
   * @param dbConnection - The database connection to use.
   */
  async insertMany(
    models: FlightPlanPhaseInsertEntity[],
    dbConnection: DatabaseConnection
  ): Promise<FlightPlanPhaseInsertEntity[]> {
    try {
      return await dbConnection.insert(flightPlanPhasesTable).values(models).returning()
    } catch (error) {
      console.error('Failed to insert new Flight Plan Phase entities in the database.', error)
      throw new Error('Failed to insert new Flight Plan Phase entities in the database.', {
        cause: error
      })
    }
  }
}
