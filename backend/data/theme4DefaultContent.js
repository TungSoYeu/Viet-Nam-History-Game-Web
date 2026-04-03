const theme4Modes = require("./theme4Modes");
const theme4GameData = require("./theme4GameData");

const theme4Content = {
  theme: {
    id: "theme-4",
    title: "Chủ đề 4: Chiến tranh bảo vệ Tổ quốc và giải phóng dân tộc",
    subtitle: "Trước Cách mạng tháng Tám năm 1945",
  },
  lessons: [
    "Bài 7: Khái quát về chiến tranh bảo vệ Tổ quốc trong lịch sử Việt Nam",
    "Bài 8: Một số cuộc khởi nghĩa và chiến tranh giải phóng trong lịch sử Việt Nam (từ thế kỉ III TCN đến cuối thế kỉ XIX)",
  ],
  requirements: {
    minQuestionsPerSection: 5,
    maxQuestionsPerSection: 10,
    imagePolicy: "Không sử dụng hình ảnh AI; phải dùng hình ảnh lịch sử chính thống, phổ biến và có giá trị.",
    notes: [
      "Lật Mở Trang Sử: 10 ảnh bí ẩn, mỗi ảnh 2x2 với 4 dữ kiện; tổng 40 dữ kiện và có gợi ý số chữ đáp án.",
      "Hiểu Ý Đồng Đội: 5 gói, mỗi gói 10 từ khóa; ưu tiên tổ chức như hoạt động tương tác trực tiếp trên lớp.",
      "Nhận Diện Lịch Sử: 10 nội dung, kết hợp nhận diện từ hình ảnh hoặc lược đồ và nhận diện từ hệ thống từ khóa.",
      "Kết Nối Lịch Sử: 10 câu, gồm 5 nối hình ảnh - thông tin và 5 nối thông tin - thông tin, có 1 phương án nhiễu.",
      "Giải Mã Ô Chữ: 5 từ khóa hàng dọc, mỗi từ khóa có từ 5 đến 10 câu hỏi hàng ngang.",
      "Dòng Chảy Lịch Sử: kéo thả dữ kiện vào 4 tiêu chí bối cảnh, diễn biến, kết quả - ý nghĩa và di sản để lại.",
      "Nhanh Như Chớp: 30 câu nhận biết, 60 giây chính và thêm 10 giây nhịp nhanh, có chuỗi lửa theo số câu đúng liên tiếp.",
      "Đuổi Hình Bắt Chữ: 10 câu, mỗi câu gồm 2 đến 4 hình ảnh để ghép thành đáp án lịch sử hoàn chỉnh.",
    ],
  },
  modeDataKeys: {
    "turning-page": "revealPictureSets",
    "understanding-teammates": "teammatePackages",
    "historical-recognition": "historicalRecognitionItems",
    "connecting-history": "connectingHistoryRounds",
    "crossword-decoding": "crosswordSets",
    "historical-flow": "historicalFlowSet",
    "lightning-fast": "lightningFastQuestions",
    "picture-puzzle": "picturePuzzleItems",
  },
  modes: theme4Modes,
  gameData: theme4GameData,
  meta: {
    version: "theme4-default-v2",
    source: "default",
  },
};

module.exports = {
  theme4Content,
  theme4Modes,
  theme4GameData,
};
