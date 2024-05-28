const config = {
  clearMocks: false,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  modulePathIgnorePatterns: ['<rootDir>/.aws-sam/', '<rootDir>/hello-api/', '<rootDir>/hello-world/'],
  testEnvironment: 'node',
  setupFiles: ['./setupTests.js'],
  testMatch: ['**/tests/unit/**'],
  transform: {
    '^.+\\.mjs?$': 'babel-jest',
  },
  workerIdleMemoryLimit: '512MB',
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleFileExtensions: ['mjs', 'js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '#node-web-compat': './node-web-compat-node.js',
    '^redis$': './__mocks__/redis.js',
  },
};

export default config;
