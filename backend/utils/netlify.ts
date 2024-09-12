import { HandlerResponse } from '@netlify/functions'

// Define the function with correct type
// eslint-disable-next-line import/prefer-default-export
export const verifyPostMethod = (event: {
  httpMethod: string
  body: string | null
}): HandlerResponse | undefined => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    }
  }
  if (!event.body) {
    return {
      statusCode: 400,
      body: 'Bad Request: Request body is required.',
    }
  }

  return undefined
}
