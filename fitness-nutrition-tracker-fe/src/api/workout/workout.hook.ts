import { QUERY_KEYS } from "@/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllWorkout, updateStatusWorkout, workoutSuggestions } from "./workout.api";

export const useGetAllWorkouts = ({
  start_day,
  end_day,
  type,
}: {
  start_day?: string;
  end_day?: string;
  type?: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WORKOUTS, start_day, end_day, type],
    queryFn: () => getAllWorkout({ start_day, end_day, type }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useWorkoutSuggestions = () => {
  return useMutation({
    mutationFn: workoutSuggestions,
  });
};

export const useUpdateStatusWorkout = () => {
  return useMutation({
    mutationFn: updateStatusWorkout,
  });
};
