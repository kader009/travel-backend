import { JoinRequest } from './joinRequest.model';
import { IJoinRequest } from './joinRequest.interface';
import { TravelPlan } from '../travelPlans/travelPlan.model';

export const joinRequestService = {
  // Create a join request
  async createJoinRequest(
    requesterId: string,
    data: { travelPlan: string; message?: string },
  ): Promise<IJoinRequest> {
    // Check if travel plan exists
    const travelPlan = await TravelPlan.findOne({
      _id: data.travelPlan,
      isDeleted: false,
    });

    if (!travelPlan) {
      throw new Error('Travel plan not found');
    }

    // Cannot request to join own plan
    if (travelPlan.user.toString() === requesterId) {
      throw new Error('You cannot request to join your own travel plan');
    }

    // Only allow joining upcoming plans
    if (travelPlan.status !== 'upcoming') {
      throw new Error('You can only request to join upcoming travel plans');
    }

    // Check for existing request
    const existingRequest = await JoinRequest.findOne({
      travelPlan: data.travelPlan,
      requester: requesterId,
    });

    if (existingRequest) {
      throw new Error(
        'You have already sent a request to join this travel plan',
      );
    }

    const joinRequest = await JoinRequest.create({
      travelPlan: data.travelPlan,
      requester: requesterId,
      message: data.message,
    });

    return joinRequest;
  },

  // Get my sent requests
  async getMyRequests(userId: string): Promise<IJoinRequest[]> {
    return await JoinRequest.find({ requester: userId })
      .populate('travelPlan', 'destination startDate endDate travelType status')
      .populate('requester', 'name image')
      .sort({ createdAt: -1 });
  },

  // Get requests for a specific travel plan (only the plan owner can see)
  async getPlanRequests(
    planId: string,
    userId: string,
  ): Promise<IJoinRequest[]> {
    // Verify the user owns this travel plan
    const travelPlan = await TravelPlan.findOne({
      _id: planId,
      isDeleted: false,
    });

    if (!travelPlan) {
      throw new Error('Travel plan not found');
    }

    if (travelPlan.user.toString() !== userId) {
      throw new Error('You can only view requests for your own travel plans');
    }

    return await JoinRequest.find({ travelPlan: planId })
      .populate(
        'requester',
        'name image bio travelInterests currentLocation isVerified',
      )
      .sort({ createdAt: -1 });
  },

  // Approve a request (only plan owner)
  async approveRequest(
    requestId: string,
    userId: string,
  ): Promise<IJoinRequest> {
    const joinRequest = await JoinRequest.findById(requestId);

    if (!joinRequest) {
      throw new Error('Join request not found');
    }

    // Verify the user owns the travel plan
    const travelPlan = await TravelPlan.findById(joinRequest.travelPlan);

    if (!travelPlan || travelPlan.user.toString() !== userId) {
      throw new Error(
        'You can only approve requests for your own travel plans',
      );
    }

    if (joinRequest.status !== 'pending') {
      throw new Error('This request has already been processed');
    }

    joinRequest.status = 'approved';
    await joinRequest.save();

    return joinRequest;
  },

  // Reject a request (only plan owner)
  async rejectRequest(
    requestId: string,
    userId: string,
  ): Promise<IJoinRequest> {
    const joinRequest = await JoinRequest.findById(requestId);

    if (!joinRequest) {
      throw new Error('Join request not found');
    }

    // Verify the user owns the travel plan
    const travelPlan = await TravelPlan.findById(joinRequest.travelPlan);

    if (!travelPlan || travelPlan.user.toString() !== userId) {
      throw new Error('You can only reject requests for your own travel plans');
    }

    if (joinRequest.status !== 'pending') {
      throw new Error('This request has already been processed');
    }

    joinRequest.status = 'rejected';
    await joinRequest.save();

    return joinRequest;
  },
};
