import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { sendErrorResponse } from '../../../utils/sendErrorResponse';

const initPayment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error('User not authenticated');
    }
    const { userId } = user;
    const { planType } = req.body;

    const result = await PaymentService.initPayment(userId, planType);

    res.status(200).json({
      success: true,
      message: 'Payment initialized successfully',
      data: result,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const handleSuccess = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.query;
    const gatewayData = req.body;

    const redirectUrl = await PaymentService.handleSuccess(
      transactionId as string,
      gatewayData,
    );

    res.redirect(redirectUrl);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_BASE_URL}/payment/failed`);
  }
};

const handleFail = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.query;
    const redirectUrl = await PaymentService.handleFail(
      transactionId as string,
    );
    res.redirect(redirectUrl);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_BASE_URL}/payment/failed`);
  }
};

const handleCancel = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.query;
    const redirectUrl = await PaymentService.handleCancel(
      transactionId as string,
    );
    res.redirect(redirectUrl);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_BASE_URL}/payment/failed`);
  }
};

const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error('User not authenticated');
    }
    const { userId } = user;
    const result = await PaymentService.getPaymentHistory(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAdminAnalytics = async (req: Request, res: Response) => {
  try {
    const result = await PaymentService.getAdminAnalytics();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

export const PaymentController = {
  initPayment,
  handleSuccess,
  handleFail,
  handleCancel,
  getPaymentHistory,
  getAdminAnalytics,
};
