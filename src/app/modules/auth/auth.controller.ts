/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const result = await authService.register(userData);
      setAuthCookies(res, result);

      res.status(201).json({
        success: true,
        message: 'User registered successfully!',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

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
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
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
      next(error);
    }
  },

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        res
          .status(401)
          .json({ success: false, message: 'Refresh token not found' });
        return;
      }

      const result = await authService.refreshToken(refreshToken);

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000,
      });

      res.status(200).json({ success: true, data: { user: result.user } });
    } catch (error) {
      next(error);
    }
  },

  async socialLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, provider, image } = req.body;
      const result = await authService.socialLogin(
        name,
        email,
        provider,
        image,
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
      next(error);
    }
  },
};

// Helper: set both refresh & access tokens on login/register
const setAuthCookies = (res: Response, result: any) => {
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
