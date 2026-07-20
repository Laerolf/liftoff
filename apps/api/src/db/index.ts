import { drizzle } from 'drizzle-orm/node-postgres'

import { config } from '@/config'

import { relations } from './schema'

export type DatabaseConnection =
  | typeof dbConnection
  | Parameters<Parameters<typeof dbConnection.transaction>[0]>[0]

export const dbConnection = drizzle({
  connection: { connectionString: config.dbUrl, ssl: config.useSsl },
  relations
})
