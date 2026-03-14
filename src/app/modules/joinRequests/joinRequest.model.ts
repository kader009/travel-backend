import { Schema, model } from 'mongoose';
import { IJoinRequest } from './joinRequest.interface';

const joinRequestSchema = new Schema<IJoinRequest>(
  {
    travelPlan: {
      type: Schema.Types.ObjectId,
      ref: 'TravelPlan',
      required: [true, 'Travel plan reference is required'],
    },
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester reference is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: 'Status must be pending, approved, or rejected',
      },
      default: 'pending',
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// One user can only request to join a specific travel plan once
joinRequestSchema.index({ travelPlan: 1, requester: 1 }, { unique: true });
joinRequestSchema.index({ travelPlan: 1, status: 1 });
joinRequestSchema.index({ requester: 1, status: 1 });

export const JoinRequest = model<IJoinRequest>(
  'JoinRequest',
  joinRequestSchema,
);
