import express from 'express';
import { reviewController } from './review.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';

const router = express.Router();

// Public routes
router.get(
  '/user/:userId',
  validateRequest(ReviewValidation.getUserReviewsSchema),
  reviewController.getUserReviews,
);

router.get(
  '/:id',
  validateRequest(ReviewValidation.getReviewSchema),
  reviewController.getReviewById,
);

// Protected routes (User & Admin)
router.post(
  '/',
  authMiddleware(['user', 'admin']),
  validateRequest(ReviewValidation.createReviewSchema),
  reviewController.createReview,
);

router.put(
  '/:id',
  authMiddleware(['user', 'admin']),
  validateRequest(ReviewValidation.updateReviewSchema),
  reviewController.updateReview,
);

router.delete(
  '/:id',
  authMiddleware(['user', 'admin']),
  validateRequest(ReviewValidation.getReviewSchema),
  reviewController.deleteReview,
);

export const reviewRoutes = router;
