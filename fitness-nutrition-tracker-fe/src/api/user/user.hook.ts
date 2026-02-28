import { QUERY_KEYS } from "@/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  //   changePassword,
  getUserInfo,
  login,
  register,
  updateUserProfile,
  getNutritionAnalytics,
  getWorkoutAnalytics,
  askAI,
  getAllMessages,
  //   registerGuestToken,
  //   requestPasswordReset,
  //   upgradeUser,
  //   verifyPassword,
} from "./user.api";

export const useGetUserInfo = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ME],
    queryFn: getUserInfo,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateUserProfile,
  });
};

export const useNutritionAnalytics = (mode: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.NUTRITION_ANALYTICS, mode],
    queryFn: () => getNutritionAnalytics(mode),
  });
};

export const useWorkoutAnalytics = (mode: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WORKOUT_ANALYTICS, mode],
    queryFn: () => getWorkoutAnalytics(mode),
  });
};

export const useAskAI = () => {
  return useMutation({
    mutationFn: askAI,
  });
};

export const useGetAllMessages = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.AI_MESSAGES],
    queryFn: getAllMessages,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
