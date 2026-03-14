export type TUserRole = 'user' | 'admin';
export type TUserStatus = 'active' | 'inactive' | 'banned';
export type TAuthProvider = 'local' | 'google' | 'github';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  bio?: string;
  travelInterests?: string[];
  visitedCountries?: string[];
  currentLocation?: string;
  isVerified?: boolean;
  role: TUserRole;
  status?: TUserStatus;
  provider?: TAuthProvider;
  isDeleted?: boolean;
  createdAt?: Date;
}

export interface IUpdatePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}
