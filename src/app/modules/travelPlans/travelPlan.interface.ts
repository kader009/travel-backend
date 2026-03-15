import { Types } from 'mongoose';

export type TTravelType = 'Solo' | 'Family' | 'Friends' | 'Couple';
export type TTravelPlanStatus =
  | 'upcoming'
  | 'ongoing'
  | 'completed'
  | 'cancelled';

export interface ITravelPlan {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: {
    min: number;
    max: number;
  };
  travelType: TTravelType;
  description: string;
  itinerary?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  images?: string[];
  status: TTravelPlanStatus;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
