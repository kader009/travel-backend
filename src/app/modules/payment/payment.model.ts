import { Schema, model } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planType: {
      type: String,
      enum: {
        values: ['monthly', 'yearly'],
        message: 'Plan type must be monthly or yearly',
      },
      required: [true, 'Plan type is required'],
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'BDT',
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled'],
      default: 'pending',
    },
    paymentGatewayData: {
      type: Object,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

paymentSchema.index({ user: 1, status: 1 });

export const Payment = model<IPayment>('Payment', paymentSchema);
