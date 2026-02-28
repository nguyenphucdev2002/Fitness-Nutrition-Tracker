"use client";

import React, { FormEvent, useState } from "react";
import { Dumbbell, Mail, Lock, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormInput,
  LoadingPage,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { useRegister, useLogin } from "@/api";
import { useRouter } from "next/navigation";
import { E_LOCAL_STORAGE } from "@/enums";
import { useApp } from "@/providers";

type AuthTab = "login" | "register";

type AuthFormState = {
  login: {
    email: string;
    password: string;
  };
  register: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
};

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");

  const router = useRouter();
  const { setUser } = useApp();

  const [form, setForm] = useState<AuthFormState>({
    login: {
      email: "",
      password: "",
    },
    register: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: login, isPending: isPendingLogin } = useLogin();
  const { mutate: register, isPending: isPendingRegister } = useRegister();

  const handleChange =
    (tab: AuthTab, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          [field]: e.target.value,
        },
      }));
    };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    login(
      {
        email: form.login.email,
        password: form.login.password,
      },
      {
        onSuccess: (data) => {
          localStorage.setItem(
            E_LOCAL_STORAGE.APP_NAME,
            JSON.stringify({ access_token: data.access_token, refresh_token: data.refresh_token })
          );
          setUser(data.user);

          if (!data.user?.profile?.target) {
            router.replace("/profile");
            toast.success("Vui lòng điền thông tin");
            return;
          }
          router.replace("/");
          toast.success("Đăng nhập thành công");
        },
        onError: () => {
          toast.error("Email hoặc mật khẩu không đúng.");
        },
      }
    );
  };

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();

    const { password, confirmPassword } = form.register;
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    register(
      {
        name: form.register.name,
        email: form.register.email,
        password,
      },
      {
        onSuccess: () => {
          toast.success("Đăng ký thành công");
          setActiveTab("login");
        },
        onError: () => toast.error("Đăng ký thất bại"),
      }
    );
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Dumbbell className="text-primary mx-auto mb-4 h-12 w-12" />
            <h1 className="mb-2 text-4xl">FitTracker AI</h1>
            <p className="text-muted-foreground">Trợ lý sức khỏe thông minh của bạn</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Chào mừng!</CardTitle>
              <CardDescription>Đăng nhập hoặc tạo tài khoản mới</CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AuthTab)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                  <TabsTrigger value="register">Đăng ký</TabsTrigger>
                </TabsList>

                {/* LOGIN */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <FormInput
                      label="Email"
                      icon={Mail}
                      type="email"
                      value={form.login.email}
                      onChange={handleChange("login", "email")}
                    />
                    <FormInput
                      label="Mật khẩu"
                      icon={Lock}
                      type="password"
                      value={form.login.password}
                      onChange={handleChange("login", "password")}
                    />

                    <Button type="submit" className="w-full" disabled={isPendingLogin}>
                      {isPendingLogin ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                  </form>
                </TabsContent>

                {/* REGISTER */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <FormInput
                      label="Họ và tên"
                      icon={UserIcon}
                      value={form.register.name}
                      onChange={handleChange("register", "name")}
                    />
                    <FormInput
                      label="Email"
                      icon={Mail}
                      type="email"
                      value={form.register.email}
                      onChange={handleChange("register", "email")}
                    />
                    <FormInput
                      label="Mật khẩu"
                      icon={Lock}
                      type="password"
                      value={form.register.password}
                      onChange={handleChange("register", "password")}
                    />
                    <FormInput
                      label="Xác nhận mật khẩu"
                      icon={Lock}
                      type="password"
                      value={form.register.confirmPassword}
                      onChange={handleChange("register", "confirmPassword")}
                    />

                    <Button type="submit" className="w-full" disabled={isPendingRegister}>
                      {isPendingRegister ? "Đang đăng ký..." : "Đăng ký"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <LoadingPage isOpen={isPendingRegister || isPendingLogin} />
    </>
  );
}
