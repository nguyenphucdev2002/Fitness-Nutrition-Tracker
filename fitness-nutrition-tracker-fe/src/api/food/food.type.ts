import { E_MEAL_TYPE } from "@/enums";
import { FoodItemType, FoodLogItemType, WorkoutLogType } from "@/types";
import { ApiReponseType } from "../common.type";

export type CreateNewFoodPayload = FoodItemType;
export type CreateNewFoodDataResponseType = FoodItemType;

export type FoodSuggestionPayload = {
  dayPlan: string;
  meal_type: string;
};

export type FoodSuggestionDataResponseType = FoodItemType[];

export type GetAllFoodLogPayload = {
  start_day?: string;
  end_day?: string;
};

export type CreateNewFoodLogPayload = {
  name: string;
  log_date: string;
  meal_type: E_MEAL_TYPE;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type FoodLogsResponseDataType = FoodLogItemType[];
export type FoodLogsResponseType = ApiReponseType<FoodLogsResponseDataType>;
