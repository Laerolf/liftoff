import { describe, beforeEach, test, expect } from '@jest/globals'
import { createExampleMissionFromScratchCreationForm } from '@test/fixtures/forms'
import { clearDatabase } from '@test/helpers/db'
import { isMissionDto } from '@test/helpers/validators'
import status from 'http-status'

import app from '@/app'

describe('/missions', () => {
  beforeEach(async () => {
    await clearDatabase()
  })

  describe('GET /missions', () => {
    test('should return a list of Missions', async () => {
      // Given
      await app.request('/missions', {
        method: 'POST',
        body: JSON.stringify(createExampleMissionFromScratchCreationForm()),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })

      // When
      const response = await app.request('/missions')

      // Then
      expect(response.status).toBe(status.OK)

      const responseData = await response.json()
      expect(Array.isArray(responseData) && responseData.every(isMissionDto)).toBeTruthy()
    })
  })

  describe('POST /missions', () => {
    test('should be able to create a new Mission', async () => {
      // When
      const response = await app.request('/missions', {
        method: 'POST',
        body: JSON.stringify(createExampleMissionFromScratchCreationForm()),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })

      // Then
      expect(response.status).toBe(status.OK)

      const responseData = await response.json()
      expect(isMissionDto(responseData)).toBeTruthy()
    })

    test('should throw an error if the creation form is invalid', async () => {
      // Given
      const expectedErrorMessage = {
        errors: [
          { field: 'environment', message: 'Invalid input: expected string, received null' }
        ],
        message: 'Invalid request body'
      }

      // When
      const response = await app.request('/missions', {
        method: 'POST',
        body: JSON.stringify(createExampleMissionFromScratchCreationForm({ environment: null })),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })

      // Then
      expect(response.status).toBe(status.UNPROCESSABLE_ENTITY)
      expect(await response.json()).toStrictEqual(expectedErrorMessage)
    })
  })
})
