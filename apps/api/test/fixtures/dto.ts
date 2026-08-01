import { FlightPlanDto } from '@/app/flightPlans/dto'
import { MissionDto } from '@/app/missions/dto'
import { PhaseDto } from '@/app/phases/dto'
import { StepDto } from '@/app/steps/dto'

import { EXAMPLE_VALUES } from './values'

const EXAMPLE_STEP_DTO = {
  id: EXAMPLE_VALUES.id,
  repository: EXAMPLE_VALUES.repositoryName,
  workflowId: EXAMPLE_VALUES.workflowId,
  exposedWorkflowInputs: EXAMPLE_VALUES.steps.exposedWorkflowInputs,
  workflowInputs: EXAMPLE_VALUES.steps.workflowInputs,
  workflowOutcome: EXAMPLE_VALUES.steps.workflowOutcome,
  startedAt: null,
  completedAt: null,
  createdAt: EXAMPLE_VALUES.date.toISOString(),
  lastUpdatedAt: null
} satisfies Record<keyof StepDto, unknown>

const EXAMPLE_PHASE_DTO = {
  id: EXAMPLE_VALUES.id,
  execution: EXAMPLE_VALUES.phases.executionMethod,
  status: EXAMPLE_VALUES.phases.status,
  steps: [EXAMPLE_STEP_DTO],
  startedAt: null,
  completedAt: null,
  createdAt: EXAMPLE_VALUES.date.toISOString(),
  lastUpdatedAt: null
} satisfies Record<keyof PhaseDto, unknown>

const EXAMPLE_MISSION_DTO = {
  id: EXAMPLE_VALUES.id,
  correlationId: EXAMPLE_VALUES.correlationId,
  flightPlanId: null,
  workflowBranch: EXAMPLE_VALUES.branchName,
  environment: EXAMPLE_VALUES.environmentName,
  services: EXAMPLE_VALUES.serviceIds,
  director: EXAMPLE_VALUES.director.name,
  status: EXAMPLE_VALUES.missions.status,
  launchedAt: null,
  phases: [EXAMPLE_PHASE_DTO],
  completedAt: null,
  createdAt: EXAMPLE_VALUES.date.toISOString(),
  lastUpdatedAt: null
} satisfies Record<keyof MissionDto, unknown>

const EXAMPLE_FLIGHT_PLAN_DTO = {
  id: EXAMPLE_VALUES.id,
  name: EXAMPLE_VALUES.flightPlans.name,
  workflowBranch: EXAMPLE_VALUES.branchName,
  environment: EXAMPLE_VALUES.environmentName,
  services: EXAMPLE_VALUES.serviceIds,
  phases: [EXAMPLE_PHASE_DTO],
  createdAt: EXAMPLE_VALUES.date.toISOString(),
  lastUpdatedAt: null
} satisfies Record<keyof FlightPlanDto, unknown>

/**
 * Creates a new example {@link MissionDto}.
 * @param overrides - Used to override properties.
 */
export function createExampleMissionDto(
  overrides?: Partial<typeof EXAMPLE_MISSION_DTO>
): typeof EXAMPLE_MISSION_DTO {
  return {
    ...EXAMPLE_MISSION_DTO,
    ...overrides
  }
}

/**
 * Creates a new example {@link FlightPlanDto}.
 * @param overrides - Used to override properties.
 */
export function createExampleFlightPlanDto(
  overrides?: Partial<typeof EXAMPLE_FLIGHT_PLAN_DTO>
): typeof EXAMPLE_FLIGHT_PLAN_DTO {
  return {
    ...EXAMPLE_FLIGHT_PLAN_DTO,
    ...overrides
  }
}
