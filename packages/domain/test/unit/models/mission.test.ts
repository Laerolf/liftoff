import { describe, test, expect } from '@jest/globals'
import { createExampleMissionData } from '@test/fixtures/data'
import { EXAMPLE_PHASE, EXAMPLE_VALUES } from '@test/fixtures/values'
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
        correlationId,
        date,
        director: { name: directorName },
        branchName,
        environmentName,
        serviceIds,
        missions: { status }
      } = EXAMPLE_VALUES

      const id = uuidv7()
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
        branchName,
        environmentName,
        serviceIds,
        directorName,
        [EXAMPLE_PHASE],
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
      expect(mission.workflowBranch).toBe(branchName)
      expect(mission.environment).toBe(environmentName)
      expect(mission.services).toStrictEqual(serviceIds)
      expect(mission.director).toBe(directorName)
      expect(mission.phases).toStrictEqual([EXAMPLE_PHASE])
      expect(mission.status).toBe(status)
      expect(mission.launchedAt).toBe(date)
      expect(mission.completedAt).toBe(completionDate)
    })

    test('needs an ID', () => {
      // Given
      const {
        correlationId,
        date,
        director: { name: directorName },
        branchName,
        environmentName,
        serviceIds,
        missions: { status }
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Mission needs an ID!')

      // When + Then
      expect(() =>
        Mission.restore(
          // @ts-expect-error A Mission needs an ID.
          null,
          correlationId,
          null,
          date,
          null,
          branchName,
          environmentName,
          serviceIds,
          directorName,
          [EXAMPLE_PHASE],
          status,
          date,
          null
        )
      ).toThrow(expectedError)
    })

    test('needs a correlation ID', () => {
      // Given
      const {
        date,
        director: { name: directorName },
        branchName,
        environmentName,
        serviceIds,
        missions: { status }
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Mission needs a correlation ID!')

      // When + Then
      expect(() =>
        Mission.restore(
          uuidv7(),
          // @ts-expect-error A Mission needs an correlation ID.
          null,
          null,
          date,
          null,
          branchName,
          environmentName,
          serviceIds,
          directorName,
          [EXAMPLE_PHASE],
          status,
          date,
          null
        )
      ).toThrow(expectedError)
    })

    test('needs a valid creation date', () => {
      // Given
      const {
        correlationId,
        date,
        director: { name: directorName },
        branchName,
        environmentName,
        serviceIds,
        missions: { status }
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Mission needs a valid creation date!')

      // When + Then
      expect(() =>
        Mission.restore(
          uuidv7(),
          correlationId,
          null,
          // @ts-expect-error A Mission needs a valid creation date.
          null,
          null,
          branchName,
          environmentName,
          serviceIds,
          directorName,
          [EXAMPLE_PHASE],
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
          branchName,
          environmentName,
          serviceIds,
          directorName,
          [EXAMPLE_PHASE],
          status,
          date,
          null
        )
      ).toThrow(expectedError)
    })

    test('needs a valid last update date', () => {
      // Given
      const {
        correlationId,
        date,
        director: { name: directorName },
        branchName,
        environmentName,
        serviceIds,
        missions: { status }
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Mission needs a valid last update date!')

      // When + Then
      expect(() =>
        Mission.restore(
          uuidv7(),
          correlationId,
          null,
          new Date(),
          // @ts-expect-error A Mission needs a valid last update date.
          'test',
          branchName,
          environmentName,
          serviceIds,
          directorName,
          [EXAMPLE_PHASE],
          status,
          date,
          null
        )
      ).toThrow(expectedError)
    })

    test('needs a status', () => {
      // Given
      const {
        correlationId,
        date,
        director: { name: directorName },
        branchName,
        environmentName,
        serviceIds
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Mission needs a valid status!')

      // When + Then
      expect(() =>
        Mission.restore(
          uuidv7(),
          correlationId,
          null,
          new Date(),
          null,
          branchName,
          environmentName,
          serviceIds,
          directorName,
          [EXAMPLE_PHASE],
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
          branchName,
          environmentName,
          serviceIds,
          directorName,
          [EXAMPLE_PHASE],
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
        correlationId,
        director: { name: directorName },
        branchName,
        environmentName,
        serviceIds,
        missions: { status }
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Mission needs a valid launch date!')

      // When + Then
      expect(() =>
        Mission.restore(
          uuidv7(),
          correlationId,
          null,
          new Date(),
          null,
          branchName,
          environmentName,
          serviceIds,
          directorName,
          [EXAMPLE_PHASE],
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
        correlationId,
        date,
        director: { name: directorName },
        branchName,
        environmentName,
        serviceIds,
        missions: { status }
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Mission needs a valid completion date!')

      // When + Then
      expect(() =>
        Mission.restore(
          uuidv7(),
          correlationId,
          null,
          date,
          null,
          branchName,
          environmentName,
          serviceIds,
          directorName,
          [EXAMPLE_PHASE],
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
        director: { name: directorName },
        branchName,
        environmentName,
        serviceIds
      } = EXAMPLE_VALUES

      // When
      const mission = Mission.fromScratch(branchName, environmentName, serviceIds, directorName)

      // Then
      expect(mission.id).toBeDefined()
      expect(mission.correlationId).toBeDefined()
      expect(mission.flightPlanId).toBeNull()
      expect(mission.createdAt).toBeDefined()
      expect(mission.lastUpdatedAt).toBeNull()
      expect(mission.workflowBranch).toBe(branchName)
      expect(mission.environment).toBe(environmentName)
      expect(mission.services).toStrictEqual(serviceIds)
      expect(mission.director).toBe(directorName)
      expect(mission.status).toBe(MissionStatus.Draft)
      expect(mission.launchedAt).toBeNull()
      expect(mission.completedAt).toBeNull()
    })

    test('needs a target workflow branch name', () => {
      // Given
      const {
        director: { name: directorName },
        environmentName,
        serviceIds
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Mission needs a target workflow branch name!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Mission needs a target workflow branch name.
        Mission.fromScratch(null, environmentName, serviceIds, directorName, [EXAMPLE_PHASE])
      ).toThrow(expectedError)
    })

    test('needs a target environment', () => {
      // Given
      const {
        director: { name: directorName },
        branchName,
        serviceIds
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Mission needs a target environment!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Mission needs a target environment.
        Mission.fromScratch(branchName, null, serviceIds, directorName, [EXAMPLE_PHASE])
      ).toThrow(expectedError)
    })

    test('needs valid target service IDs', () => {
      // Given
      const {
        director: { name: directorName },
        branchName,
        environmentName
      } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Mission needs valid target service IDs!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Mission needs valid target service IDs.
        Mission.fromScratch(branchName, environmentName, null, directorName)
      ).toThrow(expectedError)
      expect(() =>
        // @ts-expect-error A Mission needs valid target service IDs.
        Mission.fromScratch(branchName, environmentName, 'test', directorName)
      ).toThrow(expectedError)
      expect(() => Mission.fromScratch(branchName, environmentName, [], directorName)).toThrow(
        expectedError
      )
    })

    test('needs a director', () => {
      // Given
      const { branchName, environmentName, serviceIds } = EXAMPLE_VALUES

      const expectedError = new DomainError('A Mission needs a director!')

      // When + Then
      expect(() =>
        // @ts-expect-error A Mission needs a director.
        Mission.fromScratch(branchName, environmentName, serviceIds, null)
      ).toThrow(expectedError)
    })
  })

  describe('from FlightPlan + director', () => {
    test('can be created', () => {
      // Given
      const {
        director: { name: directorName },
        branchName,
        environmentName,
        serviceIds,
        flightPlans: { name }
      } = EXAMPLE_VALUES

      const flightPlan = FlightPlan.create(name, branchName, environmentName, serviceIds, {})
      flightPlan.phases = [EXAMPLE_PHASE]

      // When
      const mission = Mission.from(flightPlan, directorName)

      // Then
      expect(mission.id).toBeDefined()
      expect(mission.correlationId).toBeDefined()
      expect(mission.flightPlanId).toBe(flightPlan.id)
      expect(mission.createdAt).toBeDefined()
      expect(mission.lastUpdatedAt).toBeNull()
      expect(mission.workflowBranch).toBe(branchName)
      expect(mission.environment).toBe(environmentName)
      expect(mission.services).toStrictEqual(serviceIds)
      expect(mission.director).toBe(directorName)
      expect(mission.phases).toStrictEqual([EXAMPLE_PHASE])
      expect(mission.status).toBe(MissionStatus.Draft)
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
      const {
        branchName,
        environmentName,
        serviceIds,
        flightPlans: { name }
      } = EXAMPLE_VALUES

      const flightPlan = FlightPlan.create(name, branchName, environmentName, serviceIds, {})
      flightPlan.phases = [EXAMPLE_PHASE]

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
        director: { name: directorName },
        branchName,
        environmentName,
        serviceIds
      } = EXAMPLE_VALUES

      const mission = Mission.fromScratch(branchName, environmentName, serviceIds, directorName)

      // When + Then
      expect(Mission.isValid(mission)).toBeTruthy()
    })

    test('needs a valid Flight Plan ID', () => {
      // When + Then
      expect(Mission.isValid(createExampleMissionData({ flightPlanId: 123456 }))).toBeFalsy()
    })

    test('needs a valid launch date', () => {
      // When + Then
      expect(Mission.isValid(createExampleMissionData({ launchedAt: 123456 }))).toBeFalsy()
    })

    test('needs a valid creation date', () => {
      // When + Then
      expect(Mission.isValid(createExampleMissionData({ createdAt: null }))).toBeFalsy()
    })

    test('needs a valid last update date', () => {
      // When + Then
      expect(Mission.isValid(createExampleMissionData({ lastUpdatedAt: 123456 }))).toBeFalsy()
    })

    test('needs a valid completion date', () => {
      // When + Then
      expect(Mission.isValid(createExampleMissionData({ completedAt: 123456 }))).toBeFalsy()
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

  describe('prepare', () => {
    test('can be prepared', () => {
      // Given
      const {
        branchName,
        environmentName,
        serviceIds,
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const mission = Mission.fromScratch(branchName, environmentName, serviceIds, directorName)

      // When
      const launchedMission = mission.prepare([EXAMPLE_PHASE])

      // Then
      expect(launchedMission.status).toBe(MissionStatus.Launching)
      expect(launchedMission.lastUpdatedAt).toBeDefined()
    })

    test('can not be prepared twice', () => {
      // Given
      const {
        branchName,
        environmentName,
        serviceIds,
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const mission = Mission.fromScratch(
        branchName,
        environmentName,
        serviceIds,
        directorName
      ).prepare([EXAMPLE_PHASE])

      const expectedError = new DomainError('The Mission has already been prepared.')

      // When + Then
      expect(() => mission.prepare([EXAMPLE_PHASE])).toThrow(expectedError)
    })

    test('can not be prepared without phases', () => {
      // Given
      const {
        branchName,
        environmentName,
        serviceIds,
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const mission = Mission.fromScratch(branchName, environmentName, serviceIds, directorName)

      const expectedError = new DomainError(
        'The Mission needs valid Phases to be prepared to launch.'
      )

      // When + Then
      expect(() => mission.prepare([])).toThrow(expectedError)
      // @ts-expect-error The Mission needs valid Phases to be prepared to launch.
      expect(() => mission.prepare(['test'])).toThrow(expectedError)
      // @ts-expect-error The Mission needs valid Phases to be prepared to launch.
      expect(() => mission.prepare([null])).toThrow(expectedError)
      // @ts-expect-error The Mission needs valid Phases to be prepared to launch.
      expect(() => mission.prepare()).toThrow(expectedError)
      // @ts-expect-error The Mission needs valid Phases to be prepared to launch.
      expect(() => mission.prepare('test')).toThrow(expectedError)
    })
  })

  describe('launch', () => {
    test('can be launched', () => {
      // Given
      const {
        branchName,
        environmentName,
        serviceIds,
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const mission = Mission.fromScratch(
        branchName,
        environmentName,
        serviceIds,
        directorName
      ).prepare([EXAMPLE_PHASE])

      // When
      const launchedMission = mission.launch()

      // Then
      expect(launchedMission.status).toBe(MissionStatus.InOrbit)
      expect(launchedMission.lastUpdatedAt).toBeDefined()
    })

    test('can not launch as a draft', () => {
      // Given
      const {
        branchName,
        environmentName,
        serviceIds,
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const mission = Mission.fromScratch(branchName, environmentName, serviceIds, directorName)

      const expectedError = new DomainError('The Mission is just a draft.')

      // When + Then
      expect(() => mission.launch()).toThrow(expectedError)
    })

    test('can not be launched twice', () => {
      // Given
      const {
        branchName,
        environmentName,
        serviceIds,
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const mission = Mission.fromScratch(
        branchName,
        environmentName,
        serviceIds,
        directorName
      ).prepare([EXAMPLE_PHASE])

      mission.launch()

      const expectedError = new DomainError('The Mission has already been launched.')

      // When + Then
      expect(() => mission.launch()).toThrow(expectedError)
    })

    test('can not be launched without phases', () => {
      // Given
      const {
        branchName,
        environmentName,
        serviceIds,
        director: { name: directorName }
      } = EXAMPLE_VALUES

      const mission = Mission.fromScratch(branchName, environmentName, serviceIds, directorName)

      const expectedError = new DomainError('The Mission is just a draft.')

      // When + Then
      expect(() => mission.launch()).toThrow(expectedError)
    })
  })
})
