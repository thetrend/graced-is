import type { HandlerEvent, HandlerResponse } from '@netlify/functions'
import { handler } from '../../functions/user-refresh'
import getPrismaClient from '../../utils/prisma'
import { generateAccessToken, verifyRefreshToken } from '../../utils/tokens'

// Mock the Prisma client
jest.mock('../../utils/prisma', () => {
  const mockedPrisma = {
    refreshToken: {
      findUnique: jest.fn(),
    },
  }
  return {
    __esModule: true,
    default: jest.fn(() => mockedPrisma),
  }
})

// Mock token utilities
jest.mock('../../utils/tokens', () => ({
  generateAccessToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
}))

// Mock error response utility
jest.mock('../../utils/netlify', () => ({
  createErrorResponse: jest.fn((statusCode: number, message: string) => ({
    statusCode,
    body: JSON.stringify({ message }),
  })),
}))

const prisma = getPrismaClient()

const mockEvent = (cookie: string): Partial<HandlerEvent> => ({
  httpMethod: 'POST',
  headers: {
    cookie,
  },
  body: null,
})

afterEach(() => {
  jest.clearAllMocks() // Clear all mocks after each test
})

describe('user-refresh handler', () => {
  test('should return 200 with a new access token', async () => {
    const refreshToken = 'validRefreshToken'
    const event = mockEvent(`refreshToken=${refreshToken}`)
    ;(verifyRefreshToken as jest.Mock).mockReturnValue({ userId: 'mockUserId' })
    prisma.refreshToken.findUnique.mockResolvedValue({ token: refreshToken })
    ;(generateAccessToken as jest.Mock).mockReturnValue('newAccessToken')

    const response: HandlerResponse = await handler(event)

    expect(response).toBeDefined()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      JSON.stringify({ accessToken: 'newAccessToken' }),
    )
  })

  test('should return 400 if refresh token is missing', async () => {
    const event = mockEvent('') // No cookie present
    const response: HandlerResponse = await handler(event)

    expect(response).toBeDefined()
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(
      JSON.stringify({ message: 'Refresh token is required' }),
    )
  })

  test('should return 401 if refresh token is invalid', async () => {
    const refreshToken = 'invalidRefreshToken'
    const event = mockEvent(`refreshToken=${refreshToken}`)
    ;(verifyRefreshToken as jest.Mock).mockReturnValue(null) // Simulate invalid token

    const response: HandlerResponse = await handler(event)

    expect(response).toBeDefined()
    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual(
      JSON.stringify({ message: 'Invalid refresh token' }),
    )
  })

  test('should return 401 if refresh token is not found in the database', async () => {
    const refreshToken = 'notFoundToken'
    const event = mockEvent(`refreshToken=${refreshToken}`)
    ;(verifyRefreshToken as jest.Mock).mockReturnValue({ userId: 'mockUserId' })
    prisma.refreshToken.findUnique.mockResolvedValue(null) // Simulate token not found

    const response: HandlerResponse = await handler(event)

    expect(response).toBeDefined()
    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual(
      JSON.stringify({ message: 'Invalid refresh token' }),
    )
  })

  test('should return 500 if a database error occurs', async () => {
    const refreshToken = 'mockToken'
    const event = mockEvent(`refreshToken=${refreshToken}`)
    ;(verifyRefreshToken as jest.Mock).mockReturnValue({ userId: 'mockUserId' })

    // Simulate a rejected promise for findUnique to trigger the database error
    prisma.refreshToken.findUnique.mockRejectedValue(
      new Error('Database error'),
    )

    const response: HandlerResponse = await handler(event)

    expect(response).toBeDefined()
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(
      JSON.stringify({ message: 'An internal error occurred' }),
    )
  })
})
