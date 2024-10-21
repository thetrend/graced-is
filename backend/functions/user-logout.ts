import type { HandlerEvent, HandlerResponse } from '@netlify/functions';
import getPrismaClient from '../utils/prisma';
import { createErrorResponse } from '../utils/netlify';

const prisma = getPrismaClient();

export const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Verify that the request method is POST
  if (event.httpMethod !== 'POST') {
    return createErrorResponse(405, 'Method Not Allowed');
  }

  try {
    // Extract the refresh token from cookies
    const cookies = event.headers.cookie ?? '';
    const refreshToken = cookies
      .split('; ')
      .find(row => row.startsWith('refreshToken='))
      ?.split('=')[1];

    // Check if refresh token is provided
    if (!refreshToken) {
      return createErrorResponse(400, 'Refresh token is required');
    }

    // Delete the refresh token from the database
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Set-Cookie':
          'refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0', // Expire the cookie
      },
      body: JSON.stringify({
        message: 'Logged out successfully',
      }),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return createErrorResponse(500, errorMessage);
  }
};
