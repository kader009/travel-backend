import { Request, Response, NextFunction } from 'express';
import { ChatService } from './chat.service';
import { User } from '../user/user.model';

const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user!.userId; // from auth middleware

    const result = await ChatService.getMessages(senderId, receiverId);

    res.status(200).json({
      success: true,
      message: 'Messages fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getChattedUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const userIds = await ChatService.getChattedUsers(userId);
    
    // Populate user details (name, email, profilePhoto, role etc)
    const users = await User.find({ _id: { $in: userIds } }).select('name email profilePhoto role');

    res.status(200).json({
      success: true,
      message: 'Chatted users fetched successfully',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const ChatController = {
  getMessages,
  getChattedUsers,
};
