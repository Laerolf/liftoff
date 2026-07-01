import { describe, test, expect } from '@jest/globals'
import { EXAMPLE_FLIGHT_PLAN_VALUES } from '@test/fixtures'

import FlightPlan from '@/models/flightPlan'
import { DomainError } from '@/shared/errors'

describe('FlightPlan', () => {
  describe('create', () => {
    test('can be created', () => {
      // Given
      const { name, branch, environment, services, phases } = EXAMPLE_FLIGHT_PLAN_VALUES

      // When
      const flightPlan = FlightPlan.create(name, branch, environment, services, phases)

      // Then
      expect(flightPlan.id).toBeDefined()
    })
  })

  describe('restore', () => {
    test('can be restored', () => {
      // Given
      const { name, branch, environment, services, phases } = EXAMPLE_FLIGHT_PLAN_VALUES

      // When + Then
      expect(() =>
        FlightPlan.restore(crypto.randomUUID(), name, branch, environment, services, phases)
      ).not.toThrow()
    })

    test('needs an ID', () => {
      // Given
      const { name, branch, environment, services, phases } = EXAMPLE_FLIGHT_PLAN_VALUES

      const expectedError = new DomainError('A Flight Plan needs an ID!')

      // When + Then
      expect(
        // @ts-expect-error A Flight Plan needs an ID.
        () => FlightPlan.restore(null, name, branch, environment, services, phases)
      ).toThrow(expectedError)
    })

    test('needs a name', () => {
      // Given
      const { branch, environment, services, phases } = EXAMPLE_FLIGHT_PLAN_VALUES

      const expectedError = new DomainError('A Flight Plan needs a name!')

      // When + Then
      expect(
        // @ts-expect-error A Flight Plan needs a name.
        () => FlightPlan.restore(crypto.randomUUID(), null, branch, environment, services, phases)
      ).toThrow(expectedError)
    })

    test('needs a target workflow branch name', () => {
      // Given
      const { name, environment, services, phases } = EXAMPLE_FLIGHT_PLAN_VALUES

      const expectedError = new DomainError('A Flight Plan needs a target workflow branch name!')

      // When + Then
      expect(
        // @ts-expect-error A Flight Plan needs a target workflow branch na,e.
        () => FlightPlan.restore(crypto.randomUUID(), name, null, environment, services, phases)
      ).toThrow(expectedError)
    })

    test('needs a target environment', () => {
      // Given
      const { name, branch, services, phases } = EXAMPLE_FLIGHT_PLAN_VALUES

      const expectedError = new DomainError('A Flight Plan needs a target environment!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Flight Plan needs a target environment.
        FlightPlan.restore(crypto.randomUUID(), name, branch, null, services, phases)
      ).toThrow(expectedError)
    })

    test('needs valid target service IDs', () => {
      // Given
      const { name, branch, environment, phases } = EXAMPLE_FLIGHT_PLAN_VALUES

      const expectedError = new DomainError('A Flight Plan needs valid target service IDs!')

      // When + Then
      expect(
        // @ts-expect-error A Flight Plan needs valid target service IDs.
        () => FlightPlan.restore(crypto.randomUUID(), name, branch, environment, null, phases)
      ).toThrow(expectedError)
      expect(
        // @ts-expect-error A Flight Plan needs valid target service IDs.
        () => FlightPlan.restore(crypto.randomUUID(), name, branch, environment, 'test', phases)
      ).toThrow(expectedError)
      expect(() =>
        FlightPlan.restore(crypto.randomUUID(), name, branch, environment, [], phases)
      ).toThrow(expectedError)
    })

    test('needs valid phases', () => {
      // Given
      const { name, branch, environment, services } = EXAMPLE_FLIGHT_PLAN_VALUES

      const expectedError = new DomainError('A Flight Plan needs valid phases!')

      // When + Then
      expect(
        // @ts-expect-error A Flight Plan needs valid phases.
        () => FlightPlan.restore(crypto.randomUUID(), name, branch, environment, services, null)
      ).toThrow(expectedError)
      expect(
        // @ts-expect-error A Flight Plan needs valid phases.
        () => FlightPlan.restore(crypto.randomUUID(), name, branch, environment, services, 'test')
      ).toThrow(expectedError)
      expect(() =>
        FlightPlan.restore(crypto.randomUUID(), name, branch, environment, services, [])
      ).toThrow(expectedError)
    })

    test('needs valid workflow inputs', () => {
      // Given
      const { name, branch, environment, services, phases } = EXAMPLE_FLIGHT_PLAN_VALUES

      const expectedError = new DomainError('A Flight Plan needs valid workflow inputs!')

      // When + Then
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          branch,
          environment,
          services,
          phases,
          // @ts-expect-error A Flight Plan needs valid workflow inputs.
          'test'
        )
      ).toThrow(expectedError)
    })
  })
})
