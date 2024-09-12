import { z } from 'zod'
import { parseCookies } from 'nookies'

import type { Handler, HandlerEvent } from '@netlify/functions'

// import getPrismaClient from '../utils/prisma'
// import {
//   verifyAccessToken,
//   verifyRefreshToken,
//   generateAccessToken,
// } from '../utils/tokens'
import { verifyPostMethod } from '../utils/netlify'

// const prisma = getPrismaClient()

// eslint-disable-next-line import/prefer-default-export
export const handler: Handler = async (event: HandlerEvent) => {
  verifyPostMethod(event)

  try {
    const cookies = parseCookies({
      req: { headers: { cookie: event.headers.cookie || '' } },
    })

    // const data = JSON.parse(event.body!)
    // const validatedData = loginSchema.parse(data)

    return {
      statusCode: 200,
      body: JSON.stringify({ cookies }),
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
