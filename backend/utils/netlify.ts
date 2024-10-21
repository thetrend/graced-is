import { HandlerResponse } from '@netlify/functions'

export const createErrorResponse = (statusCode: number, message: string): HandlerResponse => ({
  statusCode,
  body: JSON.stringify({ message }),
});
