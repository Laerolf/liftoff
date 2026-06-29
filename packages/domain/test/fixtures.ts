import Phase, { PhaseExecution } from '@/phase'
import { MissionStatus, PhaseStatus } from '@/status'
import { Step } from '@/step'

export const EXAMPLE_VALUES = {
  date: new Date('2025-07-22T00:00:00Z'),

  director: {
    name: 'Ozzy'
  }
}

export const EXAMPLE_STEP_VALUES = {
  repository: 'test',
  workflowId: '6666'
}

export const EXAMPLE_PHASE_VALUES = {
  status: PhaseStatus.Waiting,
  execution: PhaseExecution.Parallel,
  steps: [new Step(EXAMPLE_STEP_VALUES.repository, EXAMPLE_STEP_VALUES.workflowId)]
}

export const EXAMPLE_MISSION_VALUES = {
  services: ['app-a', 'app-b'],
  environment: 'develop',
  branch: 'protoype/hell-on-earth',
  status: MissionStatus.Launching,
  phases: [new Phase(PhaseStatus.Waiting, PhaseExecution.Parallel, EXAMPLE_PHASE_VALUES.steps)]
}
