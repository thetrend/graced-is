import bcrypt from 'bcryptjs'
import { z } from 'zod'
import _ from 'lodash'

import type { Handler, HandlerEvent } from '@netlify/functions'

import getPrismaClient from '../utils/prisma'
import { verifyPostMethod } from '../utils/netlify'

const prisma = getPrismaClient()

const defaultTZ = process.env.DEFAULT_TIMEZONE || 'UTC'

const registrationSchema = z
  .object({
    email: z
      .string({
        required_error: 'Email address is required',
      })
      .email('Invalid email address'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, 'Password must be at least 8 characters')
      .max(24, 'Password must not exceed 24 characters'),
    passwordConfirm: z.string({
      required_error: 'Please confirm your password',
    }),
    username: z
      .string({
        required_error: 'Username is required',
      })
      .min(2)
      .max(20)
      .regex(
        /^[A-Za-z0-9_-]+$/,
        'Username can only contain letters, numbers, dashes, and underscores.'
      ),
    display: z
      .string({
        required_error: 'Display name is required',
      })
      .min(1)
      .max(20),
    timezone: z.string().default(defaultTZ),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  })

const handler: Handler = async (event: HandlerEvent) => {
  verifyPostMethod(event)

  try {
    const data = JSON.parse(event.body!)

    const validatedData = registrationSchema.parse(data)

    const { email, password, username, display, timezone } = validatedData

    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (userExists) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Email or username already exists',
        }),
      }
    }

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

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User registered', user }),
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

// eslint-disable-next-line import/prefer-default-export
export { handler }
