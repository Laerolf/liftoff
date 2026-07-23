import { defineConfig } from 'drizzle-kit'

import { useEnvConfig } from './src/config'

export default defineConfig({
  out: './.drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: useEnvConfig().dbUrl
  }
})
