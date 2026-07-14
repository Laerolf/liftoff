import { MissionStatus, PhaseStatus, StepStatus } from '../models/status'

const VALID_MISSION_STATUSES = new Set<unknown>(Object.values(MissionStatus))
const VALID_PHASE_STATUSES = new Set<unknown>(Object.values(PhaseStatus))
const VALID_STEP_STATUSES = new Set<unknown>(Object.values(StepStatus))

/**
 * Tests whether the provided value is a {@link MissionStatus}.
 * @param value - The value to test.
 */
export function isMissionStatus(value: unknown): value is MissionStatus {
  return VALID_MISSION_STATUSES.has(value)
}

/**
 * Tests whether the provided value is a {@link PhaseStatus}.
 * @param value - The value to test.
 */
export function isPhaseStatus(value: unknown): value is PhaseStatus {
  return VALID_PHASE_STATUSES.has(value)
}

/**
 * Tests whether the provided value is a {@link StepStatus}.
 * @param value - The value to test.
 */
export function isStepStatus(value: unknown): value is StepStatus {
  return VALID_STEP_STATUSES.has(value)
}
