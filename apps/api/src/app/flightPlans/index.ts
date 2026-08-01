import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { validator } from 'hono/validator'
import status from 'http-status'

import { dbConnection } from '@/db'

import { PhaseCreationForm } from '../phases/form'
import { setRequestContext } from '../shared/middleware'

import { FlightPlanDto } from './dto'
import { FlightPlanCreationForm } from './form'

const app = new Hono()

app.get('/', setRequestContext, async (context) => {
  try {
    const { flightPlanQueryService } = context.get('context')

    const flightPlans = (await flightPlanQueryService.getAll(dbConnection)).map(FlightPlanDto.from)
    return context.json(flightPlans)
  } catch (error) {
    console.error('Failed to get all Flight Plans.', { error })
    throw new HTTPException(status.INTERNAL_SERVER_ERROR, {
      message: 'Failed to get all Flight Plans.'
    })
  }
})

app.post(
  '/',
  setRequestContext,
  validator('json', (value, context) => {
    const parsed = FlightPlanCreationForm.schema.safeParse(value)

    if (!parsed.success) {
      return context.json(
        {
          message: 'Invalid request body',
          errors: parsed.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        status.UNPROCESSABLE_ENTITY
      )
    }

    const { name, workflowBranch, environment, services, phases } = parsed.data

    return new FlightPlanCreationForm(
      name,
      workflowBranch,
      environment,
      services,
      phases as PhaseCreationForm[]
    )
  }),
  async (context) => {
    try {
      const { flightPlanCommandService } = context.get('context')

      const form = context.req.valid('json')

      const model = await dbConnection.transaction(async (tx) => {
        return await flightPlanCommandService.create(form, tx)
      })

      return context.json(FlightPlanDto.from(model))
    } catch (error) {
      console.error('Failed to create a new Flight Plan.', { error })
      throw new HTTPException(status.INTERNAL_SERVER_ERROR, {
        message: 'Failed to create a new Flight Plan.'
      })
    }
  }
)

export default app
