import { Types } from 'mongoose';

export type TPaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled';
export type TSubscriptionPlan = 'monthly' | 'yearly';

export interface IPayment {
  _id?: Types.ObjectId;
  transactionId: string;
  user: Types.ObjectId;
  planType: TSubscriptionPlan;
  amount: number;
  currency: string;
  status: TPaymentStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentGatewayData?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
