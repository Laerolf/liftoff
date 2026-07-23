import { Hono } from 'hono'

import Missions from '@/app/missions'

const app = new Hono()

app.route('api/missions', Missions)

export default app
