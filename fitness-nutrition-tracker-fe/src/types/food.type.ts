import { E_MEAL_TYPE } from "@/enums";

export type FoodItemType = {
  id?: string;
  name: string;
  calories: number;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  is_vietnamese?: boolean;
};

export type FoodLogItemType = {
  id?: string;
  user_id: string;

  name: string;
  meal_type: E_MEAL_TYPE;

  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;

  log_date: string;
  created_at?: string;

  status: number;
}
