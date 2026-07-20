import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './.drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://liftoff:liftoff@localhost:5433/liftoff_test'
  }
})
