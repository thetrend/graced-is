import * as bcrypt from 'bcryptjs';
import { DateTime } from 'luxon';
import type { HandlerEvent, HandlerResponse } from '@netlify/functions';
import getPrismaClient from '../utils/prisma';
import { loginSchema } from '../schemas/userSchemas';
import { generateAccessToken, generateRefreshToken } from '../utils/tokens';
import { createErrorResponse } from '../utils/netlify';

const prisma = getPrismaClient();

export const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Check for the correct HTTP method
  if (event.httpMethod !== 'POST') {
    return createErrorResponse(405, 'Method Not Allowed');
  }

  // Check for request body
  if (!event.body) {
    return createErrorResponse(400, 'Bad Request: Request body is required.');
  }

  let userData;
  try {
    userData = JSON.parse(event.body);
  } catch (parseError) {
    return createErrorResponse(400, 'Bad Request: Invalid JSON format.');
  }

  try {
    // Validate user data
    const validatedData = loginSchema.safeParse(userData);

    if (!validatedData.success) {
      return createErrorResponse(400, JSON.stringify({ errors: validatedData.error.errors }));
    }

    const { email, password } = validatedData.data;

    // Check if user exists
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return createErrorResponse(400, 'Invalid credentials');
    }

    // Compare password
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return createErrorResponse(400, 'Invalid credentials');
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const refreshTokenTTL = Number(process.env.REFRESH_TOKEN_EXPIRES_IN?.replace('d', '')) || 7;

    const expiresAt = DateTime.now().plus({ days: refreshTokenTTL }).toJSDate();

    // Save refresh token in the database
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    });

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24 * refreshTokenTTL}`,
      },
      body: JSON.stringify({
        message: 'Login successful',
        accessToken,
      }),
    };
  } catch (error) {
    console.error("Error during login:", error);
    return createErrorResponse(500, error instanceof Error ? error.message : 'An unknown error occurred');
  }
};
