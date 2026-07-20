import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'

describe('config', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    jest.resetModules()
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  test('should use default port when PORT is not set', async () => {
    delete process.env.PORT
    process.env.DATABASE_URL = 'armageddon://localhost/liftoff'

    const { config } = await import('@/config')
    expect(config.port).toBe(3000)
  })

  test('should use default port when PORT is not NAN', async () => {
    process.env.PORT = 'test'
    process.env.DATABASE_URL = 'armageddon://localhost/liftoff'

    const { config } = await import('@/config')
    expect(config.port).toBe(3000)
  })

  test('should use provided port', async () => {
    process.env.PORT = '4000'
    process.env.DATABASE_URL = 'armageddon://localhost/liftoff'

    const { config } = await import('@/config')
    expect(config.port).toBe(4000)
  })

  test('should throw when DATABASE_URL is missing', async () => {
    delete process.env.DATABASE_URL

    await expect(import('@/config')).rejects.toThrow(
      "Failed to find a required string environment variable: 'DATABASE_URL'"
    )
  })

  test('should parse USE_SSL as boolean', async () => {
    process.env.USE_SSL = 'true'
    process.env.DATABASE_URL = 'armageddon://localhost/liftoff'

    const { config } = await import('@/config')
    expect(config.useSsl).toBe(true)
  })
})
