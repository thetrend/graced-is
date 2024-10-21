import * as bcrypt from 'bcryptjs';
import * as _ from 'lodash';

import { DateTime } from 'luxon';
import { z } from 'zod';

import type { HandlerEvent, HandlerResponse } from '@netlify/functions';

import getPrismaClient from '../utils/prisma';

import { defaultTZ, registerSchema } from '../schemas/registerSchema';
import { generateAccessToken, generateRefreshToken } from '../utils/tokens';

const prisma = getPrismaClient();

export const appendCustomErrors = (zodError: z.ZodError, customErrorMessages: Record<string, string>): z.ZodError => {
  const newErrors = Object.entries(customErrorMessages).map(([field, message]) => ({
    path: [field],
    message,
    code: z.ZodIssueCode.custom,
  }));
  return new z.ZodError([...zodError.errors, ...newErrors]);
};

const checkUserExists = async (input: { email: string; username: string }, errorList: { [key: string]: string }) => {
  const { email, username } = input;
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { id: true, email: true, username: true },
  });

  if (existingUser?.email === email) errorList.email = 'Email already exists';
  if (existingUser?.username === username) errorList.username = 'Username already exists';

  return errorList;
};

export const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }
  if (!event.body) {
    return {
      statusCode: 400,
      body: 'Bad Request: Request body is required.',
    };
  }

  let userData;
  try {
    userData = JSON.parse(event.body);
  } catch (parseError) {
    return {
      statusCode: 400,
      body: 'Bad Request: Invalid JSON format.',
    };
  }

  try {
    const customErrors: { [key: string]: string } = {};

    await checkUserExists(userData, customErrors);

    const parsedUserData = registerSchema.safeParse(userData);
    if (Object.keys(customErrors).length > 0) {
      const error = appendCustomErrors(parsedUserData.error ?? new z.ZodError([]), customErrors);
      return { statusCode: 400, body: JSON.stringify({ errors: error.errors }) };
    }

    if (!parsedUserData.success) {
      return { statusCode: 400, body: JSON.stringify({ errors: parsedUserData.error?.errors }) };
    }

    const { email, password, username, display, timezone = defaultTZ } = parsedUserData.data;

    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        username,
        display,
        timezone,
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const refreshTokenTTL = Number(process.env.REFRESH_TOKEN_EXPIRES_IN?.replace('d', '')) || 7;

    const expiresAt = DateTime.now().plus({ days: refreshTokenTTL }).toJSDate();

    // Create refresh token record
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    });

    // Return response without sensitive information
    return {
      statusCode: 201,
      headers: {
        'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24 * refreshTokenTTL}`,
      },
      body: JSON.stringify({
        message: 'User registered',
        accessToken,
        user: _.omit(user, ['password']),  // Ensure to omit sensitive data
      }),
    };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { statusCode: 400, body: JSON.stringify({ errors: error.errors }) };
    }
    return { statusCode: 500, body: JSON.stringify({ message: error instanceof Error ? error.message : 'An unknown error occurred' }) };
  }
};
