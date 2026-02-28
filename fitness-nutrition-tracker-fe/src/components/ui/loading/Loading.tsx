"use client";

import { Dumbbell, Heart, Activity, Zap } from "lucide-react";
type LoadingPageProps = {
  isOpen?: boolean;
};

export function LoadingPage({ isOpen }: LoadingPageProps) {
  if (!isOpen) return null;

  return (
    <div className="from-background via-background to-accent/30 fixed inset-0 z-100 flex min-h-screen items-center justify-center overflow-hidden bg-white/50">
      {/* Main Content */}
      <div className="relative z-10 space-y-8 px-4 text-center blur-none">
        {/* Logo with Pulse Animation */}
        <div className="relative inline-block">
          {/* Pulsing Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-primary/20 h-32 w-32 animate-ping rounded-full border-4" />
          </div>
          <div className="animation-delay-300 absolute inset-0 flex items-center justify-center">
            <div className="border-chart-1/20 h-40 w-40 animate-ping rounded-full border-4" />
          </div>

          {/* Main Logo */}
          <div className="from-primary via-primary to-chart-1 relative rounded-3xl bg-gradient-to-br p-6 shadow-2xl">
            <Dumbbell className="text-primary-foreground h-16 w-16 animate-bounce" />
          </div>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 className="from-primary via-chart-1 to-chart-4 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            FitTracker AI
          </h1>
          <p className="text-muted-foreground">Trợ lý sức khỏe thông minh của bạn</p>
        </div>

        {/* Loading Animation */}
        <div className="mx-auto max-w-xs space-y-4">
          {/* Animated Icons */}
          <div className="flex justify-center gap-4">
            <div className="animate-bounce" style={{ animationDelay: "0ms" }}>
              <Heart className="text-chart-1 fill-chart-1 h-6 w-6" />
            </div>
            <div className="animate-bounce" style={{ animationDelay: "150ms" }}>
              <Activity className="text-chart-4 h-6 w-6" />
            </div>
            <div className="animate-bounce" style={{ animationDelay: "300ms" }}>
              <Zap className="text-chart-5 fill-chart-5 h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-400 {
          animation-delay: 400ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
}
