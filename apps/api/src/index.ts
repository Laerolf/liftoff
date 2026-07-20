import { serve } from '@hono/node-server'

import App from '@/app'
import { config } from '@/config'

serve(
  {
    fetch: App.fetch,
    port: config.port
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)
