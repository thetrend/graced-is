import bcrypt from 'bcryptjs'
import { z } from 'zod'
import _ from 'lodash'
import { DateTime } from 'luxon'

import type { Handler, HandlerEvent } from '@netlify/functions'

import getPrismaClient from '../utils/prisma'
import { verifyPostMethod } from '../utils/netlify'
import { generateAccessToken, generateRefreshToken } from '../utils/tokens'
import { defaultTZ, registerSchema } from '../schemas/registerSchema'

const prisma = getPrismaClient()

const appendCustomErrors = (
  zodError: z.ZodError,
  customErrors: { [key: string]: string }
) => {
  const existingErrors = zodError.errors

  const newErrors = Object.entries(customErrors).map(([key, message]) => ({
    path: [key],
    message,
    code: z.ZodIssueCode.custom,
  }))

  const allErrors = [...existingErrors, ...newErrors]

  return new z.ZodError(allErrors)
}

// eslint-disable-next-line import/prefer-default-export
export const handler: Handler = async (event: HandlerEvent) => {
  verifyPostMethod(event)

  try {
    const data = JSON.parse(event.body!)

    // First, check for custom errors like existing email
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    })

    const customErrors: { [key: string]: string } = {}
    if (userExists) {
      if (userExists.email === data.email) {
        customErrors.email = 'Email already exists'
      }
      if (userExists.username === data.username) {
        customErrors.username = 'Username already exists'
      }
    }

    // Validate data with the register schema
    const zodResult = registerSchema.safeParse(data)

    if (!zodResult.success || Object.keys(customErrors).length > 0) {
      throw appendCustomErrors(
        zodResult.error || new z.ZodError([]),
        customErrors
      )
    }

    const { email, password, username, display, timezone } = data

    const hashedPassword = await bcrypt.hash(password, 10)

    const prismaUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        display,
        timezone: timezone || defaultTZ,
      },
    })

    const user = _.omit(prismaUser, ['password'])

    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)
    const refreshTokenTTL =
      Number(process.env.REFRESH_TOKEN_EXPIRES_IN!.replace('d', '')) || 7

    const expiresAt = DateTime.now()
      .plus({
        days: refreshTokenTTL,
      })
      .toJSDate()

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    })

    return {
      statusCode: 201,
      headers: {
        'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24 * refreshTokenTTL}`, // 7 days
      },
      body: JSON.stringify({
        message: 'User registered',
        accessToken,
        user,
      }),
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ errors: error.errors }),
      }
    }

    // Handle other errors
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return {
      statusCode: 500,
      body: JSON.stringify({ message: errorMessage }),
    }
  }
}
