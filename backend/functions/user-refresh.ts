import type { HandlerEvent, HandlerResponse } from '@netlify/functions'
import { createErrorResponse } from '../utils/netlify'
import getPrismaClient from '../utils/prisma'
import { generateAccessToken, verifyRefreshToken } from '../utils/tokens'

const prisma = getPrismaClient()

export const handler = async (
  event: Partial<HandlerEvent>,
): Promise<HandlerResponse> => {
  // Check for the HTTP method
  if (event.httpMethod !== 'POST') {
    return createErrorResponse(405, 'Method Not Allowed')
  }

  // Extract cookies
  const cookie = event.headers?.cookie ?? ''
  const refreshToken = cookie.split('refreshToken=')[1]?.split(';')[0] // Split to get only the token part

  // Validate the refresh token presence
  if (!refreshToken) {
    return createErrorResponse(400, 'Refresh token is required')
  }

  try {
    // Verify the refresh token
    const verifiedToken = verifyRefreshToken(refreshToken)
    if (!verifiedToken) {
      return createErrorResponse(401, 'Invalid refresh token')
    }

    // Check the token in the database
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    })

    // If the token is not found, return 401
    if (!tokenRecord) {
      return createErrorResponse(401, 'Invalid refresh token')
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken(verifiedToken.userId)
    return {
      statusCode: 200,
      body: JSON.stringify({ accessToken: newAccessToken }),
    }
  } catch (error) {
    // Return 500 for any other errors
    return createErrorResponse(500, 'An internal error occurred')
  }
}
