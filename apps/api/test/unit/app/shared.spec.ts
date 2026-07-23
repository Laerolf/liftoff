import { describe, test, expect } from 'bun:test'

import { RequestContext } from '@/app/shared'

describe('RequestContext', () => {
  describe('default', () => {
    test('can be created', () => {
      // When + Then
      expect(() => RequestContext.default()).not.toThrow()
    })
  })
})
