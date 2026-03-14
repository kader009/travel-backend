import { Review } from './review.model';
import { IReview } from './review.interface';
import { TravelPlan } from '../travelPlans/travelPlan.model';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../../errors/AppError';

export const reviewService = {
  // Create a review (only after trip is completed)
  async createReview(
    reviewerId: string,
    reviewData: {
      reviewee: string;
      travelPlan: string;
      rating: number;
      comment: string;
    },
  ): Promise<IReview> {
    // Cannot review yourself
    if (reviewerId === reviewData.reviewee) {
      throw new BadRequestError('You cannot review yourself');
    }

    // Check if the travel plan exists and is completed
    const travelPlan = await TravelPlan.findById(reviewData.travelPlan);
    if (!travelPlan) {
      throw new NotFoundError('Travel plan not found');
    }

    if (travelPlan.status !== 'completed') {
      throw new BadRequestError(
        'You can only review after the trip is completed',
      );
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      reviewer: reviewerId,
      reviewee: reviewData.reviewee,
      travelPlan: reviewData.travelPlan,
      isDeleted: false,
    });

    if (existingReview) {
      throw new ConflictError(
        'You have already reviewed this user for this trip',
      );
    }

    const review = await Review.create({
      ...reviewData,
      reviewer: reviewerId,
    });

    return review;
  },

  // Get all reviews for a specific user
  async getUserReviews(
    userId: string,
  ): Promise<{ reviews: IReview[]; averageRating: number }> {
    const reviews = await Review.find({
      reviewee: userId,
      isDeleted: false,
    })
      .populate('reviewer', 'name image')
      .populate('travelPlan', 'destination startDate endDate')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating =
      reviews.length > 0
        ? parseFloat((totalRating / reviews.length).toFixed(1))
        : 0;

    return { reviews, averageRating };
  },

  // Get single review
  async getReviewById(reviewId: string): Promise<IReview> {
    const review = await Review.findOne({
      _id: reviewId,
      isDeleted: false,
    })
      .populate('reviewer', 'name image')
      .populate('reviewee', 'name image')
      .populate('travelPlan', 'destination startDate endDate');

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    return review;
  },

  // Update own review
  async updateReview(
    reviewId: string,
    userId: string,
    updateData: Partial<IReview>,
  ): Promise<IReview> {
    const review = await Review.findOne({
      _id: reviewId,
      isDeleted: false,
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.reviewer.toString() !== userId) {
      throw new ForbiddenError('You can only update your own reviews');
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating: updateData.rating, comment: updateData.comment },
      { new: true, runValidators: true },
    )
      .populate('reviewer', 'name image')
      .populate('reviewee', 'name image')
      .populate('travelPlan', 'destination startDate endDate');

    if (!updatedReview) {
      throw new BadRequestError('Failed to update review');
    }

    return updatedReview;
  },

  // Delete review (own review or admin)
  async deleteReview(
    reviewId: string,
    userId: string,
    userRole: string,
  ): Promise<void> {
    const review = await Review.findOne({
      _id: reviewId,
      isDeleted: false,
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.reviewer.toString() !== userId && userRole !== 'admin') {
      throw new ForbiddenError('You are not authorized to delete this review');
    }

    await Review.findByIdAndUpdate(reviewId, { isDeleted: true });
  },
};
