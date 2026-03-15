import { z } from 'zod';

export const TravelPlanValidation = {
  createTravelPlanSchema: z.object({
    body: z.object({
      destination: z
        .string({ required_error: 'Destination is required' })
        .min(2, 'Destination must be at least 2 characters')
        .max(200, 'Destination cannot exceed 200 characters'),
      startDate: z
        .string({ required_error: 'Start date is required' })
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid start date'),
      endDate: z
        .string({ required_error: 'End date is required' })
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid end date'),
      budget: z.object({
        min: z
          .number({ required_error: 'Minimum budget is required' })
          .min(0, 'Budget cannot be negative'),
        max: z
          .number({ required_error: 'Maximum budget is required' })
          .min(0, 'Budget cannot be negative'),
      }),
      travelType: z.enum(['Solo', 'Family', 'Friends', 'Couple'], {
        required_error: 'Travel type is required',
      }),
      description: z
        .string({ required_error: 'Description is required' })
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description cannot exceed 2000 characters'),
      itinerary: z
        .string()
        .max(5000, 'Itinerary cannot exceed 5000 characters')
        .optional(),
      coordinates: z
        .object({
          lat: z.number({ required_error: 'Latitude is required' }),
          lng: z.number({ required_error: 'Longitude is required' }),
        })
        .optional(),
      images: z.array(z.string().url('Invalid image URL')).optional(),
    }),
  }),

  updateTravelPlanSchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid travel plan ID'),
    }),
    body: z.object({
      destination: z
        .string()
        .min(2, 'Destination must be at least 2 characters')
        .max(200, 'Destination cannot exceed 200 characters')
        .optional(),
      startDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid start date')
        .optional(),
      endDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid end date')
        .optional(),
      budget: z
        .object({
          min: z.number().min(0, 'Budget cannot be negative'),
          max: z.number().min(0, 'Budget cannot be negative'),
        })
        .optional(),
      travelType: z.enum(['Solo', 'Family', 'Friends', 'Couple']).optional(),
      description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description cannot exceed 2000 characters')
        .optional(),
      itinerary: z
        .string()
        .max(5000, 'Itinerary cannot exceed 5000 characters')
        .optional(),
      coordinates: z
        .object({
          lat: z.number({ required_error: 'Latitude must be a number' }),
          lng: z.number({ required_error: 'Longitude must be a number' }),
        })
        .optional(),
      images: z.array(z.string().url('Invalid image URL')).optional(),
      status: z
        .enum(['upcoming', 'ongoing', 'completed', 'cancelled'])
        .optional(),
    }),
  }),

  getTravelPlanSchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid travel plan ID'),
    }),
  }),

  searchTravelPlanSchema: z.object({
    query: z.object({
      destination: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      travelType: z.enum(['Solo', 'Family', 'Friends', 'Couple']).optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
    }),
  }),
};
