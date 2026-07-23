/**
 * The expected environment configuration.
 */
type EnvironmentConfig = {
  /**
   * The port number to run on the application with. By default: 3000.
   */
  port: number
  /**
   * The database URL to connect to.
   */
  dbUrl: string
  /**
   * Use TLS?
   */
  useTls: boolean
}

const DEFAULT_PORT = 3000

/**
 * Verifies if an environment string variable exists and parses it to a string.
 * @param key - The key of the environment variable.
 */
function verifyRequiredEnvironmentConfigStringEntry(key: string): string {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Failed to find a required string environment variable: '${key}'`)
  }

  return value
}

/**
 * Verifies if an environment boolean variable exists and parses it to a number.
 * @param key - The key of the environment variable.
 */
function verifyEnvironmentConfigNumberEntry(key: string): number | undefined {
  const value = process.env[key]

  if (!value) {
    return undefined
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? undefined : parsed
}

/**
 * Verifies if an environment boolean variable exists and parses it to a boolean.
 * @param key - The key of the environment variable.
 */
function verifyEnvironmentConfigBooleanEntry(key: string): boolean {
  return process.env[key] == 'true'
}

/**
 * Parses the environment configuration and returns it as an object.
 */
export function useEnvConfig(): EnvironmentConfig {
  try {
    return {
      port: verifyEnvironmentConfigNumberEntry('PORT') ?? DEFAULT_PORT,
      dbUrl: verifyRequiredEnvironmentConfigStringEntry('DATABASE_URL'),
      useTls: verifyEnvironmentConfigBooleanEntry('USE_TLS')
    }
  } catch (error) {
    console.error('Failed to parse environment configuration.', { cause: error })
    throw new Error('Failed to parse environment configuration.', { cause: error })
  }
}
