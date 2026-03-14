import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { authRoutes } from './app/modules/auth/auth.route';
import { userRoutes } from './app/modules/user/user.route';
import { travelPlanRoutes } from './app/modules/travelPlans/travelPlan.route';
import { reviewRoutes } from './app/modules/reviews/review.route';
import { joinRequestRoutes } from './app/modules/joinRequests/joinRequest.route';
import { paymentRoutes } from './app/modules/payment/payment.route';
import { healthRoutes } from './app/modules/health/health.route';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import {
  globalLimiter,
  authLimiter,
  paymentLimiter,
} from './app/middlewares/rateLimiter';
import notFound from './app/middlewares/notFound';

const app: Application = express();

// Security headers
app.use(helmet());

// Rate limiting (global)
app.use(globalLimiter);

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://trustedge.vercel.app',
      'https://sandbox.sslcommerz.com',
    ],
    credentials: true,
  }),
);

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Application routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/travel-plans', travelPlanRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/join-requests', joinRequestRoutes);
app.use('/api/v1/payment', paymentLimiter, paymentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Travel Buddy & Meetup Backend!');
});

// Not Found Handler
app.use(notFound);

// Global Error Handler (must be after all routes)
app.use(globalErrorHandler);

export default app;
