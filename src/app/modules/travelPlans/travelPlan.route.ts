import express from 'express';
import { travelPlanController } from './travelPlan.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import { TravelPlanValidation } from './travelPlan.validation';

const router = express.Router();

// Public routes
router.get('/', travelPlanController.getAllTravelPlans);

router.get(
  '/match',
  validateRequest(TravelPlanValidation.searchTravelPlanSchema),
  travelPlanController.searchAndMatch,
);

router.get(
  '/:id',
  validateRequest(TravelPlanValidation.getTravelPlanSchema),
  travelPlanController.getTravelPlanById,
);

// Protected routes (User & Admin)
router.post(
  '/',
  authMiddleware(['user', 'admin']),
  validateRequest(TravelPlanValidation.createTravelPlanSchema),
  travelPlanController.createTravelPlan,
);

router.get(
  '/user/my-plans',
  authMiddleware(['user', 'admin']),
  travelPlanController.getMyTravelPlans,
);

router.put(
  '/:id',
  authMiddleware(['user', 'admin']),
  validateRequest(TravelPlanValidation.updateTravelPlanSchema),
  travelPlanController.updateTravelPlan,
);

router.delete(
  '/:id',
  authMiddleware(['user', 'admin']),
  validateRequest(TravelPlanValidation.getTravelPlanSchema),
  travelPlanController.deleteTravelPlan,
);

// Admin-only routes
router.get(
  '/admin/all',
  authMiddleware(['admin']),
  travelPlanController.adminGetAllTravelPlans,
);

router.delete(
  '/admin/:id',
  authMiddleware(['admin']),
  validateRequest(TravelPlanValidation.getTravelPlanSchema),
  travelPlanController.adminDeleteTravelPlan,
);

export const travelPlanRoutes = router;