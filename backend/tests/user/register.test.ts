// Import necessary modules and functions for testing
import { handler } from '../../functions/user-register'; // The handler function for user registration
import getPrismaClient from '../../utils/prisma'; // Prisma client for database interactions
import * as bcrypt from 'bcryptjs'; // Library for password hashing
import { generateAccessToken, generateRefreshToken } from '../../utils/tokens'; // Token generation utilities

// Mock the Prisma client to avoid actual database calls during testing
jest.mock('../../utils/prisma', () => {
  const mockedPrisma = {
    user: {
      findFirst: jest.fn(), // Mock function to find an existing user
      create: jest.fn(), // Mock function to create a new user
    },
    refreshToken: {
      create: jest.fn(), // Mock function to create a new refresh token
    },
  };
  return {
    __esModule: true,
    default: jest.fn(() => mockedPrisma), // Return the mocked Prisma client
  };
});

// Mock the bcrypt library to control password hashing behavior
jest.mock('bcryptjs', () => ({
  hash: jest.fn(), // Mock the hash function
}));

// Mock token generation functions
jest.mock('../../utils/tokens', () => ({
  generateAccessToken: jest.fn(), // Mock access token generation
  generateRefreshToken: jest.fn(), // Mock refresh token generation
}));

// Get the mocked Prisma client for use in tests
const prisma = getPrismaClient();

// Start the test suite for the register handler
describe('register handler', () => {

  // Helper function to create mock event objects
  const mockEvent = (body: any) => ({
    httpMethod: 'POST', // Set the HTTP method to POST
    body: JSON.stringify(body), // Convert the body to a JSON string
  });

  // Clear mocks after each test to ensure isolated test cases
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks to ensure clean state
  });

  // Test case: Return 405 status for non-POST methods
  test('should return 405 for non-POST methods', async () => {
    const event = {
      httpMethod: 'GET', // Simulate a GET request
      body: JSON.stringify({}), // Empty body
    };
    const response = await handler(event as any); // Call the handler

    // Assert that the response has the correct status and message
    expect(response.statusCode).toBe(405);
    expect(response.body).toBe('Method Not Allowed');
  });

  // Test case: Return 400 status if body is missing
  test('should return 400 if body is missing', async () => {
    const event = { httpMethod: 'POST', body: null }; // Simulate missing body
    const response = await handler(event as any); // Call the handler

    // Assert that the response has the correct status and message
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe('Bad Request: Request body is required.');
  });

  // Test case: Return 400 status for invalid JSON format
  test('should return 400 for invalid JSON format', async () => {
    const event = { httpMethod: 'POST', body: 'invalid json' }; // Simulate invalid JSON
    const response = await handler(event as any); // Call the handler

    // Assert that the response has the correct status and message
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe('Bad Request: Invalid JSON format.');
  });

  // Test case: Return 400 status if user already exists
  test('should return 400 if user exists', async () => {
    const existingUser = { email: 'test@example.com', username: 'testuser' }; // Mock existing user
    prisma.user.findFirst.mockResolvedValue(existingUser); // Simulate user already exists in DB

    const userData = {
      email: 'test@example.com',
      username: 'newuser',
      password: 'password123',
      passwordConfirm: 'password123', // Ensure this matches
      display: 'Test User',
    };
    const event = mockEvent(userData); // Create mock event
    const response = await handler(event as any); // Call the handler

    // Assert that the response has the correct status and error message
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body as string).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Email already exists' }),
      ])
    );
  });

  // Test case: Return 400 status for Zod validation errors
  test('should return 400 for Zod validation errors', async () => {
    const userData = {
      email: 'invalid-email', // Invalid email format
      password: '123', // Too short password
      passwordConfirm: 'wrong-password',  // Intentionally wrong for testing
      username: '', // Missing username
      display: 'Test User',
    };

    const event = mockEvent(userData); // Create mock event
    const response = await handler(event as any); // Call the handler

    expect(response.statusCode).toBe(400); // Assert for correct status

    // Parse the response body to check for errors
    const parsedBody = JSON.parse(response.body ?? '{}');
    const errors = parsedBody.errors || [];

    // Assert that the number of errors is correct
    expect(errors).toHaveLength(5);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Invalid email address' }),
        expect.objectContaining({ message: 'Password must be at least 8 characters' }),
        expect.objectContaining({ message: "Passwords don't match" }),
        expect.objectContaining({ message: 'Username must contain at least 1 character' }),
        expect.objectContaining({ message: 'Username can only contain letters, numbers, dashes, and underscores' }),
      ])
    );
  });

  // Test case: Successfully register user
  test('should register user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      username: 'newuser',
      password: 'password123',
      passwordConfirm: 'password123', // Ensure this matches
      display: 'Test User',
    };

    // Mock database responses
    prisma.user.findFirst.mockResolvedValue(null); // Mock to return null for existing user
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword'); // Mock password hashing
    prisma.user.create.mockResolvedValue({ id: '1', ...userData }); // Mock user creation
    prisma.refreshToken.create.mockResolvedValue({}); // Mock refresh token creation

    // Mock generated tokens
    const accessToken = 'mockAccessToken';
    const refreshToken = 'mockRefreshToken';
    (generateAccessToken as jest.Mock).mockReturnValue(accessToken); // Mock access token
    (generateRefreshToken as jest.Mock).mockReturnValue(refreshToken); // Mock refresh token

    const event = mockEvent(userData); // Create mock event
    const response = await handler(event as any); // Call the handler

    expect(response.statusCode).toBe(201); // Assert for successful registration

    // Safely parse response body
    const responseBody = response.body ? JSON.parse(response.body) : {};

    // Assert that the response contains the expected data
    expect(responseBody.message).toBe('User registered');
    expect(responseBody.accessToken).toBe(accessToken);
    expect(responseBody.user).toEqual(
      expect.objectContaining({ email: userData.email, username: userData.username })
    );
  });
});
