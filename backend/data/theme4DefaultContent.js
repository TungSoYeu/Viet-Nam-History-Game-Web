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
      "Lật mở trang sử: 10 ảnh bí ẩn, mỗi ảnh 2x2 với 4 dữ kiện; tổng 40 dữ kiện và có gợi ý số chữ đáp án.",
      "Hiểu ý đồng đội: 5 gói, mỗi gói 10 từ khóa; ưu tiên tổ chức như hoạt động tương tác trực tiếp trên lớp.",
      "Nhận diện lịch sử: 2 mode nhỏ, mỗi mode 5 câu; gồm nhánh hình ảnh, lược đồ -> từ khóa và nhánh từ khóa -> hình ảnh.",
      "Kết nối lịch sử: 10 câu, gồm 5 nối hình ảnh - thông tin và 5 nối thông tin - thông tin, có 1 phương án nhiễu.",
      "Giải mã ô chữ: 5 từ khóa hàng dọc, mỗi từ khóa có từ 5 đến 10 câu hỏi hàng ngang.",
      "Dòng chảy lịch sử: kéo thả dữ kiện vào 4 tiêu chí bối cảnh, diễn biến, kết quả - ý nghĩa và di sản để lại.",
      "Nhanh như chớp: 30 câu nhận biết, 60 giây chính và thêm 10 giây nhịp nhanh, có chuỗi lửa theo số câu đúng liên tiếp.",
      "Đuổi hình bắt chữ: 11 câu, mỗi câu gồm 2 đến 4 hình ảnh để ghép thành đáp án lịch sử hoàn chỉnh.",
    ],
  },
  modeDataKeys: {
    "turning-page": "revealPictureSets",
    "understanding-teammates": "teammatePackages",
    "historical-recognition": "historicalRecognitionItems",
    "connecting-history": "connectingHistoryRounds",
    "crossword-decoding": "crosswordSets",
    "historical-flow": "historicalFlowSets",
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
