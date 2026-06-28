import fs from 'fs'

import { defineConfig } from 'jest'
import { createDefaultPreset, pathsToModuleNameMapper } from 'ts-jest'

const tsConfig = JSON.parse(fs.readFileSync(new URL('./tsconfig.json', import.meta.url), 'utf-8'))

const transformConfig = createDefaultPreset().transform

export default defineConfig({
  transform: {
    ...transformConfig
  },
  // Maps your `@/*` path shortcuts to your target source folders
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
    prefix: '<rootDir>/'
  }),
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  watchPathIgnorePatterns: ['<rootDir>/dist/'],
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
