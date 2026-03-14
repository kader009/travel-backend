import { z } from 'zod';

// Register validation
export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(5, 'Name must be at least 5 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    image: z.string().url('Invalid image URL').optional(),
    role: z.enum(['user', 'admin']).optional().default('user'),
  }),
});

// Login validation
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  }),
});

// Refresh token validation
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }),
  }),
});

// Social login validation
export const socialLoginSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(5, 'Name must be at least 5 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'),
    provider: z.enum(['google', 'github'], {
      required_error: 'Provider is required',
    }),
    image: z.string().url('Invalid image URL').optional(),
  }),
});

export const AuthValidation = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  socialLoginSchema,
};
