import { Request, Response } from 'express';
import { userService } from './user.service';
import { sendErrorResponse } from '../../../utils/sendErrorResponse';

export const userController = {
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const user = await userService.getProfile(userId!);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getPublicProfile(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const user = await userService.getPublicProfile(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const updateData = req.body;

      if (!updateData) {
        res
          .status(400)
          .json({ success: false, message: 'No update data provided' });
        return;
      }

      const user = await userService.updateProfile(userId!, updateData);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getSingleUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await userService.getSingleUser(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const updateData = req.body;
      const user = await userService.updateUser(userId, updateData);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      await userService.deleteUser(userId);
      res
        .status(200)
        .json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({ message: 'All fields are required' });
        return;
      }

      await userService.updatePassword({
        userId,
        currentPassword,
        newPassword,
      });

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },
};
