export const theme4ModeGuides = {
  turningPage: {
    objective: "Trả lời đúng để mở dần 9 ô của ảnh lịch sử và đoán đúng nhân vật/sự kiện trước khi hết điểm.",
    rules: [
      "Mỗi ảnh có đúng 9 câu hỏi theo lưới 3x3.",
      "Mở ô bằng cách chọn ô và trả lời câu hỏi ẩn.",
      "Có thể đoán đáp án ảnh bất cứ lúc nào.",
    ],
    scoring: "Bắt đầu 100 XP. Trả lời đúng trừ ít điểm hơn trả lời sai. Đoán đúng ảnh kết thúc vòng và nhận XP còn lại.",
    sample: "Ô số 4: “Khởi nghĩa Lam Sơn bùng nổ năm nào?” -> “1418”.",
  },
  teammate: {
    objective: "Diễn đạt đúng 10 từ khóa theo gói, tối ưu phối hợp giữa người gợi ý và người đoán.",
    rules: [
      "30 giây chuẩn bị, 60 giây thực hiện.",
      "Mỗi gói có đúng 10 từ khóa.",
      "Hết giờ thì kết thúc gói hiện tại.",
    ],
    scoring: "Mode này ưu tiên phối hợp nên không chấm XP theo từng từ. Dùng để luyện tốc độ xử lý và độ rõ cách diễn đạt.",
    sample: "Từ khóa: “Chi Lăng”. Người gợi ý nêu mốc “1427”, người đoán chốt đáp án.",
  },
  recognition: {
    objective: "Nhận diện đúng nhân vật, địa danh hoặc lược đồ kháng chiến từ tư liệu lịch sử.",
    rules: [
      "Gồm 8 câu: 5 ảnh + 3 lược đồ.",
      "Có thể phóng to ảnh/lược đồ để quan sát.",
      "Chấp nhận nhiều biến thể đáp án hợp lệ.",
    ],
    scoring: "Mỗi câu đúng +10 XP. Kết thúc lượt sẽ cộng tổng XP đúng.",
    sample: "Lược đồ có mốc 1075-1077 và phòng tuyến sông -> “Kháng chiến chống Tống thời Lý”.",
  },
  connecting: {
    objective: "Nối đúng cặp dữ kiện để tái dựng quan hệ nhân vật - sự kiện và ảnh - thông tin.",
    rules: [
      "Có 2 vòng: thông tin-thông tin và ảnh-thông tin.",
      "Mỗi vòng 5 cặp nối.",
      "Sai thì chọn lại từ đầu cặp đó.",
    ],
    scoring: "Mỗi cặp đúng +10 XP. Hoàn thành đủ 10 cặp sẽ nhận tổng XP.",
    sample: "“Nam quốc sơn hà” -> “Lý Thường Kiệt”.",
  },
  crossword: {
    objective: "Giải đúng câu gợi mở để mở ký tự và giải mã từ khóa lịch sử cuối mỗi phần.",
    rules: [
      "3 phần, mỗi phần đúng 5 câu gợi mở.",
      "Mỗi câu đúng mở thêm ký tự.",
      "Sau 5 câu phải nhập từ khóa cuối.",
    ],
    scoring: "Câu gợi mở đúng +10 XP, giải đúng từ khóa +20 XP.",
    sample: "Sau 3 ký tự mở dần “B A ? ? ? ? ? ?”, suy luận từ khóa là “Bạch Đằng”.",
  },
  flow: {
    objective: "Xếp 10 câu sự kiện vào đúng 4 dòng: bối cảnh, diễn biến, kết quả, di sản.",
    rules: [
      "Mỗi câu bắt buộc có mốc thời gian.",
      "Đủ 10 câu mới được kiểm tra.",
      "Sai dòng sẽ báo rõ số câu sai.",
    ],
    scoring: "Xếp đúng toàn bộ nhận 100 XP.",
    sample: "“1407: Nhà Minh xâm lược...” -> Dòng Bối cảnh.",
  },
  lightning: {
    objective: "Trả lời nhanh chuỗi câu hỏi ngắn, tối đa hóa điểm thưởng theo tốc độ và combo.",
    rules: [
      "Mỗi câu có 8 giây.",
      "Chỉ chọn 1 đáp án cho mỗi câu.",
      "Hết giờ tính sai và mất combo.",
    ],
    scoring: "Điểm mỗi câu = 10 + thời gian còn lại + thưởng combo.",
    sample: "Trả lời đúng khi còn 6s và combo 2 -> điểm cao hơn câu đúng thường.",
  },
  picturePuzzle: {
    objective: "Nhìn ảnh và suy luận đáp án với hệ gợi ý nhiều tầng.",
    rules: [
      "Có đúng 10 câu ảnh.",
      "Mỗi câu có thể mở thêm gợi ý tầng 1/2.",
      "Đã trả lời thì khóa câu và chuyển câu tiếp.",
    ],
    scoring: "Mỗi câu đúng +10 XP. Dùng ít gợi ý hơn giúp nhận diện tốt hơn khi học.",
    sample: "Gợi ý tầng 1: “Tên gồm 2 từ”; tầng 2: “Bắt đầu bằng chữ L”.",
  },
};

