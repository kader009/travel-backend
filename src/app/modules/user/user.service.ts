import bcrypt from 'bcrypt';
import { User } from './user.model';
import { IUpdatePasswordInput, IUser } from './user.interface';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../../errors/AppError';

export const userService = {
  async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId).select('-password');

    if (!user || user.isDeleted) {
      throw new NotFoundError('User not found');
    }
    return user;
  },

  async getPublicProfile(userId: string): Promise<IUser> {
    const user = await User.findOne({
      _id: userId,
      isDeleted: false,
    }).select('-password -provider -isDeleted');

    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  },

  async updateProfile(
    userId: string,
    updateData: Partial<IUser>,
  ): Promise<IUser> {
    // Prevent updating sensitive fields through profile update
    delete updateData.password;
    delete updateData.role;
    delete updateData.isDeleted;
    delete updateData.isVerified;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user || user.isDeleted) {
      throw new NotFoundError('User not found');
    }
    return user;
  },

  async getAllUsers(): Promise<IUser[]> {
    return await User.find({ isDeleted: false }).select('-password');
  },

  async getSingleUser(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  },

  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser> {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user || user.isDeleted) {
      throw new NotFoundError('User not found');
    }

    return user;
  },

  async deleteUser(userId: string): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true, status: 'inactive' },
      { new: true },
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  },

  // Update password
  async updatePassword({
    userId,
    currentPassword,
    newPassword,
  }: IUpdatePasswordInput): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password as string,
    );
    if (!isMatch) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();
  },
};
