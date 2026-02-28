import { WorkoutLogType } from "@/types";
import { ApiReponseType } from "../common.type";

export type WorkoutLogsReponseDataType = WorkoutLogType[];
export type WorkoutLogsReponseType = ApiReponseType<WorkoutLogsReponseDataType>;
