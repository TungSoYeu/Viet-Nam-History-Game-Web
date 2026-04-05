const localImage = (name) => `/assets/images/${name}`;
const picturePuzzleImage = (name) => localImage(`picture-puzzle/${name}`);
const historicalRecognitionImage = (name) =>
  localImage(`historical-recognition/${name}`);

const revealPictureSets = [
  {
    imageUrl: localImage("reveal-picture/hai_ba_trung_mode1.jpg"),
    answer: "Hai Bà Trưng",
    acceptedAnswers: ["Hai Bà Trưng", "Trưng Trắc và Trưng Nhị", "Trưng Trắc Trưng Nhị"],
    caption: "Hai vị nữ anh hùng mở đầu cao trào đấu tranh thời Bắc thuộc.",
    questions: [
      { q: "Cuộc khởi nghĩa do Hai Bà Trưng lãnh đạo diễn ra trong khoảng thời gian nào?", a: "Năm 40 - 43" },
      { q: "Hai Bà Trưng là hình tượng tiêu biểu cho lực lượng lãnh đạo nào trong lịch sử dân tộc?", a: "Phụ nữ" },
      { q: "Quê hương và căn cứ khởi nghĩa gắn với Hai Bà Trưng là ở đâu?", a: "Mê Linh" },
      { q: "Hình tượng chiến đấu nổi tiếng gắn với Hai Bà Trưng trong dân gian là gì?", a: "Cưỡi voi" },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/ngo_quyen_mode1.jpg"),
    answer: "Vua Ngô Quyền",
    acceptedAnswers: ["Vua Ngô Quyền", "Ngô Quyền", "Ngô Vương Quyền"],
    caption: "Người kết thúc hơn một nghìn năm Bắc thuộc bằng chiến thắng Bạch Đằng.",
    questions: [
      { q: "Chiến thắng Bạch Đằng của Ngô Quyền diễn ra vào năm nào?", a: "Năm 938" },
      { q: "Ngô Quyền thường được sử sách tôn vinh là gì đối với nền độc lập dân tộc?", a: "Tổ trung hưng" },
      { q: "Chiến thắng lừng lẫy của Ngô Quyền gắn với con sông nào?", a: "Sông Bạch Đằng" },
      { q: "Ngô Quyền đã mở ra điều gì cho quốc gia sau khi giành lại độc lập?", a: "Triều đại đầu tiên" },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/le_dai_hanh_mode1.jpg"),
    answer: "Vua Lê Đại Hành",
    acceptedAnswers: ["Vua Lê Đại Hành", "Lê Đại Hành", "Lê Hoàn"],
    caption: "Vị vua đánh bại quân Tống và củng cố nền độc lập Đại Cồ Việt.",
    questions: [
      { q: "Cuộc kháng chiến chống Tống do Lê Hoàn lãnh đạo diễn ra vào năm nào?", a: "Năm 981" },
      { q: "Một lần nữa quân dân Đại Cồ Việt làm nên chiến thắng lớn trên con sông nào?", a: "Sông Bạch Đằng" },
      { q: "Nghi lễ nhà vua trực tiếp xuống ruộng cày để khuyến nông dưới thời Lê Đại Hành gọi là gì?", a: "Lễ Tịch điền" },
      { q: "Ai đã trao long bào để Lê Hoàn lên ngôi, cùng triều đình lãnh đạo kháng chiến?", a: "Dương Vân Nga" },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/ly_thuong_kiet_mode1.jpg"),
    answer: "Lý Thường Kiệt",
    acceptedAnswers: ["Lý Thường Kiệt"],
    caption: "Danh tướng thời Lý với chiến lược chủ động đánh Tống.",
    questions: [
      { q: "Kế sách quân sự nổi tiếng của nhà Lý trong kháng chiến chống Tống là gì?", a: "Tiên phát chế nhân" },
      { q: "Cuộc kháng chiến chống Tống thời Lý diễn ra trong khoảng thời gian nào?", a: "1075 - 1077" },
      { q: "Trận quyết chiến chiến lược tiêu biểu gắn với Lý Thường Kiệt là trận nào?", a: "Trận Như Nguyệt" },
      { q: "Nhà Lý đã chọn biện pháp nào để kết thúc chiến tranh khi quân Tống lâm vào thế bế tắc?", a: "Giảng hòa" },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/hung_dao_dai_vuong_mode1.png"),
    answer: "Hưng Đạo Đại Vương",
    acceptedAnswers: ["Hưng Đạo Đại Vương", "Trần Hưng Đạo", "Trần Quốc Tuấn", "Hưng Đạo Vương"],
    caption: "Vị quốc công tiết chế ba lần chỉ huy kháng chiến chống Mông - Nguyên.",
    questions: [
      { q: "Ba lần kháng chiến chống Mông - Nguyên dưới sự chỉ huy của Trần Quốc Tuấn diễn ra vào thế kỉ nào?", a: "Thế kỉ XIII" },
      { q: "Tư tưởng giữ nước nổi tiếng của Trần Hưng Đạo là gì?", a: "Khoan thư sức dân" },
      { q: "Nhận định nào của Trần Hưng Đạo thể hiện thế chủ động của quân dân nhà Trần trong kháng chiến?", a: "Năm nay đánh giặc nhàn" },
      { q: "Nhân dân tôn xưng Trần Hưng Đạo bằng danh hiệu thiêng liêng nào?", a: "Đức thánh Trần" },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/le_thai_to_mode1.jpg"),
    answer: "Vua Lê Thái Tổ",
    acceptedAnswers: ["Vua Lê Thái Tổ", "Lê Thái Tổ", "Lê Lợi", "Bình Định Vương"],
    caption: "Người lãnh đạo khởi nghĩa Lam Sơn và lập nên triều Hậu Lê.",
    questions: [
      { q: "Khởi nghĩa Lam Sơn diễn ra vào thế kỉ nào?", a: "Thế kỉ XV" },
      { q: "Hình ảnh trả gươm nổi tiếng gắn với Lê Lợi được lưu truyền qua truyền thuyết nào?", a: "Truyền thuyết Hồ Gươm" },
      { q: "Sự kiện tập hợp những người đầu tiên cùng Lê Lợi mưu việc lớn được gọi là gì?", a: "Hội thề Lũng Nhai" },
      { q: "Lê Lợi thường được sử sách nhắc đến với vai trò khôi phục cơ nghiệp quốc gia qua danh xưng nào?", a: "Tổ trung hưng" },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/quang_trung_mode1.jpg"),
    answer: "Hoàng đế Quang Trung",
    acceptedAnswers: ["Hoàng đế Quang Trung", "Quang Trung", "Nguyễn Huệ", "Vua Quang Trung"],
    caption: "Người anh hùng Tây Sơn đại phá quân Thanh mùa xuân Kỷ Dậu.",
    questions: [
      { q: "Phong trào Tây Sơn bùng nổ vào khoảng thời gian nào?", a: "Thế kỉ XVIII" },
      { q: "Quang Trung thường được nhân dân gọi bằng hình tượng nào?", a: "Anh hùng áo vải" },
      { q: "Từ ngữ nào mô tả đặc điểm nổi bật của cuộc hành quân ra Bắc đại phá quân Thanh của Quang Trung?", a: "Thần tốc" },
      { q: "Phong trào Tây Sơn dưới sự lãnh đạo của Quang Trung có thể khái quát bằng phẩm chất nào trước các kẻ thù xâm lược?", a: "Bất bại" },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/luy_thay_mode1.png"),
    answer: "Lũy Thầy",
    acceptedAnswers: ["Lũy Thầy"],
    caption: "Công trình quân sự nổi tiếng ở Quảng Bình gắn với Đào Duy Từ.",
    questions: [
      { q: "Lũy Thầy trong lịch sử được biết đến trước hết là một loại công trình gì?", a: "Công trình phòng thủ" },
      { q: "Lũy Thầy gắn với giai đoạn đất nước ở trạng thái nào giữa Đàng Trong và Đàng Ngoài?", a: "Chia cắt" },
      { q: "Ai là người thiết kế và chỉ đạo xây dựng Lũy Thầy?", a: "Đào Duy Từ" },
      { q: "Lũy Thầy thuộc địa phận tỉnh nào hiện nay?", a: "Quảng Bình" },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/go_dong_da_mode1.jpg"),
    answer: "Gò Đống Đa",
    acceptedAnswers: ["Gò Đống Đa", "Đống Đa"],
    caption: "Di tích gắn với chiến thắng Ngọc Hồi - Đống Đa mùa xuân 1789.",
    questions: [
      { q: "Gò Đống Đa hiện nay được xếp vào loại địa điểm lịch sử nào?", a: "Di tích" },
      { q: "Chiến thắng Đống Đa của Quang Trung gắn với mốc thời gian nào trong dịp đầu xuân?", a: "Mùng 5 Tết" },
      { q: "Gò Đống Đa thường được nhắc đến như biểu tượng gì đối với quân Thanh xâm lược?", a: "Mồ chôn quân Thanh" },
      { q: "Gò Đống Đa nằm ở thành phố nào hiện nay?", a: "Hà Nội" },
    ],
  },
  {
    imageUrl: localImage("reveal-picture/tran_nhat_tao_mode1.jpg"),
    answer: "Trận Nhật Tảo",
    acceptedAnswers: ["Trận Nhật Tảo", "Nhật Tảo"],
    caption: "Chiến công đốt tàu Hy Vọng của Nguyễn Trung Trực trong kháng chiến chống Pháp.",
    questions: [
      { q: "Trận Nhật Tảo diễn ra vào năm nào?", a: "1861" },
      { q: "Người lãnh đạo trận đánh đốt tàu ở Nhật Tảo là ai?", a: "Nguyễn Trung Trực" },
      { q: "Tên chiếc tàu Pháp bị nghĩa quân đốt cháy trong trận Nhật Tảo là gì?", a: "Tàu Hy Vọng" },
      { q: "Nhật Tảo là chiến công tiêu biểu thuộc loại sự kiện nào trong chống Pháp nửa sau thế kỉ XIX?", a: "Trận đánh" },
    ],
  },
];

const teammatePackages = [
  {
    id: "historical-figures",
    title: "Gói 1",
    keywords: [
      "Tiên phát chế nhân", "Hội thề Lũng Nhai", "Khởi nghĩa Hát Môn", "Bình Tây Đại Nguyên soái", "Hịch tướng sĩ",
      "Căn cứ Ngàn Trươi", "Nước Vạn Xuân", "Yên Thế", "Mê Linh", "Ngô Vương Quyền"
    ],
  },
  {
    id: "events-movements",
    title: "Gói 2",
    keywords: [
      "Vạn Kiếp tông bí truyền thư", "Hai Bà Trưng", "Kháng chiến chống quân Nam Hán", "Quân trung từ mệnh tập", "Kháng lệnh triều đình",
      "Phá Tống bình Chiêm", "Khởi nghĩa Hương Khê", "Nam quốc sơn hà", "Khởi nghĩa Lam Sơn", "Đề Thám"
    ],
  },
  {
    id: "places-battles",
    title: "Gói 3",
    keywords: [
      "Chiến thuật xây dựng đồn rào", "Hội nghị Diên Hồng", "Thành Cổ Loa", "Ô Mã Nhi", "Phong trào Cần vương",
      "Bình Ngô Đại Cáo", "Dương Đình Nghệ", "Hịch tướng sĩ", "Anh hùng chài lưới", "Hưng Đạo Đại Vương"
    ],
  },
  {
    id: "concepts-terms",
    title: "Gói 4",
    keywords: [
      "Hào Khí Đông A", "Hội nghị Bình Than", "Thái hậu Dương Vân Nga", "Chiến thuật vây thành diệt viện", "Quang Trung",
      "Âu Lạc", "Phòng tuyến sông Như Nguyệt", "Ức Trai", "Khởi nghĩa Yên Thế", "Chiến thắng Bạch Đằng"
    ],
  },
  {
    id: "anti-french-focus",
    title: "Gói 5",
    keywords: [
      "Pháo đài Ba Đình", "Bình Tây Đại Nguyên soái", "Rạch Gầm - Xoài Mút", "Đông Bộ Đầu", "Hội thề Đông Quan",
      "Bình Định Vương", "Vua tôi đồng lòng", "Khởi nghĩa Lam Sơn", "Trương Định", "Hai Bà Trưng"
    ],
  },
];

const historicalRecognitionItems = [
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

const connectingHistoryRounds = [
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

const crosswordSets = [
  {
    id: "cw-1",
    keyword: "NHUNGUYET",
    title: "Từ khóa 1: Như Nguyệt",
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
    title: "Từ khóa 2: Độc lập",
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
        options: ["Mục đích chiến tranh", "Thời gian diễn ra", "Vũ khí sử dụng", "Số lượng quân lính"],
        correctAnswer: "Mục đích chiến tranh",
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
    title: "Từ khóa 3: Bảo vệ",
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

const historicalFlowSets = [
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
      { id: "A", text: "543, Lý Bí lên ngôi vua.", group: "extra" },
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
const historicalFlowSet = historicalFlowSets[0];

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
      "Vị vua nào của nhà Lý đã chỉ huy trận chiến trên sông Như Nguyệt?",
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

const lightningFastQuestions = buildLightningFastQuestions(lightningFastQuestionSeeds);

const picturePuzzleItems = [
  {
    images: [
      picturePuzzleImage("mode8_ngo_quyen_ngo.png"),
      picturePuzzleImage("mode8_ngo_quyen_quyen_anh.png"),
    ],
    prompt: "Đây là nhân vật nào?",
    answer: "Ngô Quyền",
    acceptedAnswers: ["Ngô Quyền"],
    explanation: "Ghép 'ngô' và 'quyền anh' để suy ra nhân vật Ngô Quyền."
  },
  {
    images: [
      picturePuzzleImage("mode8_vuon_khong_nha_trong_vuon.png"),
      picturePuzzleImage("mode8_vuon_khong_nha_trong_khong.png"),
      picturePuzzleImage("mode8_vuon_khong_nha_trong_nha.png"),
      picturePuzzleImage("mode8_vuon_khong_nha_trong_trong.png"),
    ],
    prompt: "Đây là một kế hoạch quân sự tiêu biểu trong LSVN thời nhà Trần?",
    answer: "Vườn không nhà trống",
    acceptedAnswers: ["Vườn không nhà trống"],
    explanation:
      "Ghép 'vườn', 'không', 'nhà' và 'trống' để suy ra kế sách vườn không nhà trống."
  },
  {
    images: [
      picturePuzzleImage("mode8_ho_quy_ly_ho.png"),
      picturePuzzleImage("mode8_ho_quy_ly_quy.png"),
      picturePuzzleImage("mode8_ho_quy_ly_ly.png"),
    ],
    prompt: "Đây là nhân vật nào?",
    answer: "Hồ Quý Ly",
    acceptedAnswers: ["Hồ Quý Ly"],
    explanation: "Ghép 'hồ', 'quý' và 'ly' để suy ra nhân vật Hồ Quý Ly."
  },
  {
    images: [
      picturePuzzleImage("mode8_thang_long_thang.png"),
      picturePuzzleImage("mode8_thang_long_long.png"),
    ],
    prompt: "Đây là tên của kinh đô của nước Đại Việt dưới thời Lý, Trần, Lê Sơ?",
    answer: "Thăng Long",
    acceptedAnswers: ["Thăng Long"],
    explanation: "Ghép 'thăng' và 'long' để suy ra kinh đô Thăng Long."
  },
  {
    images: [
      picturePuzzleImage("mode8_ngoc_hoi_dong_da_ngoc.png"),
      picturePuzzleImage("mode8_ngoc_hoi_dong_da_hoi.png"),
      picturePuzzleImage("mode8_ngoc_hoi_dong_da_dong_da.png"),
    ],
    prompt: "Đây là tên của một trận đánh chống ngoại xâm do Quang Trung lãnh đạo?",
    answer: "Trận Ngọc Hồi - Đống Đa",
    acceptedAnswers: ["Trận Ngọc Hồi - Đống Đa", "Ngọc Hồi - Đống Đa"],
    explanation: "Ghép 'ngọc', 'hồi' và 'Đống Đa' để suy ra trận Ngọc Hồi - Đống Đa."
  },
  {
    images: [
      picturePuzzleImage("mode8_au_lac_au.png"),
      picturePuzzleImage("mode8_au_lac_lac.png"),
    ],
    prompt: "Đây là tên của một nước?",
    answer: "Nước Âu Lạc",
    acceptedAnswers: ["Nước Âu Lạc", "Âu Lạc"],
    explanation: "Ghép 'Âu' và 'lạc' để suy ra tên nước Âu Lạc."
  },
  {
    images: [
      picturePuzzleImage("mode8_tien_phat_che_nhan_tien.png"),
      picturePuzzleImage("mode8_tien_phat_che_nhan_phat.png"),
      picturePuzzleImage("mode8_tien_phat_che_nhan_che.png"),
      picturePuzzleImage("mode8_tien_phat_che_nhan_nhan.png"),
    ],
    prompt: "Đây là tên của một kế sách quân sự thời Lý?",
    answer: "Tiên phát chế nhân",
    acceptedAnswers: ["Tiên phát chế nhân"],
    explanation:
      "Ghép 'tiên', 'phát', 'chế' và 'nhân' để suy ra kế sách 'Tiên phát chế nhân'."
  },
  {
    images: [
      picturePuzzleImage("mode8_tay_son_tay.png"),
      picturePuzzleImage("mode8_tay_son_son.png"),
    ],
    prompt: "Đây là tên của một phong trào tiêu biểu trong lịch sử Việt Nam?",
    answer: "Phong trào Tây Sơn",
    acceptedAnswers: ["Phong trào Tây Sơn", "Tây Sơn"],
    explanation: "Ghép 'tây' và 'sơn' để suy ra phong trào Tây Sơn."
  },
  {
    images: [
      picturePuzzleImage("mode8_nguyen_trung_truc_nguyen.png"),
      picturePuzzleImage("mode8_nguyen_trung_truc_trung_truc.png"),
    ],
    prompt: "Đây là nhân vật nào?",
    answer: "Nguyễn Trung Trực",
    acceptedAnswers: ["Nguyễn Trung Trực"],
    explanation:
      "Ghép ký tự Hán gợi 'Nguyễn' với hình gợi 'trung trực' để suy ra Nguyễn Trung Trực."
  },
  {
    images: [
      picturePuzzleImage("mode8_o_ma_nhi_o.png"),
      picturePuzzleImage("mode8_o_ma_nhi_ma.png"),
      picturePuzzleImage("mode8_o_ma_nhi_nhi.png"),
    ],
    prompt: "Đây là nhân vật nào?",
    answer: "Ô Mã Nhi",
    acceptedAnswers: ["Ô Mã Nhi"],
    explanation: "Ghép 'ô', 'mã' và 'nhi' để suy ra nhân vật Ô Mã Nhi."
  },
  {
    images: [
      picturePuzzleImage("mode8_yen_the_yen.png"),
      picturePuzzleImage("mode8_yen_the_the.png"),
    ],
    prompt: "Đây là tên của cuộc khởi nghĩa?",
    answer: "Khởi nghĩa Yên Thế",
    acceptedAnswers: ["Khởi nghĩa Yên Thế", "Yên Thế"],
    explanation: "Ghép 'yên' và 'thế' để suy ra cuộc khởi nghĩa Yên Thế."
  }
];

module.exports = {
  revealPictureSets,
  teammatePackages,
  historicalRecognitionItems,
  connectingHistoryRounds,
  crosswordSets,
  historicalFlowSets,
  historicalFlowSet,
  lightningFastQuestions,
  picturePuzzleItems,
};
