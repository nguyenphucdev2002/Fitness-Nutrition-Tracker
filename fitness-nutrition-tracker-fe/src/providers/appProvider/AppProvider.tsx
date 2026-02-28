"use client";
import { useGetUserInfo } from "@/api";
import { LoadingPage } from "@/components";
import { MainLayout } from "@/components/layout/MainLayout";
import { E_LOCAL_STORAGE } from "@/enums";
import { UserInfoType } from "@/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { toast } from "sonner";

interface AppContextProps {
  user?: UserInfoType;
  setUser: Dispatch<SetStateAction<UserInfoType | undefined>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfoType>();
  const router = useRouter();

  const { data, error, isLoading } = useGetUserInfo();

  const logout = () => {
    // localStorage.removeItem(E_LOCAL_STORAGE.APP_NAME);
    router.replace("/auth");
    toast.error("Vui lòng đăng nhập để sử dụng ứng dụng.", {
      id: "auth-required",
    });
  };

  useEffect(() => {
    if (isLoading) return;

    if (error) {
      logout();
      return;
    }

    if (data) {
      setUser(data.user);
      localStorage.setItem(
        E_LOCAL_STORAGE.APP_NAME,
        JSON.stringify({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        })
      );
      return;
    }

    const raw = localStorage.getItem(E_LOCAL_STORAGE.APP_NAME);
    if (!raw) {
      logout();
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!parsed?.access_token) {
        logout();
      }
    } catch {
      logout();
    }
  }, [isLoading, data, error]);

  return (
    <>
      <AppContext.Provider value={{ user, setUser }}>
        <MainLayout>{children}</MainLayout>
      </AppContext.Provider>
      <LoadingPage isOpen={isLoading} />
    </>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return ctx;
};
