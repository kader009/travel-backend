import { Schema, model } from 'mongoose';
import { ITravelPlan } from './travelPlan.interface';

const travelPlanSchema = new Schema<ITravelPlan>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
      minlength: [2, 'Destination must be at least 2 characters'],
      maxlength: [200, 'Destination cannot exceed 200 characters'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    budget: {
      min: {
        type: Number,
        required: [true, 'Minimum budget is required'],
        min: [0, 'Budget cannot be negative'],
      },
      max: {
        type: Number,
        required: [true, 'Maximum budget is required'],
        min: [0, 'Budget cannot be negative'],
      },
    },
    travelType: {
      type: String,
      enum: {
        values: ['Solo', 'Family', 'Friends', 'Couple'],
        message: 'Travel type must be Solo, Family, Friends, or Couple',
      },
      required: [true, 'Travel type is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    itinerary: {
      type: String,
      trim: true,
      maxlength: [5000, 'Itinerary cannot exceed 5000 characters'],
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        message: 'Status must be upcoming, ongoing, completed, or cancelled',
      },
      default: 'upcoming',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes for search and filtering
travelPlanSchema.index({ destination: 'text', description: 'text' });
travelPlanSchema.index({ user: 1 });
travelPlanSchema.index({ startDate: 1, endDate: 1 });
travelPlanSchema.index({ status: 1 });
travelPlanSchema.index({ travelType: 1 });
travelPlanSchema.index({ destination: 1, startDate: 1 });

export const TravelPlan = model<ITravelPlan>('TravelPlan', travelPlanSchema);
