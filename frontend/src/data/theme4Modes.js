export const theme4Modes = [
  {
    id: "turning-page",
    name: "Lật Mở Trang Sử",
    desc: "Trả lời các câu hỏi để lật mở dần một hình ảnh lịch sử giá trị.",
    longDesc:
      "Giáo viên sử dụng 5 hình ảnh lịch sử chính thống, phổ biến và có giá trị làm nền cho trò chơi. Mỗi hình có cố định 9 câu hỏi theo lưới 3x3, mỗi câu trả lời đúng sẽ lật mở thêm một phần của trang sử.",
    path: "/reveal-picture",
    bgImage: "/assets/images/bg-reveal.jpg",
    gradient:
      "linear-gradient(135deg, rgba(79, 70, 229, 0.8), rgba(99, 102, 241, 0.8))",
    stats: "5 hình | 9 câu mỗi hình",
  },
  {
    id: "understanding-teammates",
    name: "Hiểu Ý Đồng Đội",
    desc: "5 gói từ khóa với thời gian chuẩn bị và thực hiện cố định.",
    longDesc:
      "Mỗi gói gồm 10 từ khóa. Người chơi có 30 giây chuẩn bị dự lệnh và 60 giây thực hiện để diễn đạt, nhận diện các từ khóa lịch sử.",
    path: "/pvp",
    bgImage: "/assets/images/bg-pvp.jpg",
    gradient:
      "linear-gradient(135deg, rgba(219, 39, 119, 0.8), rgba(236, 72, 153, 0.8))",
    stats: "5 gói | 10 từ khóa",
  },
  {
    id: "historical-recognition",
    name: "Nhận Diện Lịch Sử",
    desc: "Nhận diện địa danh, nhân vật và lược đồ lịch sử của Chủ đề 4.",
    longDesc:
      "Phần chơi gồm 5 câu nhận diện hình ảnh và 3 câu nhận diện lược đồ, tập trung vào địa danh, nhân vật và các cuộc kháng chiến, khởi nghĩa trước năm 1945.",
    path: "/guess-character",
    bgImage: "/assets/images/bg-character.jpg",
    gradient:
      "linear-gradient(135deg, rgba(13, 148, 136, 0.8), rgba(20, 184, 166, 0.8))",
    stats: "8 câu nhận diện",
  },
  {
    id: "connecting-history",
    name: "Kết Nối Lịch Sử",
    desc: "Nối thông tin với thông tin và hình ảnh với thông tin.",
    longDesc:
      "Phần chơi cố định 10 lượt nối: 5 câu nối thông tin - thông tin và 5 câu nối hình ảnh - thông tin. Có thêm dữ kiện nhiễu để tăng độ chính xác khi suy luận.",
    path: "/matching",
    bgImage: "/assets/images/bg-matching.jpg",
    gradient:
      "linear-gradient(135deg, rgba(22, 163, 74, 0.8), rgba(34, 197, 94, 0.8))",
    stats: "10 lượt nối",
  },
  {
    id: "crossword-decoding",
    name: "Giải Mã Ô Chữ",
    desc: "Tổng hợp dữ kiện để giải mã 3 từ khóa lịch sử.",
    longDesc:
      "Phần chơi gồm 3 từ khóa. Mỗi từ khóa có 5 câu hỏi gợi mở, người chơi phải tổng hợp dữ kiện để giải mã được từ khóa cuối cùng.",
    path: "/millionaire",
    bgImage: "/assets/images/bg-millionaire.jpg",
    gradient:
      "linear-gradient(135deg, rgba(202, 138, 4, 0.8), rgba(234, 179, 8, 0.8))",
    stats: "3 từ khóa | 5 câu mỗi từ",
  },
  {
    id: "historical-flow",
    name: "Dòng Chảy Lịch Sử",
    desc: "Sắp xếp 10 câu có mốc thời gian vào đúng 4 dòng lịch sử.",
    longDesc:
      "Người chơi nhận 10 câu sự kiện có bắt buộc mốc thời gian và phải xếp đúng vào 4 dòng: bối cảnh, diễn biến, kết quả - ý nghĩa và di sản.",
    path: "/chronological",
    bgImage: "/assets/images/bg-timeline.jpg",
    gradient:
      "linear-gradient(135deg, rgba(124, 58, 237, 0.8), rgba(139, 92, 246, 0.8))",
    stats: "10 câu | 4 dòng",
  },
  {
    id: "lightning-fast",
    name: "Nhanh Như Chớp",
    desc: "10 câu hỏi ngắn với thời gian trả lời rất ngắn.",
    longDesc:
      "Đây là phần chơi phản xạ nhanh gồm 10 câu hỏi ngắn. Mỗi câu chỉ có 5-10 giây suy nghĩ và trả lời.",
    path: "/time-attack",
    bgImage: "/assets/images/bg-time.jpg",
    gradient:
      "linear-gradient(135deg, rgba(37, 99, 235, 0.8), rgba(59, 130, 246, 0.8))",
    stats: "10 câu | 8 giây/câu",
  },
  {
    id: "picture-puzzle",
    name: "Đuổi Hình Bắt Chữ",
    desc: "Quan sát các hình ảnh lịch sử để tìm ra đáp án đúng.",
    longDesc:
      "Phần chơi cố định 10 câu hỏi bằng hình ảnh. Mỗi câu dùng ảnh chân dung, tượng đài hoặc tư liệu lịch sử chính thống gắn với Chủ đề 4.",
    path: "/territory-map",
    bgImage: "/assets/images/bg-territory.jpg",
    gradient:
      "linear-gradient(135deg, rgba(234, 88, 12, 0.8), rgba(249, 115, 22, 0.8))",
    stats: "10 câu hình ảnh",
  },
];
