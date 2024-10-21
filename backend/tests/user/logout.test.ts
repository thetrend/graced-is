// Import necessary modules and functions for testing
import { handler } from '../../functions/user-logout'; // The handler function for user logout
import getPrismaClient from '../../utils/prisma'; // Prisma client for database interactions

// Mock the Prisma client to avoid actual database calls during testing
jest.mock('../../utils/prisma', () => {
  const mockedPrisma = {
    refreshToken: {
      deleteMany: jest.fn(), // Mock function to delete refresh tokens
    },
  };
  return {
    __esModule: true,
    default: jest.fn(() => mockedPrisma), // Return the mocked Prisma client
  };
});

// Get the mocked Prisma client for use in tests
const prisma = getPrismaClient();

// Start the test suite for the logout handler
describe('logout handler', () => {
  // Helper function to create mock event objects
  const mockEvent = (cookies?: string) => ({
    httpMethod: 'POST', // Set the HTTP method to POST
    headers: {
      cookie: cookies ?? '', // Provide cookies or empty string
    },
  });

  // Clear mocks after each test to ensure isolated test cases
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks to ensure clean state
  });

  // Test case: Return 405 status for non-POST methods
  test('should return 405 for non-POST methods', async () => {
    const event = {
      httpMethod: 'GET', // Simulate a GET request
      headers: { cookie: '' }, // Empty cookies
    };
    const response = await handler(event as any); // Call the handler

    // Assert that the response has the correct status and message
    expect(response.statusCode).toBe(405);
    expect(response.body).toBe(JSON.stringify({ message: 'Method Not Allowed' }));
  });

  // Test case: Return 400 status if refresh token is missing
  test('should return 400 if refresh token is missing', async () => {
    const event = mockEvent(); // Simulate missing refresh token
    const response = await handler(event as any); // Call the handler

    // Assert that the response has the correct status and message
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(JSON.stringify({ message: 'Refresh token is required' }));
  });

  // Test case: Successfully log out user
  test('should log out user successfully', async () => {
    const refreshToken = 'mockRefreshToken';
    const event = mockEvent(`refreshToken=${refreshToken}`); // Create mock event with refresh token

    const response = await handler(event as any); // Call the handler

    // Assert that the response has the correct status and message
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify({ message: 'Logged out successfully' }));
    expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({ where: { token: refreshToken } });
    expect(response.headers!['Set-Cookie']).toBe('refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'); // Check that the cookie is expired
  });

  // Test case: Handle errors during logout process
  test('should return 500 for unknown errors', async () => {
    const event = mockEvent('refreshToken=mockRefreshToken'); // Create mock event with refresh token
    prisma.refreshToken.deleteMany.mockRejectedValue(new Error('Database error')); // Simulate a database error

    const response = await handler(event as any); // Call the handler

    // Assert that the response has the correct status and error message
    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(JSON.stringify({ message: 'Database error' }));
  });
});
