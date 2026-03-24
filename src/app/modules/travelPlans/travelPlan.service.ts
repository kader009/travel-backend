import { TravelPlan } from './travelPlan.model';
import { ITravelPlan } from './travelPlan.interface';
import { User } from '../user/user.model';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../../errors/AppError';

// Helper function to update travel plan status based on dates
const updateTravelPlanStatus = async (plan: ITravelPlan): Promise<void> => {
  const now = new Date();
  let newStatus = plan.status;

  if (plan.status !== 'cancelled' && plan.status !== 'completed') {
    if (now > plan.endDate) {
      newStatus = 'completed';
    } else if (now >= plan.startDate && now <= plan.endDate) {
      newStatus = 'ongoing';
    }

    // Update if status changed
    if (newStatus !== plan.status) {
      await TravelPlan.findByIdAndUpdate(plan._id, { status: newStatus });
    }
  }
};

export const travelPlanService = {
  // Create a new travel plan
  async createTravelPlan(
    userId: string,
    planData: Partial<ITravelPlan>,
  ): Promise<ITravelPlan> {
    const plan = await TravelPlan.create({ ...planData, user: userId });
    return plan;
  },

  // Get all travel plans (public, with pagination)
  async getAllTravelPlans(query: {
    page?: string;
    limit?: string;
    destination?: string;
    travelType?: string;
  }): Promise<{
    plans: ITravelPlan[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { isDeleted: false, status: { $ne: 'cancelled' } };

    if (query.destination) {
      filter.destination = { $regex: query.destination, $options: 'i' };
    }
    if (query.travelType) {
      filter.travelType = query.travelType;
    }

    const [plans, total] = await Promise.all([
      TravelPlan.find(filter)
        .populate(
          'user',
          'name image bio travelInterests isVerified currentLocation',
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      TravelPlan.countDocuments(filter),
    ]);

    // Update status for each plan based on current date
    await Promise.all(plans.map((plan) => updateTravelPlanStatus(plan)));

    return { plans, total, page, limit };
  },

  // Get current user's travel plans
  async getMyTravelPlans(userId: string): Promise<ITravelPlan[]> {
    const plans = await TravelPlan.find({
      user: userId,
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });

    // Update status for each plan based on current date
    await Promise.all(plans.map((plan) => updateTravelPlanStatus(plan)));

    return plans;
  },

  // Get single travel plan
  async getTravelPlanById(planId: string): Promise<ITravelPlan> {
    const plan = await TravelPlan.findOne({
      _id: planId,
      isDeleted: false,
    }).populate(
      'user',
      'name image bio travelInterests isVerified currentLocation',
    );

    if (!plan) {
      throw new NotFoundError('Travel plan not found');
    }

    // Update status based on current date
    await updateTravelPlanStatus(plan);

    // Fetch updated plan
    const updatedPlan = await TravelPlan.findById(planId);
    return updatedPlan!;
  },

  // Update travel plan (only the owner can update)
  async updateTravelPlan(
    planId: string,
    userId: string,
    updateData: Partial<ITravelPlan>,
  ): Promise<ITravelPlan> {
    const plan = await TravelPlan.findOne({
      _id: planId,
      isDeleted: false,
    });

    if (!plan) {
      throw new NotFoundError('Travel plan not found');
    }

    if (plan.user.toString() !== userId) {
      throw new ForbiddenError(
        'You are not authorized to update this travel plan',
      );
    }

    const updatedPlan = await TravelPlan.findByIdAndUpdate(planId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlan) {
      throw new BadRequestError('Failed to update travel plan');
    }

    return updatedPlan;
  },

  // Soft-delete travel plan (only the owner can delete)
  async deleteTravelPlan(planId: string, userId: string): Promise<void> {
    const plan = await TravelPlan.findOne({
      _id: planId,
      isDeleted: false,
    });

    if (!plan) {
      throw new NotFoundError('Travel plan not found');
    }

    if (plan.user.toString() !== userId) {
      throw new ForbiddenError(
        'You are not authorized to delete this travel plan',
      );
    }

    await TravelPlan.findByIdAndUpdate(planId, { isDeleted: true });
  },

  // Admin: Get all travel plans including deleted
  async adminGetAllTravelPlans(): Promise<ITravelPlan[]> {
    return await TravelPlan.find()
      .populate('user', 'name email image')
      .sort({ createdAt: -1 });
  },

  // Admin: Delete any travel plan
  async adminDeleteTravelPlan(planId: string): Promise<void> {
    const plan = await TravelPlan.findById(planId);
    if (!plan) {
      throw new NotFoundError('Travel plan not found');
    }
    await TravelPlan.findByIdAndUpdate(planId, { isDeleted: true });
  },

  // Search & match travelers
  async searchAndMatch(query: {
    destination?: string;
    startDate?: string;
    endDate?: string;
    travelType?: string;
    page?: string;
    limit?: string;
  }): Promise<{
    plans: ITravelPlan[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {
      isDeleted: false,
      status: 'upcoming',
    };

    // Match by destination (case-insensitive partial match)
    if (query.destination) {
      filter.destination = { $regex: query.destination, $options: 'i' };
    }

    // Match by date range overlap
    if (query.startDate && query.endDate) {
      filter.startDate = { $lte: new Date(query.endDate) };
      filter.endDate = { $gte: new Date(query.startDate) };
    } else if (query.startDate) {
      filter.endDate = { $gte: new Date(query.startDate) };
    } else if (query.endDate) {
      filter.startDate = { $lte: new Date(query.endDate) };
    }

    // Match by travel type
    if (query.travelType) {
      filter.travelType = query.travelType;
    }

    const [plans, total] = await Promise.all([
      TravelPlan.find(filter)
        .populate(
          'user',
          'name image bio travelInterests isVerified currentLocation',
        )
        .sort({ startDate: 1 })
        .skip(skip)
        .limit(limit),
      TravelPlan.countDocuments(filter),
    ]);

    // Update status for each plan based on current date
    await Promise.all(plans.map((plan) => updateTravelPlanStatus(plan)));

    return { plans, total, page, limit };
  },
};
