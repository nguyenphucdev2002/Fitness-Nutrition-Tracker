"use client";

import { E_LOCAL_STORAGE } from "@/enums";
import { useApp } from "@/providers";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogOut = () => {
  const { setUser } = useApp();
  const router = useRouter();

  const handleLogout = () => {
    setUser(undefined);
    localStorage.removeItem(E_LOCAL_STORAGE.APP_NAME);
    router.replace("/auth");
    toast.success("Đăng xuất thành công.");
  };

  return {
    handleLogout,
  };
};
