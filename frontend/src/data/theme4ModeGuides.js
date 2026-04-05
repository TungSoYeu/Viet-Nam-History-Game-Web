export const theme4ModeGuides = {
  turningPage: {
    objective:
      "Củng cố Chủ đề 4 qua 10 'ẩn số lịch sử': mở từng mảnh ảnh bằng dữ kiện rồi xác định chính xác nhân vật, di tích hoặc địa danh lịch sử.",
    rules: [
      "10 bức ảnh bí ẩn; mỗi ảnh là một lưới 2x2 gồm 4 mảnh ghép tương ứng với 4 dữ kiện.",
      "Dữ kiện có thể liên quan trực tiếp đến ảnh hoặc là gợi ý gián tiếp để suy luận ra ảnh.",
      "Trước mỗi lượt, hệ thống gợi ý số chữ cái của đáp án; giải đúng một dữ kiện sẽ mở một phần ảnh.",
    ],
    scoring:
      "Trong web hiện dùng thang điểm giảm dần để khuyến khích mở ít ô và đoán sớm; có thể điều chỉnh theo yêu cầu của tiết dạy.",
    sample:
      "Dữ kiện: 'Khởi nghĩa Lam Sơn bùng nổ năm nào?' -> '1418'; sau khi mở dần 4 mảnh, học sinh đoán 'Lê Lợi'.",
  },
  teammate: {
    objective:
      "Tạo điều kiện để học sinh tương tác trực tiếp và đoán các từ khóa trọng tâm của Chủ đề 4 thông qua phối hợp đồng đội.",
    rules: [
      "Gồm 5 gói câu hỏi, mỗi gói 10 từ khóa; tổng cộng 50 từ khóa.",
      "Từ khóa thuộc 4 nhóm nội dung chính: nhân vật lịch sử, sự kiện - phong trào, địa danh - căn cứ - trận đánh, và khái niệm hoặc thuật ngữ.",
      "Có thể luân phiên vai trò người gợi ý và người đoán; màn chơi được giữ ở cấu trúc đơn giản để thuận tiện tổ chức trên lớp.",
    ],
    scoring:
      "Ưu tiên dùng như hoạt động lớp học để rèn phản xạ, diễn đạt và phối hợp; không bắt buộc chấm XP cạnh tranh.",
    sample:
      "Từ khóa 'Chi Lăng - Xương Giang': người gợi ý có thể nói 'năm 1427, viện binh nhà Minh thua lớn' để đồng đội đoán.",
  },
  recognition: {
    objective:
      "Mode 3 được chia thành hai mode nhỏ: nhận diện từ khóa thông qua hình ảnh, lược đồ và nhận diện hình ảnh thông qua từ khóa.",
    rules: [
      "Khi vào mode 3, người chơi chọn 1 trong 2 mode nhỏ trước khi bắt đầu.",
      "Mỗi mode nhỏ có 5 câu, mỗi câu 15 giây.",
      "Đối tượng cần nhận diện có thể là nhân vật, địa danh, sự kiện hoặc phong trào.",
      "Có thể phóng to ảnh hoặc lược đồ để quan sát chi tiết trước khi trả lời.",
    ],
    scoring: "Mỗi đáp án đúng nhận 10 XP; hết lượt hệ thống cộng tổng.",
    sample:
      "Ví dụ nhánh 1: xem lược đồ và hình ảnh để đoán 'Kháng chiến chống quân Tống (1075 - 1077)'. Ví dụ nhánh 2: đọc từ khóa 'Danh nhân văn hóa thế giới, Tâm công, Bình Ngô Sách' để nhận diện 'Nguyễn Trãi'.",
  },
  connecting: {
    objective:
      "Rèn khả năng xác lập quan hệ lịch sử qua hai dạng nối: hình ảnh với thông tin và thông tin với thông tin.",
    rules: [
      "Gồm 10 câu: 5 câu nối hình ảnh với thông tin và 5 câu nối thông tin với thông tin.",
      "Trong mỗi câu thường có khoảng 5 đáp án đúng và 1 phương án nhiễu để tăng mức độ tư duy.",
      "Nếu nối sai, người chơi có thể chọn lại cặp khác.",
    ],
    scoring: "Mỗi cặp nối đúng +10 XP; hết 10 vòng cộng tổng điểm.",
    sample:
      "Nối 'Nam quốc sơn hà' với bối cảnh kháng chiến chống Tống thời Lý, hoặc nối 'Lê Lợi' với 'Khởi nghĩa Lam Sơn'.",
  },
  crossword: {
    objective:
      "Giải từng hàng ngang để dần suy luận ra từ khóa trung tâm ở hàng dọc.",
    rules: [
      "Gồm 5 từ khóa hàng dọc; mỗi từ khóa có từ 5 đến 10 câu hỏi hàng ngang tùy độ dài.",
      "Mỗi đáp án đúng sẽ mở thêm một phần dữ kiện của ô chữ.",
      "Sau khi hoàn thành hàng ngang, học sinh nhập từ khóa trung tâm để hoàn tất phần chơi.",
    ],
    scoring: "Điểm được tích lũy theo từng hàng ngang và thưởng thêm khi giải đúng từ khóa hàng dọc.",
    sample:
      "Các gợi ý hàng ngang dần mở ra những chữ cái của từ khóa 'Bạch Đằng' để học sinh suy luận đáp án cuối cùng.",
  },
  flow: {
    objective:
      "Nhận diện và tái hiện tiến trình của một sự kiện lịch sử bằng cách phân loại dữ kiện vào đúng các thành tố cơ bản.",
    rules: [
      "Bên trái gồm 4 dòng: Bối cảnh, Diễn biến, Kết quả - Ý nghĩa, Di sản để lại.",
      "Bên phải là hệ thống dữ kiện lịch sử; người chơi kéo thả từng dữ kiện vào đúng dòng tương ứng.",
      "Phải gán đủ toàn bộ dữ kiện trước khi kiểm tra kết quả.",
    ],
    scoring: "Xếp đúng toàn bộ dữ kiện sẽ nhận thưởng XP trọn bộ.",
    sample:
      "Dữ kiện '1407: giặc Minh xâm lược' -> xếp vào dòng Bối cảnh; dữ kiện '1427: Chi Lăng - Xương Giang' -> xếp vào nhóm phù hợp với tiến trình.",
  },
  lightning: {
    objective:
      "Thử thách kiến thức nhận biết và phản xạ tốc độ cao qua 30 câu hỏi liên tiếp với chuỗi lửa theo số câu đúng liên tiếp.",
    rules: [
      "Mỗi phiên có tối đa 30 câu nhận biết với đồng hồ đếm ngược tổng 60 giây và thêm 10 giây nhịp nhanh.",
      "Người chơi trả lời liên tiếp; hệ thống hiển thị chuỗi ngọn lửa khi trả lời đúng liên tiếp.",
      "Trả lời sai sẽ làm đứt chuỗi lửa và phải xây lại chuỗi đúng liên tiếp từ đầu.",
    ],
    scoring: "Điểm mỗi câu đúng = 10 XP cộng thưởng theo chuỗi đúng liên tiếp; kết thúc khi hết thời gian hoặc hết câu.",
    sample: "Đúng liên tiếp 3 câu -> hiển thị 3 ngọn lửa; nếu câu sau sai thì chuỗi đúng trở về 0.",
  },
  picturePuzzle: {
    objective:
      "Quan sát 2 đến 4 hình ảnh, xác định từ khóa của từng hình rồi ghép thành một nội dung lịch sử hoàn chỉnh.",
    rules: [
      "Trò chơi gồm 11 câu; mỗi câu có từ 2 đến 4 hình ảnh gợi ý.",
      "Mỗi hình ảnh tương ứng với một từ khóa hoặc một tiếng trong đáp án.",
      "Người chơi cần ghép chúng thành tên sự kiện, phong trào, địa danh, nhân vật hoặc khái niệm hoàn chỉnh.",
    ],
    scoring: "Mỗi câu đúng +10 XP.",
    sample: "Ảnh gợi 'Cần' + 'Vương' -> 'Cần Vương' hoặc 'Phong trào Cần Vương'.",
  },
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
