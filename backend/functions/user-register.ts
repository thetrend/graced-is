import bcrypt from 'bcryptjs'
import _ from 'lodash'

import { DateTime } from 'luxon'
import { z } from 'zod'

import type { HandlerEvent, HandlerResponse } from '@netlify/functions'

import getPrismaClient from '../utils/prisma'

import { defaultTZ, registerSchema } from '../schemas/registerSchema'
import { verifyPostMethod } from '../utils/netlify'
import { generateAccessToken, generateRefreshToken } from '../utils/tokens'

const prisma = getPrismaClient()

/**
 * Takes a Zod error and some custom error messages, and merges the custom
 * error messages into the Zod error.
 *
 * @param zodError The Zod error to merge into.
 * @param customErrorMessages The custom error messages to merge in.
 * @returns The merged Zod error.
 */
export const appendCustomErrors = (
  zodError: z.ZodError,
  customErrorMessages: Record<string, string>,
): z.ZodError => {
  // Create an object that has the same shape as the Zod error, but with the
  // custom error messages inserted.
  const newErrors = Object.fromEntries(
    // Iterate over the custom error messages, and convert each one into an
    // object that has the same shape as the Zod error objects.
    Object.entries(customErrorMessages).map(([field, message]) => [
      field,
      {
        // The "path" property is an array of strings, and the "message"
        // property is a string. The "path" property indicates which field in
        // the input data the error refers to, and the "message" property is
        // the error message itself.
        path: [field],
        message,
        code: z.ZodIssueCode.custom,
      },
    ]),
  )

  // Concatenate the new object with the existing Zod error.
  const allErrors = [...(zodError.errors ?? []), ...Object.values(newErrors)]

  // Return the merged Zod error.
  return new z.ZodError(allErrors)
}

const checkUserExists = async (
  input: { email: string; username: string },
  errorList: { [key: string]: string },
) => {
  const { email, username } = input

  // Check if the username or email already exists in the database
  const existingUser = await prisma.user.findFirst({
    // Search for a user with the same email or username
    where: {
      OR: [{ email }, { username }],
    },
    // Only select the id, email and username columns
    select: {
      id: true,
      email: true,
      username: true,
    },
  })

  if (existingUser && existingUser.email === email) {
    errorList.email = 'Email already exists'
  }
  if (existingUser && existingUser.username === username) {
    errorList.username = 'Username already exists'
  }
  return errorList
}

/**
 * Handle the user registration request.
 *
 * @param {HandlerEvent} event The event object passed to the handler.
 * @returns {Promise<HandlerResponse>} The response object.
 */
export async function handler(event: HandlerEvent): Promise<HandlerResponse> {
  // Verify that the request is a POST request
  verifyPostMethod(event)

  try {
    // Parse the request body into a JSON object
    const userData = JSON.parse(event.body ?? '{}')

    // Initialize an empty object to store custom errors
    const customErrors: { [key: string]: string } = {}

    // If a user with the same email or username already exists, add a custom error
    checkUserExists(userData, customErrors)

    // Parse the user data using the registerSchema
    const parsedUserData = registerSchema.safeParse(userData)

    // If there are any custom errors, append them to the Zod error
    if (Object.keys(customErrors).length > 0) {
      const error = appendCustomErrors(
        parsedUserData.error ?? new z.ZodError([]),
        customErrors,
      )

      // Return a 400 response with the custom errors
      return {
        statusCode: 400,
        body: JSON.stringify({ errors: error.errors }),
      }
    }

    // If the parsed user data is invalid, return a 400 response with the Zod errors
    if (!parsedUserData.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ errors: parsedUserData.error?.errors }),
      }
    }

    // Extract the user data from the parsed user data
    const {
      email,
      password,
      username,
      display,
      timezone = defaultTZ,
    } = parsedUserData.data

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        // Hash the password before storing it in the database
        password: await bcrypt.hash(password, 10),
        username,
        display,
        timezone,
      },
    })

    // If the user was not created, throw an error
    if (!user) {
      throw new Error('Failed to create user')
    }

    // Generate an access token and a refresh token
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    // Get the refresh token TTL from the environment variable
    const refreshTokenTTL = Number(
      (process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7').replace('d', ''),
    )

    // If the refresh token TTL is not a valid number, throw an error
    if (Number.isNaN(refreshTokenTTL)) {
      throw new Error('REFRESH_TOKEN_EXPIRES_IN is not a valid number')
    }

    // Calculate the expiration date for the refresh token
    const expiresAt = DateTime.now().plus({ days: refreshTokenTTL }).toJSDate()

    // Create a new refresh token in the database
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    })

    // Return a 201 response with the access token and the user data
    return {
      statusCode: 201,
      headers: {
        // Set the refresh token as a cookie
        'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24 * refreshTokenTTL}`,
      },
      body: JSON.stringify({
        message: 'User registered',
        accessToken,
        user: _.omit(user, ['password']),
      }),
    }
  } catch (error) {
    // If the error is a ZodError, return a 400 response with the Zod errors
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ errors: error.errors }),
      }
    }

    // Return a 500 response with an error message
    return {
      statusCode: 500,
      body: JSON.stringify({
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
      }),
    }
  }
}
