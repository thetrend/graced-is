import bcrypt from 'bcryptjs'
import { DateTime } from 'luxon'
import { z } from 'zod'

import type { Handler, HandlerEvent } from '@netlify/functions'

import { verifyPostMethod } from '../utils/netlify'
import getPrismaClient from '../utils/prisma'
import { generateAccessToken, generateRefreshToken } from '../utils/tokens'

const prisma = getPrismaClient()

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email address is required',
    })
    .email('Invalid email address'),
  password: z.string({ required_error: 'Password is required' }),
})

// eslint-disable-next-line import/prefer-default-export
export const handler: Handler = async (event: HandlerEvent) => {
  verifyPostMethod(event)

  try {
    const data = JSON.parse(event.body ?? '{}')

    const validatedData = loginSchema.parse(data)

    const { email, password } = validatedData

    const user = await prisma.user.findFirst({
      where: { email },
    })

    if (!user) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      }
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      }
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)
    const refreshTokenTTL =
      Number(process.env.REFRESH_TOKEN_EXPIRES_IN?.replace('d', '')) || 7

    const expiresAt = DateTime.now()
      .plus({
        days: refreshTokenTTL,
      })
      .toJSDate()

    // Save refresh token in the database if needed
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    })

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24 * refreshTokenTTL}`, // 7 days
      },
      body: JSON.stringify({
        message: 'Login successful',
        accessToken,
      }),
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ errors: error.errors }),
      }
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ message: errorMessage }),
    }
  }
}
