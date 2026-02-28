import { API_ROUTES } from "@/constants/apiRoute";
import axiosClient from "../axiosInstant";
import {
  CreateNewFoodLogPayload,
  CreateNewFoodPayload,
  FoodLogsResponseDataType,
  FoodSuggestionPayload,
  GetAllFoodLogPayload,
} from "./food.type";
import { FoodLogItemType } from "@/types";

export const createFood = async (data: CreateNewFoodPayload) => {
  const response = await axiosClient.post(API_ROUTES.FOODS, { ...data, is_vietnamese: true });
  return response.data;
};

export const getFoodSuggestions = async (data: FoodSuggestionPayload) => {
  const response = await axiosClient.post(API_ROUTES.FOOD_SUGGESTIONS, data);
  return response.data;
};

export const getAllFoodLog = async ({ start_day, end_day }: GetAllFoodLogPayload) => {
  const response = await axiosClient.get<FoodLogsResponseDataType>(API_ROUTES.FOOD_LOGS, {
    params: {
      start_day,
      end_day,
    },
  });
  return response.data;
};

export const createNewFoodLog = async (data: CreateNewFoodLogPayload) => {
  const response = await axiosClient.post<FoodLogItemType>(API_ROUTES.FOOD_LOGS, data);
  return response.data;
};

export const deleteFoodLog = async ({ id }: { id: string }) => {
  const response = await axiosClient.delete<FoodLogItemType>(`${API_ROUTES.FOOD_LOGS}/${id}`);
  return response.data;
};
