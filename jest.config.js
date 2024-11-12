const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/spec/setupTests.ts'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/common/(.*)$': '<rootDir>/common/$1',
    '^@/utils/(.*)$': '<rootDir>/common/utils/$1',
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  projects: [
    {
      displayName: 'dom',
      testEnvironment: 'jest-environment-jsdom',
      testMatch: ['**/*.test.(ts|tsx)'],
      testPathIgnorePatterns: [
        '/node_modules/',
        '/.next/',
        '/*.api.test.(ts|tsx)',
      ],
      coveragePathIgnorePatterns: [
        '<rootDir>/common/utils/logger.ts',
        '<rootDir>/spec/setupTests.ts',
      ],
      collectCoverageFrom: [
        '<rootDir>/components/**/*.{ts,tsx}',
        '<rootDir>/pages/**/*.{ts,tsx}',
        '<rootDir>/common/**/*.{ts,tsx}',
        '<rootDir>/utils/**/*.{ts,tsx}',
        '!<rootDir>/api/**/*.{ts,tsx}',
        '!<rootDir>/common/interfaces/**/*.{ts,ts}',
        '!<rootDir>/common/utils/logger.ts',
        '!<rootDir>/common/constants.ts',
      ],
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    {
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: ['**/*.api.test.(ts|tsx)'],
      testPathIgnorePatterns: ['/node_modules/', '/.next/'],
      collectCoverageFrom: [
        '<rootDir>/api/**/*.{ts,tsx}',
        '<rootDir>/common/**/*.{ts,tsx}',
        '!<rootDir>/components/**/*.{ts,tsx}',
        '!<rootDir>/pages/**/*.{ts,tsx}',
        '!<rootDir>/api/**/*.{ts,tsx}',
        '!<rootDir>/common/interfaces/**/*.{ts,ts}',
        '!<rootDir>/common/utils/logger.ts',
        '!<rootDir>/common/utils/calculatePokemonPower.ts',
        '!<rootDir>/common/constants.ts',
      ],
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  ],
};

module.exports = createJestConfig(customJestConfig);
