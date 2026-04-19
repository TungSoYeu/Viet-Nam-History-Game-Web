const localImage = (name) => `/assets/images/${name}`;
const picturePuzzleImage = (name) => localImage(`picture-puzzle/${name}`);
const historicalRecognitionImage = (name) =>
  localImage(`historical-recognition/${name}`);

export const revealPictureSets = [
  {
    imageUrl: localImage("reveal-picture/hai_ba_trung_mode1.jpg"),
    answer: "Hai Bà Trưng",
    acceptedAnswers: ["Hai Bà Trưng", "Trưng Trắc và Trưng Nhị", "Trưng Trắc Trưng Nhị"],
    caption: "Nhân vật lịch sử gắn với buổi đầu đấu tranh giành lại chủ quyền thời Bắc thuộc.",
    questions: [
      { q: "Cuộc đấu tranh vũ trang đầu tiên trong thời kì Bắc thuộc bùng nổ vào thời gian nào?", a: "Năm 40", acceptedAnswers: ["Năm 40", "40"], hint: "40" },
      { q: "Cuộc đấu tranh diễn ra khi đất nước mất độc lập được gọi là?", a: "Phụ nữ", acceptedAnswers: ["Khởi nghĩa"], hint: "Khởi nghĩa" },
      { q: "Chiến thắng vang dội của cuộc khởi nghĩa năm 40 là những chiến thắng ở đâu?", a: "Mê Linh", acceptedAnswers: ["Mê Linh, Cổ Loa, Luy Lâu", "Mê Linh Cổ Loa Luy Lâu", "Mê Linh", "Cổ Loa", "Luy Lâu"], hint: "Mê Linh" },
      { q: "Ai là người chỉ huy quân Hán sang đàn áp cuộc khởi nghĩa Hai Bà Trưng vào năm 43?", a: "Cưỡi voi", acceptedAnswers: ["Mã Viện"], hint: "Mã Viện" },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/ngo_quyen_mode1.jpg"),
    answer: "Vua Ngô Quyền",
    acceptedAnswers: ["Vua Ngô Quyền", "Ngô Quyền", "Ngô Vương Quyền"],
    caption: "Nhân vật gắn với bước ngoặt khôi phục nền độc lập tự chủ ở thế kỉ X.",
    questions: [
      { q: "Cuộc kháng chiến chống quân Nam Hán diễn ra vào thời gian nào?", a: "Năm 938", acceptedAnswers: ["Năm 938", "938"], hint: "938" },
      { q: "Kế sách dùng cọc nhọn đóng xuống sông để chế ngự thuyền của địch lần đầu được sử dụng trong cuộc kháng chiến nào của Việt Nam?", a: "Tổ trung hưng", acceptedAnswers: ["Chống quân Nam Hán (thế kỉ X)", "Chống quân Nam Hán", "Nam Hán"], hint: "Nam Hán" },
      { q: "Trong lịch sử chiến tranh bảo vệ Tổ quốc của Việt Nam (thế kỉ X – XV), dòng sông nào sau đây ba lần ghi dấu ấn chiến thắng quân xâm lược?", a: "Sông Bạch Đằng", acceptedAnswers: ["Sông Bạch Đằng", "Bạch Đằng"], hint: "Bạch Đằng" },
      { q: "Ai là người chỉ huy quân Nam Hán xâm lược nước ta?", a: "Triều đại đầu tiên", acceptedAnswers: ["Lưu Hoằng Tháo"], hint: "Lưu Hoằng Tháo" },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/le_dai_hanh_mode1.jpg"),
    answer: "Vua Lê Đại Hành",
    acceptedAnswers: ["Vua Lê Đại Hành", "Lê Đại Hành", "Lê Hoàn"],
    caption: "Nhân vật lịch sử tiêu biểu buổi đầu xây dựng nền độc lập tự chủ.",
    questions: [
      { q: "Cuộc kháng chiến chống quân Tống diễn ra vào thời gian nào?", a: "Năm 981", acceptedAnswers: ["Năm 981", "981"], hint: "981" },
      { q: "Trong lịch sử chiến tranh bảo vệ Tổ quốc của Việt Nam (thế kỉ X – XV), dòng sông nào sau đây ba lần ghi dấu ấn chiến thắng quân xâm lược?", a: "Sông Bạch Đằng", acceptedAnswers: ["Sông Bạch Đằng", "Bạch Đằng"], hint: "Bạch Đằng" },
      { q: "Lễ hội nào được các triều đại phong kiến Việt Nam tổ chức hằng năm nhằm khuyến khích nhân dân đẩy mạnh sản xuất nông nghiệp?", a: "Lễ Tịch điền", acceptedAnswers: ["Lễ Tịch điền", "Tịch điền"], hint: "Lễ Tịch điền" },
      { q: "Ai là người chỉ huy quân Tống xâm lược Đại Cồ Việt vào đầu năm 981?", a: "Dương Vân Nga", acceptedAnswers: ["Hầu Nhân Bảo"], hint: "Hầu Nhân Bảo" },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/ly_thuong_kiet_mode1.jpg"),
    answer: "Lý Thường Kiệt",
    acceptedAnswers: ["Lý Thường Kiệt"],
    caption: "Danh tướng thời Lý với chiến lược chủ động đánh Tống.",
    questions: [
      { q: "Kế sách nào được nhà Lý sử dụng trong cuộc kháng chiến chống quân Tống (thế kỉ XI)?", a: "Tiên phát chế nhân", acceptedAnswers: ["Kế sách: “Tiên phát chế nhân”", "Tiên phát chế nhân"], hint: "Tiên phát chế nhân" },
      { q: "Cuộc kháng chiến chống Tống diễn ra vào khoảng thời gian nào?", a: "1075 - 1077", acceptedAnswers: ["1075 - 1077", "1075-1077"], hint: "1075 - 1077" },
      { q: "Trận quyết chiến chiến lược nào sau đây diễn ra trong cuộc kháng chiến chống quân xâm lược Tống thời Lý?", a: "Trận Như Nguyệt", acceptedAnswers: ["Trận Như Nguyệt", "Như Nguyệt"], hint: "Như Nguyệt" },
      { q: "Khi quân Tống rơi vào thế bế tắc, khó khăn thì nhà Lý đã chọn biện pháp nào để kết thúc chiến tranh?", a: "Giảng hòa", acceptedAnswers: ["Giảng hòa", "Giảng hoà", "Hòa hoãn"], hint: "Giảng hòa" },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/hung_dao_dai_vuong_mode1.png"),
    answer: "Hưng Đạo Đại Vương",
    acceptedAnswers: ["Hưng Đạo Đại Vương", "Trần Hưng Đạo", "Trần Quốc Tuấn", "Hưng Đạo Vương"],
    caption: "Nhân vật lịch sử tiêu biểu của thời Trần.",
    questions: [
      { q: "Ba lần kháng chiến chống quân Mông - Nguyên của nhà Trần diễn ra vào các khoảng thời gian nào?", a: "Thế kỉ XIII", acceptedAnswers: ["1258; 1285; 1287-1288", "1258, 1285, 1287-1288", "1258 1285 1287 1288"], hint: "Thế kỉ XIII" },
      { q: "Điền từ còn thiếu vào chỗ trống: “....., làm kế sâu rễ bền gốc là thượng sách giữ nước.”", a: "Khoan thư sức dân", acceptedAnswers: ["Khoan thư sức dân"], hint: "Khoan thư sức dân" },
      { q: "Trong cuộc kháng chiến chống quân Mông Nguyên (1258 - 1288), nhà Trần sử dụng kế sách nào xuyên suốt trong cuộc kháng chiến?", a: "Năm nay đánh giặc nhàn", acceptedAnswers: ["kế “Thanh dã”", "Thanh dã", "Vườn không nhà trống"], hint: "Thanh dã" },
      { q: "Hãy kể tên những thắng lợi lớn trong cuộc kháng chiến chống quân Mông - Nguyên lần thứ hai (1285)?", a: "Đức thánh Trần", acceptedAnswers: ["Tây Kết, Hàm Tử (Hưng Yên); Chương Dương, Thăng Long (Hà Nội); Vạn Kiếp (Hải Dương cũ).", "Tây Kết, Hàm Tử, Chương Dương, Thăng Long, Vạn Kiếp", "Tây Kết", "Hàm Tử", "Chương Dương", "Thăng Long", "Vạn Kiếp"], hint: "Tây Kết, Hàm Tử..." },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/le_thai_to_mode1.jpg"),
    answer: "Vua Lê Thái Tổ",
    acceptedAnswers: ["Vua Lê Thái Tổ", "Lê Thái Tổ", "Lê Lợi", "Bình Định Vương"],
    caption: "Nhân vật gắn với cuộc khởi nghĩa Lam Sơn.",
    questions: [
      { q: "Cuộc khởi nghĩa Lam Sơn diễn ra vào khoảng thời gian nào?", a: "Thế kỉ XV", acceptedAnswers: ["1418 - 1427", "1418-1427"], hint: "1418 - 1427" },
      { q: "Điểm khác biệt cơ bản về bối cảnh của cuộc khởi nghĩa Lam Sơn so với các cuộc đấu tranh ở các thế kỉ X - XIV là gì?", a: "Truyền thuyết Hồ Gươm", acceptedAnswers: ["Đất nước bị mất độc lập, bị nhà Minh đô hộ", "Nhà Minh đô hộ", "Mất độc lập"], hint: "Nhà Minh đô hộ" },
      { q: "Những thắng lợi mang tính quyết định trong khởi nghĩa Lam Sơn là?", a: "Hội thề Lũng Nhai", acceptedAnswers: ["Trận Tốt Động - Chúc Động; Trận Chi Lăng - Xương Giang", "Tốt Động - Chúc Động", "Chi Lăng - Xương Giang"], hint: "Tốt Động..." },
      { q: "Khởi nghĩa Lam Sơn mang tính chất gì?", a: "Tổ trung hưng", acceptedAnswers: ["Chiến tranh giải phóng dân tộc", "Giải phóng dân tộc"], hint: "Giải phóng dân tộc" },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/quang_trung_mode1.jpg"),
    answer: "Hoàng đế Quang Trung",
    acceptedAnswers: ["Hoàng đế Quang Trung", "Quang Trung", "Nguyễn Huệ", "Vua Quang Trung"],
    caption: "Nhân vật gắn với phong trào Tây Sơn cuối thế kỉ XVIII.",
    questions: [
      { q: "Phong trào Tây Sơn nổ ra vào khoảng thời gian nào?", a: "Thế kỉ XVIII", acceptedAnswers: ["cuối thế kỉ XVIII", "thế kỉ 18", "thế kỉ XVIII"], hint: "Thế kỉ XVIII" },
      { q: "Trong thời gian đầu dấy binh khởi nghĩa, ba anh em Tây Sơn đã sử dụng khẩu hiệu nào để tập hợp lực lượng?", a: "Anh hùng áo vải", acceptedAnswers: ["“Lấy của nhà giàu chia cho người nghèo”", "Lấy của nhà giàu chia cho người nghèo", "Lấy của nhà giàu chia cho người nghèo."], hint: "Người nghèo" },
      { q: "Hãy điền từ còn thiếu vào chỗ trống: “Đánh cho Sử tri…chi hữu chủ”.", a: "Thần tốc", acceptedAnswers: ["Nam quốc anh hùng", "Nam quốc anh hùng."], hint: "Nam quốc anh hùng" },
      { q: "Phong trào Tây Sơn đã đánh bại những kẻ thù xâm lược nào?", a: "Bất bại", acceptedAnswers: ["Quân Xiêm, quân Thanh", "Quân Xiêm và quân Thanh", "Xiêm, Thanh", "Quân Xiêm, Thanh"], hint: "Xiêm, Thanh" },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/luy_thay_mode1.png"),
    answer: "Lũy Thầy",
    acceptedAnswers: ["Lũy Thầy"],
    caption: "Di tích quân sự tiêu biểu ở miền Trung.",
    questions: [
      { q: "Cuộc chiến tranh Trịnh - Nguyễn diễn ra trong khoảng thời gian nào?", a: "Công trình phòng thủ", acceptedAnswers: ["1627 - 1672", "1627-1672"], hint: "1627 - 1672" },
      { q: "Năm 1777, nghĩa quân Tây Sơn giành được thắng lợi quan trọng nào sau đây?", a: "Chia cắt", acceptedAnswers: ["Lật đổ chúa Nguyễn", "Chúa Nguyễn"], hint: "Lật đổ chúa Nguyễn" },
      { q: "Trong các thế kỉ XVII – XVIII, con sông nào sau đây trở thành ranh giới chia cắt lãnh thổ Đại Việt thành Đàng Trong và Đàng Ngoài?", a: "Đào Duy Từ", acceptedAnswers: ["Sông Gianh", "Gianh"], hint: "Sông Gianh" },
      { q: "“Tây Sơn tam kiệt” là tên gọi ba nhân vật lịch sử nào?", a: "Quảng Bình", acceptedAnswers: ["Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ", "Nguyễn Nhạc, Nguyễn Lữ, Nguyễn Huệ", "Nguyễn Nhạc Nguyễn Lữ Nguyễn Huệ"], hint: "Nguyễn Nhạc, Nguyễn Huệ..." },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/go_dong_da_mode1.jpg"),
    answer: "Gò Đống Đa",
    acceptedAnswers: ["Gò Đống Đa", "Đống Đa"],
    caption: "Di tích lịch sử gắn với chiến thắng mùa xuân Kỷ Dậu.",
    questions: [
      { q: "“Người anh hùng áo vải” là để nói về hình tượng vị anh hùng dân tộc nào trong lịch sử dân tộc?", a: "Di tích", acceptedAnswers: ["Nguyễn Huệ - Quang Trung", "Nguyễn Huệ", "Quang Trung"], hint: "Nguyễn Huệ" },
      { q: "Tháng 12/1788 diễn ra sự kiện lịch sử nào của phong trào Tây Sơn?", a: "Mùng 5 Tết", acceptedAnswers: ["Nguyễn Huệ lên ngôi hoàng đế, lấy niên hiệu là Quang Trung, tiến quân ra Bắc", "Lên ngôi hoàng đế", "Nguyễn Huệ lên ngôi", "Tiến quân ra Bắc", "Lên ngôi hoàng đế, tiến quân ra Bắc"], hint: "Lên ngôi hoàng đế" },
      { q: "Thắng lợi quyết định trong kháng chiến chống quân Thanh (1789) là?", a: "Mồ chôn quân Thanh", acceptedAnswers: ["Chiến thắng Ngọc Hồi - Đống Đa", "Ngọc Hồi - Đống Đa", "Ngọc Hồi Đống Đa"], hint: "Ngọc Hồi - Đống Đa" },
      { q: "Phong trào nào đặt cơ sở cho việc thống nhất quốc gia vào cuối thế kỉ XVIII?", a: "Hà Nội", acceptedAnswers: ["Phong trào Tây Sơn", "Khởi nghĩa Tây Sơn", "Tây Sơn"], hint: "Tây Sơn" },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/tran_nhat_tao_mode1.jpg"),
    answer: "Trận Nhật Tảo",
    acceptedAnswers: ["Trận Nhật Tảo", "Nhật Tảo"],
    caption: "Sự kiện lịch sử tiêu biểu trong cuộc kháng chiến chống Pháp ở Nam Kì.",
    questions: [
      { q: "Cuộc kháng chiến nào không thành công vào nửa sau thế kỉ XIX?", a: "1861", acceptedAnswers: ["Kháng chiến chống thực dân Pháp (1858-1884)", "Kháng chiến chống thực dân Pháp (1881- 1884)", "Kháng chiến chống thực dân Pháp (18881- 1884)", "Kháng chiến chống thực dân Pháp", "Chống thực dân Pháp", "Chống Pháp"], hint: "Chống Pháp" },
      { q: "“Bao giờ người Tây nhổ hết cỏ nước Nam, thì mới hết người Nam đánh Tây” là câu nói nổi tiếng của ai?", a: "Nguyễn Trung Trực", acceptedAnswers: ["Nguyễn Trung Trực"], hint: "Nguyễn Trung Trực" },
      { q: "Sự kiện mở đầu cho quá trình Pháp xâm lược Việt Nam là?", a: "Tàu Hy Vọng", acceptedAnswers: ["Ngày 1/9/1858, liên quân Pháp - Tây Ban Nha nổ súng tấn công Đà Nẵng", "1/9/1858", "Pháp tấn công Đà Nẵng", "Pháp đánh Đà Nẵng"], hint: "Pháp tấn công Đà Nẵng" },
      { q: "Sự kiện nào đánh dấu Pháp hoàn thành cơ bản cuộc xâm lược Việt Nam vào nửa sau thế kỉ XIX?", a: "Trận đánh", acceptedAnswers: ["Hiệp ước Hác - măng (1883) và Hiệp ước Pa-tơ-nốt (1884) được kí kết", "Hiệp ước Hác Măng và Pa tơ nốt", "Hác-măng và Pa-tơ-nốt", "Hác măng và pa tơ nốt", "Hiệp ước Hác-măng và Pa-tơ-nốt"], hint: "Hác-măng và Pa-tơ-nốt" },
    ],
  },
];

export const teammatePackages = [
  {
    id: "understanding-package-hai-ba-trung",
    title: "Gói Hai Bà Trưng",
    keywords: [
      "Phụ nữ",
      "Đầu tiên",
      "Tô Định",
      "40",
      "Giao Chỉ",
      "Mê Linh",
      "Cưỡi voi",
      "Khởi nghĩa",
      "Trưng Vương",
      "Đông Hán",
    ],
  },
  {
    id: "understanding-package-ly-bi",
    title: "Gói Lý Bí",
    keywords: [
      "Vạn Xuân",
      "Du kích",
      "Chùa Trấn Quốc",
      "Nhà Lương",
      "Triệu Quang Phục",
      "Mâu thuẫn",
      "Dạ Trạch Vương",
      "Tô Lịch",
      "Nhà Tùy",
      "544",
    ],
  },
  {
    id: "understanding-package-nguyen-trung-truc",
    title: "Gói Nguyễn Trung Trực",
    keywords: [
      "Thực dân Pháp",
      "1861",
      "Sông Nhật Tảo",
      "Tàu Hy Vọng",
      "Tập kích",
      "Tinh thần đấu tranh",
      "Đồn Rạch Giá",
      "Nam Bộ",
      "Tiếng vang lớn",
      "Chiến công lừng lẫy",
    ],
  },
  {
    id: "understanding-package-nguyen-trai",
    title: "Gói Nguyễn Trãi",
    keywords: [
      "Công thần",
      "Hiến kế",
      "Bình Ngô đại cáo",
      "Tâm công",
      "Nhân nghĩa",
      "Nhà Minh",
      "Lam Sơn",
      "Bình Ngô sách",
      "Thế kỉ XV",
      "Lệ chi viên",
    ],
  },
  {
    id: "understanding-package-le-hoan",
    title: "Gói Lê Hoàn",
    keywords: [
      "Kháng chiến chống Tống",
      "981",
      "Sông Bạch Đằng",
      "Tiền Lê",
      "Dương Vân Nga",
      "Phá Tống bình Chiêm",
      "Đại Cồ Việt",
      "Hầu Nhân Bảo",
      "Đóng cọc",
      "Sông Lục Đầu",
    ],
  },
  {
    id: "understanding-package-special",
    title: "Gói đặc biệt",
    keywords: [
      "Tinh thần yêu nước",
      "Đoàn kết dân tộc",
      "Tính chính nghĩa",
      "Chiến tranh nhân dân",
      "Ý chí bất khuất",
      "Dĩ đoản chế trường",
      "Tư tưởng chủ hòa",
      "Ngoại giao khôn khéo",
      "Phòng ngự bị động",
      "Độc lập, tự chủ",
    ],
  },
  {
    id: "understanding-package-ngo-quyen",
    title: "Gói Ngô Quyền",
    keywords: [
      "Bạch Đằng",
      "938",
      "Cọc gỗ",
      "Nam Hán",
      "Lưu Hoằng Tháo",
      "Đường Lâm",
      "Cổ Loa",
      "Họ Khúc",
      "Ngô Vương",
      "Chấm dứt Bắc thuộc",
    ],
  },
  {
    id: "understanding-package-ly-thuong-kiet",
    title: "Gói Lý Thường Kiệt",
    keywords: [
      "Tiên phát chế nhân",
      "Như Nguyệt",
      "1075",
      "Ung Châu",
      "Nam quốc sơn hà",
      "Nhà Tống",
      "Nhà Lý",
      "Giảng hòa",
      "Phòng tuyến",
      "Đại Việt",
    ],
  },
  {
    id: "understanding-package-tran-quoc-tuan",
    title: "Gói Trần Quốc Tuấn",
    keywords: [
      "Hịch tướng sĩ",
      "Mông - Nguyên",
      "Bạch Đằng 1288",
      "Vạn Kiếp",
      "Khoan thư sức dân",
      "Thanh dã",
      "Nhà Trần",
      "Ba lần kháng chiến",
      "Thoát Hoan",
      "Hưng Đạo Vương",
    ],
  },
  {
    id: "understanding-package-le-thai-to",
    title: "Gói Lê Thái Tổ",
    keywords: [
      "Lam Sơn",
      "1418",
      "Nhà Minh",
      "Chi Lăng",
      "Xương Giang",
      "Bình Ngô",
      "Lũng Nhai",
      "Thanh Hóa",
      "Bình Định Vương",
      "Giải phóng dân tộc",
    ],
  },
  {
    id: "understanding-package-quang-trung",
    title: "Gói Quang Trung",
    keywords: [
      "Tây Sơn",
      "Ngọc Hồi",
      "Đống Đa",
      "1789",
      "Quân Thanh",
      "Quân Xiêm",
      "Anh hùng áo vải",
      "Bình Định",
      "Thống nhất đất nước",
      "Rạch Gầm - Xoài Mút",
    ],
  },
];

export const historicalRecognitionItems = [
  {
    id: "recog-1",
    type: "image",
    imageUrls: [
      historicalRecognitionImage("mode3_q1_1.png"),
      historicalRecognitionImage("mode3_q1_2.png"),
      historicalRecognitionImage("mode3_q1_3.png"),
    ],
    title: "Nhận diện qua hình ảnh, lược đồ",
    prompt:
      "Quan sát 3 hình ảnh và lược đồ sau. Đây là cuộc kháng chiến nào?",
    acceptedAnswers: [
      "Kháng chiến chống quân Tống (1075 - 1077)",
      "Kháng chiến chống quân Tống",
      "Kháng chiến chống Tống thời Lý",
    ],
    explanation:
      "Các hình ảnh gợi đến bài thơ Nam quốc sơn hà, phòng tuyến Như Nguyệt và cuộc kháng chiến chống Tống thời Lý giai đoạn 1075 - 1077.",
  },
  {
    id: "recog-2",
    type: "image",
    imageUrls: [
      historicalRecognitionImage("mode3_q2_1.png"),
      historicalRecognitionImage("mode3_q2_2.png"),
      historicalRecognitionImage("mode3_q2_3.png"),
    ],
    title: "Nhận diện qua hình ảnh, lược đồ",
    prompt:
      "Quan sát 3 hình ảnh và lược đồ sau. Đây là cuộc kháng chiến nào?",
    acceptedAnswers: [
      "Kháng chiến chống quân Mông - Nguyên (1258 - 1288)",
      "Kháng chiến chống quân Mông - Nguyên",
      "Kháng chiến chống Mông - Nguyên",
      "Kháng chiến chống Mông - Nguyên thời Trần",
    ],
    explanation:
      "Bộ hình ảnh gắn với quân Mông Cổ, chiến thắng Bạch Đằng và lược đồ kháng chiến thời Trần chống quân Mông - Nguyên.",
  },
  {
    id: "recog-3",
    type: "image",
    imageUrls: [
      historicalRecognitionImage("mode3_q3_1.png"),
      historicalRecognitionImage("mode3_q3_2.png"),
      historicalRecognitionImage("mode3_q3_3.png"),
    ],
    title: "Nhận diện qua hình ảnh, lược đồ",
    prompt:
      "Quan sát 3 hình ảnh sau. Đây là giai đoạn đấu tranh lịch sử nào?",
    acceptedAnswers: [
      "Kháng chiến chống Pháp (nửa sau thế kỉ XIX)",
      "Kháng chiến chống Pháp",
      "Kháng chiến chống Pháp nửa sau thế kỉ XIX",
    ],
    explanation:
      "Các hình ảnh phản ánh quá trình thực dân Pháp mở rộng xâm lược và phong trào kháng chiến chống Pháp của nhân dân Việt Nam nửa sau thế kỉ XIX.",
  },
  {
    id: "recog-4",
    type: "image",
    imageUrls: [
      historicalRecognitionImage("mode3_q4_1.png"),
      historicalRecognitionImage("mode3_q4_2.png"),
      historicalRecognitionImage("mode3_q4_3.png"),
    ],
    title: "Nhận diện qua hình ảnh, lược đồ",
    prompt:
      "Quan sát 3 hình ảnh sau. Đây là cuộc khởi nghĩa nào trong lịch sử dân tộc?",
    acceptedAnswers: [
      "Khởi nghĩa Lam Sơn (1418 - 1427)",
      "Khởi nghĩa Lam Sơn",
    ],
    explanation:
      "Các hình ảnh gợi đến Hội thề Lũng Nhai, Hội thề Đông Quan và Bình Ngô Đại Cáo, những dấu mốc tiêu biểu của khởi nghĩa Lam Sơn.",
  },
  {
    id: "recog-5",
    type: "image",
    imageUrls: [
      historicalRecognitionImage("mode3_q5_1.png"),
      historicalRecognitionImage("mode3_q5_2.png"),
      historicalRecognitionImage("mode3_q5_3.png"),
    ],
    title: "Nhận diện qua hình ảnh, lược đồ",
    prompt:
      "Quan sát 3 hình ảnh sau. Đây là phong trào lịch sử nào?",
    acceptedAnswers: [
      "Phong trào Tây Sơn (cuối thế kỉ XVIII)",
      "Phong trào Tây Sơn",
      "Khởi nghĩa Tây Sơn",
    ],
    explanation:
      "Tượng Quang Trung, di tích Tây Sơn và hình tượng ba anh em Tây Sơn đều gắn với phong trào Tây Sơn cuối thế kỉ XVIII.",
  },
  {
    id: "recog-6",
    type: "keyword_hint",
    title: "Nhận diện hình ảnh qua từ khóa",
    prompt:
      "Từ khóa: Nhà Đường, Thành Tống Bình, Bố Cái Đại Vương. Đó là nhân vật nào?",
    acceptedAnswers: ["Phùng Hưng", "Bố Cái Đại Vương"],
    explanation:
      "Phùng Hưng là thủ lĩnh khởi nghĩa chống nhà Đường, được nhân dân tôn xưng là Bố Cái Đại Vương.",
    imageToFind: historicalRecognitionImage("mode3_q6.png"),
  },
  {
    id: "recog-7",
    type: "keyword_hint",
    title: "Nhận diện hình ảnh qua từ khóa",
    prompt:
      "Từ khóa: Tàu Hy Vọng, Vàm Cỏ Đông, 'Bao giờ người Tây nhổ hết cỏ nước Nam...'. Đó là nhân vật nào?",
    acceptedAnswers: ["Nguyễn Trung Trực"],
    explanation:
      "Những từ khóa này gắn với chiến công và câu nói nổi tiếng của anh hùng dân tộc Nguyễn Trung Trực.",
    imageToFind: historicalRecognitionImage("mode3_q7.jpg"),
  },
  {
    id: "recog-8",
    type: "keyword_hint",
    title: "Nhận diện hình ảnh qua từ khóa",
    prompt:
      "Từ khóa: Phật giáo, Lý Bí, Vạn Xuân. Đó là hình ảnh địa danh nào?",
    acceptedAnswers: ["Chùa Trấn Quốc", "Chùa Khai Quốc"],
    explanation:
      "Chùa Trấn Quốc có tiền thân là chùa Khai Quốc, được xây dựng từ thời Lý Nam Đế ở nước Vạn Xuân.",
    imageToFind: historicalRecognitionImage("mode3_q8.png"),
  },
  {
    id: "recog-9",
    type: "keyword_hint",
    title: "Nhận diện hình ảnh qua từ khóa",
    prompt:
      "Từ khóa: Danh nhân văn hóa thế giới, Tâm công, Bình Ngô Sách. Đó là nhân vật nào?",
    acceptedAnswers: ["Nguyễn Trãi", "Ức Trai"],
    explanation:
      "Nguyễn Trãi là danh nhân văn hóa thế giới, nổi bật với tư tưởng tâm công và tác phẩm Bình Ngô Sách.",
    imageToFind: historicalRecognitionImage("mode3_q9.png"),
  },
  {
    id: "recog-10",
    type: "keyword_hint",
    title: "Nhận diện hình ảnh qua từ khóa",
    prompt:
      "Từ khóa: Công thần, hiến kế, Nghệ An. Đó là nhân vật nào?",
    acceptedAnswers: ["Nguyễn Chích"],
    explanation:
      "Nguyễn Chích là công thần Lam Sơn, người hiến kế chuyển hướng chiến lược vào Nghệ An cho nghĩa quân.",
    imageToFind: historicalRecognitionImage("mode3_q10.png"),
  },
];

export const connectingHistoryRounds = [
  // 5 rounds: Nối thông tin với hình ảnh
  {
    id: "img-info-1",
    title: "Câu 1: Hình ảnh - Thông tin",
    instruction: "Nối 5 hình ảnh sau với thông tin phù hợp.",
    pairs: [
      { left: "Ngô Quyền", right: "Chiến thắng Bạch Đằng 938", image: localImage("ngo_quyen.png") },
      { left: "Đinh Bộ Lĩnh", right: "Dẹp loạn 12 sứ quân", image: localImage("dinh_bo_linh.png") },
      { left: "Lê Hoàn", right: "Kháng chiến chống Tống 981", image: localImage("le_hoan.png") },
      { left: "Lý Thường Kiệt", right: "Phòng tuyến Như Nguyệt", image: localImage("ly_thuong_kiet.png") },
      { left: "Trần Hưng Đạo", right: "Ba lần kháng chiến chống Nguyên", image: localImage("tran_hung_dao.png") }
    ],
    distractor: ["Nguyễn Trãi - Kháng chiến chống Minh"]
  },
  {
    id: "img-info-2",
    title: "Câu 2: Hình ảnh - Thông tin",
    instruction: "Nối 5 hình ảnh anh hùng chống Pháp với chiến công/địa danh tương ứng.",
    pairs: [
      { left: "Nguyễn Trung Trực", right: "Chiến công Nhật Tảo", image: localImage("nguyen_trung_truc.png") },
      { left: "Trương Định", right: "Bình Tây Đại Nguyên soái", image: localImage("truong_dinh.png") },
      { left: "Phan Đình Phùng", right: "Khởi nghĩa Hương Khê", image: localImage("phan_dinh_phung.png") },
      { left: "Hoàng Hoa Thám", right: "Hùm thiêng Yên Thế", image: localImage("hoang_hoa_tham.png") },
      { left: "Nguyễn Thiện Thuật", right: "Khởi nghĩa Bãi Sậy", image: localImage("nguyen_thien_thuat.png") }
    ],
    distractor: ["Phan Bội Châu - Phong trào Đông Du"]
  },
  {
    id: "img-info-3",
    title: "Câu 3: Hình ảnh - Thông tin",
    instruction: "Nối nhân vật với dấu ấn hoặc tác phẩm tiêu biểu.",
    pairs: [
      { left: "Lê Lợi", right: "Khởi nghĩa Lam Sơn", image: localImage("le_loi.png") },
      { left: "Nguyễn Trãi", right: "Bình Ngô Đại Cáo", image: localImage("nguyen_trai.png") },
      { left: "Trương Định", right: "Bình Tây Đại Nguyên soái", image: localImage("truong_dinh.png") },
      { left: "Lê Hoàn", right: "Kháng chiến chống Tống năm 981", image: localImage("le_hoan.png") },
      { left: "Quang Trung", right: "Ngọc Hồi - Đống Đa", image: localImage("nguyen_hue.png") }
    ],
    distractor: ["Lê Thánh Tông - Sách Hồng Đức"]
  },
  {
    id: "img-info-4",
    title: "Câu 4: Hình ảnh - Thông tin",
    instruction: "Nối nhân vật hoặc biểu tượng với vai trò lịch sử phù hợp.",
    pairs: [
      { left: "Bà Triệu", right: "Khởi nghĩa núi Nưa năm 248", image: localImage("ba_trieu.png") },
      { left: "Lý Thường Kiệt", right: "Kháng chiến và tiến công chống Tống", image: localImage("ly_thuong_kiet.png") },
      { left: "Trần Hưng Đạo", right: "Hịch tướng sĩ", image: localImage("tran_hung_dao.png") },
      { left: "Phan Đình Phùng", right: "Khởi nghĩa Hương Khê", image: localImage("phan_dinh_phung.png") },
      { left: "Hai Bà Trưng", right: "Khởi nghĩa Mê Linh", image: localImage("hai_ba_trung.png") }
    ],
    distractor: ["Lê Chiêu Thống - Kinh thành Huế"]
  },
  {
    id: "img-info-5",
    title: "Câu 5: Hình ảnh - Thông tin",
    instruction: "Nối chân dung hoặc di tích với nội dung lịch sử tương ứng.",
    pairs: [
      { left: "Đinh Bộ Lĩnh", right: "Dẹp loạn 12 sứ quân", image: localImage("dinh_bo_linh.png") },
      { left: "Ngô Quyền", right: "Chiến thắng Bạch Đằng 938", image: localImage("ngo_quyen.png") },
      { left: "Trương Định", right: "Gò Công, Nam Kỳ", image: localImage("truong_dinh.png") },
      { left: "Nguyễn Thiện Thuật", right: "Khởi nghĩa Bãi Sậy", image: localImage("nguyen_thien_thuat.png") },
      { left: "Nguyễn Trung Trực", right: "Chiến công Nhật Tảo", image: localImage("nguyen_trung_truc.png") }
    ],
    distractor: ["Triệu Quang Phục - Vương quốc Vạn Xuân"]
  },
  {
    id: "info-info-1",
    title: "Câu 6: Thông tin - Thông tin",
    instruction: "Xác định mối quan hệ giữa sự kiện và mốc thời gian.",
    pairs: [
      { left: "Khởi nghĩa Hai Bà Trưng", right: "Năm 40" },
      { left: "Khởi nghĩa Bà Triệu", right: "Năm 248" },
      { left: "Thắng lợi Bạch Đằng", right: "Năm 938" },
      { left: "Chiến thắng Ung Châu", right: "Năm 1075" },
      { left: "Thắng lợi Lam Sơn", right: "Năm 1427" }
    ],
    distractor: ["Khởi nghĩa Yên Thế - Năm 1945"]
  },
  {
    id: "info-info-2",
    title: "Câu 7: Thông tin - Thông tin",
    instruction: "Nối phong trào - giai đoạn lịch sử với nội dung phù hợp.",
    pairs: [
      { left: "Phong trào Cần Vương", right: "Cuối thế kỷ XIX" },
      { left: "Khởi nghĩa Yên Thế", right: "Chống Pháp đầu thế kỷ XX" },
      { left: "Phong trào Đông Du", right: "Gắn với Phan Bội Châu" },
      { left: "Khởi nghĩa Lam Sơn", right: "Thu hồi độc lập sau ách Minh" },
      { left: "Kháng chiến chống Nguyên", right: "Nhà Trần, thế kỷ XIII" }
    ],
    distractor: ["Cải cách Minh Mạng - Thể chế quân chủ"]
  },
  {
    id: "info-info-3",
    title: "Câu 8: Thông tin - Thông tin",
    instruction: "Nối địa danh hoặc căn cứ với sự kiện tiêu biểu.",
    pairs: [
      { left: "Vũ Quang", right: "Căn cứ khởi nghĩa Hương Khê" },
      { left: "Phồn Xương", right: "Căn cứ Hoàng Hoa Thám" },
      { left: "Lam Sơn", right: "Phát xuất khởi nghĩa Lê Lợi" },
      { left: "Như Nguyệt", right: "Phòng tuyến Lý Thường Kiệt" },
      { left: "Chi Lăng - Xương Giang", right: "Đại thắng quân Minh 1427" }
    ],
    distractor: ["Điện Biên Phủ - Thắng lợi chống Pháp năm 1954"]
  },
  {
    id: "info-info-4",
    title: "Câu 9: Thông tin - Thông tin",
    instruction: "Nối tác phẩm hoặc khẩu hiệu với bối cảnh lịch sử.",
    pairs: [
      { left: "Nam quốc sơn hà", right: "Kháng chiến chống Tống (Lý)" },
      { left: "Bình Ngô Đại Cáo", right: "Sau thắng lợi Lam Sơn" },
      { left: "Hịch tướng sĩ", right: "Chuẩn bị kháng chiến chống Nguyên" },
      { left: "Bình Ngô sách", right: "Kế sách cho Lê Lợi" },
      { left: "Phá Tống bình Chiêm", right: "Cuộc chiến tự vệ 1075" }
    ],
    distractor: ["Luật gia trưởng - Triều Lê sơ"]
  },
  {
    id: "info-info-5",
    title: "Câu 10: Thông tin - Thông tin",
    instruction: "Nối nhân vật lãnh đạo với cuộc khởi nghĩa hoặc phong trào tiêu biểu.",
    pairs: [
      { left: "Phan Đình Phùng", right: "Khởi nghĩa Hương Khê" },
      { left: "Hoàng Hoa Thám", right: "Khởi nghĩa Yên Thế" },
      { left: "Nguyễn Thiện Thuật", right: "Khởi nghĩa Bãi Sậy" },
      { left: "Trương Định", right: "Kháng chiến Nam Kỳ chống Pháp" },
      { left: "Nguyễn Trung Trực", right: "Chiến công trên sông Nhật Tảo" }
    ],
    distractor: ["Nguyễn Ánh - Nhà Nguyễn thống nhất"]
  }
];

export const crosswordSets = [
  {
    id: "cw-1",
    keyword: "NHUNGUYET",
    title: "Ô chữ 1",
    theme: "Giải mã từ khóa 9 chữ cái qua 9 hàng ngang.",
    clues: [
      {
        question: "Lý Bí đặt tên nước là gì?",
        options: ["Vạn Xuân", "Âu Lạc", "Đại Việt", "Đại Cồ Việt"],
        correctAnswer: "Vạn Xuân",
        boardAnswer: "Vạn Xuân",
        highlightIndex: 2,
      },
      {
        question: "Khởi nghĩa tiêu biểu nhất trong Phong trào Cần Vương là gì?",
        options: ["Hương Khê", "Bãi Sậy", "Yên Thế", "Ba Đình"],
        correctAnswer: "Hương Khê",
        boardAnswer: "Hương Khê",
        highlightIndex: 0,
      },
      {
        question: "Khởi nghĩa đầu tiên do người phụ nữ lãnh đạo trong lịch sử VN là gì?",
        options: ["Hai Bà Trưng", "Bà Triệu", "Lam Sơn", "Tây Sơn"],
        correctAnswer: "Hai Bà Trưng",
        boardAnswer: "Bà Trưng",
        highlightIndex: 4,
      },
      {
        question: "Nhà Hồ đặt tên nước là gì?",
        options: ["Đại Ngu", "Đại Việt", "Vạn Xuân", "Âu Lạc"],
        correctAnswer: "Đại Ngu",
        boardAnswer: "Đại Ngu",
        highlightIndex: 3,
      },
      {
        question: "Chiến thắng nào kết thúc thời kỳ Bắc thuộc?",
        options: ["Bạch Đằng", "Như Nguyệt", "Chi Lăng - Xương Giang", "Ngọc Hồi - Đống Đa"],
        correctAnswer: "Bạch Đằng",
        boardAnswer: "Đằng",
        highlightIndex: 3,
      },
      {
        question: "Địa điểm nào mở đầu chiến lược “Tiên phát chế nhân”?",
        options: ["Ung Châu", "Như Nguyệt", "Đông Bộ Đầu", "Chi Lăng"],
        correctAnswer: "Ung Châu",
        boardAnswer: "Ung Châu",
        highlightIndex: 0,
      },
      {
        question: "Khởi nghĩa nông dân tiêu biểu dưới sự lãnh đạo của Hoàng Hoa Thám là?",
        options: ["Yên Thế", "Hương Khê", "Bãi Sậy", "Ba Đình"],
        correctAnswer: "Yên Thế",
        boardAnswer: "Yên Thế",
        highlightIndex: 0,
      },
      {
        question: "Lãnh tụ của cuộc khởi nghĩa Lam Sơn là ai?",
        options: ["Lê Lợi", "Nguyễn Trãi", "Lê Lai", "Trần Hưng Đạo"],
        correctAnswer: "Lê Lợi",
        boardAnswer: "Lê Lợi",
        highlightIndex: 1,
      },
      {
        question: "Cuộc khởi nghĩa thực hiện “mục tiêu kép”: vừa lật đổ tập đoàn phong kiến cát cứ, vừa đảm nhận sứ mệnh giải phóng dân tộc?",
        options: ["Tây Sơn", "Lam Sơn", "Yên Thế", "Hương Khê"],
        correctAnswer: "Tây Sơn",
        boardAnswer: "Tây Sơn",
        highlightIndex: 0,
      },
    ],
    acceptedAnswers: ["Như Nguyệt", "Nhu Nguyet", "Song Nhu Nguyet"]
  },
  {
    id: "cw-2",
    keyword: "DOCLAP",
    title: "Ô chữ 2",
    theme: "Giải mã từ khóa 6 chữ cái qua 6 hàng ngang.",
    clues: [
      {
        question: "Vị vua nào đặt tên nước là Đại Cồ Việt?",
        options: ["Đinh Tiên Hoàng", "Lê Đại Hành", "Lý Thái Tổ", "Ngô Quyền"],
        correctAnswer: "Đinh Tiên Hoàng",
        boardAnswer: "Đinh",
        highlightIndex: 0,
      },
      {
        question: "Khi quân Tống rơi vào thế bế tắc, khó khăn thì nhà Lý đã chọn biện pháp nào để kết thúc chiến tranh?",
        options: ["Giảng hoà", "Đầu hàng", "Cầu viện", "Rút lui"],
        correctAnswer: "Giảng hoà",
        boardAnswer: "Hoà",
        highlightIndex: 1,
      },
      {
        question: "“Chiến tranh bảo vệ Tổ quốc là cuộc chiến tranh chính nghĩa...”. Tính chất chính nghĩa của cuộc chiến tranh được nhận biết chủ yếu dựa trên cơ sở nào?",
        options: ["Mục đích", "Thời gian diễn ra", "Vũ khí sử dụng", "Số lượng quân lính"],
        correctAnswer: "Mục đích",
        boardAnswer: "Mục đích",
        highlightIndex: 2,
      },
      {
        question: "Người đã chỉ huy nhân dân Đại Cồ Việt tiến hành cuộc kháng chiến chống Tống năm 981 là…",
        options: ["Lê Hoàn", "Đinh Bộ Lĩnh", "Ngô Quyền", "Lý Thường Kiệt"],
        correctAnswer: "Lê Hoàn",
        boardAnswer: "Lê Hoàn",
        highlightIndex: 0,
      },
      {
        question: "Năm 776, Phùng Hưng đã lãnh đạo người Việt nổi dậy đấu tranh chống lại ách cai trị của…?",
        options: ["Nhà Đường", "Nhà Hán", "Nhà Tống", "Nhà Minh"],
        correctAnswer: "Nhà Đường",
        boardAnswer: "Nhà Đường",
        highlightIndex: 2,
      },
      {
        question: "Lý Thường Kiệt chọn sông Như Nguyệt để làm…?",
        options: ["Phòng tuyến", "Kinh đô", "Căn cứ hậu cần", "Thương cảng"],
        correctAnswer: "Phòng tuyến",
        boardAnswer: "Phòng tuyến",
        highlightIndex: 0,
      },
    ],
    acceptedAnswers: ["Độc lập", "Doc lap"]
  },
  {
    id: "cw-3",
    keyword: "BAOVE",
    title: "Ô chữ 3",
    theme: "Giải mã từ khóa 5 chữ cái qua 5 hàng ngang.",
    clues: [
      {
        question: "Ai là tác giả của câu nói nổi tiếng: “Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở bể Đông, chứ không thèm bắt chước người đời cúi đầu cong lưng để làm tì thiếp người ta”?",
        options: ["Bà Triệu", "Hai Bà Trưng", "Lý Chiêu Hoàng", "Dương Vân Nga"],
        correctAnswer: "Bà Triệu",
        boardAnswer: "Bà Triệu",
        highlightIndex: 0,
      },
      {
        question: "Năm 544, Lý Bí lên ngôi vua, tự xưng là…?",
        options: ["Lý Nam Đế", "Triệu Việt Vương", "Mai Hắc Đế", "Đinh Tiên Hoàng"],
        correctAnswer: "Lý Nam Đế",
        boardAnswer: "Lý Nam Đế",
        highlightIndex: 3,
      },
      {
        question: "Kế sách nào của Ngô Quyền đã được quân dân nhà Tiền Lê kế thừa, vận dụng để đánh đuổi quân Tống xâm lược (981)?",
        options: ["Đóng cọc", "Vây thành", "Đánh úp doanh trại", "Tập kích đường núi"],
        correctAnswer: "Đóng cọc",
        boardAnswer: "Đóng cọc",
        highlightIndex: 1,
      },
      {
        question: "Trong cuộc kháng chiến chống Tống, quân dân nhà Lý đã sử dụng nghệ thuật quân sự độc đáo nào?",
        options: ["Vây thành diệt viện", "Tiên phát chế nhân", "Thanh dã", "Dụ địch sâu"],
        correctAnswer: "Vây thành diệt viện",
        boardAnswer: "Viện",
        highlightIndex: 0,
      },
      {
        question: "Người lãnh đạo tối cao của cuộc khởi nghĩa Lam Sơn (1418 – 1427) là..?",
        options: ["Lê Lợi", "Nguyễn Trãi", "Lê Lai", "Trần Nguyên Hãn"],
        correctAnswer: "Lê Lợi",
        boardAnswer: "Lê Lợi",
        highlightIndex: 1,
      },
    ],
    acceptedAnswers: ["Bảo vệ", "Bao ve"]
  }
];

export const historicalFlowSets = [
  {
    id: "flow-1",
    title: "Dòng chảy lịch sử: Hai Bà Trưng",
    instruction:
      "Kéo thả dữ kiện vào đúng 4 hộp Bối cảnh, Diễn biến, Kết quả - Ý nghĩa, Di sản. Có dữ kiện thừa gây nhiễu, hãy giữ chúng ở ngoài.",
    sentences: [
      { id: "A", text: "Tháng 3 năm 40, Hai Bà Trưng phất cờ khởi nghĩa tại Hát Môn.", group: "developments" },
      { id: "B", text: "Đền thờ Hai Bà Trưng tại Mê Linh và Hát Môn được gìn giữ đến ngày nay.", group: "legacy" },
      { id: "C", text: "Năm 34, Tô Định sang làm Thái thú quận Giao Chỉ, thi hành chính sách cai trị tàn bạo.", group: "context" },
      { id: "D", text: "Giành lại chủ quyền dân tộc sau nhiều thập kỷ bị mất nước.", group: "result" },
      { id: "E", text: "Năm 39, Thi Sách bị sát hại nhằm khuất phục các thủ lĩnh địa phương.", group: "context" },
      { id: "F", text: "Mở đầu cho truyền thống đấu tranh anh hùng bất khuất.", group: "extra" },
      { id: "G", text: "Năm 40, khởi nghĩa thắng lợi hoàn toàn, Trưng Trắc lên ngôi vua (Trưng Vương).", group: "result" },
      { id: "H", text: "Năm 42, Mã Viện được vua Hán cử sang đàn áp cuộc khởi nghĩa.", group: "developments" },
      { id: "I", text: "Năm 41, Trưng Trắc lên ngôi vua, xưng là Trưng Vương.", group: "extra" },
      { id: "J", text: "Kết thúc hơn 150 năm đô hộ của nhà Tây Hán và Đông Hán.", group: "result" },
    ]
  },
  {
    id: "flow-2",
    title: "Dòng chảy lịch sử: Khởi nghĩa Lam Sơn",
    instruction:
      "Kéo thả dữ kiện vào đúng 4 hộp Bối cảnh, Diễn biến, Kết quả - Ý nghĩa, Di sản. Có dữ kiện thừa gây nhiễu, hãy giữ chúng ở ngoài.",
    sentences: [
      { id: "A", text: "11/1426, chiến thắng Tốt Động - Chúc Động.", group: "developments" },
      { id: "B", text: "Chấm dứt 20 năm ách đô hộ nhà Minh.", group: "result" },
      { id: "C", text: "1407: kháng chiến chống quân Minh thất bại, nước Đại Ngu phải chịu ách đô hộ phương Bắc.", group: "context" },
      { id: "D", text: "Là cuộc chiến tranh giải phóng dân tộc.", group: "result" },
      { id: "E", text: "10/1427, chiến thắng Chi Lăng - Xương Giang.", group: "developments" },
      { id: "F", text: "2/1418: rút quân lên núi Chí Linh.", group: "developments" },
      { id: "G", text: "Chính sách hà khắc, bóc lột tàn bạo của nhà Đường.", group: "extra" },
      { id: "H", text: "có tính nhân dân rộng rãi.", group: "result" },
      { id: "I", text: "Khôi phục nền độc lập dân tộc.", group: "result" },
      { id: "J", text: "Khu Di tích Lam Kinh (Thanh Hoá).", group: "legacy" },
      { id: "K", text: "1424-1426, chuyển hướng chiến lược vào Nghệ An.", group: "developments" },
    ]
  },
  {
    id: "flow-3",
    title: "Dòng chảy lịch sử: Phong trào Tây Sơn",
    instruction:
      "Kéo thả dữ kiện vào đúng 4 hộp Bối cảnh, Diễn biến, Kết quả - Ý nghĩa, Di sản. Có dữ kiện thừa gây nhiễu, hãy giữ chúng ở ngoài.",
    sentences: [
      { id: "A", text: "Di tích Tây Sơn Thượng đạo (Gia Lai).", group: "legacy" },
      { id: "B", text: "1/1785: chiến thắng Rạch Gầm - Xoài Mút.", group: "developments" },
      { id: "C", text: "9/1773: nghĩa quân chiếm được phủ Quy Nhơn.", group: "developments" },
      { id: "D", text: "Khôi phục thống nhất quốc gia.", group: "result" },
      { id: "E", text: "Bảo tàng Quang Trung (Bình Định).", group: "legacy" },
      { id: "F", text: "Giữa thế kỉ XVIII, chính quyền chúa Nguyễn suy yếu dần.", group: "context" },
      { id: "G", text: "1777: Lật đổ được chính quyền chúa Nguyễn.", group: "developments" },
      { id: "H", text: "Mùa xuân 1771, 3 anh em Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ dựng cờ khởi nghĩa ở Tây Sơn.", group: "developments" },
      { id: "I", text: "1789: chiến thắng Ngọc Hồi - Đống Đa.", group: "developments" },
      { id: "J", text: "Đánh tan cuộc xâm lược Xiêm.", group: "result" },
      { id: "K", text: "Bài học về nghệ thuật quân sự “Vây thành diệt viện”.", group: "extra" },
    ]
  },
  {
    id: "flow-4",
    title: "Dòng chảy lịch sử: Khởi nghĩa Lý Bí",
    instruction:
      "Kéo thả dữ kiện vào đúng 4 hộp Bối cảnh, Diễn biến, Kết quả - Ý nghĩa, Di sản. Có dữ kiện thừa gây nhiễu, hãy giữ chúng ở ngoài.",
    sentences: [
      { id: "A", text: "544, Lý Bí lên ngôi vua.", group: "extra" },
      { id: "B", text: "Nhà Lương cai trị tàn bạo.", group: "context" },
      { id: "C", text: "545, Triệu Quang Phục lãnh đạo cuộc khởi nghĩa và giành thắng lợi.", group: "developments" },
      { id: "D", text: "Mùa xuân 544, khởi nghĩa thắng lợi.", group: "developments" },
      { id: "E", text: "542, Lý Bí lãnh đạo nhân dân khởi nghĩa.", group: "developments" },
      { id: "F", text: "Thức tỉnh tinh thần dân tộc.", group: "result" },
      { id: "G", text: "Chùa Khai Quốc (tiền thân của chùa Trấn Quốc ngày nay tại Hà Nội).", group: "legacy" },
    ]
  },
  {
    id: "flow-5",
    title: "Dòng chảy lịch sử: Khúc Thừa Dụ",
    instruction:
      "Kéo thả dữ kiện vào đúng 4 hộp Bối cảnh, Diễn biến, Kết quả - Ý nghĩa, Di sản. Có dữ kiện thừa gây nhiễu, hãy giữ chúng ở ngoài.",
    sentences: [
      { id: "A", text: "Đầu thế kỉ X, góp phần kết thúc ách đô hộ của phong kiến phương Bắc.", group: "result" },
      { id: "B", text: "Đầu thế kỉ X, khởi nghĩa kết thúc hoàn toàn chế độ cai trị phong kiến phương Bắc.", group: "extra" },
      { id: "C", text: "Cuối thế kỉ IX, nhà Đường ngày càng suy yếu.", group: "context" },
      { id: "D", text: "791, nhà Đường đem quân sang đàn áp và chiếm lại.", group: "extra" },
      { id: "E", text: "Đền thờ Khúc Thừa Dụ (Hải Dương).", group: "legacy" },
      { id: "F", text: "905, Khúc Thừa Dụ tập hợp nhân dân chiếm thành Đại La, tự xưng Tiết Độ sứ.", group: "developments" },
      { id: "G", text: "Đầu năm 906: Hoàng đế nhà Đường buộc phải công nhận, phong Khúc Thừa Dụ làm Tiết độ sứ An Nam.", group: "developments" },
    ]
  }
];

/** Phiên bản một bộ (tương thích màn Dòng Chảy Lịch Sử) */
export const historicalFlowSet = historicalFlowSets[0];

const lightningFastQuestionSeeds = [
  {
    content:
      "Cuộc khởi nghĩa đầu tiên do phụ nữ lãnh đạo là cuộc khởi nghĩa nào?",
    correctAnswer: "Khởi nghĩa Hai Bà Trưng",
  },
  { content: "An Dương Vương đặt tên nước là gì?", correctAnswer: "Âu Lạc" },
  {
    content: "Nhà Trần 3 lần kháng chống quân nào?",
    correctAnswer: "Quân Mông - Nguyên",
  },
  { content: "Lý Bí đặt tên nước là gì?", correctAnswer: "Vạn Xuân" },
  { content: "Ai dẹp loạn 12 sứ quân?", correctAnswer: "Đinh Tiên Hoàng" },
  {
    content:
      "Cuộc kháng chiến đầu tiên thất bại trong lịch sử Việt Nam là cuộc kháng chiến nào?",
    correctAnswer: "Kháng chiến chống nhà Triệu",
  },
  {
    content: "Nguyễn Trung Trực đốt cháy tàu Ét-pê-răng ở đâu?",
    correctAnswer: "Sông Vàm Cỏ Đông",
  },
  {
    content:
      "Cuộc kháng chiến đầu tiên trong lịch sử dân tộc là chống lại quân xâm lược nào?",
    correctAnswer: "Quân Tần",
  },
  {
    content:
      "Ai là người lãnh đạo nhân dân Âu Lạc kháng chiến chống quân Tần?",
    correctAnswer: "Thục Phán - An Dương Vương",
  },
  {
    content:
      "Vị tướng nào thời Lý đã chỉ huy trận chiến trên sông Như Nguyệt?",
    correctAnswer: "Lý Thường Kiệt",
  },
  {
    content: "Triều đại nào đã ba lần đại thắng quân Mông - Nguyên?",
    correctAnswer: "Nhà Trần",
  },
  {
    content: 'Vị tướng nào là tác giả của "Hịch tướng sĩ"?',
    correctAnswer: "Trần Hưng Đạo",
  },
  {
    content: "Chiến thắng nào đã kết thúc thời kỳ Bắc thuộc?",
    correctAnswer: "Trận Bạch Đằng giang năm 938",
  },
  {
    content:
      "Cuộc khởi nghĩa nào là tiêu biểu nhất trong phong trào Cần Vương?",
    correctAnswer: "Khởi nghĩa Hương Khê",
  },
  {
    content:
      "Cuộc khởi nghĩa nông dân lớn nhất, kéo dài nhất cuối thế kỷ XIX đầu thế kỷ XX là gì?",
    correctAnswer: "Khởi nghĩa Yên Thế",
  },
  {
    content: 'Bài thơ "Nam Quốc Sơn Hà" của ai?',
    correctAnswer: "Lý Thường Kiệt",
  },
  {
    content:
      "Nghĩa quân Lam Sơn đã sử dụng chiến thuật gì để vây hãm quân Minh tại Đông Quan?",
    correctAnswer: "Vây thành diệt viện",
  },
  {
    content:
      "Nguyên nhân khách quan dẫn đến sự thất bại của các cuộc kháng chiến chống Pháp cuối thế kỷ XIX?",
    correctAnswer: "Tương quan so sánh lực lượng chênh lệch",
  },
  {
    content: "Nguyễn Trãi bị kết án gì?",
    correctAnswer: "Chu di cửu tộc",
  },
  {
    content:
      'Ai là người đã soạn thảo "Hịch tướng sĩ" để khích lệ tinh thần binh sĩ chống quân Mông - Nguyên?',
    correctAnswer: "Trần Hưng Đạo",
  },
  {
    content: 'Cụm từ "Cần Vương" có nghĩa là gì?',
    correctAnswer: "Giúp Vua",
  },
  {
    content:
      "Phong trào Cần Vương bùng nổ mạnh mẽ nhất ở khu vực nào của nước ta?",
    correctAnswer: "Bắc Kì và Trung Kì",
  },
  {
    content: "Ai đã đốt cháy tàu Ét-pê-răng trên sông Vàm Cỏ Đông?",
    correctAnswer: "Nguyễn Trung Trực",
  },
  { content: "Nhà Hồ đặt tên nước là gì?", correctAnswer: "Nước Đại Ngu" },
  {
    content: 'Địa điểm nào mở đầu chiến lược "Tiên phát chế nhân"?',
    correctAnswer: "Ung Châu",
  },
  {
    content: '"Tiên phát chế nhân" có nghĩa là gì?',
    correctAnswer: "Tiến công trước để tự vệ",
  },
  {
    content: "Kế sách vườn không nhà trống hay còn gọi là gì?",
    correctAnswer: "Kế thanh dã",
  },
  {
    content: "Triều đại phong kiến cuối cùng của Việt Nam là gì?",
    correctAnswer: "Triều Nguyễn",
  },
  {
    content:
      "Mục tiêu cuối cùng của phong trào Tây Sơn sau khi đánh đuổi ngoại xâm là gì?",
    correctAnswer: "Thống nhất đất nước",
  },
  {
    content:
      'Câu nói: "Nếu bệ hạ muốn hàng, xin hãy chém đầu thần trước đã" là của ai?',
    correctAnswer: "Trần Hưng Đạo",
  },
];

function buildLightningFastQuestions(seedQuestions) {
  const answerPool = [
    ...new Set(seedQuestions.map((question) => question.correctAnswer).filter(Boolean)),
  ];

  return seedQuestions.map((question, index) => {
    const distractors = [];
    const usedAnswers = new Set([question.correctAnswer]);
    const baseIndex = Math.max(answerPool.indexOf(question.correctAnswer), 0);

    const addDistractor = (candidate) => {
      if (!candidate || usedAnswers.has(candidate)) return;
      usedAnswers.add(candidate);
      distractors.push(candidate);
    };

    for (let step = 1; step < answerPool.length && distractors.length < 3; step += 1) {
      addDistractor(answerPool[(baseIndex + index + step) % answerPool.length]);
      if (distractors.length < 3) {
        addDistractor(answerPool[(baseIndex + step * 3) % answerPool.length]);
      }
    }

    for (const answer of answerPool) {
      if (distractors.length >= 3) break;
      addDistractor(answer);
    }

    const options = [...distractors];
    options.splice(index % 4, 0, question.correctAnswer);

    return {
      content: question.content,
      options,
      correctAnswer: question.correctAnswer,
      explanation: "",
    };
  });
}

export const lightningFastQuestions = buildLightningFastQuestions(
  lightningFastQuestionSeeds
);

export const picturePuzzleItems = [
  {
    id: "bach-dang-sequence",
    title: "Chiến thắng Bạch Đằng",
    instruction:
      "Xem video và sắp xếp 5 khung hình theo đúng trình tự diễn biến của chiến thắng Bạch Đằng.",
    videoUrl: "https://www.youtube.com/watch?v=cPEcXv8qJBc",
    timeLimitSeconds: 90,
    xpReward: 20,
    frames: [
      { imageUrl: picturePuzzleImage("mode8_sequence_bach_dang_1.png"), order: 1 },
      { imageUrl: picturePuzzleImage("mode8_sequence_bach_dang_2.png"), order: 2 },
      { imageUrl: picturePuzzleImage("mode8_sequence_bach_dang_3.png"), order: 3 },
      { imageUrl: picturePuzzleImage("mode8_sequence_bach_dang_4.png"), order: 4 },
      { imageUrl: picturePuzzleImage("mode8_sequence_bach_dang_5.png"), order: 5 },
    ],
  },
  {
    id: "ngoc-hoi-sequence",
    title: "Trận Ngọc Hồi",
    instruction:
      "Xem video và sắp xếp 10 khung hình từ giai đoạn mở đầu đến khi quân Tây Sơn công phá thành công phòng tuyến Ngọc Hồi.",
    videoUrl: "https://www.youtube.com/watch?v=TBHt6smccP8",
    timeLimitSeconds: 150,
    xpReward: 20,
    frames: [
      { imageUrl: picturePuzzleImage("mode8_sequence_ngoc_hoi_1.png"), order: 1 },
      { imageUrl: picturePuzzleImage("mode8_sequence_ngoc_hoi_2.png"), order: 2 },
      { imageUrl: picturePuzzleImage("mode8_sequence_ngoc_hoi_3.png"), order: 3 },
      { imageUrl: picturePuzzleImage("mode8_sequence_ngoc_hoi_4.png"), order: 4 },
      { imageUrl: picturePuzzleImage("mode8_sequence_ngoc_hoi_5.png"), order: 5 },
      { imageUrl: picturePuzzleImage("mode8_sequence_ngoc_hoi_6.png"), order: 6 },
      { imageUrl: picturePuzzleImage("mode8_sequence_ngoc_hoi_7.png"), order: 7 },
      { imageUrl: picturePuzzleImage("mode8_sequence_ngoc_hoi_8.png"), order: 8 },
      { imageUrl: picturePuzzleImage("mode8_sequence_ngoc_hoi_9.png"), order: 9 },
      { imageUrl: picturePuzzleImage("mode8_sequence_ngoc_hoi_10.png"), order: 10 },
    ],
  }
];
