import type { Handler, HandlerEvent } from '@netlify/functions'

import getPrismaClient from '../utils/prisma'
import { verifyPostMethod } from '../utils/netlify'
import { generateAccessToken, verifyRefreshToken } from '../utils/tokens'

const prisma = getPrismaClient()

// eslint-disable-next-line import/prefer-default-export
export const handler: Handler = async (event: HandlerEvent) => {
  verifyPostMethod(event)

  try {
    const cookies = event.headers.cookie || ''
    const refreshToken = cookies
      .split('; ')
      .find((row) => row.startsWith('refreshToken='))
      ?.split('=')[1]

    if (!refreshToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Refresh token is required' }),
      }
    }

    const decodedToken = verifyRefreshToken(refreshToken)

    const existingToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    })

    if (!existingToken || decodedToken.userId !== existingToken.userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid refresh token' }),
      }
    }

    const newAccessToken = generateAccessToken(existingToken.userId)

    return {
      statusCode: 200,
      body: JSON.stringify({ accessToken: newAccessToken }),
    }
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid refresh token' }),
    }
  }
}
