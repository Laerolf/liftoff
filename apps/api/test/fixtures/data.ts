import { MissionSelectEntity } from '@/app/missions/repository'
import { PhaseSelectEntity } from '@/app/phases/repository'
import { StepSelectEntity } from '@/app/steps/repository'

import { EXAMPLE_VALUES } from './values'

export const EXAMPLE_STEP_ENTITY: StepSelectEntity = {
  id: EXAMPLE_VALUES.id,
  phaseId: EXAMPLE_VALUES.id,
  repository: EXAMPLE_VALUES.repositoryName,
  workflowId: EXAMPLE_VALUES.workflowId,
  workflowOutcome: EXAMPLE_VALUES.steps.workflowOutcome,
  workflowInputs: EXAMPLE_VALUES.steps.exposedWorkflowInputs,
  createdAt: EXAMPLE_VALUES.date.toISOString(),
  lastUpdatedAt: null,
  startedAt: null,
  completedAt: null
}

export const EXAMPLE_PHASE_ENTITY: PhaseSelectEntity = {
  id: EXAMPLE_VALUES.id,
  missionId: EXAMPLE_VALUES.id,
  steps: [EXAMPLE_STEP_ENTITY],
  status: EXAMPLE_VALUES.phases.status,
  execution: EXAMPLE_VALUES.phases.executionMethod,
  createdAt: EXAMPLE_VALUES.date.toISOString(),
  lastUpdatedAt: null,
  startedAt: null,
  completedAt: null
}

export const EXAMPLE_MISSION_ENTITY: MissionSelectEntity = {
  id: EXAMPLE_VALUES.id,
  correlationId: EXAMPLE_VALUES.correlationId,
  flightPlanId: null,
  workflowBranch: EXAMPLE_VALUES.branchName,
  environment: EXAMPLE_VALUES.environmentName,
  services: EXAMPLE_VALUES.serviceIds,
  director: EXAMPLE_VALUES.director.name,
  phases: [EXAMPLE_PHASE_ENTITY],
  status: EXAMPLE_VALUES.missions.status,
  launchedAt: null,
  createdAt: EXAMPLE_VALUES.date.toISOString(),
  lastUpdatedAt: null,
  completedAt: null
}

/**
 * Creates a new example Step entity.
 * @param overrides - Used to override the default values of the entity to create.
 */
export function createExampleStepEntity(
  overrides?: Partial<typeof EXAMPLE_STEP_ENTITY> | Record<string, unknown>
): typeof EXAMPLE_STEP_ENTITY {
  return {
    ...EXAMPLE_STEP_ENTITY,
    ...overrides
  }
}

/**
 * Creates a new example Phase entity.
 * @param overrides - Used to override the default values of the entity to create.
 */
export function createExamplePhaseEntity(
  overrides?: Partial<typeof EXAMPLE_PHASE_ENTITY> | Record<string, unknown>
): typeof EXAMPLE_PHASE_ENTITY {
  return {
    ...EXAMPLE_PHASE_ENTITY,
    ...overrides
  }
}

/**
 * Creates a new example Mission entity.
 * @param overrides - Used to override the default values of the entity to create.
 */
export function createExampleMissionEntity(
  overrides?: Partial<typeof EXAMPLE_MISSION_ENTITY> | Record<string, unknown>
): typeof EXAMPLE_MISSION_ENTITY {
  return {
    ...EXAMPLE_MISSION_ENTITY,
    ...overrides
  }
}
