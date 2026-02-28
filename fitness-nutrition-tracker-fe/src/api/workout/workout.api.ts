import { API_ROUTES } from "@/constants/apiRoute";
import axiosClient from "../axiosInstant";
import { WorkoutLogsReponseDataType, WorkoutLogsReponseType } from "./workout.type";
import { E_WORKOUT_STATUS } from "@/enums";

export const getAllWorkout = async ({
  start_day,
  end_day,
  type,
}: {
  start_day?: string;
  end_day?: string;
  type?: string;
}) => {
  try {
    const response = await axiosClient.get<WorkoutLogsReponseDataType>(API_ROUTES.WORKOUT_LOGS, {
      params: {
        start_day,
        end_day,
        type,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

export const workoutSuggestions = async ({
    start_day,
    end_day,
}: {
    start_day?: string;
    end_day?: string;
}) => {
  const response = await axiosClient.post(API_ROUTES.WORKOUT_SUGGESTIONS, {
    start_day,
    end_day,
  });
  return response.data;
};


export const updateStatusWorkout = async (data: {
    workout_log_id: string;
    status: E_WORKOUT_STATUS;
}) => {
    const response = await axiosClient.put(API_ROUTES.WORKOUT_LOGS , data);
    return response.data;
};
