import { describe, test, expect } from '@jest/globals'
import { EXAMPLE_FLIGHT_PLAN_VALUES } from '@test/fixtures'

import { FlightPlan } from '@/models/flightPlan'
import { DomainError } from '@/shared/errors'

describe('FlightPlan', () => {
  describe('restore', () => {
    test('can be restored', () => {
      // Given
      const { name, branch, environment, services, phases } = EXAMPLE_FLIGHT_PLAN_VALUES

      // When + Then
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          new Date(),
          null,
          branch,
          environment,
          services,
          phases
        )
      ).not.toThrow()
    })

    test('needs an ID', () => {
      // Given
      const { name, branch, environment, services, phases } = EXAMPLE_FLIGHT_PLAN_VALUES

      const expectedError = new DomainError('A Flight Plan needs an ID!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Flight Plan needs an ID.
        FlightPlan.restore(null, name, new Date(), null, branch, environment, services, phases)
      ).toThrow(expectedError)
    })

    test('needs a name', () => {
      // Given
      const { branch, environment, services, phases } = EXAMPLE_FLIGHT_PLAN_VALUES

      const expectedError = new DomainError('A Flight Plan needs a name!')

      // When + Then
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          // @ts-expect-error A Flight Plan needs a name.
          null,
          new Date(),
          null,
          branch,
          environment,
          services,
          phases
        )
      ).toThrow(expectedError)
    })

    test('needs a valid creation date', () => {
      // Given
      const { branch, environment, services, phases, name } = EXAMPLE_FLIGHT_PLAN_VALUES

      const expectedError = new DomainError('A Flight Plan needs a valid creation date!')

      // When + Then
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          // @ts-expect-error A Flight Plan needs a valid creation date.
          null,
          null,
          branch,
          environment,
          services,
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
          branch,
          environment,
          services,
          phases
        )
      ).toThrow(expectedError)
    })

    test('needs a valid last update date', () => {
      // Given
      const { branch, environment, services, phases, name } = EXAMPLE_FLIGHT_PLAN_VALUES

      const expectedError = new DomainError('A Flight Plan needs a valid last update date!')

      // When + Then
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          new Date(),
          // @ts-expect-error A Flight Plan needs a valid last update date.
          'test',
          branch,
          environment,
          services,
          phases
        )
      ).toThrow(expectedError)
    })

    test('needs a target workflow branch name', () => {
      // Given
      const { name, environment, services, phases } = EXAMPLE_FLIGHT_PLAN_VALUES

      const expectedError = new DomainError('A Flight Plan needs a target workflow branch name!')

      // When + Then
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          new Date(),
          null,
          // @ts-expect-error A Flight Plan needs a target workflow branch.
          null,
          environment,
          services,
          phases
        )
      ).toThrow(expectedError)
    })

    test('needs a target environment', () => {
      // Given
      const { name, branch, services, phases } = EXAMPLE_FLIGHT_PLAN_VALUES

      const expectedError = new DomainError('A Flight Plan needs a target environment!')

      // When + Then
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          new Date(),
          null,
          branch,
          // @ts-expect-error A Flight Plan needs a target environment.
          null,
          services,
          phases
        )
      ).toThrow(expectedError)
    })

    test('needs valid target service IDs', () => {
      // Given
      const { name, branch, environment, phases } = EXAMPLE_FLIGHT_PLAN_VALUES

      const expectedError = new DomainError('A Flight Plan needs valid target service IDs!')

      // When + Then
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          new Date(),
          null,
          branch,
          environment,
          // @ts-expect-error A Flight Plan needs valid target service IDs.
          null,
          phases
        )
      ).toThrow(expectedError)
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          new Date(),
          null,
          branch,
          environment,
          // @ts-expect-error A Flight Plan needs valid target service IDs.
          'test',
          phases
        )
      ).toThrow(expectedError)
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          new Date(),
          null,
          branch,
          environment,
          [],
          phases
        )
      ).toThrow(expectedError)
    })

    test('needs valid phases', () => {
      // Given
      const { name, branch, environment, services } = EXAMPLE_FLIGHT_PLAN_VALUES

      const expectedError = new DomainError('A Flight Plan needs valid phases!')

      // When + Then
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          new Date(),
          null,
          branch,
          environment,
          services,
          // @ts-expect-error A Flight Plan needs valid phases.
          null
        )
      ).toThrow(expectedError)
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          new Date(),
          null,
          branch,
          environment,
          services,
          // @ts-expect-error A Flight Plan needs valid phases.
          'test'
        )
      ).toThrow(expectedError)
      expect(() =>
        FlightPlan.restore(
          crypto.randomUUID(),
          name,
          new Date(),
          null,
          branch,
          environment,
          services,
          []
        )
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
          new Date(),
          null,
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

  describe('create', () => {
    test('can be created', () => {
      // Given
      const { name, branch, environment, services, phases } = EXAMPLE_FLIGHT_PLAN_VALUES

      // When
      const flightPlan = FlightPlan.create(name, branch, environment, services, phases)

      // Then
      expect(flightPlan.id).toBeDefined()
      expect(flightPlan.createdAt).toBeDefined()
      expect(flightPlan.lastUpdatedAt).toBeNull()
    })
  })

  describe('isValid', () => {
    test('needs a valid last update date', () => {
      // Given
      const { name, branch, environment, services } = EXAMPLE_FLIGHT_PLAN_VALUES

      // When + Then
      expect(
        FlightPlan.isValid({
          id: '666666',
          name,
          workflowBranch: branch,
          environment: environment,
          services,
          phases: [
            {
              status: 'WAITING',
              execution: 'PARALLEL',
              steps: [
                {
                  repository: 'test',
                  workflowId: '6666',
                  workflowOutcome: 'WAITING',
                  workflowInputs: {},
                  createdAt: new Date(),
                  lastUpdatedAt: null
                }
              ],
              createdAt: new Date(),
              lastUpdatedAt: null
            }
          ],
          exposedWorkflowInputs: {},
          createdAt: new Date(),
          lastUpdatedAt: 'test'
        })
      ).toBeFalsy()
    })
  })
})
