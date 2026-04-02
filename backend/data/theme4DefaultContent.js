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
      "Lật Mở Trang Sử: 5 hình ảnh, mỗi hình 6-9 câu hỏi.",
      "Hiểu Ý Đồng Đội: 5 gói, mỗi gói 10 từ khóa, 30 giây chuẩn bị, 60 giây thực hiện.",
      "Nhận Diện Lịch Sử: 5 câu hình ảnh và 3 câu lược đồ.",
      "Kết Nối Lịch Sử: 5 câu thông tin - thông tin và 5 câu hình ảnh - thông tin.",
      "Giải Mã Ô Chữ: 3 từ khóa, mỗi từ khóa 5 câu gợi mở.",
      "Dòng Chảy Lịch Sử: 10 câu có mốc thời gian, sắp xếp vào 4 dòng.",
      "Nhanh Như Chớp: 10 câu hỏi ngắn, 5-10 giây mỗi câu.",
      "Đuổi Hình Bắt Chữ: 10 câu hỏi bằng hình ảnh.",
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
    version: "theme4-default-v1",
    source: "default",
  },
};

module.exports = {
  theme4Content,
  theme4Modes,
  theme4GameData,
};
