import * as bcrypt from 'bcryptjs' // Library for password hashing
// Import necessary modules and functions for testing
import { handler } from '../../functions/user-login' // The handler function for user login
import type { UserLogin } from '../../types/user'
import getPrismaClient from '../../utils/prisma' // Prisma client for database interactions
import { generateAccessToken, generateRefreshToken } from '../../utils/tokens' // Token generation utilities

// Mock the Prisma client to avoid actual database calls during testing
jest.mock('../../utils/prisma', () => {
  const mockedPrisma = {
    user: {
      findFirst: jest.fn(), // Mock function to find an existing user
    },
    refreshToken: {
      create: jest.fn(), // Mock function to create a new refresh token
    },
  }
  return {
    __esModule: true,
    default: jest.fn(() => mockedPrisma), // Return the mocked Prisma client
  }
})

// Mock the bcrypt library to control password hashing behavior
jest.mock('bcryptjs', () => ({
  compare: jest.fn(), // Mock the compare function
}))

// Mock token generation functions
jest.mock('../../utils/tokens', () => ({
  generateAccessToken: jest.fn(), // Mock access token generation
  generateRefreshToken: jest.fn(), // Mock refresh token generation
}))

// Get the mocked Prisma client for use in tests
const prisma = getPrismaClient()

// Start the test suite for the login handler
describe('login handler', () => {
  // Helper function to create mock event objects
  const mockEvent = (body: UserLogin) => ({
    httpMethod: 'POST', // Set the HTTP method to POST
    body: JSON.stringify(body), // Convert the body to a JSON string
  })

  // Clear mocks after each test to ensure isolated test cases
  afterEach(() => {
    jest.clearAllMocks() // Reset mocks to ensure clean state
  })

  // Test case: Return 405 status for non-POST methods
  test('should return 405 for non-POST methods', async () => {
    const event = {
      httpMethod: 'GET', // Simulate a GET request
      body: JSON.stringify({}), // Empty body
    }
    const response = await handler(event) // Call the handler

    // Assert that the response has the correct status and message
    expect(response.statusCode).toBe(405)
    expect(response.body).toBe(
      JSON.stringify({ message: 'Method Not Allowed' }),
    )
  })

  // Test case: Return 400 status if body is missing
  test('should return 400 if body is missing', async () => {
    const event = { httpMethod: 'POST', body: null } // Simulate missing body
    const response = await handler(event) // Call the handler

    // Assert that the response has the correct status and message
    expect(response.statusCode).toBe(400)
    expect(response.body).toBe(
      JSON.stringify({ message: 'Bad Request: Request body is required.' }),
    )
  })

  // Test case: Return 400 status for invalid JSON format
  test('should return 400 for invalid JSON format', async () => {
    const event = { httpMethod: 'POST', body: 'invalid json' } // Simulate invalid JSON
    const response = await handler(event) // Call the handler

    // Assert that the response has the correct status and message
    expect(response.statusCode).toBe(400)
    expect(response.body).toBe(
      JSON.stringify({ message: 'Bad Request: Invalid JSON format.' }),
    )
  })

  // Test case: Return 400 status if user does not exist
  test('should return 400 if user does not exist', async () => {
    const userData = {
      email: 'nonexistent@example.com',
      password: 'password123',
    }

    prisma.user.findFirst.mockResolvedValue(null) // Mock to return null for non-existing user

    const event = mockEvent(userData) // Create mock event
    const response = await handler(event) // Call the handler

    // Assert that the response has the correct status and error message
    expect(response.statusCode).toBe(400)
    expect(response.body).toBe(
      JSON.stringify({ message: 'Invalid credentials' }),
    )
  })

  // Test case: Return 400 status for incorrect password
  test('should return 400 for incorrect password', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'wrongpassword',
    }

    const existingUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
    }
    prisma.user.findFirst.mockResolvedValue(existingUser) // Mock to return an existing user
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(false) // Mock password comparison to fail

    const event = mockEvent(userData) // Create mock event
    const response = await handler(event) // Call the handler

    // Assert that the response has the correct status and error message
    expect(response.statusCode).toBe(400)
    expect(response.body).toBe(
      JSON.stringify({ message: 'Invalid credentials' }),
    )
  })

  // Test case: Successfully log in user
  test('should log in user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
    }

    const existingUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
    }
    prisma.user.findFirst.mockResolvedValue(existingUser) // Mock to return an existing user
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true) // Mock password comparison to succeed

    // Mock generated tokens
    const accessToken = 'mockAccessToken'
    const refreshToken = 'mockRefreshToken'

    // Mock the return values for the token generation functions
    ;(generateAccessToken as jest.Mock).mockReturnValue(accessToken) // Mock access token
    ;(generateRefreshToken as jest.Mock).mockReturnValue(refreshToken) // Mock refresh token

    const event = mockEvent(userData) // Create mock event
    const response = await handler(event) // Call the handler

    expect(response.statusCode).toBe(200) // Assert for successful login

    // Safely parse response body
    const responseBody = response.body ? JSON.parse(response.body) : {}

    // Assert that the response contains the expected data
    expect(responseBody.message).toBe('Login successful')
    expect(responseBody.accessToken).toBe(accessToken)
    expect(response.headers?.['Set-Cookie']).toMatch(
      /refreshToken=mockRefreshToken/,
    ) // Check Set-Cookie header
  })
})
