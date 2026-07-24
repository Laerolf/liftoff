import {
  FlightPlan,
  Mission,
  MissionStatus,
  Phase,
  PhaseExecution,
  PhaseStatus,
  Step,
  StepStatus
} from '@/index'

export const EXAMPLE_VALUES = {
  id: '6666',
  workflowId: '6666',
  correlationId: '6666',
  date: new Date('2025-07-22T00:00:00Z'),
  repositoryName: 'liftoff/test',
  branchName: 'protoype/hell-on-earth',
  environmentName: 'test',
  serviceIds: ['app-a', 'app-b'],
  director: {
    name: 'Ozzy'
  },
  flightPlans: {
    name: 'Armageddon'
  },
  missions: {
    status: MissionStatus.Draft
  },
  phases: { status: PhaseStatus.Draft, executionMethod: PhaseExecution.Parallel },
  steps: {
    workflowOutcome: StepStatus.Waiting,
    exposedWorkflowInputs: {},
    workflowInputs: {}
  }
}

export const EXAMPLE_FLIGHT_PLAN = FlightPlan.create(
  EXAMPLE_VALUES.flightPlans.name,
  EXAMPLE_VALUES.branchName,
  EXAMPLE_VALUES.environmentName,
  EXAMPLE_VALUES.serviceIds
)

export const EXAMPLE_MISSION = Mission.from(EXAMPLE_FLIGHT_PLAN, EXAMPLE_VALUES.director.name)

export const EXAMPLE_PHASE = Phase.create(EXAMPLE_VALUES.phases.executionMethod)

export const EXAMPLE_STEP = Step.create(
  EXAMPLE_VALUES.repositoryName,
  EXAMPLE_VALUES.workflowId,
  EXAMPLE_VALUES.steps.exposedWorkflowInputs
)
