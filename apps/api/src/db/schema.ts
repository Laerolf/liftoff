import { defineRelations } from 'drizzle-orm'
import { timestamp, pgTable, varchar, json, integer } from 'drizzle-orm/pg-core'

const ID_MAX_LENGTH = 36
const STRING_MAX_LENGTH = 150

/**
 * The FlightPlans database table schema.
 */
export const flightPlansTable = pgTable('flight-plans', {
  id: varchar({ length: ID_MAX_LENGTH }).primaryKey(),
  name: varchar({ length: STRING_MAX_LENGTH }).notNull().unique(),
  createdAt: timestamp({ mode: 'string' }).notNull(),
  lastUpdatedAt: timestamp({ mode: 'string' }),
  workflowBranch: varchar({ length: STRING_MAX_LENGTH }).notNull(),
  environment: varchar({ length: STRING_MAX_LENGTH }).notNull(),
  services: json().$type<string[]>().notNull().default([])
})

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
  status: varchar({ length: STRING_MAX_LENGTH }).notNull(),
  execution: varchar({ length: STRING_MAX_LENGTH }).notNull(),
  createdAt: timestamp({ mode: 'string' }).notNull(),
  lastUpdatedAt: timestamp({ mode: 'string' }),
  startedAt: timestamp({ mode: 'string' }),
  completedAt: timestamp({ mode: 'string' })
})

/**
 * The FlightPlan Phases table schema.
 */
export const flightPlanPhasesTable = pgTable('flight-plan-phases', {
  flightPlanId: varchar({ length: ID_MAX_LENGTH })
    .notNull()
    .references(() => flightPlansTable.id, { onDelete: 'cascade' }),
  phaseId: varchar({ length: ID_MAX_LENGTH })
    .notNull()
    .references(() => phasesTable.id, { onDelete: 'cascade' }),
  order: integer().notNull()
})

/**
 * The Mission Phases table schema.
 */
export const missionPhasesTable = pgTable('mission-phases', {
  missionId: varchar({ length: ID_MAX_LENGTH })
    .notNull()
    .references(() => missionsTable.id, { onDelete: 'cascade' }),
  phaseId: varchar({ length: ID_MAX_LENGTH })
    .notNull()
    .references(() => phasesTable.id, { onDelete: 'cascade' }),
  order: integer().notNull()
})

/**
 * The Steps table schema.
 */
export const stepsTable = pgTable('steps', {
  id: varchar({ length: ID_MAX_LENGTH }).primaryKey(),
  repository: varchar({ length: STRING_MAX_LENGTH }).notNull(),
  workflowId: varchar({ length: STRING_MAX_LENGTH }).notNull(),
  createdAt: timestamp({ mode: 'string' }).notNull(),
  lastUpdatedAt: timestamp({ mode: 'string' }),
  startedAt: timestamp({ mode: 'string' }),
  completedAt: timestamp({ mode: 'string' }),
  workflowOutcome: varchar({ length: STRING_MAX_LENGTH }).notNull(),
  exposedWorkflowInputs: json().$type<Record<string, string>>().notNull().default({}),
  workflowInputs: json().$type<Record<string, string>>().notNull().default({})
})

/**
 * The Phase Steps table schema.
 */
export const phaseStepsTable = pgTable('phase-steps', {
  phaseId: varchar({ length: ID_MAX_LENGTH })
    .notNull()
    .references(() => phasesTable.id, { onDelete: 'cascade' }),
  stepId: varchar({ length: ID_MAX_LENGTH })
    .notNull()
    .references(() => stepsTable.id, { onDelete: 'cascade' }),
  order: integer().notNull()
})

export const relations = defineRelations(
  {
    flightPlans: flightPlansTable,
    missions: missionsTable,
    phases: phasesTable,
    flightPlanPhases: flightPlanPhasesTable,
    missionPhases: missionPhasesTable,
    steps: stepsTable,
    phaseSteps: phaseStepsTable
  },
  (relation) => ({
    flightPlans: {
      flightPlanPhases: relation.many.flightPlanPhases({
        from: relation.flightPlans.id,
        to: relation.flightPlanPhases.flightPlanId
      })
    },
    flightPlanPhases: {
      phase: relation.one.phases({
        from: relation.flightPlanPhases.phaseId,
        to: relation.phases.id
      })
    },
    missions: {
      missionPhases: relation.many.missionPhases({
        from: relation.missions.id,
        to: relation.missionPhases.missionId
      })
    },
    missionPhases: {
      phase: relation.one.phases({
        from: relation.missionPhases.phaseId,
        to: relation.phases.id
      })
    },
    phases: {
      phaseSteps: relation.many.phaseSteps({
        from: relation.phases.id,
        to: relation.phaseSteps.phaseId
      })
    },
    phaseSteps: {
      step: relation.one.steps({
        from: relation.phaseSteps.stepId,
        to: relation.steps.id
      })
    }
  })
)
