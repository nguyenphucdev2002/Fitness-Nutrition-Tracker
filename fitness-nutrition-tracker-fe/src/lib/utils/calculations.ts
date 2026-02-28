import { E_WORKOUT_STATUS } from "@/enums";
import { UserProfile, CalorieRequirements } from "../../types";

export const calculateBMR = (profile: UserProfile): number => {
  // Mifflin-St Jeor Equation
  const { weight, height, age, gender } = profile;

  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

export const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    "very-active": 1.9,
  };

  return bmr * (activityMultipliers[activityLevel] || 1.2);
};

export const calculateCalorieRequirements = (profile: UserProfile): CalorieRequirements => {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);

  let targetCalories = tdee;

  // Adjust based on goal
  if (profile.goal === "lose-weight") {
    targetCalories = tdee - 500; // 500 calorie deficit
  } else if (profile.goal === "gain-muscle") {
    targetCalories = tdee + 300; // 300 calorie surplus
  }

  // Macro calculation (example ratios)
  let proteinRatio = 0.3;
  let carbsRatio = 0.4;
  let fatRatio = 0.3;

  if (profile.goal === "gain-muscle") {
    proteinRatio = 0.35;
    carbsRatio = 0.4;
    fatRatio = 0.25;
  } else if (profile.goal === "lose-weight") {
    proteinRatio = 0.35;
    carbsRatio = 0.3;
    fatRatio = 0.35;
  }

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    proteinGrams: Math.round((targetCalories * proteinRatio) / 4),
    carbsGrams: Math.round((targetCalories * carbsRatio) / 4),
    fatGrams: Math.round((targetCalories * fatRatio) / 9),
  };
};

export const calculateCaloriesBurned = (
  type: string,
  duration: number,
  weight: number,
  intensity: string
): number => {
  // MET values for different activities
  const metValues: Record<string, Record<string, number>> = {
    running: { low: 6, medium: 8, high: 11 },
    walking: { low: 2.5, medium: 3.5, high: 4.5 },
    cycling: { low: 4, medium: 7, high: 10 },
    swimming: { low: 5, medium: 7, high: 10 },
    gym: { low: 3, medium: 5, high: 7 },
    yoga: { low: 2, medium: 3, high: 4 },
    hiit: { low: 6, medium: 8, high: 12 },
    dancing: { low: 3, medium: 5, high: 7 },
    sports: { low: 4, medium: 6, high: 8 },
  };

  const met = metValues[type]?.[intensity] || 5;

  // Calories = MET × weight(kg) × duration(hours)
  return Math.round(met * weight * (duration / 60));
};

export const calculateBMI = (weight: number, height: number): number => {
  // BMI = weight(kg) / (height(m))^2
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "Thiếu cân";
  if (bmi < 25) return "Bình thường";
  if (bmi < 30) return "Thừa cân";
  return "Béo phì";
};

export const getActivityLevelLabel = (level: string): string => {
  const labels: Record<string, string> = {
    sedentary: "Ít vận động (văn phòng)",
    light: "Nhẹ nhàng (1-2 ngày/tuần)",
    moderate: "Trung bình (3-5 ngày/tuần)",
    active: "Tích cực (6-7 ngày/tuần)",
    "very-active": "Rất tích cực (vận động viên)",
  };
  return labels[level] || level;
};

export const getGoalLabel = (goal: string): string => {
  const labels: Record<string, string> = {
    "lose-weight": "Giảm cân",
    "gain-muscle": "Tăng cơ",
    maintain: "Duy trì cân nặng",
  };
  return labels[goal] || goal;
};

export function getStatusLabel(status: E_WORKOUT_STATUS): string {
  switch (status) {
    case E_WORKOUT_STATUS.PLANNED:
      return "Đã lên lịch";
    case E_WORKOUT_STATUS.COMPLETED:
      return "Đã hoàn thành";
    case E_WORKOUT_STATUS.SKIPPED:
      return "Đã bỏ qua";
    default:
      return "Không xác định";
  }
}

export function getStatusColor(status: E_WORKOUT_STATUS): string {
  switch (status) {
    case E_WORKOUT_STATUS.PLANNED:
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case E_WORKOUT_STATUS.COMPLETED:
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case E_WORKOUT_STATUS.SKIPPED:
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    default:
      return "bg-muted";
  }
}
