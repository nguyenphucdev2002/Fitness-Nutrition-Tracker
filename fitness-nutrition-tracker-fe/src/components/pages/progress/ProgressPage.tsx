"use client";
import { Activity, Flame, TrendingUp } from "lucide-react";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  LoadingPage,
} from "@/components/ui";
import { useGetUserInfo, useNutritionAnalytics, useWorkoutAnalytics } from "@/api/user/user.hook";
import dayjs from "dayjs";
import { getResultProfile } from "@/lib/utils/helpers";
import { useApp } from "@/providers";

export function ProgressTracker() {
  const [timeRange, setTimeRange] = React.useState<"week" | "month">("week");
  const mode = timeRange === "week" ? 7 : 30;

  const { user } = useApp();
  const { data: nutritionStats, isLoading: isLoadingNutrition } = useNutritionAnalytics(mode);
  const { data: workoutStats, isLoading: isLoadingWorkout } = useWorkoutAnalytics(mode);

  const isLoading = isLoadingNutrition || isLoadingWorkout;

  const profile = user?.profile;
  const target = profile?.target;

  // Prepare chart data
  const calorieData =
    nutritionStats?.map((nStat) => {
      return {
        date: dayjs(nStat.day).format("DD/MM"),
        "Năng lượng (kcal)": nStat.calories,
        "Tinh bột (g)": nStat.carbs,
        "Protein (g)": nStat.protein,
        "Béo (g)": nStat.fat,
      };
    }) || [];

  // Process workout data
  const workoutData = React.useMemo(() => {
    if (!workoutStats) return [];

    const groupedData = workoutStats.reduce(
      (acc, stat) => {
        const date = dayjs(stat.day).format("DD/MM");
        if (!acc[date]) {
          acc[date] = {
            date,
            completed: 0,
            skipped: 0,
            planned: 0,
            unknown: 0,
          };
        }

        // Map status to field
        switch (stat.status) {
          case 1: // COMPLETED
            acc[date].completed += stat.duration_min;
            break;
          case 2: // SKIPPED
            acc[date].skipped += stat.duration_min;
            break;
          case 0: // PLANNED
            acc[date].planned += stat.duration_min;
            break;
          default:
            acc[date].unknown += stat.duration_min;
        }
        return acc;
      },
      {} as Record<
        string,
        { date: string; completed: number; skipped: number; planned: number; unknown: number }
      >
    );

    return Object.values(groupedData);
  }, [workoutStats]);

  const todayStr = dayjs().format("YYYY-MM-DD");
  const todayStats = nutritionStats?.find((s) => s.day === todayStr) || {
    protein: 0,
    carbs: 0,
    fat: 0,
    calories: 0,
  };

  const macroData = [
    { name: "Protein", value: todayStats.protein, color: "#10b981" },
    { name: "Carbs", value: todayStats.carbs, color: "#3b82f6" },
    { name: "Fat", value: todayStats.fat, color: "#f59e0b" },
  ];

  const totalCalories = nutritionStats?.reduce((sum, stat) => sum + stat.calories, 0) || 0;
  const totalWorkoutMinutes = workoutStats?.reduce((sum, stat) => sum + stat.duration_min, 0) || 0;
  const averageCalories = Math.round(totalCalories / (nutritionStats?.length || 1));
  const averageWorkout = Math.round(totalWorkoutMinutes / (workoutStats?.length || 1));

  const goalLabels = getResultProfile(target?.goal || "");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Theo dõi tiến độ</h1>
          <p className="text-muted-foreground">Xem biểu đồ và thống kê chi tiết</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={timeRange === "week" ? "default" : "outline"}
            onClick={() => setTimeRange("week")}
          >
            7 ngày
          </Button>
          <Button
            variant={timeRange === "month" ? "default" : "outline"}
            onClick={() => setTimeRange("month")}
          >
            30 ngày
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Calo TB/ngày</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCalories}</div>
            <p className="text-muted-foreground text-xs">
              Mục tiêu: {target?.daily_calories || "--"} kcal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tập TB/ngày</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageWorkout} phút</div>
            <p className="text-muted-foreground text-xs">Tổng: {totalWorkoutMinutes} phút</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Mục tiêu chính</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalLabels.label}</div>
            {target?.target_weight && (
              <p className="text-muted-foreground text-xs">
                Cân nặng mục tiêu: {target.target_weight} kg
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="calories">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calories">Calo</TabsTrigger>
          <TabsTrigger value="workout">Tập luyện</TabsTrigger>
        </TabsList>

        <TabsContent value="calories">
          <Card>
            <CardHeader>
              <CardTitle>Dinh Dưỡng hàng ngày</CardTitle>
              <CardDescription>Theo dõi dinh dưỡng nạp của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={calorieData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Năng lượng (kcal)"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                  <Line type="monotone" dataKey="Tinh bột (g)" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Protein (g)" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="Béo (g)" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workout">
          <Card>
            <CardHeader>
              <CardTitle>Thời gian tập luyện</CardTitle>
              <CardDescription>Số phút tập luyện mỗi ngày</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={workoutData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" name="Đã hoàn thành" stackId="a" fill="#10b981" />
                  <Bar dataKey="skipped" name="Đã bỏ qua" stackId="a" fill="#ef4444" />
                  <Bar dataKey="planned" name="Đã lên lịch" stackId="a" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <LoadingPage isOpen={isLoading} />
    </div>
  );
}
