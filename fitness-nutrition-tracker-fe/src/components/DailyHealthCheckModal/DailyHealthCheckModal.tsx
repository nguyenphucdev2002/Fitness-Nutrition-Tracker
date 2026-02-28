import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Calendar,
  Scale,
  Ruler,
  Activity,
  Moon,
  Zap,
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { HealthCheckEntryType } from "@/types/user.type";
import { toast } from "sonner";
import { useApp } from "@/providers";
import { useUpdateProfile } from "@/api";

interface DailyHealthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DailyHealthCheckModal({ isOpen, onClose }: DailyHealthCheckModalProps) {
  const { user, setUser } = useApp();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const previousChecks = user?.profile?.target?.audit_log || [];
  const lastCheck = previousChecks.length > 0 ? previousChecks[previousChecks.length - 1] : null;

  const [formData, setFormData] = React.useState({
    // Body measurements
    weight: user?.profile?.weight_kg,
    waist: lastCheck?.waist || undefined,
    chest: lastCheck?.chest || undefined,
    hips: lastCheck?.hips || undefined,
    biceps: lastCheck?.biceps || undefined,
    thighs: lastCheck?.thighs || undefined,
    bodyFatPercentage: lastCheck?.bodyFatPercentage || undefined,

    // Wellness metrics (1-5)
    energyLevel: 3,
    sleepQuality: 3,
    stressLevel: 3,
    appetiteLevel: 3,

    // Qualitative
    notes: "",
    challenges: "",
    achievements: "",
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!user?.profile) return;

    const today = new Date();
    const check: HealthCheckEntryType = {
      id: crypto.randomUUID(),
      date: today.toISOString().split("T")[0],
      weight: formData.weight,
      waist: formData.waist,
      chest: formData.chest,
      hips: formData.hips,
      biceps: formData.biceps,
      thighs: formData.thighs,
      bodyFatPercentage: formData.bodyFatPercentage,
      energyLevel: formData.energyLevel,
      sleepQuality: formData.sleepQuality,
      stressLevel: formData.stressLevel,
      appetiteLevel: formData.appetiteLevel,
      notes: formData.notes,
      challenges: formData.challenges,
      achievements: formData.achievements,
      created_at: new Date().toISOString(),
    };

    const existingAuditLog = user.profile.target?.audit_log || [];
    const { updated_at, ...profileWithoutTimestamp } = user.profile;
    const updatedProfile = {
      ...profileWithoutTimestamp,
      weight_kg: formData.weight || user.profile.weight_kg,
      target: {
        ...user.profile.target,
        audit_log: [...existingAuditLog, check],
      },
    };

    updateProfile(updatedProfile, {
      onSuccess: (data) => {
        setUser({
          ...user,
          profile: data,
        });
        toast.success("Đã lưu cập nhật sức khỏe!", {
          description: "Tiếp tục duy trì nỗ lực nhé! 💪",
        });
        onClose();
      },
      onError: (err) => {
        console.error(err);
        toast.error("Có lỗi xảy ra khi lưu cập nhật");
      },
    });
  };

  const handleSkipThisWeek = () => {
    toast.info("Đã bỏ qua lần cập nhật này", {
      description: "Nhớ cập nhật vào lần sau nhé!",
    });
    onClose();
  };

