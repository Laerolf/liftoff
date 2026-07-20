import { defineRelations } from 'drizzle-orm'
import { timestamp, pgTable, varchar, json } from 'drizzle-orm/pg-core'

const ID_MAX_LENGTH = 36
const STRING_MAX_LENGTH = 150

/**
 * The Missions database table schema.
 */
export const missionsTable = pgTable('missions', {
  id: varchar({ length: ID_MAX_LENGTH }).primaryKey(),
  correlationId: varchar({ length: ID_MAX_LENGTH }).notNull().unique(),
  flightPlanId: varchar({ length: ID_MAX_LENGTH }),
  createdAt: timestamp({ mode: 'string' }).notNull(),
  lastUpdatedAt: timestamp({ mode: 'string' }),
  workflowBranch: varchar({ length: STRING_MAX_LENGTH }).notNull(),
  environment: varchar({ length: STRING_MAX_LENGTH }).notNull(),
  services: json().$type<string[]>().notNull().default([]),
  director: varchar({ length: STRING_MAX_LENGTH }).notNull(),
  status: varchar({ length: STRING_MAX_LENGTH }).notNull(),
  launchedAt: timestamp({ mode: 'string' }),
  completedAt: timestamp({ mode: 'string' })
})

/**
 * The Phases table schema.
 */
export const phasesTable = pgTable('phases', {
  id: varchar({ length: ID_MAX_LENGTH }).primaryKey(),
  missionId: varchar({ length: ID_MAX_LENGTH })
    .notNull()
    .references(() => missionsTable.id, { onDelete: 'cascade' }),
  status: varchar({ length: STRING_MAX_LENGTH }).notNull(),
  execution: varchar({ length: STRING_MAX_LENGTH }).notNull(),
  createdAt: timestamp({ mode: 'string' }).notNull(),
  lastUpdatedAt: timestamp({ mode: 'string' }),
  startedAt: timestamp({ mode: 'string' }),
  completedAt: timestamp({ mode: 'string' })
})

/**
 * The Steps table schema.
 */
export const stepsTable = pgTable('steps', {
  id: varchar({ length: ID_MAX_LENGTH }).primaryKey(),
  phaseId: varchar({ length: ID_MAX_LENGTH })
    .notNull()
    .references(() => phasesTable.id, { onDelete: 'cascade' }),
  repository: varchar({ length: STRING_MAX_LENGTH }).notNull(),
  workflowId: varchar({ length: STRING_MAX_LENGTH }).notNull(),
  createdAt: timestamp({ mode: 'string' }).notNull(),
  lastUpdatedAt: timestamp({ mode: 'string' }),
  startedAt: timestamp({ mode: 'string' }),
  completedAt: timestamp({ mode: 'string' }),
  workflowOutcome: varchar({ length: STRING_MAX_LENGTH }).notNull(),
  workflowInputs: json().$type<Record<string, string>>().notNull().default({})
})

export const relations = defineRelations(
  { missions: missionsTable, phases: phasesTable, steps: stepsTable },
  (relation) => ({
    missions: {
      phases: relation.many.phases({
        from: relation.missions.id,
        to: relation.phases.missionId
      })
    },
    phases: {
      steps: relation.many.steps({
        from: relation.phases.id,
        to: relation.steps.phaseId
      })
    }
  })
)
