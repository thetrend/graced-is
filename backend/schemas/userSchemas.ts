import { z } from 'zod'

export const defaultTZ = 'America/New_York'

export const registerSchema = z
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
    passwordConfirm: z
      .string({
        required_error: 'Please confirm your password',
      })
      .min(8, 'Password must be at least 8 characters')
      .max(24, 'Password must not exceed 24 characters'),
    username: z
      .string({
        required_error: 'Username is required',
      })
      .min(1, 'Username must contain at least 1 character')
      .max(20, 'Username can only be up to 20 characters')
      .regex(
        /^[A-Za-z0-9_-]+$/,
        'Username can only contain letters, numbers, dashes, and underscores'
      ),
    display: z
      .string({
        required_error: 'Display name is required',
      })
      .min(1, 'Display name must contain at least 1 character')
      .max(20, 'Display name can only be up to 20 characters'),
    timezone: z.string().default(defaultTZ),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  })

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email address is required',
    })
    .email('Invalid email address'),
  password: z.string({ required_error: 'Password is required' }),
});
