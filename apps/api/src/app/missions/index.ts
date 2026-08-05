import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { validator } from 'hono/validator'
import status from 'http-status'
import { array } from 'zod'

import { dbConnection } from '@/db'

import { PhaseCreationForm } from '../phases/form'
import { AppContextMiddlewareVariables, setRequestContext } from '../shared/middleware'
import { tags } from '../shared/openapi'
import { StepCreationForm } from '../steps/form'

import { MissionDto } from './dto'
import { MissionFromScratchCreationForm } from './form'

const app = new OpenAPIHono<AppContextMiddlewareVariables>()

app.use(setRequestContext)

const getAllOpenApiRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      description: 'Return all existing Missions.',
      content: { 'application/json': { schema: array(MissionDto.schema) } }
    }
  },
  tags: [tags.missions.name]
})

app.openapi(getAllOpenApiRoute, async (context) => {
  try {
    const { missionQueryService } = context.get('context')

    const missions = (await missionQueryService.getAll(dbConnection)).map(MissionDto.from)
    return context.json(missions)
  } catch (error) {
    console.error('Failed to get all Missions.', { error })
    throw new HTTPException(status.INTERNAL_SERVER_ERROR, {
      message: 'Failed to get all Missions.'
    })
  }
})

const createOpenApiRoute = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: MissionFromScratchCreationForm.schema
        }
      },
      required: true
    }
  },
  responses: {
    200: {
      description: 'Return the newly created Mission.',
      content: { 'application/json': { schema: MissionDto.schema } }
    }
  },
  tags: [tags.missions.name]
})

app.openapi(createOpenApiRoute, async (context) => {
  try {
    const { missionCommandService } = context.get('context')

    const { workflowBranch, environment, services, director, phases } = context.req.valid('json')

    const form = new MissionFromScratchCreationForm(
      workflowBranch,
      environment,
      services,
      director,
      phases.map(({ execution, steps }) => {
        const stepCreationForms = steps.map(
          ({ repository, workflowId, exposedWorkflowInputs, workflowInputs }) =>
            new StepCreationForm(
              repository,
              workflowId,
              exposedWorkflowInputs || undefined,
              workflowInputs || undefined
            )
        )
        return new PhaseCreationForm(execution, stepCreationForms)
      })
    )

    const model = await dbConnection.transaction(async (tx) => {
      return await missionCommandService.createFromScratch(form, tx)
    })

    return context.json(MissionDto.from(model))
  } catch (error) {
    console.error('Failed to create a new Mission.', { error })
    throw new HTTPException(status.INTERNAL_SERVER_ERROR, {
      message: 'Failed to create a new Mission.'
    })
  }
})

export default app
