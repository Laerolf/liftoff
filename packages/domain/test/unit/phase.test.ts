import { describe, test, expect } from '@jest/globals'
import { EXAMPLE_PHASE_VALUES } from '@test/fixtures'

import Phase from '@/phase'
import { DomainError } from '@/shared/errors'

describe('Phase', () => {
  test('can be created', () => {
    // Given
    const { status, execution, steps } = EXAMPLE_PHASE_VALUES

    // When + Then
    expect(() => new Phase(status, execution, steps)).not.toThrow()
  })

  test('needs a status', () => {
    // Given
    const { execution, steps } = EXAMPLE_PHASE_VALUES

    const expectedError = new DomainError('A Phase needs a status!')

    // When + Then
    // @ts-expect-error A Phase needs a status.
    expect(() => new Phase(null, execution, steps)).toThrow(expectedError)
  })

  test('needs an execution method', () => {
    // Given
    const { status, steps } = EXAMPLE_PHASE_VALUES

    const expectedError = new DomainError('A Phase needs an execution method!')

    // When + Then
    // @ts-expect-error A Phase needs an execution method.
    expect(() => new Phase(status, null, steps)).toThrow(expectedError)
  })

  test('needs valid steps', () => {
    // Given
    const { status, execution } = EXAMPLE_PHASE_VALUES

    const expectedError = new DomainError('A Phase needs valid steps!')

    // When + Then
    // @ts-expect-error A Phase needs valid steps.
    expect(() => new Phase(status, execution, null)).toThrow(expectedError)
    // @ts-expect-error A Phase needs valid steps.
    expect(() => new Phase(status, execution, 'test')).toThrow(expectedError)
    expect(() => new Phase(status, execution, [])).toThrow(expectedError)
  })
})
