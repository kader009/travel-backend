import { Types } from 'mongoose';

export type TJoinRequestStatus = 'pending' | 'approved' | 'rejected';

export interface IJoinRequest {
  _id?: Types.ObjectId;
  travelPlan: Types.ObjectId;
  requester: Types.ObjectId;
  status: TJoinRequestStatus;
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
