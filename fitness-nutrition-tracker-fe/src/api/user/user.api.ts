import { API_ROUTES } from "@/constants/apiRoute";
import axiosClient from "../axiosInstant";
import {
  ChangePasswordRequestType,
  GetUserInfoDataType,
  LoginPayloadType,
  LoginReponseDataType,
  RegisterGuestTokenDataType,
  RegisterPayloadType,
  RequestPasswordResetRequestType,
  UpdateProfilePayload,
  UpdateProfileResponseDataType,
  UpgradeResponseDataType,
  VerifyTempPasswordRequestType,
  NutritionAnalyticsType,
  WorkoutAnalyticsType,
  AskAIRequest,
  AskAIResponse,
} from "./user.type";
import { MessageItemType } from "@/types/message.type";

export const getUserInfo = async () => {
  try {
    const response = await axiosClient.get<GetUserInfoDataType>(API_ROUTES.ME);
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

export const login = async (payload: LoginPayloadType) => {
  const response = await axiosClient.post<LoginReponseDataType>(API_ROUTES.LOGIN, payload);
  return response.data;
};

export const register = async (payload: RegisterPayloadType) => {
  const response = await axiosClient.post(API_ROUTES.REGISTER, payload);
  return response.data;
};

export const updateUserProfile = async (payload: UpdateProfilePayload) => {
  const response = await axiosClient.put<UpdateProfileResponseDataType>(
    API_ROUTES.UPDATE_PROFILE,
    payload
  );
  return response.data;
};

export const getNutritionAnalytics = async (mode: number) => {
  const response = await axiosClient.get<NutritionAnalyticsType[]>(API_ROUTES.ANALYTICS_CALO, {
    params: { mode },
  });
  return response.data;
};

export const getWorkoutAnalytics = async (mode: number): Promise<WorkoutAnalyticsType[]> => {
  const { data } = await axiosClient.get(API_ROUTES.ANALYTICS_WORKOUT, {
    params: { mode },
  });
  return data;
};

export const askAI = async (data: AskAIRequest)=> {
  const response = await axiosClient.post<MessageItemType>(API_ROUTES.AI_ASK, data);
  return response.data;
};


export const getAllMessages = async () => {
  const response = await axiosClient.get<MessageItemType[]>(API_ROUTES.AI_MESSAGES);
  return response.data;
};
