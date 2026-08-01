import { Hono } from 'hono'

import FlightPlans from '@/app/flightPlans'
import Missions from '@/app/missions'

const app = new Hono()

app.route('/api/flight-plans', FlightPlans)
app.route('api/missions', Missions)

export default app
