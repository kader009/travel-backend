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

  // Get user review statistics with user details (public endpoint)
  async getUserReviewStats(userId: string): Promise<{
    user: {
      _id: string;
      name: string;
      email: string;
      image?: string;
      bio?: string;
      isVerified: boolean;
    };
    totalReviews: number;
    averageRating: number;
    ratingBreakdown: {
      five: number;
      four: number;
      three: number;
      two: number;
      one: number;
    };
  }> {
    // Get user details
    const { User } = await import('../user/user.model');
    const user = await User.findOne({
      _id: userId,
      isDeleted: false,
    }).select('name email image bio isVerified');

    if (!user) {
      throw new Error('User not found');
    }

    // Get all reviews for this user
    const reviews = await Review.find({
      reviewee: userId,
      isDeleted: false,
    });

    // Calculate statistics
    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating =
      totalReviews > 0
        ? parseFloat((totalRating / totalReviews).toFixed(1))
        : 0;

    // Count ratings breakdown
    const ratingBreakdown = {
      five: reviews.filter((r) => r.rating === 5).length,
      four: reviews.filter((r) => r.rating === 4).length,
      three: reviews.filter((r) => r.rating === 3).length,
      two: reviews.filter((r) => r.rating === 2).length,
      one: reviews.filter((r) => r.rating === 1).length,
    };

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        bio: user.bio,
        isVerified: user.isVerified,
      },
      totalReviews,
      averageRating,
      ratingBreakdown,
    };
  },

  // Get all users with their review statistics (for listing/mapping)
  async getAllUsersReviewStats(): Promise<
    Array<{
      user: {
        _id: string;
        name: string;
        email: string;
        image?: string;
        bio?: string;
        isVerified: boolean;
      };
      totalReviews: number;
      averageRating: number;
      ratingBreakdown: {
        five: number;
        four: number;
        three: number;
        two: number;
        one: number;
      };
    }>
  > {
    // Get all users
    const { User } = await import('../user/user.model');
    const users = await User.find({ isDeleted: false }).select(
      'name email image bio isVerified',
    );

    // Get all reviews grouped by reviewee
    const reviews = await Review.find({ isDeleted: false });

    // Create a map of reviews by reviewee
    const reviewsByUser = new Map<string, IReview[]>();
    reviews.forEach((review) => {
      const key = review.reviewee.toString();
      if (!reviewsByUser.has(key)) {
        reviewsByUser.set(key, []);
      }
      reviewsByUser.get(key)!.push(review);
    });

    // Build result array
    const result = users
      .map((user) => {
        const userReviews = reviewsByUser.get(user._id.toString()) || [];
        const totalReviews = userReviews.length;
        const totalRating = userReviews.reduce(
          (sum, review) => sum + review.rating,
          0,
        );
        const averageRating =
          totalReviews > 0
            ? parseFloat((totalRating / totalReviews).toFixed(1))
            : 0;

        const ratingBreakdown = {
          five: userReviews.filter((r) => r.rating === 5).length,
          four: userReviews.filter((r) => r.rating === 4).length,
          three: userReviews.filter((r) => r.rating === 3).length,
          two: userReviews.filter((r) => r.rating === 2).length,
          one: userReviews.filter((r) => r.rating === 1).length,
        };

        return {
          user: {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            bio: user.bio,
            isVerified: user.isVerified,
          },
          totalReviews,
          averageRating,
          ratingBreakdown,
        };
      })
      .sort((a, b) => b.averageRating - a.averageRating); // Sort by rating (highest first)

    return result;
  },

  // Get all reviews for a specific user (for their profile - reviews they received)
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

  // Get all reviews given by a user (for dashboard - reviews they created)
  async getReviewsGivenByUser(
    userId: string,
  ): Promise<{ reviews: IReview[]; total: number }> {
    const reviews = await Review.find({
      reviewer: userId,
      isDeleted: false,
    })
      .populate('reviewee', 'name image')
      .populate('travelPlan', 'destination startDate endDate')
      .sort({ createdAt: -1 });

    return { reviews, total: reviews.length };
  },

  // Get all reviews received by a user (for dashboard - reviews about them)
  async getReviewsReceivedByUser(
    userId: string,
  ): Promise<{ reviews: IReview[]; averageRating: number; total: number }> {
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

    return { reviews, averageRating, total: reviews.length };
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

  // Get latest reviews for carousel (community voices)
  async getLatestReviews(limit: number = 6): Promise<
    Array<{
      _id: string;
      reviewer: {
        _id: string;
        name: string;
        image?: string;
      };
      reviewee: {
        _id: string;
        name: string;
      };
      rating: number;
      comment: string;
      travelPlan: {
        destination: string;
      };
      createdAt: Date;
    }>
  > {
    const reviews = await Review.find({ isDeleted: false })
      .populate('reviewer', 'name image')
      .populate('reviewee', 'name')
      .populate('travelPlan', 'destination')
      .sort({ createdAt: -1 })
      .limit(limit);

    return reviews.map((review) => ({
      _id: review._id?.toString() || '',
      reviewer: {
        _id: (review.reviewer as any)._id?.toString() || '',
        name: (review.reviewer as any).name,
        image: (review.reviewer as any).image,
      },
      reviewee: {
        _id: (review.reviewee as any)._id?.toString() || '',
        name: (review.reviewee as any).name,
      },
      rating: review.rating,
      comment: review.comment,
      travelPlan: {
        destination: (review.travelPlan as any).destination,
      },
      createdAt: review.createdAt!,
    }));
  },
};
