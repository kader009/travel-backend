import bcrypt from 'bcrypt';
import { User } from '../user/user.model';
import { IAuthResponse } from './auth.interface';
import { tokenUtils } from '../../../utils/tokenUtils';
import { IUser } from '../user/user.interface';

export const authService = {
  // Register user
  async register(userData: IUser): Promise<IAuthResponse> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    if (!userData.password) {
      throw new Error('Password is required for registration');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create({ ...userData, password: hashedPassword });

    const { accessToken, refreshToken } = tokenUtils.generateTokens(
      user._id.toString(),
      user.role
    );

    return { accessToken, refreshToken, user };
  },

  // Login user
  async login(email: string, password: string): Promise<IAuthResponse> {
    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.password) {
      throw new Error('This account uses social login. Please login with your social provider.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const { accessToken, refreshToken } = tokenUtils.generateTokens(
      user._id.toString(),
      user.role
    );
    return { accessToken, refreshToken, user };
  },

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; user: IUser }> {
    const decoded = tokenUtils.verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);
    if (!user || user.isDeleted) {
      throw new Error('Invalid refresh token');
    }

    const accessToken = tokenUtils.generateAccessToken(
      user._id.toString(),
      user.role
    );

    return { accessToken, user };
  },

  async socialLogin(
    name: string,
    email: string,
    provider: 'google' | 'github',
    image?: string
  ): Promise<IAuthResponse> {
    // Check if user already exists
    let user = await User.findOne({ email, isDeleted: false });

    if (user) {
      // User exists, generate tokens and return
      const { accessToken, refreshToken } = tokenUtils.generateTokens(
        user._id.toString(),
        user.role
      );
      return { accessToken, refreshToken, user };
    }

    // User doesn't exist, create new user
    user = await User.create({
      name,
      email,
      provider,
      image,
      role: 'user',
    });

    const { accessToken, refreshToken } = tokenUtils.generateTokens(
      user._id.toString(),
      user.role
    );

    return { accessToken, refreshToken, user };
  },
};
