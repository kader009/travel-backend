import express from 'express';
import { PaymentController } from './payment.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = express.Router();

// Public callback routes (called by SSLCommerz)
// Note: SSLCommerz sends data via POST to the success/fail/cancel URLs
router.post('/success', PaymentController.handleSuccess);
router.post('/fail', PaymentController.handleFail);
router.post('/cancel', PaymentController.handleCancel);

// Protected routes
router.post(
  '/init',
  authMiddleware(['user', 'admin']),
  PaymentController.initPayment
);

router.get(
  '/history',
  authMiddleware(['user', 'admin']),
  PaymentController.getPaymentHistory
);

router.get(
  '/analytics',
  authMiddleware(['admin']),
  PaymentController.getAdminAnalytics
);

export const paymentRoutes = router;
