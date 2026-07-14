import { describe, test, expect } from '@jest/globals'
import { EXAMPLE_FLIGHT_PLAN_VALUES, EXAMPLE_MISSION_VALUES, EXAMPLE_VALUES } from '@test/fixtures'
import { v7 as uuidv7 } from 'uuid'

import { FlightPlan } from '@/models/flightPlan'
import { Mission } from '@/models/mission'
import { MissionStatus } from '@/models/status'
import { DomainError } from '@/shared/errors'

describe('Mission', () => {
  describe('restore', () => {
    test('can be restored', () => {
      // Given
      const {
        date,
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const { branch, environment, services, phases, status } = EXAMPLE_MISSION_VALUES

      const id = uuidv7()
      const correlationId = uuidv7()
      const flightPlanId = uuidv7()
      const creationDate = new Date()
      const lastUpdateDate = new Date()
      const completionDate = new Date()

      // When
      const mission = Mission.restore(
        id,
        correlationId,
        flightPlanId,
        creationDate,
        lastUpdateDate,
        branch,
        environment,
        services,
        directorName,
        phases,
        status,
        date,
        completionDate
      )

      // Then
      expect(mission.id).toBe(id)
      expect(mission.correlationId).toBe(correlationId)
      expect(mission.flightPlanId).toBe(flightPlanId)
      expect(mission.createdAt).toBe(creationDate)
      expect(mission.lastUpdatedAt).toBe(lastUpdateDate)
      expect(mission.workflowBranch).toBe(branch)
      expect(mission.environment).toBe(environment)
      expect(mission.services).toStrictEqual(services)
      expect(mission.director).toBe(directorName)
      expect(mission.phases).toStrictEqual(phases)
      expect(mission.status).toBe(status)
      expect(mission.launchedAt).toBe(date)
      expect(mission.completedAt).toBe(completionDate)
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
        Mission.restore(
          // @ts-expect-error A Mission needs an ID.
          null,
          uuidv7(),
          null,
          new Date(),
          null,
          branch,
          environment,
          services,
          directorName,
          phases,
          status,
          date,
          null
        )
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
          uuidv7(),
          // @ts-expect-error A Mission needs an correlation ID.
          null,
          null,
          new Date(),
          null,
          branch,
          environment,
          services,
          directorName,
          phases,
          status,
          date,
          null
        )
      ).toThrow(expectedError)
    })

    test('needs a valid creation date', () => {
      // Given
      const {
        director: { name: directorName },
        date
      } = EXAMPLE_VALUES

      const { branch, environment, services, status, phases } = EXAMPLE_MISSION_VALUES

      const expectedError = new DomainError('A Mission needs a valid creation date!')

      // When + Then
      expect(() =>
        Mission.restore(
          uuidv7(),
          uuidv7(),
          null,
          // @ts-expect-error A Mission needs a valid creation date.
          null,
          null,
          branch,
          environment,
          services,
          directorName,
          phases,
          status,
          date,
          null
        )
      ).toThrow(expectedError)
      expect(() =>
        Mission.restore(
          uuidv7(),
          uuidv7(),
          null,
          // @ts-expect-error A Mission needs a valid creation date.
          'test',
          null,
          branch,
          environment,
          services,
          directorName,
          phases,
          status,
          date,
          null
        )
      ).toThrow(expectedError)
    })

    test('needs a valid last update date', () => {
      // Given
      const {
        director: { name: directorName },
        date
      } = EXAMPLE_VALUES

      const { branch, environment, services, status, phases } = EXAMPLE_MISSION_VALUES

      const expectedError = new DomainError('A Mission needs a valid last update date!')

      // When + Then
      expect(() =>
        Mission.restore(
          uuidv7(),
          uuidv7(),
          null,
          new Date(),
          // @ts-expect-error A Mission needs a valid last update date.
          'test',
          branch,
          environment,
          services,
          directorName,
          phases,
          status,
          date,
          null
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
          uuidv7(),
          uuidv7(),
          null,
          new Date(),
          null,
          branch,
          environment,
          services,
          directorName,
          phases,
          // @ts-expect-error A Mission needs a valid status.
          null,
          date,
          null
        )
      ).toThrow(expectedError)
      expect(() =>
        Mission.restore(
          uuidv7(),
          uuidv7(),
          null,
          new Date(),
          null,
          branch,
          environment,
          services,
          directorName,
          phases,
          // @ts-expect-error A Mission needs a valid status.
          'test',
          date,
          null
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
          uuidv7(),
          uuidv7(),
          null,
          new Date(),
          null,
          branch,
          environment,
          services,
          directorName,
          phases,
          status,
          // @ts-expect-error A Mission needs a valid launch date
          'test',
          null
        )
      ).toThrow(expectedError)
    })

    test('needs a valid completion date', () => {
      // Given
      const {
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const { branch, environment, services, status, phases } = EXAMPLE_MISSION_VALUES

      const expectedError = new DomainError('A Mission needs a valid completion date!')

      // When + Then
      expect(() =>
        Mission.restore(
          uuidv7(),
          uuidv7(),
          null,
          new Date(),
          null,
          branch,
          environment,
          services,
          directorName,
          phases,
          status,
          null,
          // @ts-expect-error A Mission needs a valid completion date
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
      expect(mission.createdAt).toBeDefined()
      expect(mission.lastUpdatedAt).toBeNull()
      expect(mission.workflowBranch).toBe(branch)
      expect(mission.environment).toBe(environment)
      expect(mission.services).toStrictEqual(services)
      expect(mission.director).toBe(directorName)
      expect(mission.status).toBe(MissionStatus.Launching)
      expect(mission.launchedAt).toBeNull()
      expect(mission.phases).toStrictEqual(phases)
      expect(mission.completedAt).toBeNull()
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

      const flightPlan = FlightPlan.create(name, branch, environment, services, phases, {})

      // When
      const mission = Mission.from(flightPlan, directorName)

      // Then
      expect(mission.id).toBeDefined()
      expect(mission.correlationId).toBeDefined()
      expect(mission.flightPlanId).toBe(flightPlan.id)
      expect(mission.createdAt).toBeDefined()
      expect(mission.lastUpdatedAt).toBeNull()
      expect(mission.workflowBranch).toBe(branch)
      expect(mission.environment).toBe(environment)
      expect(mission.services).toStrictEqual(services)
      expect(mission.director).toBe(directorName)
      expect(mission.phases).toStrictEqual(phases)
      expect(mission.status).toBe(MissionStatus.Launching)
      expect(mission.launchedAt).toBeNull()
      expect(mission.completedAt).toBeNull()
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

      const flightPlan = FlightPlan.create(name, branch, environment, services, phases, {})

      const expectedError = new DomainError('The provided director is not valid!')

      // When + Then
      // @ts-expect-error A Mission needs a director.
      expect(() => Mission.from(flightPlan, null)).toThrow(expectedError)
    })
  })

  describe('isValid', () => {
    test('can be valid', () => {
      // Given
      const {
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const { branch, environment, services, phases } = EXAMPLE_MISSION_VALUES

      const mission = Mission.fromScratch(branch, environment, services, directorName, phases)

      // When + Then
      expect(Mission.isValid(mission)).toBeTruthy()
    })

    test('needs a valid Flight Plan ID', () => {
      // When + Then
      expect(
        Mission.isValid({
          id: '6666',
          correlationId: '5555',
          flightPlanId: 123456,
          workflowBranch: 'protoype/hell-on-earth',
          environment: 'develop',
          services: ['app-a', 'app-b'],
          director: 'Ozzy',
          status: 'LAUNCHING',
          launchedAt: null,
          phases: [
            {
              id: '6666',
              missionId: '4444',
              status: 'WAITING',
              execution: 'PARALLEL',
              steps: [
                {
                  id: uuidv7(),
                  phaseId: uuidv7(),
                  repository: 'test',
                  workflowId: '6666',
                  workflowOutcome: 'WAITING',
                  workflowInputs: {},
                  createdAt: new Date(),
                  lastUpdatedAt: null,
                  startedAt: new Date()
                }
              ],
              createdAt: new Date(),
              lastUpdatedAt: null,
              startedAt: null,
              completedAt: null
            }
          ],
          createdAt: new Date(),
          lastUpdatedAt: null,
          completedAt: null
        })
      ).toBeFalsy()
    })

    test('needs a valid launch date', () => {
      // When + Then
      expect(
        Mission.isValid({
          id: '6666',
          correlationId: '5555',
          flightPlanId: '1111',
          workflowBranch: 'protoype/hell-on-earth',
          environment: 'develop',
          services: ['app-a', 'app-b'],
          director: 'Ozzy',
          status: 'LAUNCHING',
          launchedAt: 123456,
          phases: [
            {
              id: '6666',
              missionId: '4444',
              status: 'WAITING',
              execution: 'PARALLEL',
              steps: [
                {
                  id: uuidv7(),
                  phaseId: uuidv7(),
                  repository: 'test',
                  workflowId: '6666',
                  workflowOutcome: 'WAITING',
                  workflowInputs: {},
                  createdAt: new Date(),
                  lastUpdatedAt: null,
                  startedAt: new Date()
                }
              ],
              createdAt: new Date(),
              lastUpdatedAt: null,
              startedAt: null,
              completedAt: null
            }
          ],
          createdAt: new Date(),
          lastUpdatedAt: null,
          completedAt: null
        })
      ).toBeFalsy()
    })

    test('needs a valid creation date', () => {
      // When + Then
      expect(
        Mission.isValid({
          id: '6666',
          correlationId: '5555',
          flightPlanId: '1111',
          workflowBranch: 'protoype/hell-on-earth',
          environment: 'develop',
          services: ['app-a', 'app-b'],
          director: 'Ozzy',
          status: 'LAUNCHING',
          launchedAt: null,
          phases: [
            {
              id: '6666',
              missionId: '4444',
              status: 'WAITING',
              execution: 'PARALLEL',
              steps: [
                {
                  id: uuidv7(),
                  phaseId: uuidv7(),
                  repository: 'test',
                  workflowId: '6666',
                  workflowOutcome: 'WAITING',
                  workflowInputs: {},
                  createdAt: new Date(),
                  lastUpdatedAt: null,
                  startedAt: new Date()
                }
              ],
              createdAt: new Date(),
              lastUpdatedAt: null,
              startedAt: null,
              completedAt: null
            }
          ],
          createdAt: null,
          lastUpdatedAt: null,
          completedAt: null
        })
      ).toBeFalsy()
    })

    test('needs a valid last update date', () => {
      // When + Then
      expect(
        Mission.isValid({
          id: '6666',
          correlationId: '5555',
          flightPlanId: '1111',
          workflowBranch: 'protoype/hell-on-earth',
          environment: 'develop',
          services: ['app-a', 'app-b'],
          director: 'Ozzy',
          status: 'LAUNCHING',
          launchedAt: null,
          phases: [
            {
              id: '6666',
              missionId: '4444',
              status: 'WAITING',
              execution: 'PARALLEL',
              steps: [
                {
                  id: uuidv7(),
                  phaseId: uuidv7(),
                  repository: 'test',
                  workflowId: '6666',
                  workflowOutcome: 'WAITING',
                  workflowInputs: {},
                  createdAt: new Date(),
                  lastUpdatedAt: null,
                  startedAt: new Date()
                }
              ],
              createdAt: new Date(),
              lastUpdatedAt: null,
              startedAt: null,
              completedAt: null
            }
          ],
          createdAt: new Date(),
          lastUpdatedAt: 123456,
          completedAt: null
        })
      ).toBeFalsy()
    })

    test('needs a valid completion date', () => {
      // When + Then
      expect(
        Mission.isValid({
          id: '6666',
          correlationId: '5555',
          flightPlanId: '1111',
          workflowBranch: 'protoype/hell-on-earth',
          environment: 'develop',
          services: ['app-a', 'app-b'],
          director: 'Ozzy',
          status: 'LAUNCHING',
          launchedAt: null,
          phases: [
            {
              id: '6666',
              missionId: '4444',
              status: 'WAITING',
              execution: 'PARALLEL',
              steps: [
                {
                  id: uuidv7(),
                  phaseId: uuidv7(),
                  repository: 'test',
                  workflowId: '6666',
                  workflowOutcome: 'WAITING',
                  workflowInputs: {},
                  createdAt: new Date(),
                  lastUpdatedAt: null,
                  startedAt: new Date()
                }
              ],
              createdAt: new Date(),
              lastUpdatedAt: null,
              startedAt: null,
              completedAt: null
            }
          ],
          createdAt: new Date(),
          lastUpdatedAt: null,
          completedAt: 123456
        })
      ).toBeFalsy()
    })

    test('needs to be defined', () => {
      // When + Then
      expect(Mission.isValid(null)).toBeFalsy()
      expect(Mission.isValid(undefined)).toBeFalsy()
    })

    test('needs to be an object', () => {
      // When + Then
      expect(Mission.isValid([])).toBeFalsy()
      expect(Mission.isValid('test')).toBeFalsy()
      expect(Mission.isValid(6666)).toBeFalsy()
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
      expect(launchedMission.lastUpdatedAt).toBeDefined()
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
