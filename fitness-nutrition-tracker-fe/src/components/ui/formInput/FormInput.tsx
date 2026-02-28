"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Label } from "../label";
import { Input } from "../input";

export const FormInput = ({
  label,
  icon: Icon,
  type,
  ...props
}: {
  label: string;
  icon: any;
  type?: string;
} & React.ComponentProps<typeof Input>) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="relative">
        <Icon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

        <Input
          {...props}
          type={isPassword && showPassword ? "text" : type}
          className="pr-10 pl-10"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};
