import fs from 'fs'

import { defineConfig } from 'jest'
import { createDefaultPreset, pathsToModuleNameMapper } from 'ts-jest'

const tsConfig = JSON.parse(
  fs.readFileSync(new URL('./tsconfig.jest.json', import.meta.url), 'utf-8')
)

const transformConfig = createDefaultPreset().transform

export default defineConfig({
  extensionsToTreatAsEsm: ['.ts'],
  globals: {},
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true, tsconfig: '<rootDir>/tsconfig.jest.json' }],
    ...transformConfig
  },
  moduleNameMapper: {
    '^@liftoff/domain$': '<rootDir>/../../packages/domain/src/index.ts',
    ...pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
      prefix: '<rootDir>/'
    })
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  watchPathIgnorePatterns: ['<rootDir>/dist/'],
  setupFiles: ['<rootDir>/test/setup-env.ts'],
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      // Requires 80% branch coverage
      branches: 80,
      // Requires 80% function coverage
      functions: 80,
      // Requires 80% line coverage
      lines: 80
    }
  }
})
