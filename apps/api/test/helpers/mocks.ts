import { MockInstance, vi } from 'vitest'

/**
 * Mocks a database repository class.
 * @param targetClass - The database repository class to mock.
 * @param methods - The methods of the database repository class to mock.
 */
export function setupMockRepository<T extends object>(
  targetClass: { prototype: T },
  methods: {
    [K in keyof T]?: T[K] extends (...args: any[]) => any ? Awaited<ReturnType<T[K]>> : never
  }
) {
  Object.entries(methods).forEach(([methodName, value]) => {
    const spy = vi.spyOn(targetClass.prototype, methodName as any)
    const mockSpy = spy as MockInstance<(...args: any[]) => any>
    mockSpy.mockResolvedValueOnce(value)
  })
}
