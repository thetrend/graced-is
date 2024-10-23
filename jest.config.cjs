// jest.config.js
module.exports = {
  preset: 'ts-jest', // Use ts-jest preset
  testEnvironment: 'node', // Use Node.js environment
  modulePathIgnorePatterns: ['<rootDir>/dist/'], // Adjust if you're outputting to a dist directory
}
