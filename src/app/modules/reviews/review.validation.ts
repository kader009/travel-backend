import { z } from 'zod';

export const ReviewValidation = {
  createReviewSchema: z.object({
    body: z.object({
      reviewee: z
        .string({ required_error: 'Reviewee ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid reviewee ID'),
      travelPlan: z
        .string({ required_error: 'Travel plan ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid travel plan ID'),
      rating: z
        .number({ required_error: 'Rating is required' })
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating cannot exceed 5'),
      comment: z
        .string({ required_error: 'Comment is required' })
        .min(10, 'Comment must be at least 10 characters')
        .max(2000, 'Comment cannot exceed 2000 characters'),
    }),
  }),

  updateReviewSchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid review ID'),
    }),
    body: z.object({
      rating: z
        .number()
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating cannot exceed 5')
        .optional(),
      comment: z
        .string()
        .min(10, 'Comment must be at least 10 characters')
        .max(2000, 'Comment cannot exceed 2000 characters')
        .optional(),
    }),
  }),

  getReviewSchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid review ID'),
    }),
  }),

  getUserReviewsSchema: z.object({
    params: z.object({
      userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    }),
  }),
};
