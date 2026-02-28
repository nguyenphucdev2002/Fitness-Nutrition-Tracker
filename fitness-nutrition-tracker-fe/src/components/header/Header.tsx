"use client";

import { Dumbbell, LogOut } from "lucide-react";
import { Button } from "../ui";
import { usePathname } from "next/navigation";
import { HEADER_PATH_HIDE, HEADERS } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useApp } from "@/providers";
import { useLogOut } from "@/hooks";

export const Header = () => {
  const pathname = usePathname();

  const { user } = useApp();
  const { handleLogout } = useLogOut();

  const isHidden = HEADER_PATH_HIDE.some((path) => pathname.startsWith(path));

  if (isHidden) {
    return null;
  }

  return (
    <header className="bg-background sticky top-0 z-10 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="text-primary h-8 w-8" />
            <h1 className="text-2xl">FitTracker AI</h1>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground hidden text-sm sm:inline">
                {user.name} • {user.profile?.weight_kg ?? 0}kg
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </Button>
            </div>
          )}
        </div>
      </div>
      <nav className="bg-background sticky z-10 border-b py-2">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {HEADERS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  href={item.href}
                  key={item.id}
                  className={cn(
                    "focus-visible:border-ring text-primary hover:bg-primary/90 focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-all outline-none hover:text-white focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                    isActive && "bg-primary text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};
