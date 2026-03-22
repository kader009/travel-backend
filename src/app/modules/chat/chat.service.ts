import { Types } from 'mongoose';
import { Message } from './chat.model';

// Fetch chat history between two users
const getMessages = async (userId1: string, userId2: string) => {
  const messages = await Message.find({
    $or: [
      { senderId: new Types.ObjectId(userId1), receiverId: new Types.ObjectId(userId2) },
      { senderId: new Types.ObjectId(userId2), receiverId: new Types.ObjectId(userId1) },
    ],
  }).sort({ createdAt: 1 }); // Oldest to newest

  return messages;
};

// Get list of users the logged in user has chatted with
const getChattedUsers = async (userId: string) => {
    // Find all unique users this user has sent messages to or received messages from
    const userObjectId = new Types.ObjectId(userId);
    
    // Aggregate to get unique conversational partners
    const partners = await Message.aggregate([
        {
            $match: {
                $or: [{ senderId: userObjectId }, { receiverId: userObjectId }]
            }
        },
        {
            $group: {
                _id: null,
                senders: { $addToSet: '$senderId' },
                receivers: { $addToSet: '$receiverId' }
            }
        },
        {
            $project: {
                allUsers: { $setUnion: ['$senders', '$receivers'] }
            }
        }
    ]);

    let uniqueUserIds = partners.length > 0 ? partners[0].allUsers : [];
    
    // Filter out the logged-in user's own ID
    uniqueUserIds = uniqueUserIds.filter((id: Types.ObjectId) => id.toString() !== userId);
    
    return uniqueUserIds;
};

export const ChatService = {
  getMessages,
  getChattedUsers,
};
