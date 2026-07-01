/**
 * Tests whether the provided value is a {@link Date}.
 * @param value - The value to test.
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date
}
