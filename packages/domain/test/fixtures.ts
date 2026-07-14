import { Phase, PhaseExecution } from '@/models/phase'
import { MissionStatus, PhaseStatus, StepStatus } from '@/models/status'
import { Step } from '@/models/step'

export const EXAMPLE_VALUES = {
  date: new Date('2025-07-22T00:00:00Z'),

  director: {
    name: 'Ozzy'
  }
}

export const EXAMPLE_STEP_VALUES = {
  repository: 'test',
  workflowId: '6666',
  outcome: StepStatus.Waiting
}

export const EXAMPLE_PHASE_VALUES = {
  status: PhaseStatus.Waiting,
  execution: PhaseExecution.Parallel,
  steps: [Step.create('5555', EXAMPLE_STEP_VALUES.repository, EXAMPLE_STEP_VALUES.workflowId)]
}

export const EXAMPLE_FLIGHT_PLAN_VALUES = {
  name: 'Armageddon',
  services: ['app-a', 'app-b'],
  environment: 'develop',
  branch: 'protoype/hell-on-earth',
  phases: [Phase.create('4444', PhaseExecution.Parallel, EXAMPLE_PHASE_VALUES.steps)]
}

export const EXAMPLE_MISSION_VALUES = {
  ...EXAMPLE_FLIGHT_PLAN_VALUES,
  status: MissionStatus.Launching
}
