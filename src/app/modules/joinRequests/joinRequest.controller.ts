import { Request, Response, NextFunction } from 'express';
import { joinRequestService } from './joinRequest.service';

export const joinRequestController = {
  async createJoinRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requesterId = req.user!.userId;
      const joinRequest = await joinRequestService.createJoinRequest(
        requesterId,
        req.body
      );
      res.status(201).json({
        success: true,
        message: 'Join request sent successfully',
        data: joinRequest,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMyRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const requests = await joinRequestService.getMyRequests(userId);
      res.status(200).json({ success: true, data: requests });
    } catch (error) {
      next(error);
    }
  },

  async getPlanRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const requests = await joinRequestService.getPlanRequests(
        req.params.planId,
        userId
      );
      res.status(200).json({ success: true, data: requests });
    } catch (error) {
      next(error);
    }
  },

  async approveRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const joinRequest = await joinRequestService.approveRequest(
        req.params.id,
        userId
      );
      res.status(200).json({
        success: true,
        message: 'Request approved successfully',
        data: joinRequest,
      });
    } catch (error) {
      next(error);
    }
  },

  async rejectRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const joinRequest = await joinRequestService.rejectRequest(
        req.params.id,
        userId
      );
      res.status(200).json({
        success: true,
        message: 'Request rejected',
        data: joinRequest,
      });
    } catch (error) {
      next(error);
    }
  },
};
