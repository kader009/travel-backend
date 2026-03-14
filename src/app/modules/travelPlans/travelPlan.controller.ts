import { Request, Response } from 'express';
import { travelPlanService } from './travelPlan.service';
import { sendErrorResponse } from '../../../utils/sendErrorResponse';

export const travelPlanController = {
  async createTravelPlan(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const plan = await travelPlanService.createTravelPlan(userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Travel plan created successfully',
        data: plan,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getAllTravelPlans(req: Request, res: Response): Promise<void> {
    try {
      const result = await travelPlanService.getAllTravelPlans(
        req.query as {
          page?: string;
          limit?: string;
          destination?: string;
          travelType?: string;
        },
      );
      res.status(200).json({
        success: true,
        data: result.plans,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getMyTravelPlans(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const plans = await travelPlanService.getMyTravelPlans(userId);
      res.status(200).json({ success: true, data: plans });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getTravelPlanById(req: Request, res: Response): Promise<void> {
    try {
      const plan = await travelPlanService.getTravelPlanById(req.params.id);
      res.status(200).json({ success: true, data: plan });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async updateTravelPlan(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const plan = await travelPlanService.updateTravelPlan(
        req.params.id,
        userId,
        req.body,
      );
      res.status(200).json({
        success: true,
        message: 'Travel plan updated successfully',
        data: plan,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async deleteTravelPlan(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      await travelPlanService.deleteTravelPlan(req.params.id, userId);
      res.status(200).json({
        success: true,
        message: 'Travel plan deleted successfully',
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async adminGetAllTravelPlans(req: Request, res: Response): Promise<void> {
    try {
      const plans = await travelPlanService.adminGetAllTravelPlans();
      res.status(200).json({ success: true, data: plans });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async adminDeleteTravelPlan(req: Request, res: Response): Promise<void> {
    try {
      await travelPlanService.adminDeleteTravelPlan(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Travel plan deleted by admin',
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async searchAndMatch(req: Request, res: Response): Promise<void> {
    try {
      const result = await travelPlanService.searchAndMatch(
        req.query as {
          destination?: string;
          startDate?: string;
          endDate?: string;
          travelType?: string;
          page?: string;
          limit?: string;
        },
      );
      res.status(200).json({
        success: true,
        data: result.plans,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },
};
