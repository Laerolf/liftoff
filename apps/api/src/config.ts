/**
 * The expected CORS configuration.
 */
type CorsConfig = {
  origin: string[]
}

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
  /**
   * The CORS configuration.
   */
  cors: CorsConfig
}

const DEFAULT_PORT = 3000

/**
 * Parses a required environment variable to a string.
 * @param key - The key of the environment variable to parse.
 * @throws {Error} - When the expected environment variable doesn't exist.
 */
function parseRequiredEnvironmentConfigString(key: string): string {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Failed to find a required string environment variable: '${key}'`)
  }

  return value
}

/**
 * Parses a required environment variable to a string array.
 * @param key - The key of the environment variable to parse.
 * @throws {Error} - When the expected environment variable doesn't exist.
 */
function parseRequiredEnvironmentConfigStringArray(key: string): string[] {
  try {
    const value = process.env[key]

    if (!value) {
      throw new Error(`Failed to find a required string environment variable: '${key}'`)
    }

    return JSON.parse(value)
  } catch (error) {
    throw new Error(
      `Failed to parse the environment key '${key}' to a string array: ${(error as Error).message}`,
      { cause: error }
    )
  }
}

/**
 * Parses an environment variable to a number.
 * @param key - The key of the environment variable to parse.
 */
function parseEnvironmentConfigNumber(key: string): number | undefined {
  const value = process.env[key]

  if (!value) {
    return undefined
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? undefined : parsed
}

/**
 * Parses an environment variable to a boolean.
 * @param key - The key of the environment variable to parse.
 */
function parseEnvironmentConfigBoolean(key: string): boolean {
  return process.env[key] == 'true'
}

/**
 * Parses the environment configuration and returns it as an object.
 */
export function useEnvConfig(): EnvironmentConfig {
  try {
    return {
      port: parseEnvironmentConfigNumber('PORT') ?? DEFAULT_PORT,
      dbUrl: parseRequiredEnvironmentConfigString('DATABASE_URL'),
      useTls: parseEnvironmentConfigBoolean('USE_TLS'),
      cors: {
        origin: parseRequiredEnvironmentConfigStringArray('CORS_ORIGIN')
      }
    }
  } catch (error) {
    console.error('Failed to parse environment configuration.', { cause: error })
    throw new Error('Failed to parse environment configuration.', { cause: error })
  }
}
