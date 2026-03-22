import { Types } from 'mongoose';

export interface IMessage {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  content: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
