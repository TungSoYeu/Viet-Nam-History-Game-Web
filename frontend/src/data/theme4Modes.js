export const theme4Modes = [
  {
    id: "turning-page",
    name: "Lật mở trang sử",
    desc: "Mỗi ảnh có 4 từ khóa, 4 câu hỏi và các lượt đoán nhanh theo thời gian.",
    longDesc:
      "Mỗi bức ảnh là một ẩn số lịch sử. Học sinh lần lượt mở 4 từ khóa qua 4 câu hỏi riêng biệt; mỗi lần mở được một từ khóa cũng đồng thời lật ra một góc của hình ảnh, sau đó có thêm 5 giây để đưa ra dự đoán như cách chơi gợi mở của Olympia.",
    path: "/reveal-picture",
    bgImage: "/assets/images/bg-reveal-history.svg",
    gradient:
      "linear-gradient(135deg, rgba(79, 70, 229, 0.8), rgba(99, 102, 241, 0.8))",
    stats: "10 ảnh | 4 từ khóa/ảnh",
    rewardText: "Tối đa 100 XP",
  },
  {
    id: "understanding-teammates",
    name: "Hiểu ý đồng đội",
    desc: "5 gói tổng hợp từ khóa với 30s chuẩn bị và 60s đoán.",
    longDesc:
      "Đây là trò chơi tương tác trực tiếp giữa học sinh theo cặp hoặc nhóm nhỏ. Mỗi gói gồm 10 từ khóa tổng hợp, được trộn nhiều dạng nội dung lịch sử để người gợi ý ghi nhớ trong 30 giây và người đoán trả lời liên tục trong 60 giây.",
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
    desc: "Kéo thả các thẻ dữ kiện rồi bấm hoàn thành mới chấm đúng sai.",
    longDesc:
      "Gồm 10 lượt kết nối: 5 lượt nối hình ảnh với thông tin phù hợp và 5 lượt nối thông tin với thông tin. Người chơi kéo thả toàn bộ thẻ trong thời gian giới hạn rồi bấm hoàn thành để hệ thống chấm một lượt.",
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
    desc: "Bảng ô chữ kiểu Olympia với các phần Ô chữ 1, Ô chữ 2...",
    longDesc:
      "Trò chơi gồm 5 phần ô chữ. Mỗi phần có các câu hỏi hàng ngang theo nhịp 15 giây, hiển thị dưới dạng bảng ô chữ để học sinh dần mở các ký tự của từ khóa hàng dọc.",
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
    desc: "Quan sát 2-4 hình và ghép đáp án trong 15 giây mỗi câu.",
    longDesc:
      "Mỗi câu gồm từ 2 đến 4 hình ảnh. Học sinh bấm bắt đầu để mở lượt 15 giây, xác định từ khóa của từng hình rồi ghép lại thành một nội dung lịch sử hoàn chỉnh như sự kiện, phong trào, địa danh, nhân vật hoặc khái niệm.",
    path: "/territory-map",
    bgImage: "/assets/images/bg-picture-puzzle.svg",
    gradient:
      "linear-gradient(135deg, rgba(234, 88, 12, 0.8), rgba(249, 115, 22, 0.8))",
    stats: "11 câu | 2-4 hình/câu",
    rewardText: "10 XP / đáp án đúng",
  },
];
