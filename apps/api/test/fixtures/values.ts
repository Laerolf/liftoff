import { MissionStatus, PhaseExecution, PhaseStatus, StepStatus } from '@liftoff/domain'

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
    exposedWorkflowInputs: {}
  }
}
