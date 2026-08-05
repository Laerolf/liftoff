import { OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'

import FlightPlans from '@/app/flightPlans'
import Missions from '@/app/missions'

import { name, description, version } from '../../package.json'

import { tags } from './shared/openapi'

const app = new OpenAPIHono()

app.route('/api/flight-plans', FlightPlans)
app.route('/api/missions', Missions)

app.doc('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: name,
    version,
    description
  },
  tags: Object.values(tags)
})

app.get(
  '/docs',
  Scalar({
    url: '/openapi.json',
    theme: 'deepSpace',
    agent: { disabled: true },
    mcp: { disabled: true },
    showDeveloperTools: 'localhost'
  })
)

export default app
