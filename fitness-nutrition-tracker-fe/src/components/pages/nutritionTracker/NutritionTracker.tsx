"use client";
import {
  useCreateFood,
  useCreateNewFoodLog,
  useDeleteFoodLog,
  useFoodSuggestion,
  useGetAllFoodLog,
} from "@/api";
import { useGetUserInfo } from "@/api/user/user.hook";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  LoadingPage,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui";
import { E_MEAL_TYPE } from "@/enums";
import { FoodEntry, FoodItemType, HEALTH_CHECK_LABELS, HealthCheckEntryType } from "@/types";
import dayjs from "dayjs";
import {
  Apple,
  Camera,
  Coffee,
  Cookie,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UtensilsCrossed,
  Calendar as CalendarIcon,
} from "lucide-react";
import React, { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { DatePicker } from "antd";
import isoWeek from "dayjs/plugin/isoWeek";
import { useApp } from "@/providers";

dayjs.extend(isoWeek);

type AddMethod = "manual" | "ai" | "search";

interface FormData {
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  aiText: string;
  searchQuery: string;
}

type SearchResultItem = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
};

interface AddFoodLogProps {
  meal?: E_MEAL_TYPE;
  onSuccess?: () => void;
  dayPlan?: string;
  length?: number;
}

const AddFoodLog = ({ meal, onSuccess, dayPlan }: AddFoodLogProps) => {
  const { user } = useApp();
  const auditLogs = user?.profile?.target?.audit_log || [];
  const lastLog = [...auditLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  const [isOpen, setIsOpen] = useState(false);
  const [addMethod, setAddMethod] = useState<AddMethod>("manual");
  const [mealType, setMealType] = useState<E_MEAL_TYPE>(meal ?? E_MEAL_TYPE.BREAKFAST);
  const [formData, setFormData] = useState<FoodItemType>({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const totalMeals = 4;

  const { mutate: createFood, isPending: isPendingCreate } = useCreateNewFoodLog();
  const { mutate: createFoodSuggestions, isPending: isPendingSuggestion } = useFoodSuggestion();

  const isPending = isPendingCreate || isPendingSuggestion;

  const resetForm = () => {
    setFormData({
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    });
  };

  const handleManualAdd = () => {
    if (!formData.name.trim() || formData.calories <= 0) {
      toast.error("Vui lòng nhập tên món ăn và calories hợp lệ");
      return;
    }

    createFood(
      {
        name: formData.name,
        log_date: dayPlan ?? dayjs().format("YYYY-MM-DD"),
        meal_type: mealType,
        calories: formData.calories,
        protein: formData.protein ?? 0,
        carbs: formData.carbs ?? 0,
        fat: formData.fat ?? 0,
      },
      {
        onSuccess: (data) => {
          toast.success("Đã thêm món ăn thành công.");
          resetForm();
          setIsOpen(false);
          onSuccess?.();
        },
        onError: (err) => {
          toast.error("Thêm món ăn thất bại.");
          console.log(err);
        },
      }
    );
  };

  const getMealLabel = (meal: E_MEAL_TYPE) => {
    switch (meal) {
      case E_MEAL_TYPE.BREAKFAST:
        return "Bữa sáng";
      case E_MEAL_TYPE.LUNCH:
        return "Bữa trưa";
      case E_MEAL_TYPE.DINNER:
        return "Bữa tối";
      case E_MEAL_TYPE.SNACK:
        return "Bữa phụ";
      default:
        return "Bữa phụ";
    }
  };

  const handleAIAdd = () => {
    createFoodSuggestions(
      { dayPlan: dayPlan ?? dayjs().format("YYYY-MM-DD"), meal_type: "all" },
      {
        onSuccess: (data) => {
          toast.success("Đã tạo món ăn thành công.");
          resetForm();
          setIsOpen(false);
          onSuccess?.();
        },
        onError: (err) => {
          toast.error("Tạo món ăn thất bại.");
          console.log(err);
        },
      }
    );
  };

  const formatHealthValue = (key: keyof HealthCheckEntryType, value: any) => {
    if (value === undefined || value === null) return null;

    switch (key) {
      case "energyLevel":
      case "sleepQuality":
      case "stressLevel":
      case "appetiteLevel":
        return `${value}/10`;

      case "bodyFatPercentage":
        return `${value}%`;

      case "weight":
        return `${value} kg`;

      case "waist":
      case "chest":
      case "hips":
      case "biceps":
      case "thighs":
        return `${value} cm`;

      case "date":
      case "created_at":
        return dayjs(value).format("DD/MM/YYYY");

      default:
        return value;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"sm"}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm món ăn
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm món ăn</DialogTitle>
          <DialogDescription>Chọn cách thêm món ăn phù hợp với bạn</DialogDescription>
        </DialogHeader>

        <Tabs value={addMethod} onValueChange={(v) => setAddMethod(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Thủ công</TabsTrigger>
            <TabsTrigger value="ai">
              <Sparkles className="mr-2 h-4 w-4" />
              AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-2">
              <Label>Bữa ăn</Label>
              <Select value={mealType} onValueChange={(v: any) => setMealType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={E_MEAL_TYPE.BREAKFAST}>Bữa sáng</SelectItem>
                  <SelectItem value={E_MEAL_TYPE.LUNCH}>Bữa trưa</SelectItem>
                  <SelectItem value={E_MEAL_TYPE.DINNER}>Bữa tối</SelectItem>
                  <SelectItem value={E_MEAL_TYPE.SNACK}>Bữa phụ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tên món ăn</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Phở bò"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Calories (kcal)</Label>
                <Input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Protein (g)</Label>
                <Input
                  type="number"
                  value={formData?.protein ?? 0}
                  onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>Carbs (g)</Label>
                <Input
                  type="number"
                  value={formData?.carbs ?? 0}
                  onChange={(e) => setFormData({ ...formData, carbs: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>Fat (g)</Label>
                <Input
                  type="number"
                  value={formData?.fat ?? 0}
                  onChange={(e) => setFormData({ ...formData, fat: Number(e.target.value) })}
                />
              </div>
            </div>

            <Button onClick={handleManualAdd} className="w-full">
              Thêm món ăn
            </Button>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div className="space-y-2">
              <Label>{getMealLabel(mealType)}</Label>
              <p className="text-muted-foreground text-sm">
                AI sẽ phân tích đề xuất ra thực đơn phù hợp với bạn cho cả ngày
              </p>
            </div>

            {lastLog && (
              <div className="bg-muted/50 space-y-3 rounded-lg p-4 text-sm">
                <p className="font-semibold">
                  Tình trạng gần đây ({dayjs(lastLog.date).format("DD/MM/YYYY")})
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(HEALTH_CHECK_LABELS) as (keyof HealthCheckEntryType)[])
                    .filter(
                      (key) =>
                        !["id", "created_at", "date"].includes(key) &&
                        lastLog[key] !== undefined &&
                        lastLog[key] !== null
                    )
                    .map((key) => (
                      <div key={key} className="flex gap-1">
                        <span className="text-muted-foreground">{HEALTH_CHECK_LABELS[key]}:</span>
                        <span className="font-medium">{formatHealthValue(key, lastLog[key])}</span>
                      </div>
                    ))}
                </div>

                {lastLog.notes && (
                  <div className="text-muted-foreground mt-2 text-xs italic">
                    📝 Ghi chú: "{lastLog.notes}"
                  </div>
                )}

                {lastLog.challenges && (
                  <div className="mt-1 text-xs text-red-400">⚠️ Khó khăn: {lastLog.challenges}</div>
                )}

                {lastLog.achievements && (
                  <div className="mt-1 text-xs text-green-400">
                    🎯 Thành tựu: {lastLog.achievements}
                  </div>
                )}
              </div>
            )}

            <Button onClick={handleAIAdd} className="w-full" disabled={isPendingSuggestion}>
              {isPendingSuggestion ? "Đang xử lý..." : "Đề xuất"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
      <LoadingPage isOpen={isPending} />
    </Dialog>
  );
};

export function NutritionTracker() {
  const [currentWeek, setCurrentWeek] = useState<dayjs.Dayjs>(dayjs());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const startDay = currentWeek.startOf("isoWeek").format("YYYY-MM-DD");
  const endDay = currentWeek.endOf("isoWeek").format("YYYY-MM-DD");

  const {
    data: foodLogs,
    refetch,
    isLoading,
  } = useGetAllFoodLog({
    start_day: startDay,
    end_day: endDay,
  });

  const { mutateAsync: deleteFoodLog } = useDeleteFoodLog();
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteFoodLog({ id: deleteId });
      toast.success("Đã xóa món ăn");
      refetch();
    } catch (error) {
      toast.error("Xóa món ăn thất bại");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    currentWeek.startOf("isoWeek").add(i, "day").format("YYYY-MM-DD")
  );

  // ── Tính toán thống kê ──────────────────────
  const stats = {
    caloriesIn: foodLogs?.reduce((sum, e) => sum + e.calories, 0) || 0,
    protein: foodLogs?.reduce((sum, e) => sum + (e.protein || 0), 0) || 0,
    carbs: foodLogs?.reduce((sum, e) => sum + (e.carbs || 0), 0) || 0,
    fat: foodLogs?.reduce((sum, e) => sum + (e.fat || 0), 0) || 0,
  };

  const getMealIcon = (type: string) => {
    switch (type) {
      case "breakfast":
        return <Coffee className="h-4 w-4" />;
      case "lunch":
        return <UtensilsCrossed className="h-4 w-4" />;
      case "dinner":
        return <Apple className="h-4 w-4" />;
      case "snack":
        return <Cookie className="h-4 w-4" />;
      default:
        return <Apple className="h-4 w-4" />;
    }
  };

  const getMealLabel = (type: string) => {
    switch (type) {
      case "breakfast":
        return "Sáng";
      case "lunch":
        return "Trưa";
      case "dinner":
        return "Tối";
      case "snack":
        return "Phụ";
      default:
        return type;
    }
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header + Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Nhật ký dinh dưỡng</h1>
          <p className="text-muted-foreground text-sm">Theo dõi calo và dinh dưỡng hàng tuần</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-card flex items-center gap-2 rounded-lg border p-1">
            <CalendarIcon className="text-muted-foreground ml-2 h-4 w-4" />
            <DatePicker
              picker="week"
              value={currentWeek}
              onChange={(date) => date && setCurrentWeek(date)}
              allowClear={false}
              format={() =>
                `${currentWeek.startOf("isoWeek").format("DD/MM")} - ${currentWeek
                  .endOf("isoWeek")
                  .format("DD/MM/YYYY")}`
              }
              className="border-none shadow-none focus:ring-0"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tổng quan tuần này</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.caloriesIn}</p>
              <p className="text-muted-foreground text-sm">Calories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{Math.round(stats.protein)}g</p>
              <p className="text-muted-foreground text-sm">Protein</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{Math.round(stats.carbs)}g</p>
              <p className="text-muted-foreground text-sm">Carbs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{Math.round(stats.fat)}g</p>
              <p className="text-muted-foreground text-sm">Fat</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {weekDays.map((day) => {
          const logsForDay = foodLogs?.filter((log) => log.log_date === day) || [];
          const dayCalories = logsForDay.reduce((sum, log) => sum + log.calories, 0);

          return (
            <AccordionItem key={day} value={day} className="bg-card rounded-lg border px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex w-full items-center justify-between pr-4">
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-bold capitalize">{dayjs(day).format("dddd, DD/MM")}</span>
                    <span className="text-muted-foreground text-xs">
                      {logsForDay.length} món ăn đã ghi
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-bold">{dayCalories} kcal</p>
                    </div>
                    {logsForDay.length === 0 && <AddFoodLog dayPlan={day} onSuccess={refetch} />}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {(
                    [
                      E_MEAL_TYPE.BREAKFAST,
                      E_MEAL_TYPE.LUNCH,
                      E_MEAL_TYPE.DINNER,
                      E_MEAL_TYPE.SNACK,
                    ] as const
                  ).map((meal) => {
                    const logsForMeal = logsForDay.filter((log) => log.meal_type === meal);
                    const mealCalories = logsForMeal.reduce((sum, log) => sum + log.calories, 0);

                    return (
                      <Card key={meal} className="bg-muted/50">
                        <CardHeader className="py-4">
                          <CardTitle className="flex items-center gap-2 text-base">
                            {getMealIcon(meal)}
                            Bữa {getMealLabel(meal)}
                            <span className="text-muted-foreground ml-auto text-sm font-normal">
                              {mealCalories} kcal
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                          {logsForMeal.length === 0 ? (
                            <p className="text-muted-foreground py-2 text-center text-sm italic">
                              Chưa có món ăn nào
                            </p>
                          ) : (
                            <div className="space-y-2 bg-white">
                              {logsForMeal.map((entry) => (
                                <div
                                  key={entry.id}
                                  className="flex items-center justify-between rounded-md border p-2 text-sm"
                                >
                                  <div>
                                    <p className="font-medium">{entry.name}</p>
                                    <p className="text-muted-foreground text-xs">
                                      P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fat}g
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium">{entry.calories} kcal</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => setDeleteId(entry.id!)}
                                    >
                                      <Trash2 className="text-destructive h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      <LoadingPage isOpen={isLoading || isDeleting} />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa món ăn này khỏi nhật ký không? Hành động này không thể hoàn
              tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
