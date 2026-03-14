import { Schema, model } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>(
  {
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewer is required'],
    },
    reviewee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewee is required'],
    },
    travelPlan: {
      type: Schema.Types.ObjectId,
      ref: 'TravelPlan',
      required: [true, 'Travel plan reference is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
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

// One reviewer can only review one person per travel plan
reviewSchema.index(
  { reviewer: 1, reviewee: 1, travelPlan: 1 },
  { unique: true },
);
reviewSchema.index({ reviewee: 1, createdAt: -1 });
reviewSchema.index({ travelPlan: 1 });

export const Review = model<IReview>('Review', reviewSchema);
