import express from 'express';
import { ChatController } from './chat.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = express.Router();

router.get(
  '/messages/:receiverId',
  authMiddleware(['user', 'admin']),
  ChatController.getMessages,
);

router.get(
  '/users',
  authMiddleware(['user', 'admin']),
  ChatController.getChattedUsers,
);

export const chatRoutes = router;
