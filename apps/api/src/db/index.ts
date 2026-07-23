import { drizzle } from 'drizzle-orm/bun-sql'

import { useEnvConfig } from '@/config'

import { relations } from './schema'

export type DatabaseConnection =
  | typeof dbConnection
  | Parameters<Parameters<typeof dbConnection.transaction>[0]>[0]

const envConfig = useEnvConfig()

export const dbConnection = drizzle({
  connection: { url: envConfig.dbUrl, tls: envConfig.useTls },
  relations
})
