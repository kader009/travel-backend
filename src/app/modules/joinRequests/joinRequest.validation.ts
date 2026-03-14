import { z } from 'zod';

export const JoinRequestValidation = {
  createJoinRequestSchema: z.object({
    body: z.object({
      travelPlan: z
        .string({ required_error: 'Travel plan ID is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid travel plan ID'),
      message: z
        .string()
        .max(500, 'Message cannot exceed 500 characters')
        .optional(),
    }),
  }),

  getJoinRequestSchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid request ID'),
    }),
  }),

  getPlanRequestsSchema: z.object({
    params: z.object({
      planId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid travel plan ID'),
    }),
  }),

  updateStatusSchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid request ID'),
    }),
  }),
};
