import express from 'express';
import { joinRequestController } from './joinRequest.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import { JoinRequestValidation } from './joinRequest.validation';

const router = express.Router();

// All routes are protected
router.post(
  '/',
  authMiddleware(['user', 'admin']),
  validateRequest(JoinRequestValidation.createJoinRequestSchema),
  joinRequestController.createJoinRequest,
);

router.get(
  '/my-requests',
  authMiddleware(['user', 'admin']),
  joinRequestController.getMyRequests,
);

router.get(
  '/plan/:planId',
  authMiddleware(['user', 'admin']),
  validateRequest(JoinRequestValidation.getPlanRequestsSchema),
  joinRequestController.getPlanRequests,
);

router.patch(
  '/:id/approve',
  authMiddleware(['user', 'admin']),
  validateRequest(JoinRequestValidation.updateStatusSchema),
  joinRequestController.approveRequest,
);

router.patch(
  '/:id/reject',
  authMiddleware(['user', 'admin']),
  validateRequest(JoinRequestValidation.updateStatusSchema),
  joinRequestController.rejectRequest,
);

export const joinRequestRoutes = router;
