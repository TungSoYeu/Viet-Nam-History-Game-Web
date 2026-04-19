export const theme4ModeGuides = {
  turningPage: {
    objective: "Lật mở các mảnh ghép thông qua việc trả lời đúng câu hỏi để xác định nhân vật, di tích hoặc sự kiện.",
    rules: [
      "10 ảnh bí ẩn, mỗi ảnh có 4 mảnh ghép.",
      "Mỗi mảnh tương ứng với 1 dữ kiện gợi ý.",
      "Giải đúng dữ kiện để mở mảnh ghép và đoán ảnh cuối cùng."
    ],
    scoring: "Đoán ảnh càng sớm, điểm càng cao.",
    sample: "'Khởi nghĩa Lam Sơn bùng nổ năm nào?' -> '1418' -> Ảnh: 'Lê Lợi'."
  },
  teammate: {
    objective: "Phối hợp đồng đội để hiểu ý và đoán từ khóa lịch sử.",
    rules: [
      "6 gói câu hỏi, mỗi gói 10 từ khóa.",
      "Người gợi ý có 30 giây để ghi nhớ, người đoán có 60 giây để xử lý gói.",
      "Từ nào chưa đoán được có thể bỏ qua và quay lại ở cuối hàng chờ."
    ],
    scoring: "Hoạt động lớp học rèn phản xạ, không đặt nặng điểm số.",
    sample: "Gợi ý: 'năm 981, đánh tan quân Tống trên sông lớn' -> Đoán: 'Lê Hoàn'."
  },
  recognition: {
    objective: "Nhận diện nhanh từ khóa hoặc hình ảnh, lược đồ lịch sử.",
    rules: [
      "Chọn 1 trong 2 mode: đoán hình hoặc đoán chữ.",
      "Mỗi chế độ có 5 câu hỏi, 15 giây/câu."
    ],
    scoring: "10 XP cho mỗi câu trả lời đúng.",
    sample: "Đọc dữ kiện 'Bình Ngô Sách' -> Chọn ảnh 'Nguyễn Trãi'."
  },
  connecting: {
    objective: "Nối hình ảnh với thông tin, hoặc thông tin với thông tin phù hợp.",
    rules: [
      "10 vòng chơi nối dữ kiện.",
      "Kéo thả các thẻ để tạo thành cặp tương ứng."
    ],
    scoring: "+10 XP cho mỗi cặp nối đúng.",
    sample: "Nối thẻ 'Lê Lợi' với thẻ 'Khởi nghĩa Lam Sơn'."
  },
  crossword: {
    objective: "Giải các hàng ngang để tìm ra từ khóa trung tâm hàng dọc.",
    rules: [
      "5 từ khóa dọc chính.",
      "Trả lời hàng ngang để mở các chữ cái gợi ý cho hàng dọc."
    ],
    scoring: "Tích điểm theo hàng ngang, thưởng mốc khi mở được từ khóa dọc.",
    sample: "Mở ra các chữ cái B, A, C -> Suy luận ra 'Bạch Đằng'."
  },
  flow: {
    objective: "Sắp xếp hệ thống sự kiện đúng vào quá trình lịch sử.",
    rules: [
      "Phân chia các sự kiện vào 4 nhóm: Bối cảnh, Diễn biến, Kết quả, Di sản.",
      "Kéo thả toàn bộ dữ kiện đầy đủ trước khi nộp.",
      "Mỗi câu có 60 giây để hoàn thành."
    ],
    scoring: "Nhận thưởng tổng cộng XP khi xếp đúng trọn bộ.",
    sample: "'1407 giặc Minh xâm lược' -> Nằm ở thẻ Bối cảnh."
  },
  lightning: {
    objective: "Trả lời siêu tốc các câu hỏi nhận biết để tạo chuỗi liên tiếp.",
    rules: [
      "30 câu hỏi nhận biết trong thời gian 70 giây.",
      "Trả lời đúng liên tiếp để thiết lập chuỗi lửa."
    ],
    scoring: "+10 XP mỗi câu, thưởng lớn theo chuỗi đúng liên tiếp.",
    sample: "Trả lời đúng 3 câu liên tục -> Nhận 3 ngọn lửa thưởng."
  },
  picturePuzzle: {
    objective: "Xem video rồi xếp các khung hình theo đúng diễn biến lịch sử.",
    rules: [
      "Mỗi lượt chơi gắn với một video tư liệu lịch sử.",
      "Sau khi xem, sắp xếp các khung hình từ sớm đến muộn theo đúng nội dung video.",
      "Có thể kiểm tra giữa chừng rồi tiếp tục chỉnh lại thứ tự nếu chưa đúng."
    ],
    scoring: "Hoàn thành đúng một lượt sắp xếp để nhận XP của video đó.",
    sample: "Xem video Trận Ngọc Hồi rồi xếp lại 10 khung hình theo đúng mạch tiến công của quân Tây Sơn."
  }
};

export const theme4ModeGuideKeys = {
  "turning-page": "turningPage",
  "understanding-teammates": "teammate",
  "historical-recognition": "recognition",
  "connecting-history": "connecting",
  "crossword-decoding": "crossword",
  "historical-flow": "flow",
  "lightning-fast": "lightning",
  "picture-puzzle": "picturePuzzle",
};

export const getTheme4ModeGuide = (modeId) => {
  const guideKey = theme4ModeGuideKeys[modeId];
  return guideKey ? theme4ModeGuides[guideKey] : null;
};
