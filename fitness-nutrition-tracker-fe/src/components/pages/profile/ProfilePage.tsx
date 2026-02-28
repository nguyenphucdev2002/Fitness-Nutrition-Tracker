"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { useUpdateProfile } from "@/api";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  LoadingPage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { calculateBMI, getBMICategory } from "@/lib/utils/calculations";
import { validateForm } from "@/lib/utils/helpers";
import { useApp } from "@/providers";
import { UserProfileType } from "@/types";

const ACTIVITY_TO_WORKOUT_DAYS: Record<UserProfileType["activity_level"], number> = {
  low: 2,
  medium: 4,
  high: 6,
};

const WORKOUT_DAYS_TO_ACTIVITY: Record<number, UserProfileType["activity_level"]> = {
  2: "low",
  4: "medium",
  6: "high",
};

export function UserProfilePage() {
  const { user, setUser } = useApp();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [initialized, setInitialized] = useState(false);

  const [formData, setFormData] = useState<UserProfileType>({
    user_id: "",
    age: 0,
    gender: "male",
    weight_kg: 0,
    height_cm: 0,
    activity_level: "medium",
    bmi: "",
    target: {
      daily_calories: 0,
      goal: "",
      target_weight: 0,
      weekly_workout_days: 0,
    },
  });

  const bmi =
    formData.height_cm && formData.weight_kg
      ? calculateBMI(formData.weight_kg, formData.height_cm)
      : 0;

  const updateField = <K extends keyof UserProfileType>(field: K, value: UserProfileType[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateTargetField = <K extends keyof UserProfileType["target"]>(
    field: K,
    value: UserProfileType["target"][K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      target: {
        ...prev.target,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      toast.error("Vui lòng kiểm tra lại thông tin nhập.");
      console.log("Validation errors:", errors);
      return;
    }

    updateProfile(
      { ...formData, bmi: `${bmi}` },
      {
        onSuccess: (data: any) => {
          setUser((pre) => {
            if (!pre) return;
            return { ...pre, profile: data };
          });
          toast.success("Cập nhật thông tin thành công.");
        },
        onError: () => toast.error("Cập nhật thông tin thất bại."),
      }
    );
  };

  useEffect(() => {
    if (!user?.profile) return;

    const hasUserGoal = !!user.profile.target?.goal;
    const hasFormGoal = !!formData.target.goal;

    // Initialize if not done yet, OR if we missed the data previously (race condition fix)
    if (!initialized || (!hasFormGoal && hasUserGoal)) {
      setFormData({
        user_id: user.id ?? "",
        age: user.profile.age,
        gender: user.profile.gender,
        weight_kg: user.profile.weight_kg,
        height_cm: user.profile.height_cm,
        activity_level: user.profile.activity_level,
        bmi: `${calculateBMI(user.profile.weight_kg, user.profile.height_cm)}`,
        target: {
          daily_calories: user.profile.target?.daily_calories ?? 0,
          goal: user.profile.target?.goal ?? "",
          target_weight: user.profile.target?.target_weight ?? 0,
          weekly_workout_days: user.profile.target?.weekly_workout_days ?? 0,
        },
      });

      setInitialized(true);
    }
  }, [user, initialized, formData.target.goal]);

  console.log(user, formData);
  return (
    <>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1>{user?.profile ? "Chỉnh sửa hồ sơ" : "Thiết lập hồ sơ"}</h1>
          <p className="text-muted-foreground">
            Thông tin của bạn giúp chúng tôi tính toán nhu cầu năng lượng chính xác
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* -------- Basic Info -------- */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Độ tuổi và giới tính</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tuổi</Label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateField("age", Number(e.target.value))}
                  min={15}
                  max={100}
                />
              </div>

              <div className="space-y-2">
                <Label>Giới tính</Label>
                <Select value={formData.gender} onValueChange={(v) => updateField("gender", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* -------- Body Info -------- */}
          <Card>
            <CardHeader>
              <CardTitle>Chỉ số cơ thể</CardTitle>
              <CardDescription>Cân nặng và chiều cao</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cân nặng (kg)</Label>
                  <Input
                    type="number"
                    value={formData.weight_kg}
                    onChange={(e) => updateField("weight_kg", Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Chiều cao (cm)</Label>
                  <Input
                    type="number"
                    value={formData.height_cm}
                    onChange={(e) => updateField("height_cm", Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="bg-muted flex justify-between rounded-lg p-4">
                <span>BMI:</span>
                <span className="text-lg">
                  {bmi} - {getBMICategory(bmi)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* -------- Activity -------- */}
          <Card>
            <CardHeader>
              <CardTitle>Mức độ vận động</CardTitle>
              <CardDescription>Mức độ hoạt động thể chất hàng tuần</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={WORKOUT_DAYS_TO_ACTIVITY[formData.target?.weekly_workout_days]}
                onValueChange={(v) => {
                  updateField("activity_level", v);
                  const workoutDays = ACTIVITY_TO_WORKOUT_DAYS[v];
                  updateTargetField("weekly_workout_days", workoutDays);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Nhẹ nhàng (1-2 ngày/tuần)</SelectItem>
                  <SelectItem value="medium">Trung bình (3-5 ngày/tuần)</SelectItem>
                  <SelectItem value="high">Tích cực (6-7 ngày/tuần)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mục tiêu sức khỏe</CardTitle>
              <CardDescription>Bạn muốn đạt được điều gì?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Mục tiêu chính</Label>
                <Select
                  value={formData?.target?.goal}
                  onValueChange={(v) => updateTargetField("goal", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose-weight">Giảm cân</SelectItem>
                    <SelectItem value="gain-weight">Tăng cân</SelectItem>
                    <SelectItem value="gain-muscle">Tăng cơ</SelectItem>
                    <SelectItem value="maintain">Duy trì cân nặng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetWeight">Cân nặng mục tiêu (kg)</Label>
                <Input
                  type="number"
                  value={formData.target.target_weight}
                  onChange={(e) => updateTargetField("target_weight", Number(e.target.value))}
                  min="30"
                  max="300"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyCalories">Lượng calo mục tiêu mỗi ngày (kcal)</Label>
                <Input
                  id="dailyCalories"
                  type="number"
                  value={formData.target.daily_calories}
                  onChange={(e) => updateTargetField("daily_calories", Number(e.target.value))}
                  min={1000}
                  max={6000}
                  step={50}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            {user?.profile ? "Cập nhật hồ sơ" : "Tạo hồ sơ"}
          </Button>
        </form>
      </div>
      <LoadingPage isOpen={isPending} />
    </>
  );
}
