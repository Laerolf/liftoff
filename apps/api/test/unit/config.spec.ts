import { beforeEach, describe, test, expect } from 'bun:test'

const { useEnvConfig } = await import('@/config')

describe('config', () => {
  beforeEach(() => {
    process.env.DATABASE_URL = 'test'
  })

  test('should use default port when PORT is not set', async () => {
    // Given
    delete process.env.PORT

    // When
    const config = useEnvConfig()

    // Then
    expect(config.port).toBe(3000)
  })

  test('should use default port when PORT is not NAN', async () => {
    // Given
    process.env.PORT = 'test'

    // When
    const config = useEnvConfig()

    // Then
    expect(config.port).toBe(3000)
  })

  test('should use provided port', async () => {
    // Given
    process.env.PORT = '4000'

    // When
    const config = useEnvConfig()

    // Then
    expect(config.port).toBe(4000)
  })

  test('should throw when DATABASE_URL is missing', async () => {
    // Given
    delete process.env.DATABASE_URL

    // When + then
    await expect(() => useEnvConfig()).toThrow(
      new Error('Failed to parse environment configuration.')
    )
  })

  test('should parse USE_SSL as boolean', async () => {
    // Given
    process.env.USE_TLS = 'true'

    // When
    const config = useEnvConfig()

    // Then
    expect(config.useTls).toBe(true)
  })
})
