// @ts-ignore
import SSLCommerzPayment from 'sslcommerz-lts';
import config from '../../config';
import { Payment } from './payment.model';
import { User } from '../user/user.model';
import { TSubscriptionPlan } from './payment.interface';

// Subscription pricing
const SUBSCRIPTION_PRICES: Record<TSubscriptionPlan, number> = {
  monthly: 499,
  yearly: 4999,
};

const initPayment = async (userId: string, planType: TSubscriptionPlan) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (!SUBSCRIPTION_PRICES[planType]) {
    throw new Error('Invalid subscription plan type');
  }

  const amount = SUBSCRIPTION_PRICES[planType];
  const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const paymentData = {
    total_amount: amount,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${config.backend_base_url}/payment/success?transactionId=${transactionId}`,
    fail_url: `${config.backend_base_url}/payment/fail?transactionId=${transactionId}`,
    cancel_url: `${config.backend_base_url}/payment/cancel?transactionId=${transactionId}`,
    ipn_url: `${config.backend_base_url}/payment/ipn`,
    shipping_method: 'No',
    product_name: `Travel Buddy ${planType} Subscription`,
    product_category: 'Subscription',
    product_profile: 'general',
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: user.currentLocation || 'N/A',
    cus_add2: 'N/A',
    cus_city: 'N/A',
    cus_state: 'N/A',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    cus_fax: '01711111111',
    ship_name: user.name,
    ship_add1: 'N/A',
    ship_add2: 'N/A',
    ship_city: 'N/A',
    ship_state: 'N/A',
    ship_postcode: '1000',
    ship_country: 'Bangladesh',
  };

  const sslcz = new SSLCommerzPayment(
    config.store_id,
    config.store_password,
    config.is_live,
  );

  const apiResponse = await sslcz.init(paymentData);

  if (apiResponse?.GatewayPageURL) {
    // Create a pending payment record
    await Payment.create({
      transactionId,
      user: userId,
      planType,
      amount,
      status: 'pending',
    });

    return apiResponse.GatewayPageURL;
  } else {
    throw new Error('Failed to initialize payment with SSLCommerz');
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleSuccess = async (transactionId: string, gatewayData: any) => {
  const payment = await Payment.findOne({ transactionId });

  if (!payment) {
    throw new Error('Payment record not found');
  }

  payment.status = 'paid';
  payment.paymentGatewayData = gatewayData;
  await payment.save();

  // Set user as verified after successful subscription payment
  await User.findByIdAndUpdate(payment.user, { isVerified: true });

  return `${config.client_base_url}/payment/success?transactionId=${transactionId}`;
};

const handleFail = async (transactionId: string) => {
  await Payment.findOneAndUpdate({ transactionId }, { status: 'failed' });
  return `${config.client_base_url}/payment/failed?transactionId=${transactionId}`;
};

const handleCancel = async (transactionId: string) => {
  await Payment.findOneAndUpdate({ transactionId }, { status: 'cancelled' });
  return `${config.client_base_url}/payment/cancel?transactionId=${transactionId}`;
};

const getPaymentHistory = async (userId: string) => {
  return await Payment.find({ user: userId }).sort({ createdAt: -1 });
};

const getAdminAnalytics = async () => {
  const totalEarnings = await Payment.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const planBreakdown = await Payment.aggregate([
    { $match: { status: 'paid' } },
    {
      $group: {
        _id: '$planType',
        count: { $sum: 1 },
        totalEarned: { $sum: '$amount' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const recentPayments = await Payment.find({ status: 'paid' })
    .populate('user', 'name email image')
    .sort({ createdAt: -1 })
    .limit(20);

  return {
    totalEarnings: totalEarnings[0]?.total || 0,
    planBreakdown,
    recentPayments,
  };
};

export const PaymentService = {
  initPayment,
  handleSuccess,
  handleFail,
  handleCancel,
  getPaymentHistory,
  getAdminAnalytics,
};
