// import { HeaderItemType } from "@/types/header.type";
import { Apple, Bot, Dumbbell, Home, TrendingUp, User } from "lucide-react";

// export const HEADERS: HeaderItemType[] = [
//   {
//     href: "/",
//     label: "Trang chủ",
//   },
//   {
//     href: "/thu-tuc",
//     label: "Thủ tục",
//   },
//   {
//     href: "/ho-tro",
//     label: "Hỗ trợ",
//   },
// ];

export const HEADERS = [
  { id: "dashboard", label: "Trang chủ", icon: Home, href: "/" },
  { id: "nutrition", label: "Dinh dưỡng", icon: Apple, href: "/nutrition" },
  { id: "workout", label: "Tập luyện", icon: Dumbbell, href: "/workout" },
  { id: "coach", label: "AI Coach", icon: Bot, href: "/coach" },
  { id: "progress", label: "Tiến độ", icon: TrendingUp, href: "/progress" },
  { id: "profile", label: "Hồ sơ", icon: User, href: "/profile" },
];

export const HEADER_PATH_HIDE = ["/auth"];
