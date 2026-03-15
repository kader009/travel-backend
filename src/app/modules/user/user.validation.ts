import { z } from 'zod';

export const UserValidation = {
  // Update profile schema
  updateProfileSchema: z.object({
    body: z.object({
      name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .optional(),

      email: z.string().email('Invalid email format').optional(),

      image: z.string().url('Invalid image URL').optional(),

      bio: z.string().max(1000, 'Bio cannot exceed 1000 characters').optional(),

      travelInterests: z
        .array(z.string().min(1, 'Interest cannot be empty'))
        .max(20, 'Cannot have more than 20 interests')
        .optional(),

      visitedCountries: z
        .array(z.string().min(1, 'Country name cannot be empty'))
        .max(100, 'Cannot have more than 100 countries')
        .optional(),

      currentLocation: z
        .string()
        .max(200, 'Location cannot exceed 200 characters')
        .optional(),
      coordinates: z
        .object({
          lat: z.number({ required_error: 'Latitude must be a number' }),
          lng: z.number({ required_error: 'Longitude must be a number' }),
        })
        .optional(),
    }),
  }),

  // Update password schema
  updatePasswordSchema: z.object({
    body: z
      .object({
        currentPassword: z
          .string({ required_error: 'Current password is required' })
          .min(6, 'Password must be at least 6 characters'),

        newPassword: z
          .string({ required_error: 'New password is required' })
          .min(6, 'New password must be at least 6 characters')
          .max(50, 'New password cannot exceed 50 characters'),

        confirmPassword: z.string({
          required_error: 'Confirm password is required',
        }),
      })
      .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'New password and confirm password do not match',
        path: ['confirmPassword'],
      }),
  }),

  // Admin update user schema
  adminUpdateUserSchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    }),
    body: z.object({
      name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .optional(),

      email: z.string().email('Invalid email format').optional(),

      role: z.enum(['user', 'admin']).optional(),

      status: z.enum(['active', 'inactive', 'banned']).optional(),

      isVerified: z.boolean().optional(),
    }),
  }),

  // Delete user schema
  deleteUserSchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    }),
  }),

  // Get single user schema
  getSingleUserSchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    }),
  }),

  // Get public profile schema
  getPublicProfileSchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    }),
  }),

  // Get all users query schema
  getAllUsersSchema: z.object({
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      search: z.string().optional(),
      role: z.enum(['user', 'admin']).optional(),
      isActive: z.enum(['true', 'false']).optional(),
      sort: z
        .enum(['name', '-name', 'email', '-email', 'createdAt', '-createdAt'])
        .optional(),
    }),
  }),
};
