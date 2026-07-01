import { describe, test, expect } from '@jest/globals'
import { EXAMPLE_FLIGHT_PLAN_VALUES, EXAMPLE_MISSION_VALUES, EXAMPLE_VALUES } from '@test/fixtures'
import { v7 as uuidv7 } from 'uuid'

import FlightPlan from '@/models/flightPlan'
import Mission from '@/models/mission'
import { MissionStatus } from '@/models/status'
import { DomainError } from '@/shared/errors'

describe('Mission', () => {
  describe('restore', () => {
    test('can be created', () => {
      // Given
      const {
        date,
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const { branch, environment, services, phases, status } = EXAMPLE_MISSION_VALUES

      const id = uuidv7()
      const correlationId = uuidv7()
      const flightPlanId = uuidv7()

      // When
      const mission = Mission.restore(
        id,
        correlationId,
        flightPlanId,
        branch,
        environment,
        services,
        directorName,
        phases,
        status,
        date
      )

      // Then
      expect(mission.id).toBe(id)
      expect(mission.correlationId).toBe(correlationId)
      expect(mission.flightPlanId).toBe(flightPlanId)
      expect(mission.workflowBranch).toBe(branch)
      expect(mission.environment).toBe(environment)
      expect(mission.services).toStrictEqual(services)
      expect(mission.director).toBe(directorName)
      expect(mission.status).toBe(status)
      expect(mission.launchedAt).toBe(date)
      expect(mission.phases).toStrictEqual(phases)
    })

    test('needs an ID', () => {
      // Given
      const {
        director: { name: directorName },
        date
      } = EXAMPLE_VALUES

      const { branch, environment, services, status, phases } = EXAMPLE_MISSION_VALUES

      const expectedError = new DomainError('A Mission needs an ID!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Mission needs an ID.
        Mission.restore(null, branch, environment, services, directorName, status, date, phases)
      ).toThrow(expectedError)
    })

    test('needs a correlation ID', () => {
      // Given
      const {
        director: { name: directorName },
        date
      } = EXAMPLE_VALUES

      const { branch, environment, services, status, phases } = EXAMPLE_MISSION_VALUES

      const expectedError = new DomainError('A Mission needs a correlation ID!')

      // When + Then
      expect(() =>
        Mission.restore(
          crypto.randomUUID(),
          // @ts-expect-error A Mission needs a correlation ID.
          null,
          null,
          branch,
          environment,
          services,
          directorName,
          phases,
          status,
          date
        )
      ).toThrow(expectedError)
    })

    test('needs a status', () => {
      // Given
      const {
        date,
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const { branch, environment, services, phases } = EXAMPLE_MISSION_VALUES

      const expectedError = new DomainError('A Mission needs a valid status!')

      // When + Then
      expect(() =>
        Mission.restore(
          crypto.randomUUID(),
          crypto.randomUUID(),
          null,
          branch,
          environment,
          services,
          directorName,
          phases,
          // @ts-expect-error A Mission needs a status.
          null,
          date
        )
      ).toThrow(expectedError)
      expect(() =>
        Mission.restore(
          crypto.randomUUID(),
          crypto.randomUUID(),
          null,
          branch,
          environment,
          services,
          directorName,
          phases,
          // @ts-expect-error A Mission needs a status.
          'test',
          date
        )
      ).toThrow(expectedError)
    })

    test('needs a valid launch date', () => {
      // Given
      const {
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const { branch, environment, services, status, phases } = EXAMPLE_MISSION_VALUES

      const expectedError = new DomainError('A Mission needs a valid launch date!')

      // When + Then
      expect(() =>
        Mission.restore(
          crypto.randomUUID(),
          crypto.randomUUID(),
          null,
          branch,
          environment,
          services,
          directorName,
          phases,
          status,
          // @ts-expect-error A Mission needs a valid launch date.
          'test'
        )
      ).toThrow(expectedError)
    })
  })

  describe('fromScratch', () => {
    test('can be created', () => {
      // Given
      const {
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const { branch, environment, services, phases } = EXAMPLE_MISSION_VALUES

      // When
      const mission = Mission.fromScratch(branch, environment, services, directorName, phases)

      // Then
      expect(mission.id).toBeDefined()
      expect(mission.correlationId).toBeDefined()
      expect(mission.flightPlanId).toBeNull()
      expect(mission.workflowBranch).toBe(branch)
      expect(mission.environment).toBe(environment)
      expect(mission.services).toStrictEqual(services)
      expect(mission.director).toBe(directorName)
      expect(mission.status).toBe(MissionStatus.Launching)
      expect(mission.launchedAt).toBeNull()
      expect(mission.phases).toStrictEqual(phases)
    })

    test('needs a target workflow branch name', () => {
      // Given
      const {
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const { environment, services, phases } = EXAMPLE_MISSION_VALUES

      const expectedError = new DomainError('A Mission needs a target workflow branch name!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Mission needs a target workflow branch name.
        Mission.fromScratch(null, environment, services, directorName, phases)
      ).toThrow(expectedError)
    })

    test('needs a target environment', () => {
      // Given
      const {
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const { branch, services, phases } = EXAMPLE_MISSION_VALUES

      const expectedError = new DomainError('A Mission needs a target environment!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Mission needs a target environment.
        Mission.fromScratch(branch, null, services, directorName, phases)
      ).toThrow(expectedError)
    })

    test('needs valid target service IDs', () => {
      // Given
      const {
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const { branch, environment, phases } = EXAMPLE_MISSION_VALUES

      const expectedError = new DomainError('A Mission needs valid target service IDs!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Mission needs valid target service IDs.
        Mission.fromScratch(branch, environment, null, directorName, phases)
      ).toThrow(expectedError)
      expect(() =>
        // @ts-expect-error A Mission needs valid target service IDs.
        Mission.fromScratch(branch, environment, 'test', directorName, phases)
      ).toThrow(expectedError)
      expect(() => Mission.fromScratch(branch, environment, [], directorName, phases)).toThrow(
        expectedError
      )
    })

    test('needs a director', () => {
      // Given

      const { branch, environment, services, phases } = EXAMPLE_MISSION_VALUES

      const expectedError = new DomainError('A Mission needs a director!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Mission needs a director.
        Mission.fromScratch(branch, environment, services, null, phases)
      ).toThrow(expectedError)
    })

    test('needs valid phases', () => {
      // Given
      const {
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const { branch, environment, services } = EXAMPLE_MISSION_VALUES

      const expectedError = new DomainError('A Mission needs valid phases!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Mission needs valid phases.
        Mission.fromScratch(branch, environment, services, directorName, null)
      ).toThrow(expectedError)
      expect(() =>
        // @ts-expect-error A Mission needs valid phases.
        Mission.fromScratch(branch, environment, services, directorName, 'test')
      ).toThrow(expectedError)
      expect(() => Mission.fromScratch(branch, environment, services, directorName, [])).toThrow(
        expectedError
      )
    })
  })

  describe('from FlightPlan + director', () => {
    test('can be created', () => {
      // Given
      const {
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const { branch, environment, services, phases, name } = EXAMPLE_FLIGHT_PLAN_VALUES

      const flightPlanId = uuidv7()

      const flightPlan = new FlightPlan(
        flightPlanId,
        name,
        branch,
        environment,
        services,
        phases,
        {}
      )

      // When
      const mission = Mission.from(flightPlan, directorName)

      // Then
      expect(mission.id).toBeDefined()
      expect(mission.correlationId).toBeDefined()
      expect(mission.flightPlanId).toBe(flightPlanId)
      expect(mission.workflowBranch).toBe(branch)
      expect(mission.environment).toBe(environment)
      expect(mission.services).toStrictEqual(services)
      expect(mission.director).toBe(directorName)
      expect(mission.status).toBe(MissionStatus.Launching)
      expect(mission.launchedAt).toBeNull()
      expect(mission.phases).toStrictEqual(phases)
    })

    test('needs a valid FlightPlan', () => {
      // Given
      const {
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const flightPlanWithoutSteps = {
        id: '019f1c29-a1ce-77cb-9cd3-a7a8cd56d0f0',
        name: 'Armageddon',
        workflowBranch: 'protoype/hell-on-earth',
        environment: 'develop',
        services: ['app-a', 'app-b'],
        phases: [{ status: 'WAITING', execution: 'PARALLEL', steps: [] }],
        exposedWorkflowInputs: {}
      }

      const expectedError = new DomainError('The provided FlightPlan is not valid!')

      // When + Then
      // @ts-expect-error A Mission needs a valid FlightPlan.
      expect(() => Mission.from(flightPlanWithoutSteps, directorName)).toThrow(expectedError)
      // @ts-expect-error A Mission needs a valid FlightPlan.
      expect(() => Mission.from(null, directorName)).toThrow(expectedError)
    })

    test('needs a director', () => {
      // Given
      const { branch, environment, services, phases, name } = EXAMPLE_FLIGHT_PLAN_VALUES

      const flightPlanId = uuidv7()

      const flightPlan = new FlightPlan(
        flightPlanId,
        name,
        branch,
        environment,
        services,
        phases,
        {}
      )

      const expectedError = new DomainError('The provided director is not valid!')

      // When + Then
      // @ts-expect-error A Mission needs a director.
      expect(() => Mission.from(flightPlan, null)).toThrow(expectedError)
    })
  })

  describe('launch', () => {
    test('can be launched', () => {
      // Given
      const {
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const { branch, environment, services, phases } = EXAMPLE_MISSION_VALUES

      const mission = Mission.fromScratch(branch, environment, services, directorName, phases)

      // When
      const launchedMission = mission.launch()

      // Then
      expect(launchedMission.status).toBe(MissionStatus.InOrbit)
    })

    test('can not be launched twice', () => {
      // Given
      const {
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const { branch, environment, services, phases } = EXAMPLE_MISSION_VALUES

      const mission = Mission.fromScratch(
        branch,
        environment,
        services,
        directorName,
        phases
      ).launch()

      const expectedError = new DomainError('The Mission has already been launched.')

      // When + Then
      expect(() => mission.launch()).toThrow(expectedError)
    })
  })
})
