"use client";

import { Search } from "lucide-react";

export const SearchSection = () => {
  return (
    <div className="mb-6 rounded border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
      <div className="flex gap-3">
        <div className="flex flex-1 items-center gap-3 rounded border border-gray-300 bg-white px-4 py-3">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm văn bản"
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>
        <button className="flex items-center gap-2 rounded bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
          <Search size={16} />
          Tìm kiếm
        </button>
      </div>
    </div>
  );
}
