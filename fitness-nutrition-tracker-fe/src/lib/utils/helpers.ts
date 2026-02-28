import { UserProfileType, HealthCheckEntryType } from "@/types";

type TargetErrors = {
  main_target?: string;
  main_weight_kg?: string;
  priority?: string;
};

export type ValidationErrors = {
  user_id?: string;
  age?: string;
  gender?: string;
  weight_kg?: string;
  height_cm?: string;
  activity_level?: string;
  bmi?: string;
  target?: TargetErrors;
};

export const validateForm = (data: UserProfileType) => {
  const errors: ValidationErrors = {};

  if (!data.user_id?.trim()) {
    errors.user_id = "User ID không được để trống";
  }

  if (!data.age || data.age <= 0 || data.age > 120) {
    errors.age = "Tuổi không hợp lệ";
  }

  if (!data.weight_kg || data.weight_kg <= 0) {
    errors.weight_kg = "Cân nặng phải lớn hơn 0";
  }

  if (!data.height_cm || data.height_cm <= 0) {
    errors.height_cm = "Chiều cao phải lớn hơn 0";
  }

  if (!data.activity_level) {
    errors.activity_level = "Vui lòng chọn mức độ hoạt động";
  }

  const targetErrors: TargetErrors = {};

  if (!data.target?.daily_calories) {
    targetErrors.main_target = "Vui lòng chọn lượng calo tiêu thụ mỗi ngày";
  }

  if (!data.target?.target_weight || data.target.target_weight <= 0) {
    targetErrors.main_weight_kg = "Cân nặng mục tiêu phải lớn hơn 0";
  }

  if (!data.target?.goal) {
    targetErrors.priority = "Vui lòng chọn mục tiêu";
  }

  if (Object.keys(targetErrors).length > 0) {
    errors.target = targetErrors;
  }

  return errors;
};

export const hasAuditLogForToday = (auditLog?: HealthCheckEntryType[]): boolean => {
  if (!auditLog || auditLog.length === 0) {
    return false;
  }

  const today = new Date().toISOString().split("T")[0];

  return auditLog.some((entry) => entry.date === today);
};

export const hasAuditLogForCurrentWeek = (auditLog?: HealthCheckEntryType[]): boolean => {
  if (!auditLog || auditLog.length === 0) {
    return false;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 (Mon) to 6 (Sun)

  const monday = new Date(today);
  monday.setDate(today.getDate() - daysSinceMonday);

  const sunday = new Date(today);
  sunday.setDate(today.getDate() + (6 - daysSinceMonday));

  const startOfWeek = monday.toISOString().split("T")[0];
  const endOfWeek = sunday.toISOString().split("T")[0];

  return auditLog.some((entry) => {
    return entry.date >= startOfWeek && entry.date <= endOfWeek;
  });
};

export function getResultProfile(goal?: string) {
  switch (goal) {
    case "lose-weight":
      return {
        label: "Giảm cân",
        color: "text-green-500",
      };
    case "gain-muscle":
      return {
        label: "Tăng cơ",
        color: "text-blue-500",
      };
    case "gain-weight":
      return {
        label: "Tăng cân",
        color: "text-orange-500",
      };
    case "maintain":
      return {
        label: "Duy trì",
        color: "text-primary",
      };
    default:
      return {
        label: "",
        color: "text-gray-500",
      };
  }
}
