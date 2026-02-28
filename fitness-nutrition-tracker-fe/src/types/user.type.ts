export type UserInfoType = {
  id?: string;
  name: string;
  email: string;
  profile: UserProfileType | null;
  role: number;
  created_at?: string;
};

export type HealthCheckEntryType = {
  id: string;
  date: string;
  weight?: number;
  waist?: number;
  chest?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
  bodyFatPercentage?: number;
  energyLevel: number;
  sleepQuality: number;
  stressLevel: number;
  appetiteLevel: number;
  notes?: string;
  challenges?: string;
  achievements?: string;
  created_at: string;
};

export type UserProfileType = {
  user_id: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  updated_at?: string;
  bmi: string;
  target: {
    daily_calories: number;
    goal: string;
    target_weight: number;
    weekly_workout_days: number;
    target_date?: string;
    available_workout_time_min?: number;
    audit_log?: HealthCheckEntryType[];
  };
};

export const HEALTH_CHECK_LABELS: Record<keyof HealthCheckEntryType, string> = {
  id: "ID",
  date: "Ngày ghi nhận",
  weight: "Cân nặng (kg)",
  waist: "Vòng eo (cm)",
  chest: "Vòng ngực (cm)",
  hips: "Vòng hông (cm)",
  biceps: "Vòng bắp tay (cm)",
  thighs: "Vòng đùi (cm)",
  bodyFatPercentage: "Tỷ lệ mỡ cơ thể (%)",
  energyLevel: "Mức năng lượng",
  sleepQuality: "Chất lượng giấc ngủ",
  stressLevel: "Mức độ căng thẳng",
  appetiteLevel: "Mức độ thèm ăn",
  notes: "Ghi chú",
  challenges: "Khó khăn",
  achievements: "Thành tựu",
  created_at: "Ngày tạo",
};
