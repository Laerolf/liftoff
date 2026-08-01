import { serve } from 'bun'

import App from '@/app'

import { useEnvConfig } from './config'

const envConfig = useEnvConfig()

const server = serve({
  port: envConfig.port,
  fetch: App.fetch
})

console.log(`Listening on ${server.url}`)
