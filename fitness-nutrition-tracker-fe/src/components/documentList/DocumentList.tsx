"use client";

export const DocumentList = () => {
  const documents = [
    {
      id: 1,
      number: "117/2025/NĐ-CP",
      title:
        "Quy định quản lý thuế đối với hoạt động kinh doanh trên nền tảng thương mại điện tử, nền tảng số của hộ, cá nhân",
      effectDate: "09/06/2025",
      effectiveFrom: "01/07/2025",
      effect: "Còn hiệu lực",
      updateDate: "01/10/2025",
      tags: ["Tóm tắt", "VB liên quan", "Hiệu lực", "Lược độ", "Tài về"],
    },
    {
      id: 2,
      number: "",
      title: "Bộ luật tổ tượng hình sư sửa đổi, bổ sung năm 2025",
      effectDate: "27/06/2025",
      effectiveFrom: "01/07/2025",
      effect: "Còn hiệu lực",
      updateDate: "28/08/2025",
      tags: ["Tóm tắt", "VB liên quan", "Hiệu lực", "Lược độ", "Tài về"],
    },
    {
      id: 3,
      number: "250/2025/NĐ-CP",
      title:
        "Quy định chi tiết việc thành lập và hoạt động của Hội động giám sát, Trình tư, thủ tục định",
      effectDate: "22/09/2025",
      effectiveFrom: "22/09/2025",
      effect: "Còn hiệu lực",
      updateDate: "22/09/2025",
      tags: ["Tóm tắt", "VB liên quan", "Hiệu lực", "Lược độ", "Tài về"],
    },
  ];

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="rounded border border-gray-200 bg-white p-4 transition hover:shadow-md lg:p-6"
        >
          <div className="flex gap-4">
            {/* Number */}
            <div className="flex-shrink-0 text-xl font-bold text-gray-400 lg:text-2xl">
              {doc.id}
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Title */}
              <h3 className="hover:text-primary mb-3 cursor-pointer text-base font-semibold text-gray-900 lg:text-lg">
                {doc.title}
              </h3>

              {/* Tags/Links */}
              <div className="mb-3 flex flex-wrap gap-3 text-xs text-gray-600">
                {doc.tags.map((tag) => (
                  <a key={tag} href="#" className="hover:text-primary text-gray-600 transition">
                    {tag}
                  </a>
                ))}
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 gap-3 text-xs lg:grid-cols-2">
                <div>
                  <span className="text-gray-600">Ban hành:</span>
                  <span className="ml-2 font-semibold text-red-600">{doc.effectDate}</span>
                </div>
                <div>
                  <span className="text-gray-600">Áp dụng:</span>
                  <span className="ml-2 font-semibold text-red-600">{doc.effectiveFrom}</span>
                </div>
                <div>
                  <span className="text-gray-600">Hiệu lực:</span>
                  <span className="ml-2 font-semibold text-orange-600">{doc.effect}</span>
                </div>
                <div>
                  <span className="text-gray-600">Cập nhật:</span>
                  <span className="ml-2 font-semibold text-red-600">{doc.updateDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
