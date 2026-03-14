/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";

export const sendErrorResponse = (error: any, res: Response) => {
  const statusCode = error.statusCode || 400;
  res
    .status(statusCode)
    .json({ success: false, message: error.message || "Something went wrong" });
};
