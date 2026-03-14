import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';

const router = Router();

router.post(
  '/register',
  validateRequest(AuthValidation.registerSchema),
  authController.register
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginSchema),
  authController.login
);

router.post('/logout', authController.logout);

router.post(
  '/refresh',
  validateRequest(AuthValidation.refreshTokenSchema),
  authController.refreshToken
);

router.post(
  '/social-login',
  validateRequest(AuthValidation.socialLoginSchema),
  authController.socialLogin
);

export const authRoutes = router;
