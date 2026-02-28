"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    "Chi thị",
    "Hiệp định",
    "Hiệp ước",
    "Lệnh",
    "Luật",
    "Nghị định",
    "Nghị quyết",
    "Nghị quyết liên",
    "Pháp lệnh",
    "Quyết định",
    "Thông tư",
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed right-6 bottom-32 z-30 rounded-full bg-[#8B6F47] p-3 text-white shadow-lg lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`${isOpen ? "block" : "hidden"} w-full flex-shrink-0 lg:block lg:w-80`}>
        {/* Search Box Title */}
        <div className="sticky top-0 z-20 rounded-t bg-[#8B6F47] p-4 text-center font-semibold text-white">
          LOẠI VĂN BẢN TRA CỨU
        </div>

        {/* Categories List */}
        <div className="space-y-3 rounded-b border border-gray-200 bg-white p-4 lg:p-6">
          <ul className="space-y-3">
            {categories.map((category) => (
              <li key={category}>
                <a
                  href="#"
                  className="hover:text-primary flex items-center gap-2 text-sm text-gray-700 transition hover:font-semibold"
                >
                  <span className="text-primary">•</span>
                  {category}
                </a>
              </li>
            ))}
          </ul>

          {/* Contact Info Box */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="space-y-2 rounded bg-gray-100 p-4 text-xs">
              <div>
                <span className="font-semibold text-gray-700">Điện thoại:</span>
                <div className="text-gray-600">84212111222212</div>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Email:</span>
                <div className="break-all text-gray-600">dev@gmail.com</div>
              </div>
            </div>
          </div>

          {/* Powered By */}
          <div className="mt-4 flex items-center justify-center gap-1 text-center text-xs text-gray-500">
            <span>🌐</span>
            <span>Powered by tawk.to</span>
          </div>

          {/* Footer Text */}
          <div className="mt-4 border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
            Nhập yêu cầu tại đây
          </div>
        </div>
      </aside>
    </>
  );
}
