import { Types } from 'mongoose';

export interface IReview {
  _id?: Types.ObjectId;
  reviewer: Types.ObjectId;
  reviewee: Types.ObjectId;
  travelPlan: Types.ObjectId;
  rating: number;
  comment: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
