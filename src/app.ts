import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRoutes } from './app/modules/auth/auth.route';
import { userRoutes } from './app/modules/user/user.route';
import { travelPlanRoutes } from './app/modules/travelPlans/travelPlan.route';
import { reviewRoutes } from './app/modules/reviews/review.route';
import { joinRequestRoutes } from './app/modules/joinRequests/joinRequest.route';
import { paymentRoutes } from './app/modules/payment/payment.route';
import { healthRoutes } from './app/modules/health/health.route';

const app: Application = express();

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
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/travel-plans', travelPlanRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/join-requests', joinRequestRoutes);
app.use('/api/v1/payment', paymentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Travel Buddy & Meetup Backend!');
});

export default app;
