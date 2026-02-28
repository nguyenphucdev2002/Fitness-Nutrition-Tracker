"use client";

import { useState } from "react";
import {
  Users,
  MessageSquare,
  ThumbsUp,
  CheckCircle,
  TrendingUp,
  Edit,
  Trash2,
  Plus,
  Type,
  Layout,
  Save,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboard = ({ onNavigate }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "chats" | "interface" | "procedures" | "posts"
  >("dashboard");

  const stats = [
    {
      label: "Cuộc trò chuyện hôm nay",
      value: "1,234",
      icon: MessageSquare,
      color: "text-[#0A4FD5]",
    },
    { label: "Người dùng mới", value: "56", icon: Users, color: "text-[#3DDC84]" },
    { label: "Tỷ lệ hài lòng", value: "92%", icon: ThumbsUp, color: "text-yellow-600" },
    { label: "Thủ tục phổ biến", value: "24", icon: CheckCircle, color: "text-green-600" },
  ];

  const chartData = [
    { name: "T2", conversations: 400, users: 240 },
    { name: "T3", conversations: 500, users: 300 },
    { name: "T4", conversations: 450, users: 280 },
    { name: "T5", conversations: 600, users: 350 },
    { name: "T6", conversations: 800, users: 450 },
    { name: "T7", conversations: 700, users: 400 },
    { name: "CN", conversations: 500, users: 300 },
  ];

  const pieData = [
    { name: "Hộ tịch", value: 30, color: "#0A4FD5" },
    { name: "Đất đai", value: 25, color: "#3DDC84" },
    { name: "Kinh doanh", value: 20, color: "#F59E0B" },
    { name: "BHXH", value: 15, color: "#8B5CF6" },
    { name: "Khác", value: 10, color: "#EC4899" },
  ];

  const recentChats = [
    {
      id: "C-1001",
      user: "nguyen.a@email.com",
      category: "Đất đai",
      startTime: "2025-11-20 09:12",
      status: "Đang xử lý",
      model: "GovAI",
    },
    {
      id: "C-1002",
      user: "tran.b@email.com",
      category: "Hộ tịch",
      startTime: "2025-11-20 10:30",
      status: "Hoàn thành",
      model: "GPT-4.5",
    },
    {
      id: "C-1003",
      user: "le.c@email.com",
      category: "Kinh doanh",
      startTime: "2025-11-20 11:45",
      status: "Đang xử lý",
      model: "GovAI",
    },
    {
      id: "C-1004",
      user: "pham.d@email.com",
      category: "BHXH",
      startTime: "2025-11-20 13:20",
      status: "Hoàn thành",
      model: "GovAI",
    },
    {
      id: "C-1005",
      user: "hoang.e@email.com",
      category: "Thuế",
      startTime: "2025-11-20 14:15",
      status: "Đang xử lý",
      model: "GPT-4.5",
    },
  ];

  const featuredProcedures = [
    { id: "1", title: "Đăng ký kinh doanh", category: "Kinh doanh", views: 1250, featured: true },
    { id: "2", title: "Chuyển nhượng đất", category: "Đất đai", views: 980, featured: true },
    { id: "3", title: "Đăng ký khai sinh", category: "Hộ tịch", views: 850, featured: true },
    { id: "4", title: "Cấp giấy phép xây dựng", category: "Xây dựng", views: 720, featured: false },
    { id: "5", title: "Đăng ký BHXH", category: "BHXH", views: 650, featured: true },
  ];

  const blogPosts = [
    {
      id: "1",
      title: "Hướng dẫn đăng ký kinh doanh online 2025",
      author: "Admin",
      date: "2025-11-15",
      status: "published",
      views: 2340,
    },
    {
      id: "2",
      title: "Những lưu ý khi chuyển nhượng đất",
      author: "Admin",
      date: "2025-11-10",
      status: "published",
      views: 1890,
    },
    {
      id: "3",
      title: "Thủ tục đăng ký khai sinh mới nhất",
      author: "Admin",
      date: "2025-11-08",
      status: "draft",
      views: 0,
    },
    {
      id: "4",
      title: "Quy trình nộp thuế điện tử",
      author: "Editor",
      date: "2025-11-05",
      status: "published",
      views: 1560,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-8 py-6">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => onNavigate("home")} className="text-[#0A4FD5] hover:underline">
              ← Trang chủ
            </button>
            <button
              onClick={() => onNavigate("login")}
              className="text-sm text-red-600 transition-colors hover:text-red-700"
            >
              Đăng xuất
            </button>
          </div>
          <h1 className="mb-4 text-[#111827]">Quản trị hệ thống</h1>

          {/* Tabs */}
          <div className="flex gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`rounded-lg px-4 py-2 whitespace-nowrap transition-colors ${
                activeTab === "dashboard"
                  ? "bg-[#0A4FD5] text-white"
                  : "text-[#111827] hover:bg-[#F3F4F6]"
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab("chats")}
              className={`rounded-lg px-4 py-2 whitespace-nowrap transition-colors ${
                activeTab === "chats"
                  ? "bg-[#0A4FD5] text-white"
                  : "text-[#111827] hover:bg-[#F3F4F6]"
              }`}
            >
              Quản lý Chat
            </button>
            <button
              onClick={() => setActiveTab("interface")}
              className={`rounded-lg px-4 py-2 whitespace-nowrap transition-colors ${
                activeTab === "interface"
                  ? "bg-[#0A4FD5] text-white"
                  : "text-[#111827] hover:bg-[#F3F4F6]"
              }`}
            >
              Quản lý Giao diện
            </button>
            <button
              onClick={() => setActiveTab("procedures")}
              className={`rounded-lg px-4 py-2 whitespace-nowrap transition-colors ${
                activeTab === "procedures"
                  ? "bg-[#0A4FD5] text-white"
                  : "text-[#111827] hover:bg-[#F3F4F6]"
              }`}
            >
              Thủ tục Phổ biến
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`rounded-lg px-4 py-2 whitespace-nowrap transition-colors ${
                activeTab === "posts"
                  ? "bg-[#0A4FD5] text-white"
                  : "text-[#111827] hover:bg-[#F3F4F6]"
              }`}
            >
              Đăng Bài viết
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <stat.icon className={`h-10 w-10 ${stat.color}`} />
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="mb-1 text-3xl text-[#111827]">{stat.value}</div>
                  <div className="text-sm text-[#111827] opacity-70">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Line Chart */}
              <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
                <h2 className="mb-6 text-[#111827]">Hoạt động theo tuần</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="conversations"
                      stroke="#0A4FD5"
                      name="Cuộc trò chuyện"
                    />
                    <Line type="monotone" dataKey="users" stroke="#3DDC84" name="Người dùng" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-[#111827]">Phân bổ theo lĩnh vực</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* Chats Tab */}
        {activeTab === "chats" && (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-[#111827]">Danh sách cuộc trò chuyện</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#0A4FD5] focus:outline-none"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F3F4F6]">
                  <tr>
                    <th className="px-6 py-4 text-left text-[#111827]">ID</th>
                    <th className="px-6 py-4 text-left text-[#111827]">User</th>
                    <th className="px-6 py-4 text-left text-[#111827]">Lĩnh vực</th>
                    <th className="px-6 py-4 text-left text-[#111827]">Model AI</th>
                    <th className="px-6 py-4 text-left text-[#111827]">Bắt đầu</th>
                    <th className="px-6 py-4 text-left text-[#111827]">Trạng thái</th>
                    <th className="px-6 py-4 text-left text-[#111827]">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentChats.map((chat) => (
                    <tr key={chat.id} className="transition-colors hover:bg-[#F3F4F6]">
                      <td className="px-6 py-4 text-[#111827]">{chat.id}</td>
                      <td className="px-6 py-4 text-[#111827]">{chat.user}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-[#0A4FD5]/10 px-3 py-1 text-sm text-[#0A4FD5]">
                          {chat.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            chat.model === "GovAI"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {chat.model}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#111827] opacity-70">
                        {chat.startTime}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            chat.status === "Hoàn thành"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {chat.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-sm text-[#0A4FD5] hover:underline">
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Interface Management Tab */}
        {activeTab === "interface" && (
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[#111827]">Quản lý Giao diện</h2>
                <button className="flex items-center gap-2 rounded-lg bg-[#0A4FD5] px-6 py-2 text-white transition-colors hover:bg-[#083aa3]">
                  <Save className="h-5 w-5" />
                  Lưu thay đổi
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Logo & Branding */}
                <div className="rounded-lg border border-gray-200 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <h3 className="text-[#111827]">Logo & Branding</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm text-[#111827]">Tên ứng dụng</label>
                      <input
                        type="text"
                        defaultValue="GovAssist AI"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0A4FD5] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-[#111827]">Slogan</label>
                      <input
                        type="text"
                        defaultValue="Hỗ trợ thông tin thủ tục hành chính"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0A4FD5] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-[#111827]">Logo</label>
                      <button className="w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-2 transition-colors hover:border-[#0A4FD5]">
                        Tải lên logo mới
                      </button>
                    </div>
                  </div>
                </div>

                {/* Colors */}
                <div className="rounded-lg border border-gray-200 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Layout className="h-5 w-5 text-[#0A4FD5]" />
                    <h3 className="text-[#111827]">Màu sắc</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm text-[#111827]">
                        Màu chính (Primary)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          defaultValue="#0A4FD5"
                          className="h-10 w-16 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          defaultValue="#0A4FD5"
                          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0A4FD5] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-[#111827]">Màu phụ (Accent)</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          defaultValue="#3DDC84"
                          className="h-10 w-16 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          defaultValue="#3DDC84"
                          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0A4FD5] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-[#111827]">Màu nền</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          defaultValue="#F3F4F6"
                          className="h-10 w-16 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          defaultValue="#F3F4F6"
                          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0A4FD5] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Section */}
                <div className="rounded-lg border border-gray-200 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Type className="h-5 w-5 text-[#0A4FD5]" />
                    <h3 className="text-[#111827]">Trang chủ - Hero</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm text-[#111827]">Tiêu đề chính</label>
                      <textarea
                        defaultValue="AI hỗ trợ tư vấn thủ tục hành chính 24/7"
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0A4FD5] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-[#111827]">Mô tả</label>
                      <textarea
                        defaultValue="Giải đáp hồ sơ, giấy tờ, quy trình hành chính nhanh chóng và chính xác."
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0A4FD5] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="rounded-lg border border-gray-200 p-6">
                  <h3 className="mb-4 text-[#111827]">Footer</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm text-[#111827]">Thông tin liên hệ</label>
                      <input
                        type="text"
                        defaultValue="contact@govassist.vn"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0A4FD5] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-[#111827]">Địa chỉ</label>
                      <input
                        type="text"
                        placeholder="Nhập địa chỉ..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0A4FD5] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Featured Procedures Tab */}
        {activeTab === "procedures" && (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-[#111827]">Quản lý Thủ tục Phổ biến</h2>
              <button
                onClick={() => onNavigate("procedures")}
                className="flex items-center gap-2 rounded-lg bg-[#0A4FD5] px-6 py-2 text-white transition-colors hover:bg-[#083aa3]"
              >
                <Plus className="h-5 w-5" />
                Thêm thủ tục
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F3F4F6]">
                  <tr>
                    <th className="px-6 py-4 text-left text-[#111827]">ID</th>
                    <th className="px-6 py-4 text-left text-[#111827]">Tên thủ tục</th>
                    <th className="px-6 py-4 text-left text-[#111827]">Lĩnh vực</th>
                    <th className="px-6 py-4 text-left text-[#111827]">Lượt xem</th>
                    <th className="px-6 py-4 text-left text-[#111827]">Nổi bật</th>
                    <th className="px-6 py-4 text-left text-[#111827]">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {featuredProcedures.map((proc) => (
                    <tr key={proc.id} className="transition-colors hover:bg-[#F3F4F6]">
                      <td className="px-6 py-4 text-[#111827]">{proc.id}</td>
                      <td className="px-6 py-4 text-[#111827]">{proc.title}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-[#0A4FD5]/10 px-3 py-1 text-sm text-[#0A4FD5]">
                          {proc.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#111827]">{proc.views}</td>
                      <td className="px-6 py-4">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            defaultChecked={proc.featured}
                            className="peer sr-only"
                          />
                          <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#0A4FD5] peer-focus:ring-4 peer-focus:ring-[#0A4FD5]/20 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                        </label>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="rounded p-2 transition-colors hover:bg-[#F3F4F6]">
                            <Edit className="h-4 w-4 text-[#0A4FD5]" />
                          </button>
                          <button className="rounded p-2 transition-colors hover:bg-[#F3F4F6]">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Blog Posts Tab */}
        {activeTab === "posts" && (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-[#111827]">Quản lý Bài viết</h2>
              <button className="flex items-center gap-2 rounded-lg bg-[#0A4FD5] px-6 py-2 text-white transition-colors hover:bg-[#083aa3]">
                <Plus className="h-5 w-5" />
                Tạo bài viết mới
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F3F4F6]">
                  <tr>
                    <th className="px-6 py-4 text-left text-[#111827]">ID</th>
                    <th className="px-6 py-4 text-left text-[#111827]">Tiêu đề</th>
                    <th className="px-6 py-4 text-left text-[#111827]">Tác giả</th>
                    <th className="px-6 py-4 text-left text-[#111827]">Ngày đăng</th>
                    <th className="px-6 py-4 text-left text-[#111827]">Trạng thái</th>
                    <th className="px-6 py-4 text-left text-[#111827]">Lượt xem</th>
                    <th className="px-6 py-4 text-left text-[#111827]">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {blogPosts.map((post) => (
                    <tr key={post.id} className="transition-colors hover:bg-[#F3F4F6]">
                      <td className="px-6 py-4 text-[#111827]">{post.id}</td>
                      <td className="px-6 py-4 text-[#111827]">{post.title}</td>
                      <td className="px-6 py-4 text-[#111827] opacity-70">{post.author}</td>
                      <td className="px-6 py-4 text-sm text-[#111827] opacity-70">{post.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            post.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.status === "published" ? "Đã đăng" : "Nháp"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#111827]">{post.views}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="rounded p-2 transition-colors hover:bg-[#F3F4F6]">
                            <Edit className="h-4 w-4 text-[#0A4FD5]" />
                          </button>
                          <button className="rounded p-2 transition-colors hover:bg-[#F3F4F6]">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
