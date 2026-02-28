import { UserProfile, DailyStats } from "../../types";

interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export const generateAICoachResponse = async (
  message: string,
  profile: UserProfile | null,
  todayStats: DailyStats | null
): Promise<string> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const lowerMessage = message.toLowerCase();

  // Greeting
  if (
    lowerMessage.includes("xin chào") ||
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi")
  ) {
    return "Xin chào! Tôi là trợ lý AI của bạn. Tôi ở đây để giúp bạn đạt được mục tiêu sức khỏe. Bạn cần hỗ trợ gì hôm nay?";
  }

  // Motivation
  if (
    lowerMessage.includes("mệt") ||
    lowerMessage.includes("không muốn") ||
    lowerMessage.includes("chán")
  ) {
    return "Tôi hiểu bạn đang cảm thấy mệt mỏi! Nhưng hãy nhớ rằng mỗi bước nhỏ đều quan trọng. Không cần phải hoàn hảo, chỉ cần bắt đầu. Ngay cả 10 phút tập luyện cũng tốt hơn không tập! 💪";
  }

  // Diet questions
  if (lowerMessage.includes("ăn gì") || lowerMessage.includes("món")) {
    if (profile?.goal === "lose-weight") {
      return "Để giảm cân hiệu quả, bạn nên:\n- Ưu tiên protein (thịt nạc, cá, trứng)\n- Rau xanh nhiều chất xơ\n- Carb phức hợp (gạo lứt, yến mạch)\n- Hạn chế đường và đồ chiên rán\n\nMột số gợi ý: Gỏi cuốn, cá nướng, salad ức gà, canh chua.";
    } else if (profile?.goal === "gain-muscle") {
      return "Để tăng cơ, bạn cần:\n- Protein cao (1.6-2g/kg cơ thể)\n- Carb đủ cho năng lượng\n- Ăn thặng dư calo vừa phải\n\nGợi ý: Cơm gà, bò bít tết, trứng, chuối, sữa, yến mạch.";
    }
    return "Hãy ăn cân đối các nhóm dinh dưỡng: protein, carbs, và chất béo lành mạnh. Ưu tiên thực phẩm tự nhiên, hạn chế đồ chế biến sẵn.";
  }

  // Workout questions
  if (
    lowerMessage.includes("tập") ||
    lowerMessage.includes("luyện") ||
    lowerMessage.includes("workout")
  ) {
    if (profile?.goal === "lose-weight") {
      return "Để giảm mỡ hiệu quả:\n- Kết hợp cardio (chạy, đạp xe) 3-4 lần/tuần\n- Tập tạ 2-3 lần/tuần để giữ cơ\n- HIIT giúp đốt cháy calo nhanh\n- Đi bộ nhiều trong ngày\n\nQuan trọng nhất: kiên trì và duy trì!";
    } else if (profile?.goal === "gain-muscle") {
      return "Để tăng cơ:\n- Tập tạ nặng 4-5 lần/tuần\n- Tập trung bài tập phức hợp (squat, deadlift, bench press)\n- Tăng tải trọng dần dần\n- Nghỉ ngơi đủ để cơ phục hồi\n- Ngủ 7-8 tiếng/đêm";
    }
    return "Hãy bắt đầu với mức độ phù hợp và tăng dần. Kết hợp cả cardio và tập lực cho hiệu quả tốt nhất!";
  }

  // Progress check
  if (
    lowerMessage.includes("tiến độ") ||
    lowerMessage.includes("kết quả") ||
    lowerMessage.includes("progress")
  ) {
    if (todayStats) {
      const netCalories = todayStats.caloriesIn - todayStats.caloriesOut;
      if (profile?.goal === "lose-weight") {
        if (netCalories < 0) {
          return `Tuyệt vời! Hôm nay bạn đã tạo thâm hụt calo ${Math.abs(netCalories)} kcal. Tiếp tục duy trì như vậy, bạn sẽ thấy kết quả sớm thôi! 🎉`;
        } else {
          return `Hôm nay bạn nạp thặng dư ${netCalories} kcal. Không sao, ngày mai cố gắng tập nhiều hơn hoặc ăn ít hơn một chút nhé!`;
        }
      }
      return `Hôm nay bạn đã nạp ${todayStats.caloriesIn} kcal và đốt cháy ${todayStats.caloriesOut} kcal. Đang làm rất tốt! 👍`;
    }
  }

  // Water
  if (lowerMessage.includes("nước") || lowerMessage.includes("water")) {
    return "Uống đủ nước rất quan trọng! Bạn nên uống:\n- Tối thiểu 2 lít/ngày\n- Thêm 500ml cho mỗi giờ tập luyện\n- Uống đều trong ngày, không chờ khát\n\nNước giúp: đẩy nhanh trao đổi chất, giảm cảm giác đói, tăng năng lượng.";
  }

  // Sleep
  if (lowerMessage.includes("ngủ") || lowerMessage.includes("sleep")) {
    return "Giấc ngủ rất quan trọng cho việc giảm cân và tăng cơ:\n- Ngủ 7-8 tiếng/đêm\n- Ngủ đúng giờ (trước 11h tối)\n- Tránh điện thoại trước khi ngủ\n\nThiếu ngủ làm tăng hormone gây đói và giảm hiệu quả tập luyện!";
  }

  // Default helpful response
  return "Câu hỏi hay đấy! Tôi có thể giúp bạn về:\n- Dinh dưỡng và chế độ ăn\n- Kế hoạch tập luyện\n- Động viên tinh thần\n- Theo dõi tiến độ\n- Lời khuyên về sức khỏe\n\nBạn muốn biết điều gì cụ thể?";
};

export const generateDailyTip = (profile: UserProfile | null): string => {
  const tips = [
    "Uống một cốc nước ngay sau khi thức dậy để kích hoạt trao đổi chất!",
    "Ăn chậm và nhai kỹ giúp não nhận tín hiệu no, tránh ăn quá nhiều.",
    "Đi bộ 10 phút sau bữa ăn giúp kiểm soát đường huyết tốt hơn.",
    "Chuẩn bị bữa ăn trước giúp bạn kiểm soát calo tốt hơn.",
    "Ngủ đủ 7-8 tiếng giúp cơ bắp phục hồi và giảm cân hiệu quả hơn.",
    "Đừng bỏ bữa sáng - nó là bữa ăn quan trọng nhất trong ngày!",
    "Tập luyện buổi sáng giúp tăng năng lượng cả ngày.",
    "Thay thế đồ uống có đường bằng nước lọc để giảm calo dễ dàng.",
    "Ăn nhiều rau xanh - ít calo nhưng nhiều dinh dưỡng và chất xơ.",
    "Đặt mục tiêu nhỏ mỗi tuần thay vì nghĩ về mục tiêu dài hạn.",
  ];

  return tips[Math.floor(Math.random() * tips.length)];
};

export const generateMotivationalMessage = (
  profile: UserProfile | null,
  stats: DailyStats
): string => {
  if (stats.workoutMinutes > 30) {
    return "🔥 Tuyệt vời! Bạn đã tập luyện tốt hôm nay! Tiếp tục phát huy nhé!";
  }

  if (stats.caloriesIn === 0) {
    return "📝 Hãy ghi lại bữa ăn của bạn để theo dõi tiến độ tốt hơn nhé!";
  }

  if (stats.water >= 2000) {
    return "💧 Tuyệt vời! Bạn đã uống đủ nước hôm nay!";
  }

  return "💪 Hãy bắt đầu ngày mới với năng lượng tích cực!";
};
