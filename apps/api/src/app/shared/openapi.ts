import { MissionStatus, PhaseExecution, PhaseStatus, StepStatus } from '@liftoff/domain'

import type { OpenAPIObjectConfigure } from '@hono/zod-openapi'
import type { Env } from 'hono'

type OpenApiDocConfig = Exclude<OpenAPIObjectConfigure<Env, string>, (...args: never[]) => unknown>
type TagObject = NonNullable<OpenApiDocConfig['tags']>[number]

export const tags = {
  flightPlans: { name: 'Flight Plans', description: 'Manage Flight Plans.' },
  missions: { name: 'Missions', description: 'Manage Missions.' }
} satisfies Record<string, TagObject>

export const exampleValues = {
  id: '6666',
  workflowId: '6666',
  date: new Date('2025-07-22T00:00:00Z'),
  repositoryName: 'liftoff/test',
  branchName: 'protoype/hell-on-earth',
  environmentName: 'example',
  serviceIds: ['api', 'ui'],
  director: {
    name: 'Ozzy'
  },
  flightPlan: {
    name: 'Project Armageddon'
  },
  mission: {
    status: MissionStatus.Draft
  },
  phase: { status: PhaseStatus.Draft, executionMethod: PhaseExecution.Parallel },
  step: {
    workflowOutcome: StepStatus.Waiting,
    exposedWorkflowInputs: {},
    workflowInputs: {}
  }
}
