import { PropsWithChildren, useEffect, useState } from "react";
import { Header } from "../header";
import { Toaster } from "sonner";
import { DailyHealthCheckModal } from "../DailyHealthCheckModal";
import { hasAuditLogForCurrentWeek } from "@/lib/utils/helpers";
import { useApp } from "@/providers";

type MainLayoutProps = PropsWithChildren;

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useApp();
  const [isHealthCheckOpen, setIsHealthCheckOpen] = useState(false);

  useEffect(() => {
    if (!user || !user?.profile?.target?.goal) return;

    const hasLoggedToday = hasAuditLogForCurrentWeek(user?.profile?.target?.audit_log);

    if (!hasLoggedToday) {
      setIsHealthCheckOpen(true);
    }
  }, [user]);

  return (
    <>
      <div className="bg-background">
        {/* Header */}
        <Header />
        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-[1fr,350px]">
            <div>{children}</div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t">
          <div className="container mx-auto px-4 py-6">
            <p className="text-muted-foreground text-center text-sm">
              FitTracker AI - Trợ lý sức khỏe thông minh của bạn 💪
            </p>
          </div>
        </footer>
      </div>
      <Toaster />
      <DailyHealthCheckModal
        isOpen={isHealthCheckOpen}
        onClose={() => setIsHealthCheckOpen(false)}
      />
    </>
  );
};
