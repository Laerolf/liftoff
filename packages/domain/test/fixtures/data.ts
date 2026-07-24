import { EXAMPLE_VALUES } from './values'

export const EXAMPLE_STEP_DATA = {
  id: EXAMPLE_VALUES.id,
  phaseId: EXAMPLE_VALUES.id,
  repository: EXAMPLE_VALUES.repositoryName,
  workflowId: EXAMPLE_VALUES.workflowId,
  workflowOutcome: EXAMPLE_VALUES.steps.workflowOutcome,
  exposedWorkflowInputs: EXAMPLE_VALUES.steps.exposedWorkflowInputs,
  workflowInputs: EXAMPLE_VALUES.steps.workflowInputs,
  createdAt: EXAMPLE_VALUES.date,
  lastUpdatedAt: EXAMPLE_VALUES.date,
  startedAt: EXAMPLE_VALUES.date,
  completedAt: EXAMPLE_VALUES.date
}

export const EXAMPLE_PHASE_DATA = {
  id: EXAMPLE_VALUES.id,
  missionId: EXAMPLE_VALUES.id,
  status: EXAMPLE_VALUES.phases.status,
  execution: EXAMPLE_VALUES.phases.executionMethod,
  steps: [EXAMPLE_STEP_DATA],
  createdAt: EXAMPLE_VALUES.date,
  lastUpdatedAt: EXAMPLE_VALUES.date,
  startedAt: EXAMPLE_VALUES.date,
  completedAt: EXAMPLE_VALUES.date
}

export const EXAMPLE_MISSION_DATA = {
  id: EXAMPLE_VALUES.id,
  correlationId: EXAMPLE_VALUES.correlationId,
  flightPlanId: null,
  workflowBranch: EXAMPLE_VALUES.branchName,
  environment: EXAMPLE_VALUES.environmentName,
  services: EXAMPLE_VALUES.serviceIds,
  director: EXAMPLE_VALUES.director.name,
  status: EXAMPLE_VALUES.missions.status,
  launchedAt: null,
  phases: [EXAMPLE_PHASE_DATA],
  createdAt: EXAMPLE_VALUES.date,
  lastUpdatedAt: null,
  completedAt: null
}

export const EXAMPLE_FLIGHT_PLAN_DATA = {
  id: EXAMPLE_VALUES.id,
  name: EXAMPLE_VALUES.flightPlans.name,
  workflowBranch: EXAMPLE_VALUES.branchName,
  environment: EXAMPLE_VALUES.environmentName,
  services: EXAMPLE_VALUES.serviceIds,
  phases: [EXAMPLE_PHASE_DATA],
  createdAt: EXAMPLE_VALUES.date,
  lastUpdatedAt: EXAMPLE_VALUES.date
}

/**
 * Creates a new example Step data.
 * @param overrides - Used to override the default values of the data to create.
 */
export function createExampleStepData(
  overrides?: Partial<typeof EXAMPLE_STEP_DATA> | Record<string, unknown>
): typeof EXAMPLE_STEP_DATA {
  return {
    ...EXAMPLE_STEP_DATA,
    ...overrides
  }
}

/**
 * Creates a new example Phase data.
 * @param overrides - Used to override the default values of the data to create.
 */
export function createExamplePhaseData(
  overrides?: Partial<typeof EXAMPLE_PHASE_DATA> | Record<string, unknown>
): typeof EXAMPLE_PHASE_DATA {
  return {
    ...EXAMPLE_PHASE_DATA,
    ...overrides
  }
}

/**
 * Creates a new example Mission data.
 * @param overrides - Used to override the default values of the data to create.
 */
export function createExampleMissionData(
  overrides?: Partial<typeof EXAMPLE_MISSION_DATA> | Record<string, unknown>
): typeof EXAMPLE_MISSION_DATA {
  return {
    ...EXAMPLE_MISSION_DATA,
    ...overrides
  }
}

/**
 * Creates a new example Flight Plan data.
 * @param overrides - Used to override the default values of the data to create.
 */
export function createExampleFlightPlanData(
  overrides?: Partial<typeof EXAMPLE_FLIGHT_PLAN_DATA> | Record<string, unknown>
): typeof EXAMPLE_FLIGHT_PLAN_DATA {
  return {
    ...EXAMPLE_FLIGHT_PLAN_DATA,
    ...overrides
  }
}
