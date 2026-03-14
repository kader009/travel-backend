import { IUser } from "../user/user.interface";

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface ITokenPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}
