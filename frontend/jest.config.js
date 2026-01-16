const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom', // Changed from 'jest-environment-jsdom'
  testEnvironmentOptions: { url: 'http://localhost/' },
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/packages/types(.*)$': '<rootDir>/../packages/types/typescript/$1',
  },
  // Removed transform and preset configurations. next/jest should handle TS.
  transformIgnorePatterns: [
    '/node_modules/(?!(.*@testing-library/react.*)/)',
  ],
};

module.exports = createJestConfig(customJestConfig);
