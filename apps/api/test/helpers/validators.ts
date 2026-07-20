import { isMissionStatus, isPhaseExecution, isPhaseStatus, isStepStatus } from '@liftoff/domain'

import { MissionDto } from '@/app/missions/dto'
import { PhaseDto } from '@/app/phases/dto'
import { StepDto } from '@/app/steps/dto'

/**
 * Tests whether the provided value is a valid {@link MissionDto}.
 * @param value - The value to test.
 */
export function isMissionDto(value: unknown): value is MissionDto {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.correlationId === 'string' &&
    (!candidate.flightPlanId || typeof candidate.flightPlanId === 'string') &&
    typeof candidate.workflowBranch === 'string' &&
    typeof candidate.environment === 'string' &&
    Array.isArray(candidate.services) &&
    !!candidate.services.length &&
    candidate.services.every((service) => typeof service === 'string') &&
    typeof candidate.director === 'string' &&
    isMissionStatus(candidate.status) &&
    (!candidate.launchedAt || isValidDateString(candidate.launchedAt)) &&
    (!candidate.phases ||
      (Array.isArray(candidate.phases) && candidate.phases.every(isPhaseDto))) &&
    isValidDateString(candidate.createdAt) &&
    (!candidate.lastUpdatedAt || isValidDateString(candidate.lastUpdatedAt)) &&
    (!candidate.completedAt || isValidDateString(candidate.completedAt))
  )
}

/**
 * Tests whether the provided value is a valid {@link PhaseDto}.
 * @param value - The value to test.
 */
export function isPhaseDto(value: unknown): value is PhaseDto {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.missionId === 'string' &&
    isPhaseStatus(candidate.status) &&
    isPhaseExecution(candidate.execution) &&
    (!candidate.steps || (Array.isArray(candidate.steps) && candidate.steps.every(isStepDto))) &&
    isValidDateString(candidate.createdAt) &&
    (!candidate.lastUpdatedAt || isValidDateString(candidate.lastUpdatedAt)) &&
    (!candidate.startedAt || isValidDateString(candidate.startedAt)) &&
    (!candidate.completedAt || isValidDateString(candidate.completedAt))
  )
}

/**
 * Tests whether the provided value is a valid {@link StepDto}.
 * @param value - The value to test.
 */
export function isStepDto(value: unknown): value is StepDto {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.phaseId === 'string' &&
    typeof candidate.repository === 'string' &&
    typeof candidate.workflowId === 'string' &&
    isValidDateString(candidate.createdAt) &&
    (!candidate.lastUpdatedAt || isValidDateString(candidate.lastUpdatedAt)) &&
    (!candidate.startedAt || isValidDateString(candidate.startedAt)) &&
    (!candidate.completedAt || isValidDateString(candidate.completedAt)) &&
    isStepStatus(candidate.workflowOutcome) &&
    (typeof candidate.workflowInputs === 'object' || candidate.workflowInputs === null)
  )
}

/**
 * Tests whether the provided value is a {@link Date} string.
 * @param value - The value to test.
 */
export function isValidDateString(value: unknown): value is Date {
  if (typeof value !== 'string') {
    return false
  }

  return !isNaN(new Date(value).getTime())
}
