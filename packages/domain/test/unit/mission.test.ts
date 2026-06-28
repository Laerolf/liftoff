import { describe, test, expect } from '@jest/globals'
import { EXAMPLE_MISSION_VALUES, EXAMPLE_VALUES } from '@test/fixtures'

import Mission from '@/mission'
import { DomainError } from '@/shared/errors'

describe('Mission', () => {
  test('can be created', () => {
    // Given
    const {
      date,
      director: { name }
    } = EXAMPLE_VALUES

    const { status, phases } = EXAMPLE_MISSION_VALUES

    // When + Then
    expect(() => new Mission(crypto.randomUUID(), name, status, date, phases)).not.toThrow()
  })

  test('needs an ID', () => {
    // Given
    const {
      director: { name },
      date
    } = EXAMPLE_VALUES

    const { status, phases } = EXAMPLE_MISSION_VALUES

    const expectedError = new DomainError('A Mission needs an ID!')

    // When + Then
    // @ts-expect-error A Mission needs an ID.
    expect(() => new Mission(null, name, status, date, phases)).toThrow(expectedError)
  })

  test('needs a director', () => {
    // Given
    const { date } = EXAMPLE_VALUES

    const { status, phases } = EXAMPLE_MISSION_VALUES

    const expectedError = new DomainError('A Mission needs a director!')

    // When + Then
    // @ts-expect-error A Mission needs a director.
    expect(() => new Mission(crypto.randomUUID(), null, status, date, phases)).toThrow(
      expectedError
    )
  })

  test('needs a status', () => {
    // Given
    const {
      date,
      director: { name }
    } = EXAMPLE_VALUES

    const { phases } = EXAMPLE_MISSION_VALUES

    const expectedError = new DomainError('A Mission needs a status!')

    // When + Then
    // @ts-expect-error A Mission needs a status.
    expect(() => new Mission(crypto.randomUUID(), name, null, date, phases)).toThrow(expectedError)
  })

  test('needs a launch date', () => {
    // Given
    const {
      director: { name }
    } = EXAMPLE_VALUES

    const { status, phases } = EXAMPLE_MISSION_VALUES

    const expectedError = new DomainError('A Mission needs a valid launch date!')

    // When + Then
    // @ts-expect-error A Mission needs a valid launch date.
    expect(() => new Mission(crypto.randomUUID(), name, status, null, phases)).toThrow(
      expectedError
    )
  })

  test('needs valid phases', () => {
    // Given
    const {
      date,
      director: { name }
    } = EXAMPLE_VALUES

    const { status } = EXAMPLE_MISSION_VALUES

    const expectedError = new DomainError('A Mission requires valid phases!')

    // When + Then
    // @ts-expect-error A Mission needs valid phases.
    expect(() => new Mission(crypto.randomUUID(), name, status, date, null)).toThrow(expectedError)
    // @ts-expect-error A Mission needs valid phases.
    expect(() => new Mission(crypto.randomUUID(), name, status, date, 'test')).toThrow(
      expectedError
    )
    expect(() => new Mission(crypto.randomUUID(), name, status, date, [])).toThrow(expectedError)
  })
})
