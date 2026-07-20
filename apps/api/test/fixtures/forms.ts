import { MissionFromScratchCreationForm } from '@/app/missions/form'
import { PhaseCreationForm } from '@/app/phases/form'
import { StepCreationForm } from '@/app/steps/form'

import { EXAMPLE_VALUES } from './values'

const EXAMPLE_STEP_CREATION_FORM: StepCreationForm = {
  repository: EXAMPLE_VALUES.repositoryName,
  workflowId: EXAMPLE_VALUES.workflowId,
  workflowInputs: EXAMPLE_VALUES.steps.exposedWorkflowInputs
}

const EXAMPLE_PHASE_CREATION_FORM: PhaseCreationForm = {
  execution: EXAMPLE_VALUES.phases.executionMethod,
  steps: [EXAMPLE_STEP_CREATION_FORM]
}

const EXAMPLE_MISSION_FROM_SCRATCH_CREATION_FORM: MissionFromScratchCreationForm = {
  director: EXAMPLE_VALUES.director.name,
  environment: EXAMPLE_VALUES.environmentName,
  phases: [EXAMPLE_PHASE_CREATION_FORM],
  services: EXAMPLE_VALUES.serviceIds,
  workflowBranch: EXAMPLE_VALUES.branchName
}

/**
 * Creates an example {@link MissionFromScratchCreationForm}.
 * @param overrides - Used to override properties.
 */
export function createExampleMissionFromScratchCreationForm(
  overrides?: Partial<MissionFromScratchCreationForm> | Record<string, unknown>
): MissionFromScratchCreationForm {
  return {
    ...EXAMPLE_MISSION_FROM_SCRATCH_CREATION_FORM,
    ...overrides
  }
}
