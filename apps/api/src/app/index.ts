import { OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'
import { cors } from 'hono/cors'

import FlightPlans from '@/app/flightPlans'
import Missions from '@/app/missions'
import { useEnvConfig } from '@/config'

import { name, description, version } from '../../package.json'

import { tags } from './shared/openapi'

const app = new OpenAPIHono()

const config = useEnvConfig()

app.use(
  '/api/*',
  cors({
    origin: config.cors.origin,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
)

app.route('/api/flight-plans', FlightPlans).route('/api/missions', Missions)

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
