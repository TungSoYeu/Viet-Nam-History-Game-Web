const theme4Modes = [
  {
    id: "turning-page",
    name: "Lật mở trang sử",
    desc: "Mở 10 bức ảnh bí ẩn qua 40 dữ kiện của Chủ đề 4.",
    longDesc:
      "Mỗi bức ảnh là một ẩn số lịch sử gắn với anh hùng dân tộc, nhân vật lịch sử, di tích hoặc địa danh tiêu biểu trước năm 1945. Ảnh được chia thành lưới 2x2 với 4 mảnh ghép; học sinh giải đúng từng dữ kiện để lật mở ảnh và xác định chính xác đáp án.",
    path: "/reveal-picture",
    bgImage: "/assets/images/bg-reveal-history.svg",
    gradient:
      "linear-gradient(135deg, rgba(79, 70, 229, 0.8), rgba(99, 102, 241, 0.8))",
    stats: "10 ảnh bí ẩn | 40 dữ kiện",
    rewardText: "Tối đa 100 XP",
  },
  {
    id: "understanding-teammates",
    name: "Hiểu ý đồng đội",
    desc: "5 gói đoán ý với 50 từ khóa lịch sử trọng tâm.",
    longDesc:
      "Đây là một trò chơi tương tác trực tiếp giữa học sinh. Mỗi gói có 10 từ khóa thuộc các nhóm: nhân vật lịch sử, sự kiện hoặc phong trào, địa danh hoặc trận đánh, và khái niệm hay thuật ngữ quan trọng của Chủ đề 4.",
    path: "/pvp",
    bgImage: "/assets/images/bg-pvp-teamwork.svg",
    gradient:
      "linear-gradient(135deg, rgba(219, 39, 119, 0.8), rgba(236, 72, 153, 0.8))",
    stats: "5 gói | 10 từ/gói",
    rewardText: "Hoạt động lớp học",
  },
  {
    id: "historical-recognition",
    name: "Nhận diện lịch sử",
    desc: "Gồm 2 mode nhỏ: hình ảnh, lược đồ -> từ khóa và từ khóa -> hình ảnh.",
    longDesc:
      "Mode 3 được tách thành 2 mode nhỏ riêng. Người chơi chọn một nhánh trước khi bắt đầu: quan sát hình ảnh hoặc lược đồ để nhận diện từ khóa lịch sử, hoặc đọc hệ thống từ khóa gợi ý để nhận diện đúng hình ảnh, nhân vật, địa danh hay sự kiện tương ứng.",
    path: "/guess-character",
    bgImage: "/assets/images/bg-recognition-scan.svg",
    gradient:
      "linear-gradient(135deg, rgba(13, 148, 136, 0.8), rgba(20, 184, 166, 0.8))",
    stats: "2 mode nhỏ | 5 câu/mode",
    rewardText: "10 XP / đáp án đúng",
  },
  {
    id: "connecting-history",
    name: "Kết nối lịch sử",
    desc: "Nối hình ảnh - thông tin và thông tin - thông tin.",
    longDesc:
      "Gồm 10 câu kết nối: 5 câu nối hình ảnh với thông tin phù hợp và 5 câu nối thông tin với thông tin. Mỗi câu thường có 5 đáp án đúng và 1 phương án nhiễu để tăng yêu cầu phân tích.",
    path: "/matching",
    bgImage: "/assets/images/bg-matching-links.svg",
    gradient:
      "linear-gradient(135deg, rgba(22, 163, 74, 0.8), rgba(34, 197, 94, 0.8))",
    stats: "10 câu | 1 phương án nhiễu",
    rewardText: "10 XP / cặp đúng",
  },
  {
    id: "crossword-decoding",
    name: "Giải mã ô chữ",
    desc: "Giải hàng ngang để tìm từ khóa trung tâm hàng dọc.",
    longDesc:
      "Trò chơi gồm 5 từ khóa hàng dọc. Mỗi từ khóa có từ 5 đến 10 câu hỏi hàng ngang; mỗi câu trả lời đúng sẽ mở thêm dữ kiện để học sinh suy luận ra từ khóa trung tâm.",
    path: "/millionaire",
    bgImage: "/assets/images/bg-crossword-amber.svg",
    gradient:
      "linear-gradient(135deg, rgba(202, 138, 4, 0.8), rgba(234, 179, 8, 0.8))",
    stats: "5 ô chữ | 5-10 hàng ngang",
    rewardText: "Điểm theo từng hàng",
  },
  {
    id: "historical-flow",
    name: "Dòng chảy lịch sử",
    desc: "Phân loại dữ kiện vào đúng dòng chảy của sự kiện lịch sử.",
    longDesc:
      "Học sinh nhận diện và kéo thả các dữ kiện vào 4 nhóm: Bối cảnh, Diễn biến, Kết quả - Ý nghĩa và Di sản để lại. Trò chơi giúp tái hiện tiến trình sự kiện lịch sử một cách có hệ thống.",
    path: "/chronological",
    bgImage: "/assets/images/bg-flow-timeline.svg",
    gradient:
      "linear-gradient(135deg, rgba(124, 58, 237, 0.8), rgba(139, 92, 246, 0.8))",
    stats: "4 tiêu chí | kéo thả dữ kiện",
    rewardText: "Thưởng khi xếp trọn bộ",
  },
  {
    id: "lightning-fast",
    name: "Nhanh như chớp",
    desc: "30 câu nhận biết với đồng hồ đếm ngược và chuỗi lửa.",
    longDesc:
      "Giữ cấu trúc hỏi nhanh liên tiếp như chế độ cũ, đồng thời thêm nhịp thời gian 10 giây và chuỗi lửa theo số câu đúng liên tiếp để tăng áp lực phản xạ và độ sinh động khi chơi.",
    path: "/time-attack",
    bgImage: "/assets/images/bg-lightning-flame.svg",
    gradient:
      "linear-gradient(135deg, rgba(37, 99, 235, 0.8), rgba(59, 130, 246, 0.8))",
    stats: "30 câu | 60s + 10s",
    rewardText: "XP thưởng theo chuỗi đúng liên tiếp",
  },
  {
    id: "picture-puzzle",
    name: "Đuổi hình bắt chữ",
    desc: "Ghép từ khóa từ 2-4 hình ảnh để ra đáp án lịch sử.",
    longDesc:
      "Mỗi câu gồm từ 2 đến 4 hình ảnh. Học sinh xác định từ khóa của từng hình rồi ghép lại để tạo thành một nội dung lịch sử hoàn chỉnh như sự kiện, phong trào, địa danh, nhân vật hoặc khái niệm.",
    path: "/territory-map",
    bgImage: "/assets/images/bg-picture-puzzle.svg",
    gradient:
      "linear-gradient(135deg, rgba(234, 88, 12, 0.8), rgba(249, 115, 22, 0.8))",
    stats: "11 câu | 2-4 hình/câu",
    rewardText: "10 XP / đáp án đúng",
  },
];

module.exports = theme4Modes;
