import type { Handler, HandlerEvent } from '@netlify/functions'

import getPrismaClient from '../utils/prisma'
import { verifyPostMethod } from '../utils/netlify'

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

    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    })

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie':
          'refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0', // Expire the cookie
      },
      body: JSON.stringify({
        message: 'Logged out successfully',
      }),
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return {
      statusCode: 500,
      body: JSON.stringify({ message: errorMessage }),
    }
  }
}
