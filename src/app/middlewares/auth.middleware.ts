import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../errors/AppError';

interface AuthenticatedRequest extends Request {
  user?: { userId: string; role: string };
}

export const authMiddleware = (allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      // Read token from cookies or Authorization header
      const token =
        req.cookies?.accessToken ||
        (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
          ? req.headers.authorization.split(' ')[1]
          : null);

      if (!token) {
        throw new UnauthorizedError('Access token not found. Please login.');
      }

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(
          token,
          process.env.JWT_ACCESS_SECRET as string,
        ) as {
          userId: string;
          role: string;
        };
      } catch (err) {
        throw new UnauthorizedError('Invalid or expired access token');
      }

      // Check roles
      if (!allowedRoles.includes(decoded.role)) {
        throw new ForbiddenError(
          'You do not have permission to access this resource',
        );
      }

      // Attach user to request and continue
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};
