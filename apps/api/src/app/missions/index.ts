import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { validator } from 'hono/validator'
import status from 'http-status'

import { dbConnection } from '@/db'

import { PhaseCreationForm } from '../phases/form'
import { setRequestContext } from '../shared/middleware'

import { MissionDto } from './dto'
import { MissionFromScratchCreationForm } from './form'

const app = new Hono()

app.get('/', setRequestContext, async (context) => {
  try {
    const { missionQueryService } = context.get('context')

    const missions = await missionQueryService.getAll(dbConnection)
    return context.json(missions)
  } catch (error) {
    console.error('Failed to get all Missions.', { error })
    throw new HTTPException(status.INTERNAL_SERVER_ERROR, {
      message: 'Failed to get all Missions.'
    })
  }
})

app.post(
  '/',
  setRequestContext,
  validator('json', (value, context) => {
    const parsed = MissionFromScratchCreationForm.schema.safeParse(value)

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

    const { workflowBranch, environment, services, director, phases } = parsed.data

    return new MissionFromScratchCreationForm(
      workflowBranch,
      environment,
      services,
      director,
      phases as PhaseCreationForm[]
    )
  }),
  async (context) => {
    try {
      const { missionCommandService } = context.get('context')

      const form = context.req.valid('json')

      const model = await missionCommandService.createFromScratch(form, dbConnection)

      return context.json(MissionDto.from(model))
    } catch (error) {
      console.error('Failed to create a new Mission.', { error })
      throw new HTTPException(status.INTERNAL_SERVER_ERROR, {
        message: 'Failed to create a new Mission.'
      })
    }
  }
)

export default app
