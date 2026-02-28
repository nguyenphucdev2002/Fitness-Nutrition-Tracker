// Type definitions for the fitness app

export interface UserProfile {
  id: string;
  age: number;
  gender: "male" | "female";
  weight: number; // kg
  height: number; // cm
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very-active";
  goal: "lose-weight" | "gain-muscle" | "maintain";
  targetWeight?: number;
  targetDate?: string;
  priority?: "fat-loss" | "muscle-gain" | "endurance";
  createdAt: string;
  updatedAt: string;
}

export interface FoodEntry {
  id: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  portion?: string;
  imageUrl?: string;
}

export interface WorkoutEntry {
  id: string;
  date: string;
  type: string;
  name: string;
  duration: number; // minutes
  intensity: "low" | "medium" | "high";
  caloriesBurned: number;
  notes?: string;
}

export interface WaterLog {
  id: string;
  date: string;
  amount: number; // ml
  timestamp: string;
}

export interface DailyStats {
  date: string;
  caloriesIn: number;
  caloriesOut: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  workoutMinutes: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  daysPerWeek: number;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  duration?: number;
  restTime?: number;
  description: string;
  videoUrl?: string;
  muscleGroup: string;
}

export interface CalorieRequirements {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export * from "./user.type";
export * from "./workout.type";
export * from "./food.type";
