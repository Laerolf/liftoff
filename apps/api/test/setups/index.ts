import path from 'node:path'
import { parseEnv } from 'node:util'

const testEnvPath = path.resolve(process.cwd(), '.env.test')
const testEnvFile = Bun.file(testEnvPath)

if (await testEnvFile.exists()) {
  const rawContent = await testEnvFile.text()

  const testVars = parseEnv(rawContent)
  Object.assign(process.env, testVars)
}
