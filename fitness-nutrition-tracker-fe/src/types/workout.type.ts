import { E_WORKOUT_STATUS } from "@/enums";

export type WorkoutType = {
  id: string;
  name: string;
  type: string;
  workout_logs: WorkoutLogType[];
};

export type WorkoutLogType = {
  id: string;
  user_id: string;
  workout_type: number;
  calories_burned: number;
  duration_min: number;
  description: string;
  log_date: string;
  note: string | null;
  status: E_WORKOUT_STATUS;
  created_at: string;
  workout_metadata: {
    description: string;
    name: string;
    link_reference?: string | null;
  };
};
