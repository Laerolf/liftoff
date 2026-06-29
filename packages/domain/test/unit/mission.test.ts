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

    const { branch, environment, services, status, phases } = EXAMPLE_MISSION_VALUES

    // When + Then
    expect(
      () =>
        new Mission(
          crypto.randomUUID(),
          crypto.randomUUID(),
          branch,
          environment,
          services,
          name,
          status,
          date,
          phases
        )
    ).not.toThrow()
  })

  test('needs an ID', () => {
    // Given
    const {
      director: { name },
      date
    } = EXAMPLE_VALUES

    const { branch, environment, services, status, phases } = EXAMPLE_MISSION_VALUES

    const expectedError = new DomainError('A Mission needs an ID!')

    // When + Then
    expect(
      // @ts-expect-error A Mission needs an ID.
      () => new Mission(null, branch, environment, services, name, status, date, phases)
    ).toThrow(expectedError)
  })

  test('needs a correlation ID', () => {
    // Given
    const {
      director: { name },
      date
    } = EXAMPLE_VALUES

    const { branch, environment, services, status, phases } = EXAMPLE_MISSION_VALUES

    const expectedError = new DomainError('A Mission needs a correlation ID!')

    // When + Then
    expect(
      () =>
        new Mission(
          crypto.randomUUID(),
          // @ts-expect-error A Mission needs a correlation ID.
          null,
          branch,
          environment,
          services,
          name,
          status,
          date,
          phases
        )
    ).toThrow(expectedError)
  })

  test('needs a target workflow branch name', () => {
    // Given
    const {
      director: { name },
      date
    } = EXAMPLE_VALUES

    const { environment, services, status, phases } = EXAMPLE_MISSION_VALUES

    const expectedError = new DomainError('A Mission needs a target workflow branch name!')

    // When + Then
    expect(
      () =>
        new Mission(
          crypto.randomUUID(),
          crypto.randomUUID(),
          // @ts-expect-error A Mission needs a target workflow branch name.
          null,
          environment,
          services,
          name,
          status,
          date,
          phases
        )
    ).toThrow(expectedError)
  })

  test('needs a target environment', () => {
    // Given
    const {
      director: { name },
      date
    } = EXAMPLE_VALUES

    const { branch, services, status, phases } = EXAMPLE_MISSION_VALUES

    const expectedError = new DomainError('A Mission needs a target environment!')

    // When + Then
    expect(
      () =>
        new Mission(
          crypto.randomUUID(),
          crypto.randomUUID(),
          branch,
          // @ts-expect-error A Mission needs a target environment.
          null,
          services,
          name,
          status,
          date,
          phases
        )
    ).toThrow(expectedError)
  })

  test('needs valid target service IDs', () => {
    // Given
    const {
      director: { name },
      date
    } = EXAMPLE_VALUES

    const { branch, environment, status, phases } = EXAMPLE_MISSION_VALUES

    const expectedError = new DomainError('A Mission needs valid target service IDs!')

    // When + Then
    expect(
      () =>
        new Mission(
          crypto.randomUUID(),
          crypto.randomUUID(),
          branch,
          environment,
          // @ts-expect-error A Mission needs valid target service IDs.
          null,
          name,
          status,
          date,
          phases
        )
    ).toThrow(expectedError)
    expect(
      () =>
        new Mission(
          crypto.randomUUID(),
          crypto.randomUUID(),
          branch,
          environment,
          // @ts-expect-error A Mission needs valid target service IDs.
          'test',
          name,
          status,
          date,
          phases
        )
    ).toThrow(expectedError)
    expect(
      () =>
        new Mission(
          crypto.randomUUID(),
          crypto.randomUUID(),
          branch,
          environment,
          [],
          name,
          status,
          date,
          phases
        )
    ).toThrow(expectedError)
  })

  test('needs a director', () => {
    // Given
    const { date } = EXAMPLE_VALUES

    const { branch, environment, services, status, phases } = EXAMPLE_MISSION_VALUES

    const expectedError = new DomainError('A Mission needs a director!')

    // When + Then
    expect(
      () =>
        new Mission(
          crypto.randomUUID(),
          crypto.randomUUID(),
          branch,
          environment,
          services,
          // @ts-expect-error A Mission needs a director.
          null,
          status,
          date,
          phases
        )
    ).toThrow(expectedError)
  })

  test('needs a status', () => {
    // Given
    const {
      date,
      director: { name }
    } = EXAMPLE_VALUES

    const { branch, environment, services, phases } = EXAMPLE_MISSION_VALUES

    const expectedError = new DomainError('A Mission needs a status!')

    // When + Then
    expect(
      () =>
        new Mission(
          crypto.randomUUID(),
          crypto.randomUUID(),
          branch,
          environment,
          services,
          name,
          // @ts-expect-error A Mission needs a status.
          null,
          date,
          phases
        )
    ).toThrow(expectedError)
  })

  test('needs a launch date', () => {
    // Given
    const {
      director: { name }
    } = EXAMPLE_VALUES

    const { branch, environment, services, status, phases } = EXAMPLE_MISSION_VALUES

    const expectedError = new DomainError('A Mission needs a valid launch date!')

    // When + Then
    expect(
      () =>
        new Mission(
          crypto.randomUUID(),
          crypto.randomUUID(),
          branch,
          environment,
          services,
          name,
          status,
          // @ts-expect-error A Mission needs a valid launch date.
          null,
          phases
        )
    ).toThrow(expectedError)
  })

  test('needs valid phases', () => {
    // Given
    const {
      date,
      director: { name }
    } = EXAMPLE_VALUES

    const { branch, environment, services, status } = EXAMPLE_MISSION_VALUES

    const expectedError = new DomainError('A Mission requires valid phases!')

    // When + Then
    expect(
      () =>
        new Mission(
          crypto.randomUUID(),
          crypto.randomUUID(),
          branch,
          environment,
          services,
          name,
          status,
          date,
          // @ts-expect-error A Mission needs valid phases.
          null
        )
    ).toThrow(expectedError)
    expect(
      () =>
        new Mission(
          crypto.randomUUID(),
          crypto.randomUUID(),
          branch,
          environment,
          services,
          name,
          status,
          date,
          // @ts-expect-error A Mission needs valid phases.
          'test'
        )
    ).toThrow(expectedError)
    expect(
      () =>
        new Mission(
          crypto.randomUUID(),
          crypto.randomUUID(),
          branch,
          environment,
          services,
          name,
          status,
          date,
          []
        )
    ).toThrow(expectedError)
  })
})
