import { QUERY_KEYS } from "@/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createFood,
  createNewFoodLog,
  deleteFoodLog,
  getAllFoodLog,
  getFoodSuggestions,
} from "./food.api";

export const useCreateFood = () => {
  return useMutation({
    mutationFn: createFood,
  });
};

export const useFoodSuggestion = () => {
  return useMutation({
    mutationFn: getFoodSuggestions,
  });
};

export const useGetAllFoodLog = ({
  start_day,
  end_day,
}: {
  start_day?: string;
  end_day?: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FOOD_LOGS, start_day, end_day],
    queryFn: () => getAllFoodLog({ start_day, end_day }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useCreateNewFoodLog = () => {
  return useMutation({
    mutationFn: createNewFoodLog,
  });
};

export const useDeleteFoodLog = () => {
  return useMutation({
    mutationFn: deleteFoodLog,
  });
};
