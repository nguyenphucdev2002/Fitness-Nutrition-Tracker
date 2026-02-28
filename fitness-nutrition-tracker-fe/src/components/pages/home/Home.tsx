"use client";
import React, { useMemo, useState } from "react";
import {
  Flame,
  Target,
  TrendingDown,
  TrendingUp,
  Droplet,
  Apple,
  Dumbbell,
  Zap,
  Calendar,
  Goal as GoalIcon,
  Trophy,
  Scale,
  Activity,
} from "lucide-react";
import { CalorieRequirements, UserProfile } from "@/types";
import { calculateCalorieRequirements } from "@/lib/utils/calculations";
import {
  Button,
  Progress,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import Link from "next/link";
import { useGetUserInfo, useNutritionAnalytics, useWorkoutAnalytics } from "@/api/user/user.hook";
import { DailyHealthCheckModal } from "@/components/DailyHealthCheckModal";
import { getResultProfile, hasAuditLogForToday } from "@/lib/utils/helpers";
import { useApp } from "@/providers";

export function HomePage() {
  const { user } = useApp();
  const { data: nutritionData } = useNutritionAnalytics(1);
  const { data: workoutData } = useWorkoutAnalytics(1);
  const [showWeeklyCheck, setShowWeeklyCheck] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const profile: UserProfile | null = useMemo(() => {
    if (!user?.profile?.target?.goal) return null;
    const p = user.profile;
    return {
      id: p.user_id,
      age: p.age,
      gender: p.gender as "male" | "female",
      weight: p.weight_kg,
      height: p.height_cm,
      activityLevel: p.activity_level as any,
      goal: p.target.goal as any,
      targetWeight: p.target.target_weight,
      targetDate: p.target.target_date,
      // Pass raw audit_log for HomeHeader to process
      auditLog: p.target.audit_log,
      createdAt: "",
      updatedAt: "",
      name: user.name,
    } as any;
  }, [user]);

  const requirements = useMemo(() => {
    if (!profile)
      return {
        bmr: 0,
        tdee: 0,
        targetCalories: 0,
        proteinGrams: 0,
        carbsGrams: 0,
        fatGrams: 0,
      };
    return calculateCalorieRequirements(profile);
  }, [profile]);

  const todayNutrition = useMemo(() => {
    return nutritionData?.find((n) => n.day === today);
  }, [nutritionData, today]);

  const todayWorkout = useMemo(() => {
    return workoutData?.find((w) => w.day === today);
  }, [workoutData, today]);

  const caloriesIn = todayNutrition?.calories || 0;
  const caloriesBurned = todayWorkout?.calo || 0;
  const caloriesRemaining = requirements.targetCalories - caloriesIn + caloriesBurned;

  // Progress calculations
  const caloriesProgress = requirements.targetCalories
    ? (caloriesIn / requirements.targetCalories) * 100
    : 0;

  // Macros
  const proteinCurrent = todayNutrition?.protein || 0;
  const carbsCurrent = todayNutrition?.carbs || 0;
  const fatCurrent = todayNutrition?.fat || 0;

  const proteinProgress = requirements.proteinGrams
    ? (proteinCurrent / requirements.proteinGrams) * 100
    : 0;
  const carbsProgress = requirements.carbsGrams
    ? (carbsCurrent / requirements.carbsGrams) * 100
    : 0;
  const fatProgress = requirements.fatGrams ? (fatCurrent / requirements.fatGrams) * 100 : 0;

  const waterProgress = 0; // Water tracking might be separate or missing in current API

  return (
    <div className="space-y-6">
      {/* Header with Comparison */}
      <HomeHeader profile={profile} setShowWeeklyCheck={setShowWeeklyCheck} />

      {/* Main Stats Grid */}

      {/* Macros Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Dinh dưỡng hôm nay</CardTitle>
          <CardDescription>Phân bổ Protein, Carbs, Fat</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span>Protein</span>
                <span>{Math.round(proteinCurrent)}g</span>
              </div>
              <Progress value={Math.min(100, proteinProgress)} className="h-2" />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span>Carbs</span>
                <span>{Math.round(carbsCurrent)}g</span>
              </div>
              <Progress value={Math.min(100, carbsProgress)} className="h-2" />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span>Fat</span>
                <span>{Math.round(fatCurrent)}g</span>
              </div>
              <Progress value={Math.min(100, fatProgress)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href={"nutrition"}
          className="hover:border-primary bg-card text-card-foreground flex cursor-pointer flex-col gap-6 rounded-xl border transition-colors"
        >
          <CardHeader>
            <CardTitle>Ghi nhận bữa ăn</CardTitle>
            <CardDescription>Thêm món ăn bằng AI hoặc tìm kiếm</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Apple className="mr-2 h-4 w-4" />
              Thêm món ăn
            </Button>
          </CardContent>
        </Link>

        <Link
          href={"workout"}
          className="hover:border-primary bg-card text-card-foreground flex cursor-pointer flex-col gap-6 rounded-xl border transition-colors"
        >
          <CardHeader>
            <CardTitle>Ghi nhận tập luyện</CardTitle>
            <CardDescription>Thêm hoạt động thể chất</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Dumbbell className="mr-2 h-4 w-4" />
              Thêm bài tập
            </Button>
          </CardContent>
        </Link>
      </div>

      <DailyHealthCheckModal isOpen={showWeeklyCheck} onClose={() => setShowWeeklyCheck(false)} />
    </div>
  );
}

const HomeHeader = ({
  profile,
  setShowWeeklyCheck,
}: {
  profile: any;
  setShowWeeklyCheck: (v: boolean) => void;
}) => {
  if (!profile) return null;

  const currentWeight = profile.weight;
  const targetWeight = profile.targetWeight || currentWeight;
  const startWeight = currentWeight; // Placeholder, ideally should come from initial profile or first audit log
  const weightChange = currentWeight - startWeight;
  const progressToTarget = startWeight - targetWeight;
  const currentProgress = startWeight - currentWeight;
  const weightProgress = progressToTarget !== 0 ? (currentProgress / progressToTarget) * 100 : 0;

  const { label: goalLabel, color: goalColor } = getResultProfile(profile.goal);

  // Comparison Logic
  const auditLogs = profile.auditLog || [];
  const sortedLogs = [...auditLogs].sort(
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const comparisonData =
    sortedLogs.length >= 2
      ? {
          newest: sortedLogs[0],
          previous: sortedLogs[1],
          changes: {
            weight: sortedLogs[0].weight - sortedLogs[1].weight,
            bodyFat:
              (sortedLogs[0].bodyFatPercentage || 0) - (sortedLogs[1].bodyFatPercentage || 0),
            waist: (sortedLogs[0].waist || 0) - (sortedLogs[1].waist || 0),
          },
        }
      : null;

  const isHasAuditLogForToday = hasAuditLogForToday(auditLogs);

  return (
    <>
      {/* Hero Banner with Slogan */}
      <Card className="from-primary/10 via-primary/5 to-background border-primary/20 bg-gradient-to-r">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="text-primary h-6 w-6" />
                <h2 className="text-2xl">Chào {profile?.name}!</h2>
              </div>
              <p className="text-muted-foreground text-lg">
                <strong>FitTracker AI</strong> - Đồng hành cùng bạn trên hành trình chinh phục mục
                tiêu
              </p>
              <p className="text-primary text-sm italic">
                &quot;Mỗi ngày một chút tiến bộ, mỗi tuần một bước xa hơn - Bạn đang làm rất tốt!
                💪&quot;
              </p>
            </div>
            {!isHasAuditLogForToday && (
              <Button onClick={() => setShowWeeklyCheck(true)} size="lg" className="gap-2">
                <Calendar className="h-5 w-5" />
                Cập nhật thể trạng tuần
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Goal Highlight */}
      <Card className="border-primary/30 border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`bg-primary/10 rounded-full p-3`}>
                <GoalIcon className={`h-6 w-6 ${goalColor}`} />
              </div>
              <div>
                <CardTitle>Mục tiêu: {goalLabel}</CardTitle>
                <CardDescription>
                  {profile.targetDate && (
                    <>Hoàn thành trước {new Date(profile.targetDate).toLocaleDateString("vi-VN")}</>
                  )}
                </CardDescription>
              </div>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Scale className="mx-auto mb-2 h-5 w-5 text-blue-500" />
              <div className="text-2xl">{currentWeight}kg</div>
              <p className="text-muted-foreground text-xs">Hiện tại</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Target className="mx-auto mb-2 h-5 w-5 text-green-500" />
              <div className="text-2xl">{targetWeight}kg</div>
              <p className="text-muted-foreground text-xs">Mục tiêu</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Activity className="mx-auto mb-2 h-5 w-5 text-purple-500" />
              <div className="text-2xl">{Math.abs(currentWeight - targetWeight).toFixed(1)}kg</div>
              <p className="text-muted-foreground text-xs">Còn lại</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <TrendingUp className="mx-auto mb-2 h-5 w-5 text-orange-500" />
              <div className="text-2xl">
                {Math.min(100, Math.max(0, weightProgress)).toFixed(0)}%
              </div>
              <p className="text-muted-foreground text-xs">Tiến độ</p>
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm">Tiến độ mục tiêu</span>
              <span className="text-muted-foreground text-sm">
                {weightChange > 0 ? "-" : "+"}
                {Math.abs(weightChange).toFixed(1)}kg
              </span>
            </div>
            <Progress value={Math.min(100, Math.max(0, weightProgress))} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Progress Comparison */}
      {comparisonData && (
        <Card>
          <CardHeader>
            <CardTitle>Sự thay đổi gần đây</CardTitle>
            <CardDescription>
              So sánh giữa {new Date(comparisonData.previous.date).toLocaleDateString("vi-VN")} và{" "}
              {new Date(comparisonData.newest.date).toLocaleDateString("vi-VN")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics Comparison */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-muted-foreground mb-1 text-sm">Cân nặng</div>
                <div className="text-xl">{comparisonData.newest.weight}kg</div>
                <div
                  className={`flex items-center justify-center gap-1 text-sm ${
                    comparisonData.changes.weight < 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {comparisonData.changes.weight < 0 ? "↓" : "↑"}{" "}
                  {Math.abs(comparisonData.changes.weight).toFixed(1)}kg
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-muted-foreground mb-1 text-sm">Body Fat</div>
                <div className="text-xl">{comparisonData.newest.bodyFatPercentage}%</div>
                <div
                  className={`flex items-center justify-center gap-1 text-sm ${
                    comparisonData.changes.bodyFat < 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {comparisonData.changes.bodyFat < 0 ? "↓" : "↑"}{" "}
                  {Math.abs(comparisonData.changes.bodyFat).toFixed(1)}%
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-muted-foreground mb-1 text-sm">Eo</div>
                <div className="text-xl">{comparisonData.newest.waist}cm</div>
                <div
                  className={`flex items-center justify-center gap-1 text-sm ${
                    comparisonData.changes.waist < 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {comparisonData.changes.waist < 0 ? "↓" : "↑"}{" "}
                  {Math.abs(comparisonData.changes.waist).toFixed(1)}cm
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-muted-foreground mb-1 text-sm">Năng lượng</div>
                <div className="text-xl">{comparisonData.newest.energyLevel}/5</div>
                <div
                  className={`flex items-center justify-center gap-1 text-sm ${
                    comparisonData.newest.energyLevel - comparisonData.previous.energyLevel >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {comparisonData.newest.energyLevel - comparisonData.previous.energyLevel >= 0
                    ? "↑"
                    : "↓"}{" "}
                  {Math.abs(
                    comparisonData.newest.energyLevel - comparisonData.previous.energyLevel
                  )}
                </div>
              </div>
            </div>

            {/* Notes and Achievements */}
            {(comparisonData.newest.achievements || comparisonData.newest.challenges) && (
              <div className="space-y-3 border-t pt-4">
                {comparisonData.newest.achievements && (
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Thành tựu</span>
                    </div>
                    <p className="text-muted-foreground pl-6 text-sm">
                      {comparisonData.newest.achievements}
                    </p>
                  </div>
                )}
                {comparisonData.newest.challenges && (
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Target className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Khó khăn</span>
                    </div>
                    <p className="text-muted-foreground pl-6 text-sm">
                      {comparisonData.newest.challenges}
                    </p>
                  </div>
                )}
                {comparisonData.newest.notes && (
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Ghi chú</span>
                    </div>
                    <p className="text-muted-foreground pl-6 text-sm">
                      {comparisonData.newest.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};
