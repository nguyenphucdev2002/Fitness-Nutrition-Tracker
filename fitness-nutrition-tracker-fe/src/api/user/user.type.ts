import { UserInfoType, UserProfileType } from "@/types";
import { ApiReponseType } from "../common.type";

export type RegisterPayloadType = {
  name: string;
  password: string;
  email: string;
};

export type LoginPayloadType = {
  email: string;
  password: string;
};

export type LoginReponseDataType = {
  access_token: string;
  user: UserInfoType;
  refresh_token: string;
};
export type LoginReponseType = ApiReponseType<LoginReponseDataType>;

export type GetUserInfoDataType = {
  access_token: string;
  user: UserInfoType;
  refresh_token: string;
};
export type GetUserInfoReponseType = ApiReponseType<GetUserInfoDataType>;

export type RegisterGuestTokenDataType = {
  data: UserInfoType;
};
export type RegisterGuestTokenReponseType = ApiReponseType<RegisterGuestTokenDataType>;

export type UpdateProfilePayload = UserProfileType;

export type UpdateProfileResponseDataType = UserProfileType;

export type UpgradeResponseDataType = {
  data: {
    access_token: string;
    refresh_token: string;
    user: UserInfoType;
  };
  message: string;
  success: boolean;
};

export type RequestPasswordResetRequestType = {
  email: string;
};

export type VerifyTempPasswordRequestType = {
  email: string;
  temp_password: string;
};

export type ChangePasswordRequestType = {
  email: string;
  new_password: string;
  temp_password: string;
};

export type NutritionAnalyticsType = {
  calories: number;
  carbs: number;
  day: string;
  fat: number;
  protein: number;
};

export type WorkoutAnalyticsType = {
  calo: number;
  day: string;
  duration_min: number;
  status: number;
};

export type AskAIRequest = {
  message: string;
};

export type AskAIResponse = {
  content: string;
  created_at: string;
  id: string;
  role: string;
  user_id: string;
};
