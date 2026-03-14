/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

// Centralized error response interface
interface ErrorResponse {
  success: false;
  message: string;
  errorDetails?: object;
  stack?: string;
}

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorDetails: object | undefined;

  // 1. Custom AppError (our own thrown errors)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // 2. Zod Validation Error
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    errorDetails = {
      errors: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    };
  }

  // 3. Mongoose Validation Error
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation error';
    errorDetails = {
      errors: Object.values(err.errors).map((e) => ({
        path: e.path,
        message: e.message,
      })),
    };
  }

  // 4. Mongoose CastError (invalid ObjectId)
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // 5. MongoDB Duplicate Key Error (code 11000)
  else if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    statusCode = 409;
    const keyValue = (err as any).keyValue;
    const field = Object.keys(keyValue).join(', ');
    message = `Duplicate value for field: ${field}. This value already exists.`;
  }

  // 6. JWT Errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  // 7. Generic Error (fallback)
  else {
    message = err.message || 'Something went wrong';
  }

  // Build response
  const response: ErrorResponse = {
    success: false,
    message,
    ...(errorDetails && { errorDetails }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};
