import app from '../src/app';
import { connectDB } from '../src/utils/dbConnect';
import type { Request, Response } from 'express';

// Export the Express app as a Vercel serverless function
export default async function handler(req: Request, res: Response) {
  // Connect to database before handling request
  await connectDB();

  // Pass the request to Express app
  return app(req, res);
}
