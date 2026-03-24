import { Request, Response, NextFunction } from 'express';
import { reviewService } from './review.service';

export const reviewController = {
  async createReview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const reviewerId = req.user!.userId;
      const review = await reviewService.createReview(reviewerId, req.body);
      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserReviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const result = await reviewService.getUserReviews(userId);
      res.status(200).json({
        success: true,
        data: result.reviews,
        averageRating: result.averageRating,
      });
    } catch (error) {
      next(error);
    }
  },

  async getReviewsGivenByUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await reviewService.getReviewsGivenByUser(userId);
      res.status(200).json({
        success: true,
        message: 'Reviews given by you',
        data: result.reviews,
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  },

  async getReviewsReceivedByUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await reviewService.getReviewsReceivedByUser(userId);
      res.status(200).json({
        success: true,
        message: 'Reviews received by you',
        data: result.reviews,
        averageRating: result.averageRating,
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  },

  async getReviewById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const review = await reviewService.getReviewById(req.params.id);
      res.status(200).json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  },

  async updateReview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const review = await reviewService.updateReview(
        req.params.id,
        userId,
        req.body,
      );
      res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteReview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const userRole = req.user!.role;
      await reviewService.deleteReview(req.params.id, userId, userRole);
      res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
