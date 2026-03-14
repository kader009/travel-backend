/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { authService } from './auth.service';
import { sendErrorResponse } from '../../../utils/sendErrorResponse';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const userData = req.body;
      const result = await authService.register(userData);
      setAuthCookies(res, result);

      res.status(201).json({
        success: true,
        message: 'User registered successfully!',
        data: { user: result.user }, // no need to send access token to frontend
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      // console.log("result", result);

      setAuthCookies(res, result);

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async logout(req: Request, res: Response) {
    try {
      // Clear both access and refresh tokens
      res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
      });
      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
      });

      res
        .status(200)
        .json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        res
          .status(401)
          .json({ success: false, message: 'Refresh token not found' });
        return;
      }

      const result = await authService.refreshToken(refreshToken);

      // Set new short-lived access token cookie
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.status(200).json({ success: true, data: { user: result.user } });
    } catch (error) {
      res
        .status(401)
        .json({ success: false, message: 'Refresh token invalid', error });
    }
  },

  async socialLogin(req: Request, res: Response) {
    try {
      const { name, email, provider, image } = req.body;
      const result = await authService.socialLogin(
        name,
        email,
        provider,
        image
      );

      setAuthCookies(res, result);

      res.status(200).json({
        success: true,
        message: 'Social login successful!',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },
};

// Helper: set both refresh & access tokens on login/register

const setAuthCookies = (res: Response, result: any) => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Refresh token
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000 * 30,
  });

  // Access token
  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 15 * 60 * 1000,
  });
};
