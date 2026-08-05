import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import status from 'http-status'
import { array } from 'zod'

import { dbConnection } from '@/db'

import { PhaseCreationForm } from '../phases/form'
import { AppContextMiddlewareVariables, setRequestContext } from '../shared/middleware'
import { tags } from '../shared/openapi'
import { StepCreationForm } from '../steps/form'

import { FlightPlanDto } from './dto'
import { FlightPlanCreationForm } from './form'

const app = new OpenAPIHono<AppContextMiddlewareVariables>()

app.use(setRequestContext)

const getAllOpenApiRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    [status.OK]: {
      description: 'Return all existing Flight Plans.',
      content: { 'application/json': { schema: array(FlightPlanDto.schema) } }
    }
  },
  tags: [tags.flightPlans.name]
})

app.openapi(getAllOpenApiRoute, async (context) => {
  try {
    const { flightPlanQueryService } = context.get('context')

    const flightPlans = (await flightPlanQueryService.getAll(dbConnection)).map(FlightPlanDto.from)
    return context.json(flightPlans, status.OK)
  } catch (error) {
    console.error('Failed to get all Flight Plans.', { error })
    throw new HTTPException(status.INTERNAL_SERVER_ERROR, {
      message: 'Failed to get all Flight Plans.'
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
          schema: FlightPlanCreationForm.schema
        }
      },
      required: true
    }
  },
  responses: {
    [status.OK]: {
      description: 'Return the newly created Flight Plan.',
      content: { 'application/json': { schema: FlightPlanDto.schema } }
    }
  },
  tags: [tags.flightPlans.name]
})

app.openapi(createOpenApiRoute, async (context) => {
  try {
    const { flightPlanCommandService } = context.get('context')

    const { name, workflowBranch, environment, services, phases } = context.req.valid('json')

    const form = new FlightPlanCreationForm(
      name,
      workflowBranch,
      environment,
      services,
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
      return await flightPlanCommandService.create(form, tx)
    })

    return context.json(FlightPlanDto.from(model), status.OK)
  } catch (error) {
    console.error('Failed to create a new Flight Plan.', { error })
    throw new HTTPException(status.INTERNAL_SERVER_ERROR, {
      message: 'Failed to create a new Flight Plan.'
    })
  }
})

export default app
