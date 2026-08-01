import { describe, test, expect } from 'bun:test'

import { createExampleFlightPlanData } from '@test/fixtures/data'
import { EXAMPLE_FLIGHT_PLAN, EXAMPLE_VALUES } from '@test/fixtures/values'

import { FlightPlan } from '@/models/flightPlan'
import { DomainError } from '@/shared/errors'

describe('FlightPlan', () => {
  describe('restore', () => {
    test('can be restored', () => {
      // Given
      const { phases } = EXAMPLE_FLIGHT_PLAN
      const {
        flightPlans: { name },
        branchName,
        environmentName,
        serviceIds
      } = EXAMPLE_VALUES

      // When + Then
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          new Date(),
          null,
          branchName,
          environmentName,
          serviceIds,
          phases
        )
      ).not.toThrow()
    })

    test('needs an ID', () => {
      // Given
      const { phases } = EXAMPLE_FLIGHT_PLAN
      const {
        flightPlans: { name },
        date,
        branchName,
        environmentName,
        serviceIds
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Flight Plan needs an ID!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Flight Plan needs an ID.
        FlightPlan.restore(null, name, date, null, branchName, environmentName, serviceIds, phases)
      ).toThrow(expectedError)
    })

    test('needs a name', () => {
      // Given
      const { phases } = EXAMPLE_FLIGHT_PLAN
      const { date, branchName, environmentName, serviceIds } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Flight Plan needs a name!')

      // When + Then
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          // @ts-expect-error A Flight Plan needs a name.
          null,
          date,
          null,
          branchName,
          environmentName,
          serviceIds,
          phases
        )
      ).toThrow(expectedError)
    })

    test('needs a valid creation date', () => {
      // Given
      const { phases } = EXAMPLE_FLIGHT_PLAN
      const {
        flightPlans: { name },
        branchName,
        environmentName,
        serviceIds
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Flight Plan needs a valid creation date!')

      // When + Then
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          // @ts-expect-error A Flight Plan needs a valid creation date.
          null,
          null,
          branchName,
          environmentName,
          serviceIds,
          phases
        )
      ).toThrow(expectedError)
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          // @ts-expect-error A Flight Plan needs a valid creation date.
          'test',
          null,
          branchName,
          environmentName,
          serviceIds,
          phases
        )
      ).toThrow(expectedError)
    })

    test('needs a valid last update date', () => {
      // Given
      const { phases } = EXAMPLE_FLIGHT_PLAN
      const {
        flightPlans: { name },
        date,
        branchName,
        environmentName,
        serviceIds
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Flight Plan needs a valid last update date!')

      // When + Then
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          date,
          // @ts-expect-error A Flight Plan needs a valid last update date.
          'test',
          branchName,
          environmentName,
          serviceIds,
          phases
        )
      ).toThrow(expectedError)
    })

    test('needs a target workflow branch name', () => {
      // Given
      const { phases } = EXAMPLE_FLIGHT_PLAN
      const {
        flightPlans: { name },
        date,
        environmentName,
        serviceIds
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Flight Plan needs a target workflow branch name!')

      // When + Then
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          date,
          null,
          // @ts-expect-error A Flight Plan needs a target workflow branch.
          null,
          environmentName,
          serviceIds,
          phases
        )
      ).toThrow(expectedError)
    })

    test('needs a target environment', () => {
      // Given
      const { phases } = EXAMPLE_FLIGHT_PLAN
      const {
        flightPlans: { name },
        date,
        branchName,
        serviceIds
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Flight Plan needs a target environment!')

      // When + Then
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          date,
          null,
          branchName,
          // @ts-expect-error A Flight Plan needs a target environment.
          null,
          serviceIds,
          phases
        )
      ).toThrow(expectedError)
    })

    test('needs valid target service IDs', () => {
      // Given
      const { phases } = EXAMPLE_FLIGHT_PLAN
      const {
        flightPlans: { name },
        date,
        branchName,
        environmentName
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Flight Plan needs valid target service IDs!')

      // When + Then
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          date,
          null,
          branchName,
          environmentName,
          // @ts-expect-error A Flight Plan needs valid target service IDs.
          null,
          phases
        )
      ).toThrow(expectedError)
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          date,
          null,
          branchName,
          environmentName,
          // @ts-expect-error A Flight Plan needs valid target service IDs.
          'test',
          phases
        )
      ).toThrow(expectedError)
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          date,
          null,
          branchName,
          environmentName,
          [],
          phases
        )
      ).toThrow(expectedError)
    })
  })

  describe('create', () => {
    test('can be created', () => {
      // Given
      const {
        flightPlans: { name },
        branchName,
        environmentName,
        serviceIds
      } = EXAMPLE_VALUES

      // When
      const flightPlan = FlightPlan.create(name, branchName, environmentName, serviceIds)

      // Then
      expect(flightPlan.id).toBeDefined()
      expect(flightPlan.createdAt).toBeDefined()
      expect(flightPlan.lastUpdatedAt).toBeNull()
    })
  })

  describe('isValid', () => {
    test('needs a valid last update date', () => {
      // When + Then
      expect(FlightPlan.isValid(createExampleFlightPlanData({ lastUpdatedAt: null }))).toBeTruthy()
      expect(FlightPlan.isValid(createExampleFlightPlanData({ lastUpdatedAt: 123456 }))).toBeFalsy()
      expect(
        FlightPlan.isValid(createExampleFlightPlanData({ lastUpdatedAt: EXAMPLE_VALUES.date }))
      ).toBeTruthy()
    })
  })
})
