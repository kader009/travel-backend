import { Request, Response, NextFunction } from 'express';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'API Endpoint Not Found',
    errorDetails: {
      url: req.originalUrl,
      method: req.method,
    },
  });
};

export default notFound;
