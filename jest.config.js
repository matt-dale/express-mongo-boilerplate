/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "@utils": "<rootDir>/src/utils/index.ts",
    "@errors": "<rootDir>/src/errors/index.ts",
    "@nptypes": "<rootDir>/src/nptypes/index.ts",
    "@db": "<rootDir>/src/db/index.ts"
  },
};