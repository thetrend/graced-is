import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

import type { Handler, HandlerEvent } from '@netlify/functions'

import getPrismaClient from '../utils/prisma'
import { verifyPostMethod } from '../utils/netlify'

const prisma = getPrismaClient()

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email address is required',
    })
    .email('Invalid email address'),
  password: z.string({ required_error: 'Password is required' }),
})

const handler: Handler = async (event: HandlerEvent) => {
  verifyPostMethod(event)

  try {
    const data = JSON.parse(event.body!)

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

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      }
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Login successful', token }),
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