  const getChangeIndicator = (current: number, previous: number | undefined) => {
    if (!previous) return null;
    const diff = current - previous;
    if (Math.abs(diff) < 0.1) {
      return (
        <Badge variant="outline" className="gap-1">
          <Minus className="h-3 w-3" /> Không đổi
        </Badge>
      );
    }
    if (diff > 0) {
      return (
        <Badge variant="outline" className="gap-1 text-orange-600">
          <TrendingUp className="h-3 w-3" /> +{diff.toFixed(1)}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1 text-green-600">
        <TrendingDown className="h-3 w-3" /> {diff.toFixed(1)}
      </Badge>
    );
  };

  const getRatingLabel = (value: number, type: "energy" | "sleep" | "stress" | "appetite") => {
    const labels = {
      energy: ["Rất thấp", "Thấp", "Trung bình", "Tốt", "Rất tốt"],
      sleep: ["Rất kém", "Kém", "Tạm ổn", "Tốt", "Rất tốt"],
      stress: ["Rất thấp", "Thấp", "Trung bình", "Cao", "Rất cao"],
      appetite: ["Rất kém", "Kém", "Bình thường", "Tốt", "Rất tốt"],
    };
    return labels[type][value - 1] || "";
  };

  const getRatingColor = (value: number, type: "energy" | "sleep" | "stress" | "appetite") => {
    if (type === "stress") {
      // For stress, lower is better
      if (value <= 2) return "text-green-600";
      if (value === 3) return "text-yellow-600";
      return "text-red-600";
    } else {
      // For others, higher is better
      if (value >= 4) return "text-green-600";
      if (value === 3) return "text-yellow-600";
      return "text-red-600";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Calendar className="text-primary h-6 w-6" />
            <DialogTitle className="text-2xl">Cập nhật sức khỏe hàng tuần</DialogTitle>
          </div>
          <DialogDescription>
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="body" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="body">Thể trạng</TabsTrigger>
            <TabsTrigger value="wellness">Sức khỏe</TabsTrigger>
            <TabsTrigger value="notes">Ghi chú</TabsTrigger>
          </TabsList>

          <TabsContent value="body" className="mt-4 space-y-4">
            {/* Weight */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="text-primary h-5 w-5" />
                    <CardTitle className="text-base">Cân nặng</CardTitle>
                  </div>
                  {lastCheck &&
                    formData.weight &&
                    getChangeIndicator(formData.weight, lastCheck.weight)}
                </div>
                <CardDescription>Cân nặng hiện tại của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => updateField("weight", parseFloat(e.target.value))}
                    step="0.1"
                    min="30"
                    max="300"
                    className="h-14 text-center text-2xl"
                  />
                  <span className="text-muted-foreground text-xl">kg</span>
                </div>
                {lastCheck && (
                  <p className="text-muted-foreground mt-2 text-sm">
                    Tuần trước: {lastCheck.weight} kg
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Body Measurements */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Ruler className="text-primary h-5 w-5" />
                  <CardTitle className="text-base">Số đo cơ thể</CardTitle>
                </div>
                <CardDescription>Các vòng đo (tùy chọn)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="waist">Vòng eo (cm)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="waist"
                        type="number"
                        value={formData.waist || ""}
                        onChange={(e) =>
                          updateField(
                            "waist",
                            e.target.value ? parseFloat(e.target.value) : undefined
                          )
                        }
                        step="0.1"
                        placeholder="VD: 75"
                      />
                      {lastCheck?.waist &&
                        formData.waist &&
                        getChangeIndicator(formData.waist, lastCheck.waist)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chest">Vòng ngực (cm)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="chest"
                        type="number"
                        value={formData.chest || ""}
                        onChange={(e) =>
                          updateField(
                            "chest",
                            e.target.value ? parseFloat(e.target.value) : undefined
                          )
                        }
                        step="0.1"
                        placeholder="VD: 90"
                      />
                      {lastCheck?.chest &&
                        formData.chest &&
                        getChangeIndicator(formData.chest, lastCheck.chest)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hips">Vòng mông (cm)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="hips"
                        type="number"
                        value={formData.hips || ""}
                        onChange={(e) =>
                          updateField(
                            "hips",
                            e.target.value ? parseFloat(e.target.value) : undefined
                          )
                        }
                        step="0.1"
                        placeholder="VD: 95"
                      />
                      {lastCheck?.hips &&
                        formData.hips &&
                        getChangeIndicator(formData.hips, lastCheck.hips)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="biceps">Vòng tay (cm)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="biceps"
                        type="number"
                        value={formData.biceps || ""}
                        onChange={(e) =>
                          updateField(
                            "biceps",
                            e.target.value ? parseFloat(e.target.value) : undefined
                          )
                        }
                        step="0.1"
                        placeholder="VD: 30"
                      />
                      {lastCheck?.biceps &&
                        formData.biceps &&
                        getChangeIndicator(formData.biceps, lastCheck.biceps)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thighs">Vòng đùi (cm)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="thighs"
                        type="number"
                        value={formData.thighs || ""}
                        onChange={(e) =>
                          updateField(
                            "thighs",
                            e.target.value ? parseFloat(e.target.value) : undefined
                          )
                        }
                        step="0.1"
                        placeholder="VD: 55"
                      />
                      {lastCheck?.thighs &&
                        formData.thighs &&
                        getChangeIndicator(formData.thighs, lastCheck.thighs)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bodyFat">% Body Fat</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="bodyFat"
                        type="number"
                        value={formData.bodyFatPercentage || ""}
                        onChange={(e) =>
                          updateField(
                            "bodyFatPercentage",
                            e.target.value ? parseFloat(e.target.value) : undefined
                          )
                        }
                        step="0.1"
                        placeholder="VD: 20"
                      />
                      {lastCheck?.bodyFatPercentage &&
                        formData.bodyFatPercentage &&
                        getChangeIndicator(formData.bodyFatPercentage, lastCheck.bodyFatPercentage)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wellness" className="mt-4 space-y-4">
            {/* Energy Level */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-base">Mức năng lượng</CardTitle>
                </div>
                <CardDescription>Cảm giác năng lượng trong tuần qua</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Đánh giá</Label>
                    <span
                      className={`font-semibold ${getRatingColor(formData.energyLevel, "energy")}`}
                    >
                      {getRatingLabel(formData.energyLevel, "energy")}
                    </span>
                  </div>
                  <Slider
                    value={[formData.energyLevel]}
                    onValueChange={([value]) => updateField("energyLevel", value)}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-muted-foreground flex justify-between text-xs">
                    <span>Rất thấp</span>
                    <span>Rất tốt</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sleep Quality */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-base">Chất lượng giấc ngủ</CardTitle>
                </div>
                <CardDescription>Chất lượng giấc ngủ trong tuần qua</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Đánh giá</Label>
                    <span
                      className={`font-semibold ${getRatingColor(formData.sleepQuality, "sleep")}`}
                    >
                      {getRatingLabel(formData.sleepQuality, "sleep")}
                    </span>
                  </div>
                  <Slider
                    value={[formData.sleepQuality]}
                    onValueChange={([value]) => updateField("sleepQuality", value)}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-muted-foreground flex justify-between text-xs">
                    <span>Rất kém</span>
                    <span>Rất tốt</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stress Level */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-500" />
                  <CardTitle className="text-base">Mức độ stress</CardTitle>
                </div>
                <CardDescription>Mức độ căng thẳng trong tuần qua</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Đánh giá</Label>
                    <span
                      className={`font-semibold ${getRatingColor(formData.stressLevel, "stress")}`}
                    >
                      {getRatingLabel(formData.stressLevel, "stress")}
                    </span>
                  </div>
                  <Slider
                    value={[formData.stressLevel]}
                    onValueChange={([value]) => updateField("stressLevel", value)}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-muted-foreground flex justify-between text-xs">
                    <span>Rất thấp</span>
                    <span>Rất cao</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appetite Level */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <CardTitle className="text-base">Cảm giác thèm ăn</CardTitle>
                </div>
                <CardDescription>Khẩu vị và cảm giác thèm ăn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Đánh giá</Label>
                    <span
                      className={`font-semibold ${getRatingColor(formData.appetiteLevel, "appetite")}`}
                    >
                      {getRatingLabel(formData.appetiteLevel, "appetite")}
                    </span>
                  </div>
                  <Slider
                    value={[formData.appetiteLevel]}
                    onValueChange={([value]) => updateField("appetiteLevel", value)}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-muted-foreground flex justify-between text-xs">
                    <span>Rất kém</span>
                    <span>Rất tốt</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ghi chú chung</CardTitle>
                <CardDescription>Cảm giác và suy nghĩ của bạn tuần này</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Ví dụ: Tuần này cảm thấy khỏe hơn, tinh thần tốt..."
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thành tựu đạt được</CardTitle>
                <CardDescription>Những điều tích cực bạn đã làm được</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.achievements}
                  onChange={(e) => updateField("achievements", e.target.value)}
                  placeholder="Ví dụ: Tập đủ 5 buổi, giảm được 0.5kg, ăn uống điều độ..."
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Khó khăn gặp phải</CardTitle>
                <CardDescription>Những thử thách cần khắc phục</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.challenges}
                  onChange={(e) => updateField("challenges", e.target.value)}
                  placeholder="Ví dụ: Khó kiểm soát ăn vặt, thiếu động lực, stress công việc..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 border-t pt-4">
          <Button
            onClick={handleSkipThisWeek}
            variant="ghost"
            className="flex-1"
            disabled={isPending}
          >
            Bỏ qua lần này
          </Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={isPending}>
            {isPending ? "Đang lưu..." : "Lưu cập nhật"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
