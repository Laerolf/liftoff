import { dbConnection } from '@/db'
import { missionsTable, phasesTable, stepsTable } from '@/db/schema'

/**
 * Deletes all records in the database.
 */
export async function clearDatabase() {
  await Promise.all([
    dbConnection.delete(stepsTable),
    dbConnection.delete(phasesTable),
    dbConnection.delete(missionsTable)
  ])
}
