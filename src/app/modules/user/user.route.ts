import { Router } from 'express';
import { userController } from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = Router();

// Public route - view any user's profile
router.get(
  '/profile/:id',
  validateRequest(UserValidation.getPublicProfileSchema),
  userController.getPublicProfile,
);

// User / My Profile
router.get('/me', authMiddleware(['user', 'admin']), userController.getProfile);

router.put(
  '/update-profile',
  authMiddleware(['user', 'admin']),
  validateRequest(UserValidation.updateProfileSchema),
  userController.updateProfile,
);

router.patch(
  '/update-password',
  authMiddleware(['user', 'admin']),
  validateRequest(UserValidation.updatePasswordSchema),
  userController.updatePassword,
);

// Admin-only routes
router.get(
  '/admin/all-users',
  authMiddleware(['admin']),
  validateRequest(UserValidation.getAllUsersSchema),
  userController.getAllUsers,
);

router.put(
  '/admin/update-user/:id',
  authMiddleware(['admin']),
  validateRequest(UserValidation.adminUpdateUserSchema),
  userController.updateUser,
);

router.delete(
  '/delete-user/:id',
  authMiddleware(['admin']),
  validateRequest(UserValidation.deleteUserSchema),
  userController.deleteUser,
);

router.get(
  '/admin/:id',
  authMiddleware(['admin']),
  validateRequest(UserValidation.getSingleUserSchema),
  userController.getSingleUser,
);

export const userRoutes = router;
