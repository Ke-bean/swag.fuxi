module.exports = {
  rootDir: './',

  testEnvironment: 'node',

  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],

  moduleDirectories: ['node_modules'],

  moduleNameMapper: {
  },

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: 'coverage',

  roots: ['<rootDir>/src'],

  testTimeout: 30000, 

};
