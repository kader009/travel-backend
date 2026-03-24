import express from 'express';
import { reviewController } from './review.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';

const router = express.Router();

// Protected routes (User & Admin) - MUST BE BEFORE /:id route
// Get reviews given and received by logged-in user
router.get(
  '/given',
  authMiddleware(['user', 'admin']),
  reviewController.getReviewsGivenByUser,
);

router.get(
  '/received',
  authMiddleware(['user', 'admin']),
  reviewController.getReviewsReceivedByUser,
);

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

// Public routes - AFTER protected routes
router.get('/all-stats', reviewController.getAllUsersReviewStats);

router.get('/latest', reviewController.getLatestReviews);

router.get(
  '/user/:userId',
  validateRequest(ReviewValidation.getUserReviewsSchema),
  reviewController.getUserReviews,
);

router.get(
  '/stats/:userId',
  validateRequest(ReviewValidation.getUserReviewsSchema),
  reviewController.getUserReviewStats,
);

router.get(
  '/:id',
  validateRequest(ReviewValidation.getReviewSchema),
  reviewController.getReviewById,
);

export const reviewRoutes = router;
