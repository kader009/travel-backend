import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';
import { BadRequestError } from '../../errors/AppError';

export const userController = {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const user = await userService.getProfile(userId!);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async getPublicProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const user = await userService.getPublicProfile(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const updateData = req.body;

      if (!updateData || Object.keys(updateData).length === 0) {
        throw new BadRequestError('No update data provided');
      }

      const user = await userService.updateProfile(userId!, updateData);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  },

  async getSingleUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await userService.getSingleUser(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const updateData = req.body;
      const user = await userService.updateUser(userId, updateData);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      await userService.deleteUser(userId);
      res
        .status(200)
        .json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async updatePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new BadRequestError('All fields are required');
      }

      await userService.updatePassword({
        userId,
        currentPassword,
        newPassword,
      });

      res
        .status(200)
        .json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  },
};
