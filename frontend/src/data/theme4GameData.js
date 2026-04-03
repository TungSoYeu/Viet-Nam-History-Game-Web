const localImage = (name) => `/assets/images/${name}`;

const toSvgDataUri = (svg) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const createDiagram = ({ title, subtitle, boxes, accent = "#d97706" }) =>
  toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="900" height="520" fill="url(#bg)" rx="28" />
      <text x="450" y="68" text-anchor="middle" fill="#f8fafc" font-size="34" font-family="Arial" font-weight="700">${title}</text>
      <text x="450" y="104" text-anchor="middle" fill="#cbd5e1" font-size="18" font-family="Arial">${subtitle}</text>
      ${boxes
        .map(
          (box, index) => `
            <rect x="${72 + index * 258}" y="186" width="220" height="144" rx="20" fill="#111827" stroke="${accent}" stroke-width="3" />
            <text x="${182 + index * 258}" y="228" text-anchor="middle" fill="${accent}" font-size="20" font-family="Arial" font-weight="700">${box.heading}</text>
            <text x="${182 + index * 258}" y="266" text-anchor="middle" fill="#e5e7eb" font-size="18" font-family="Arial">${box.line1}</text>
            <text x="${182 + index * 258}" y="294" text-anchor="middle" fill="#e5e7eb" font-size="18" font-family="Arial">${box.line2}</text>
            ${
              index < boxes.length - 1
                ? `<path d="M ${292 + index * 258} 258 L ${330 + index * 258} 258" stroke="${accent}" stroke-width="5" marker-end="url(#arrow)" />`
                : ""
            }
          `
        )
        .join("")}
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="${accent}" />
        </marker>
      </defs>
      <text x="450" y="410" text-anchor="middle" fill="#94a3b8" font-size="17" font-family="Arial">
        Lược đồ chỉ dùng cho nhận diện. Các mốc thời gian được làm nổi bật có chủ ý.
      </text>
    </svg>
  `);

const createClueCard = ({ label, accent = "#38bdf8" }) =>
  toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
      <defs>
        <linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#111827" />
        </linearGradient>
      </defs>
      <rect width="640" height="640" rx="40" fill="url(#card)" />
      <rect x="28" y="28" width="584" height="584" rx="32" fill="none" stroke="${accent}" stroke-width="8" />
      <text x="320" y="128" text-anchor="middle" fill="#cbd5e1" font-size="24" font-family="Arial" font-weight="700">GOI Y LICH SU</text>
      <circle cx="320" cy="288" r="108" fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-width="4" />
      <text x="320" y="312" text-anchor="middle" fill="#f8fafc" font-size="64" font-family="Arial" font-weight="700">${label}</text>
      <text x="320" y="470" text-anchor="middle" fill="#94a3b8" font-size="22" font-family="Arial">Ghep cac tu khoa de tim dap an</text>
    </svg>
  `);

export const revealPictureSets = [
  {
    imageUrl: localImage("le_loi.png"),
    answer: "Lê Lợi",
    acceptedAnswers: ["Lê Lợi", "Lê Thái Tổ", "Bình Định Vương"],
    caption: "Lãnh tụ khởi nghĩa Lam Sơn.",
    questions: [
      { q: "Lê Lợi phất cờ khởi nghĩa ở đâu?", a: "Lam Sơn" },
      { q: "Khởi nghĩa Lam Sơn bùng nổ vào năm nào?", a: "1418" },
      { q: "Ai là quân sư kiệt xuất đồng hành với Lê Lợi?", a: "Nguyễn Trãi" },
      { q: "Triều đại do Lê Lợi sáng lập sau thắng lợi là gì?", a: "Hậu Lê" },
    ],
  },
  {
    imageUrl: localImage("nguyen_trai.png"),
    answer: "Nguyễn Trãi",
    acceptedAnswers: ["Nguyễn Trãi", "Ức Trai"],
    caption: "Danh nhân văn hóa thế giới.",
    questions: [
      { q: "Hiệu nổi tiếng của Nguyễn Trãi là gì?", a: "Ức Trai" },
      { q: "Nguyễn Trãi dâng kế sách gì cho Lê Lợi?", a: "Bình Ngô sách" },
      { q: "Tác phẩm được xem là bản tuyên ngôn độc lập thứ hai là gì?", a: "Bình Ngô Đại Cáo" },
      { q: "Vụ án lịch sử gắn với bi kịch của Nguyễn Trãi là gì?", a: "Lệ Chi Viên" },
    ],
  },
  {
    imageUrl: localImage("nguyen_trung_truc.png"),
    answer: "Nguyễn Trung Trực",
    acceptedAnswers: ["Nguyễn Trung Trực"],
    caption: "Anh hùng dân tộc kháng chiến chống Pháp.",
    questions: [
      { q: "Nguyễn Trung Trực nổi tiếng với chiến công đốt tàu nào của Pháp?", a: "L'Espérance" },
      { q: "Chiến công đốt tàu của ông diễn ra trên dòng sông nào?", a: "Nhật Tảo" },
      { q: "Ông chỉ huy nghĩa quân đánh chiếm đồn nào ở Rạch Giá?", a: "Đồn Kiên Giang" },
      { q: "Câu nói bất hủ của ông kết thúc bằng mệnh đề nào?", a: "Mới hết người Nam đánh Tây" },
    ],
  },
  {
    imageUrl: localImage("phan_dinh_phung.png"),
    answer: "Phan Đình Phùng",
    acceptedAnswers: ["Phan Đình Phùng"],
    caption: "Lãnh tụ khởi nghĩa Hương Khê.",
    questions: [
      { q: "Phan Đình Phùng là lãnh tụ của cuộc khởi nghĩa nào?", a: "Hương Khê" },
      { q: "Khởi nghĩa Hương Khê thuộc phong trào nào?", a: "Cần Vương" },
      { q: "Ai là cộng sự nổi bật giúp nghĩa quân chế tạo súng trường?", a: "Cao Thắng" },
      { q: "Căn cứ lớn của nghĩa quân Phan Đình Phùng là vùng nào?", a: "Vũ Quang" },
    ],
  },
  {
    imageUrl: localImage("hoang_hoa_tham.png"),
    answer: "Hoàng Hoa Thám",
    acceptedAnswers: ["Hoàng Hoa Thám", "Đề Thám"],
    caption: "Hùm thiêng Yên Thế.",
    questions: [
      { q: "Biệt danh nổi tiếng của Hoàng Hoa Thám là gì?", a: "Hùm thiêng Yên Thế" },
      { q: "Ông là thủ lĩnh của cuộc khởi nghĩa nào?", a: "Yên Thế" },
      { q: "Căn cứ quan trọng của nghĩa quân Yên Thế là ở đâu?", a: "Phồn Xương" },
      { q: "Khởi nghĩa Yên Thế kéo dài gần bao lâu?", a: "Gần 30 năm" },
    ],
  },
  {
    imageUrl: localImage("ba_trieu.png"),
    answer: "Bà Triệu",
    acceptedAnswers: ["Bà Triệu", "Triệu Thị Trinh"],
    caption: "Anh hùng dân tộc thời Bắc thuộc.",
    questions: [
      { q: "Bà Triệu khởi nghĩa chống quân nào?", a: "Đông Ngô" },
      { q: "Bà Triệu phất cờ khởi nghĩa ở đâu?", a: "Núi Nưa" },
      { q: "Cuộc khởi nghĩa của Bà Triệu nổ ra vào năm nào?", a: "248" },
      { q: "Hình ảnh cưỡi con vật gì ra trận gắn liền với Bà Triệu?", a: "Voi" },
    ],
  },
  {
    imageUrl: localImage("ly_thuong_kiet.png"),
    answer: "Lý Thường Kiệt",
    acceptedAnswers: ["Lý Thường Kiệt"],
    caption: "Người chỉ huy kháng chiến chống Tống.",
    questions: [
      { q: "Phòng tuyến nổi tiếng gắn liền với Lý Thường Kiệt là gì?", a: "Như Nguyệt" },
      { q: "Bài thơ thần được cho là của Lý Thường Kiệt là gì?", a: "Nam quốc sơn hà" },
      { q: "Ông chỉ huy quân dân ta chống lại nhà nào?", a: "Nhà Tống" },
      { q: "Lý Thường Kiệt đã chủ trương chiến thuật gì?", a: "Tiên phát chế nhân" },
    ],
  },
  {
    imageUrl: localImage("tran_hung_dao.png"),
    answer: "Trần Hưng Đạo",
    acceptedAnswers: ["Trần Hưng Đạo", "Trần Quốc Tuấn"],
    caption: "Vị tướng tài ba ba lần thắng quân Nguyên.",
    questions: [
      { q: "Tác phẩm nổi tiếng ông viết để khích lệ tướng sĩ là gì?", a: "Hịch tướng sĩ" },
      { q: "Hưng Đạo Vương gắn với chiến thắng trên dòng sông nào năm 1288?", a: "Bạch Đằng" },
      { q: "Ông được triều đình phong tước hiệu gì?", a: "Quốc công Tiết chế" },
      { q: "Trần Hưng Đạo gắn liền với tư tưởng quân sự gì?", a: "Khoan thư sức dân" },
    ],
  },
  {
    imageUrl: localImage("truong_dinh.png"),
    answer: "Trương Định",
    acceptedAnswers: ["Trương Định"],
    caption: "Bình Tây Đại Nguyên soái.",
    questions: [
      { q: "Trương Định được nhân dân suy tôn danh hiệu gì?", a: "Bình Tây Đại Nguyên soái" },
      { q: "Ông lãnh đạo nhân dân vùng nào kháng Pháp?", a: "Gò Công" },
      { q: "Căn cứ chính của nghĩa quân Trương Định ở đâu?", a: "Tân Hòa" },
      { q: "Ông hi sinh vào năm nào?", a: "1864" },
    ],
  },
  {
    imageUrl: localImage("nguyen_hue.png"),
    answer: "Quang Trung",
    acceptedAnswers: ["Quang Trung", "Nguyễn Huệ"],
    caption: "Anh hùng áo vải Tây Sơn.",
    questions: [
      { q: "Chiến thắng vĩ đại nào đánh tan 29 vạn quân Thanh?", a: "Ngọc Hồi - Đống Đa" },
      { q: "Ông lên ngôi hoàng đế vào năm nào?", a: "1788" },
      { q: "Niên hiệu của Nguyễn Huệ sau khi lên ngôi là gì?", a: "Quang Trung" },
      { q: "Chiến thắng nào ở miền Nam đánh tan 5 vạn quân Xiêm?", a: "Rạch Gầm - Xoài Mút" },
    ],
  },
];

export const teammatePackages = [
  {
    id: "historical-figures",
    title: "Gói 1: Nhân Vật Lịch Sử",
    keywords: [
      "Hai Bà Trưng", "Bà Triệu", "Ngô Quyền", "Lê Hoàn", "Lý Thường Kiệt",
      "Trần Hưng Đạo", "Lê Lợi", "Nguyễn Trãi", "Quang Trung", "Trương Định"
    ],
  },
  {
    id: "events-movements",
    title: "Gói 2: Sự Kiện - Phong Trào",
    keywords: [
      "Khởi nghĩa Hai Bà Trưng", "Khởi nghĩa Bà Triệu", "Kháng chiến chống Tống thời Lý", "Ba lần kháng chiến chống Nguyên - Mông", "Khởi nghĩa Lam Sơn",
      "Phong trào Cần Vương", "Khởi nghĩa Yên Thế", "Khởi nghĩa Hương Khê", "Khởi nghĩa Bãi Sậy", "Chiến thắng Ngọc Hồi - Đống Đa"
    ],
  },
  {
    id: "places-battles",
    title: "Gói 3: Địa Danh - Trận Đánh",
    keywords: [
      "Sông Bạch Đằng", "Phòng tuyến Như Nguyệt", "Lam Sơn", "Chi Lăng - Xương Giang", "Vũ Quang",
      "Yên Thế", "Nhật Tảo", "Gò Công", "Rạch Gầm - Xoài Mút", "Ngọc Hồi - Đống Đa"
    ],
  },
  {
    id: "concepts-terms",
    title: "Gói 4: Khái Niệm - Thuật Ngữ",
    keywords: [
      "Nam quốc sơn hà", "Hịch tướng sĩ", "Bình Ngô Đại Cáo", "Bình Ngô sách", "Tiên phát chế nhân",
      "Khoan thư sức dân", "Tâm công", "Cần Vương", "Bình Tây Đại Nguyên soái", "Hùm thiêng Yên Thế"
    ],
  },
  {
    id: "anti-french-focus",
    title: "Gói 5: Chống Pháp Cuối XIX",
    keywords: [
      "Nguyễn Trung Trực", "Phan Đình Phùng", "Hoàng Hoa Thám", "Nguyễn Thiện Thuật", "Cao Thắng",
      "Hàm Nghi", "Tôn Thất Thuyết", "Ba Đình", "Phồn Xương", "Tân Hòa"
    ],
  },
];

export const historicalRecognitionItems = [
  // 5 items: Nhận diện từ khóa qua hình ảnh/lược đồ
  {
    id: "recog-1",
    type: "image",
    imageUrl: localImage("le_loi.png"),
    title: "Nhận diện nhân vật",
    prompt: "Xác định tên nhân vật lịch sử qua bức tượng đài này.",
    acceptedAnswers: ["Lê Lợi", "Lê Thái Tổ"],
    explanation: "Đây là Lê Lợi, lãnh tụ khởi nghĩa Lam Sơn."
  },
  {
    id: "recog-2",
    type: "image",
    imageUrl: localImage("nguyen_trai.png"),
    title: "Nhận diện nhân vật",
    prompt: "Xác định tên nhân vật qua bức chân dung truyền thần này.",
    acceptedAnswers: ["Nguyễn Trãi", "Ức Trai"],
    explanation: "Đây là Nguyễn Trãi, tác giả Bình Ngô Đại Cáo."
  },
  {
    id: "recog-3",
    type: "diagram",
    imageUrl: createDiagram({
      title: "Lược đồ trận Bạch Đằng 938",
      subtitle: "Trận phục kích bãi cọc",
      boxes: [
        { heading: "Nhử địch", line1: "Thủy quân giả thua", line2: "Dẫn địch vào sông" },
        { heading: "Phục kích", line1: "Đợi thủy triều rút", line2: "Đóng cọc ngầm" },
        { heading: "Tấn công", line1: "Tổng phản công", line2: "Tiêu diệt Nam Hán" }
      ]
    }),
    title: "Nhận diện lược đồ",
    prompt: "Lược đồ này mô tả trận chiến nổi tiếng nào trên sông?",
    acceptedAnswers: ["Bạch Đằng", "Trận Bạch Đằng 938"],
    explanation: "Đây là chiến thắng Bạch Đằng của Ngô Quyền."
  },
  {
    id: "recog-4",
    type: "image",
    imageUrl: localImage("hoang_hoa_tham.png"),
    title: "Nhận diện nhân vật",
    prompt: "Đây là nhân vật nào trong phong trào kháng chiến chống Pháp?",
    acceptedAnswers: ["Hoàng Hoa Thám", "Đề Thám"],
    explanation: "Đây là Hoàng Hoa Thám, thủ lĩnh khởi nghĩa Yên Thế."
  },
  {
    id: "recog-5",
    type: "diagram",
    imageUrl: createDiagram({
      title: "Lược đồ khởi nghĩa Hương Khê",
      subtitle: "Đỉnh cao phong trào Cần Vương",
      boxes: [
        { heading: "Căn cứ", line1: "Vũ Quang", line2: "Hà Tĩnh" },
        { heading: "Lãnh tụ", line1: "Phan Đình Phùng", line2: "Cao Thắng" },
        { heading: "Vũ khí", line1: "Súng trường", line2: "Tự chế tạo" }
      ]
    }),
    title: "Nhận diện lược đồ",
    prompt: "Lược đồ trên gắn với cuộc khởi nghĩa tiêu biểu nào?",
    acceptedAnswers: ["Hương Khê", "Khởi nghĩa Hương Khê"],
    explanation: "Đây là cuộc khởi nghĩa Hương Khê do Phan Đình Phùng lãnh đạo."
  },
  // 5 items: Nhận diện hình ảnh qua từ khóa
  {
    id: "recog-6",
    type: "keyword_hint",
    title: "Nhận diện qua từ khóa",
    prompt: "Từ khóa: Năm 40, Hát Môn, Mê Linh, 'Đền nợ nước, trả thù nhà'. Đối tượng là ai?",
    acceptedAnswers: ["Hai Bà Trưng", "Trưng Trắc Trưng Nhị"],
    explanation: "Dữ kiện gắn liền với cuộc khởi nghĩa của Hai Bà Trưng năm 40.",
    imageToFind: localImage("hai_ba_trung.png")
  },
  {
    id: "recog-7",
    type: "keyword_hint",
    title: "Nhận diện qua từ khóa",
    prompt: "Từ khóa: Phòng tuyến Như Nguyệt, Nam quốc sơn hà, Tiên phát chế nhân. Đối tượng là ai?",
    acceptedAnswers: ["Lý Thường Kiệt"],
    explanation: "Các từ khóa đặc trưng cho sự nghiệp của Thái úy Lý Thường Kiệt.",
    imageToFind: localImage("ly_thuong_kiet.png")
  },
  {
    id: "recog-8",
    type: "keyword_hint",
    title: "Nhận diện qua từ khóa",
    prompt: "Từ khóa: Nhật Tảo, Kiên Giang, 'Bao giờ người Tây nhổ hết cỏ nước Nam...'. Đối tượng là ai?",
    acceptedAnswers: ["Nguyễn Trung Trực"],
    explanation: "Đây là danh ngôn và chiến công của người anh hùng Nguyễn Trung Trực.",
    imageToFind: localImage("nguyen_trung_truc.png")
  },
  {
    id: "recog-9",
    type: "keyword_hint",
    title: "Nhận diện qua từ khóa",
    prompt: "Từ khóa: Năm 1075, Phá Tống bình Chiêm, Ung Châu, Khâm Châu. Sự kiện nào?",
    acceptedAnswers: ["Kháng chiến chống Tống thời Lý", "Lý Thường Kiệt đánh Tống"],
    explanation: "Đây là cuộc tiến công sang đất Tống để tự vệ của nhà Lý.",
    imageToFind: localImage("khang_chien_chong_tong.png")
  },
  {
    id: "recog-10",
    type: "keyword_hint",
    title: "Nhận diện qua từ khóa",
    prompt: "Từ khóa: Năm 1789, Rồng lửa, Đống Đa, Ngọc Hồi. Trận đánh nào?",
    acceptedAnswers: ["Ngọc Hồi Đống Đa", "Đại phá quân Thanh"],
    explanation: "Đây là đại thắng mùa xuân năm Kỷ Dậu của vua Quang Trung.",
    imageToFind: localImage("nguyen_hue.png")
  }
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
    keyword: "DOCLAP",
    title: "Từ khóa 1: Độc lập",
    theme: "Quyền thiêng liêng của một dân tộc",
    clues: [
      { question: "Vị vua sáng lập triều Hậu Lê?", options: ["Lê Lợi", "Lê Thánh Tông", "Lê Hoàn", "Lê Thái Tông"], correctAnswer: "Lê Lợi" },
      { question: "Bản tuyên ngôn độc lập thứ 2 là gì?", options: ["Nam quốc sơn hà", "Bình Ngô Đại Cáo", "Tuyên ngôn độc lập", "Hịch tướng sĩ"], correctAnswer: "Bình Ngô Đại Cáo" },
      { question: "Người anh hùng áo vải Tây Sơn?", options: ["Nguyễn Huệ", "Nguyễn Nhạc", "Nguyễn Lữ", "Nguyễn Ánh"], correctAnswer: "Nguyễn Huệ" },
      { question: "Cuộc khởi nghĩa gắn với Vũ Quang?", options: ["Hương Khê", "Yên Thế", "Bãi Sậy", "Hùng Lĩnh"], correctAnswer: "Hương Khê" },
      { question: "Trận thắng tiêu diệt viện binh nhà Minh?", options: ["Chi Lăng", "Đống Đa", "Bạch Đằng", "Như Nguyệt"], correctAnswer: "Chi Lăng" }
    ],
    acceptedAnswers: ["Độc lập", "Doc lap"]
  },
  {
    id: "cw-2",
    keyword: "BACHDANG",
    title: "Từ khóa 2: Bạch Đằng",
    theme: "Dòng sông gắn với chiến thắng chống ngoại xâm",
    clues: [
      { question: "Ai chỉ huy đại thắng trên sông Bạch Đằng năm 938?", options: ["Ngô Quyền", "Lê Hoàn", "Trần Hưng Đạo", "Lý Thường Kiệt"], correctAnswer: "Ngô Quyền" },
      { question: "Chiến thuật trận Bạch Đằng 1288 của nhà Trần?", options: ["Cọc ngầm, nhử giặc", "Phục kích núi", "Vây thành", "Tấn công đường bộ"], correctAnswer: "Cọc ngầm, nhử giặc" },
      { question: "Kẻ thù bị đánh bại tại Bạch Đằng năm 938?", options: ["Nam Hán", "Nhà Tống", "Chiêm Thành", "Nhà Minh"], correctAnswer: "Nam Hán" },
      { question: "Chiến thắng Bạch Đằng góp phần chấm dứt điều gì?", options: ["Nghìn năm Bắc thuộc", "Ách Pháp", "Ách Minh", "Loạn 12 sứ quân"], correctAnswer: "Nghìn năm Bắc thuộc" },
      { question: "Tướng Trần nào gắn với lần Bạch Đằng thứ ba?", options: ["Trần Hưng Đạo", "Trần Nhân Tông", "Trần Quang Khải", "Trần Thủ Độ"], correctAnswer: "Trần Hưng Đạo" },
      { question: "Bạch Đằng thuộc tỉnh nào ngày nay?", options: ["Quảng Ninh", "Hải Phòng", "Hà Nam", "Hưng Yên"], correctAnswer: "Hải Phòng" }
    ],
    acceptedAnswers: ["Bạch Đằng", "Bach Dang", "Song Bach Dang"]
  },
  {
    id: "cw-3",
    keyword: "CANVUONG",
    title: "Từ khóa 3: Cần Vương",
    theme: "Phong trào yêu vua, giành độc lập cuối XIX",
    clues: [
      { question: "Phong trào Cần Vương diễn ra chủ yếu thời gian nào?", options: ["Cuối thế kỷ XIX", "Đầu thế kỷ XX", "Thế kỷ XVII", "Thế kỷ XVIII"], correctAnswer: "Cuối thế kỷ XIX" },
      { question: "Cuộc khởi nghĩa nào xem là đỉnh cao Cần Vương?", options: ["Hương Khê", "Yên Thế", "Bãi Sậy", "Ba Đình"], correctAnswer: "Hương Khê" },
      { question: "Lãnh tụ tiêu biểu khởi nghĩa Hương Khê?", options: ["Phan Đình Phùng", "Hoàng Hoa Thám", "Trương Định", "Nguyễn Trung Trực"], correctAnswer: "Phan Đình Phùng" },
      { question: "Khẩu hiệu 'Cần Vương' thể hiện lòng trung với ai?", options: ["Vua nhà Nguyễn", "Vua Lê", "Vua Trần", "Vua Lý"], correctAnswer: "Vua nhà Nguyễn" },
      { question: "Căn cứ Vũ Quang gắn với khởi nghĩa nào?", options: ["Hương Khê", "Yên Thế", "Lam Sơn", "Tây Sơn"], correctAnswer: "Hương Khê" },
      { question: "Cộng sự nổi tiếng giúp chế tạo súng của Phan Đình Phùng?", options: ["Cao Thắng", "Nguyễn Trãi", "Trần Quốc Toản", "Lê Lai"], correctAnswer: "Cao Thắng" },
      { question: "Đế quốc nào đang xâm lược khi phong trào Cần Vương bùng nổ?", options: ["Pháp", "Thanh", "Mông Cổ", "Minh"], correctAnswer: "Pháp" }
    ],
    acceptedAnswers: ["Cần Vương", "Can Vuong"]
  },
  {
    id: "cw-4",
    keyword: "YENTHE",
    title: "Từ khóa 4: Yên Thế",
    theme: "Khởi nghĩa kéo dài ở Bắc Giang",
    clues: [
      { question: "Biệt danh của Hoàng Hoa Thám?", options: ["Hùm thiêng Yên Thế", "Ông Đề", "Bình Tây Đại Nguyên soái", "Thủ khoa"], correctAnswer: "Hùm thiêng Yên Thế" },
      { question: "Khởi nghĩa Yên Thế chống lực lượng nào?", options: ["Pháp", "Minh", "Xiêm", "Thanh"], correctAnswer: "Pháp" },
      { question: "Căn cứ lịch sử nổi bật của nghĩa quân Yên Thế?", options: ["Phồn Xương", "Lam Sơn", "Vũ Quang", "Cổ Loa"], correctAnswer: "Phồn Xương" },
      { question: "Khởi nghĩa Yên Thế kéo dài khoảng bao lâu?", options: ["Gần 30 năm", "5 năm", "100 năm", "2 năm"], correctAnswer: "Gần 30 năm" },
      { question: "Thủ lĩnh khởi nghĩa Yên Thế là ai?", options: ["Hoàng Hoa Thám", "Phan Đình Phùng", "Trương Định", "Nguyễn Thiện Thuật"], correctAnswer: "Hoàng Hoa Thám" },
      { question: "Tỉnh nào là địa bàn chính Yên Thế?", options: ["Bắc Giang", "Hà Tĩnh", "Thanh Hóa", "Nghệ An"], correctAnswer: "Bắc Giang" }
    ],
    acceptedAnswers: ["Yên Thế", "Yen The", "Khoi nghia Yen The"]
  },
  {
    id: "cw-5",
    keyword: "LAMSON",
    title: "Từ khóa 5: Lam Sơn",
    theme: "Căn cứ và cuộc khởi nghĩa của Lê Lợi",
    clues: [
      { question: "Lê Lợi khởi nghĩa năm nào?", options: ["1418", "1400", "1427", "938"], correctAnswer: "1418" },
      { question: "Kẻ thù chính của khởi nghĩa Lam Sơn?", options: ["Nhà Minh", "Nhà Tống", "Pháp", "Xiêm"], correctAnswer: "Nhà Minh" },
      { question: "Năm 1427 gắn với chiến thắng nào?", options: ["Chi Lăng - Xương Giang", "Bạch Đằng", "Ngọc Hồi - Đống Đa", "Tốt Động"], correctAnswer: "Chi Lăng - Xương Giang" },
      { question: "Quân sư nổi tiếng của Lê Lợi?", options: ["Nguyễn Trãi", "Trần Hưng Đạo", "Lý Thường Kiệt", "Phạm Ngũ Lão"], correctAnswer: "Nguyễn Trãi" },
      { question: "Triều đại sau thắng lợi Lam Sơn?", options: ["Hậu Lê", "Nhà Lý", "Nhà Trần", "Nhà Trịnh"], correctAnswer: "Hậu Lê" },
      { question: "Hội thề lịch sử gắn với đuổi Minh?", options: ["Đông Quan", "Diên Hồng", "Bình Than", "Nhất Trung"], correctAnswer: "Đông Quan" },
      { question: "Khởi nghĩa Lam Sơn thuộc Chủ đề 4 vì?", options: ["Kháng chiến trước 1945", "Sau hiến pháp 1946", "Thời Lý", "Thời Nguyễn mới"], correctAnswer: "Kháng chiến trước 1945" },
      { question: "Vùng núi Thanh Hoá hiện diện trong giai đoạn nào của Lam Sơn?", options: ["Xây dựng lực lượng ban đầu", "Đánh Tây Sơn", "Chống Pháp", "Nam tiến"], correctAnswer: "Xây dựng lực lượng ban đầu" }
    ],
    acceptedAnswers: ["Lam Sơn", "Lam Son", "Khoi nghia Lam Son"]
  }
];

export const historicalFlowSets = [
  {
    id: "set-1",
    title: "Tiến trình Khởi nghĩa Lam Sơn",
    instruction: "Sắp xếp 10 dữ kiện sau vào 4 nhóm tiến trình.",
    sentences: [
      { id: "A", text: "1407: Giặc Minh xâm lược và đặt ách đô hộ.", group: "context" },
      { id: "B", text: "1418: Lê Lợi dựng cờ khởi nghĩa tại Lam Sơn.", group: "context" },
      { id: "C", text: "1424: Chuyển hướng quân vào Nghệ An.", group: "developments" },
      { id: "D", text: "1425: Giải phóng Tân Bình, Thuận Hóa.", group: "developments" },
      { id: "E", text: "1426: Thắng lớn ở Tốt Động - Chúc Động.", group: "developments" },
      { id: "F", text: "1427: Đại thắng Chi Lăng - Xương Giang.", group: "developments" },
      { id: "G", text: "1427: Hội thề Đông Quan, quân Minh rút về.", group: "result" },
      { id: "H", text: "1428: Lê Lợi lên ngôi hoàng đế.", group: "result" },
      { id: "I", text: "Bình Ngô Đại Cáo khẳng định chủ quyền.", group: "legacy" },
      { id: "J", text: "Bài học về đoàn kết toàn dân tộc.", group: "legacy" }
    ]
  }
];

/** Phiên bản một bộ (tương thích màn Dòng Chảy Lịch Sử) */
export const historicalFlowSet = historicalFlowSets[0];

export const lightningFastQuestions = [
  { content: "Năm nổ ra khởi nghĩa Hai Bà Trưng?", options: ["40", "43", "248", "938"], correctAnswer: "40", explanation: "Mùa xuân năm 40." },
  { content: "Bà Triệu khởi nghĩa chống quân nào?", options: ["Đông Ngô", "Nam Hán", "Nhà Minh", "Nhà Tống"], correctAnswer: "Đông Ngô", explanation: "Năm 248 chống quân Ngô." },
  { content: "Ai chỉ huy trận Bạch Đằng 938?", options: ["Ngô Quyền", "Lê Hoàn", "Trần Hưng Đạo", "Lý Bí"], correctAnswer: "Ngô Quyền", explanation: "Chiến thắng chấm dứt nghìn năm Bắc thuộc." },
  { content: "Bài thơ thần trên sông Như Nguyệt?", options: ["Nam quốc sơn hà", "Hịch tướng sĩ", "Bình Ngô Đại Cáo", "Tụng giá hoàn kinh sư"], correctAnswer: "Nam quốc sơn hà", explanation: "Bản tuyên ngôn độc lập đầu tiên." },
  { content: "Tác giả Hịch tướng sĩ là ai?", options: ["Trần Hưng Đạo", "Nguyễn Trãi", "Trần Quang Khải", "Lê Thánh Tông"], correctAnswer: "Trần Hưng Đạo", explanation: "Viết để khích lệ quân sĩ chống Nguyên." },
  { content: "Địa bàn khởi nghĩa Yên Thế?", options: ["Bắc Giang", "Thanh Hóa", "Hà Tĩnh", "Nam Định"], correctAnswer: "Bắc Giang", explanation: "Căn cứ Phồn Xương, Bắc Giang." },
  { content: "Khởi nghĩa nào đỉnh cao phong trào Cần Vương?", options: ["Hương Khê", "Bãi Sậy", "Hùng Lĩnh", "Ba Đình"], correctAnswer: "Hương Khê", explanation: "Do Phan Đình Phùng lãnh đạo." },
  { content: "Ai được vinh danh Danh nhân văn hóa thế giới?", options: ["Nguyễn Trãi", "Lê Lợi", "Phan Đình Phùng", "Trương Định"], correctAnswer: "Nguyễn Trãi", explanation: "UNESCO vinh danh năm 1980." },
  { content: "Ai là 'Hùm thiêng Yên Thế'?", options: ["Hoàng Hoa Thám", "Phan Đình Phùng", "Nguyễn Trung Trực", "Nguyễn Thiện Thuật"], correctAnswer: "Hoàng Hoa Thám", explanation: "Biệt danh của Đề Thám." },
  { content: "Chiến thắng nào tiêu diệt 29 vạn quân Thanh?", options: ["Ngọc Hồi - Đống Đa", "Rạch Gầm - Xoài Mút", "Chi Lăng - Xương Giang", "Tốt Động - Chúc Động"], correctAnswer: "Ngọc Hồi - Đống Đa", explanation: "Đại phá quân Thanh năm 1789." },
  { content: "Lê Lợi khởi nghĩa Lam Sơn năm nào?", options: ["1418", "1427", "1407", "938"], correctAnswer: "1418", explanation: "Mốc khởi đầu kháng Minh." },
  { content: "Thắng lợi quyết định đánh đuổi quân Minh?", options: ["Chi Lăng - Xương Giang", "Bạch Đằng", "Như Nguyệt", "Tốt Động"], correctAnswer: "Chi Lăng - Xương Giang", explanation: "Năm 1427." },
  { content: "Ai là Bình Tây Đại Nguyên soái?", options: ["Trương Định", "Nguyễn Trung Trực", "Hoàng Hoa Thám", "Phan Đình Phùng"], correctAnswer: "Trương Định", explanation: "Danh hiệu nhân dân tặng." },
  { content: "Chiến công đốt tàu chiến Pháp L'Espérance gắn với ai?", options: ["Nguyễn Trung Trực", "Trương Định", "Nguyễn Thiện Thuật", "Phan Đình Phùng"], correctAnswer: "Nguyễn Trung Trực", explanation: "Trên sông Nhật Tảo." },
  { content: "Khởi nghĩa Bãi Sậy do ai lãnh đạo?", options: ["Nguyễn Thiện Thuật", "Hoàng Hoa Thám", "Phan Đình Phùng", "Cao Thắng"], correctAnswer: "Nguyễn Thiện Thuật", explanation: "Gắn với chiến thắng trên sông Vàm Nao." },
  { content: "Triều đại Lê Lợi lập sau kháng Minh được gọi là gì?", options: ["Hậu Lê", "Tiền Lê", "Lê sơ", "Lê trung hưng"], correctAnswer: "Hậu Lê", explanation: "Phân biệt với triều Lê trước đó." },
  { content: "Tác phẩm Nguyễn Trãi viết gửi Lê Lợi trước thời Bình Ngô Đại Cáo?", options: ["Bình Ngô sách", "Hịch tướng sĩ", "Nam quốc sơn hà", "Vạn Kiếp bình Nam thư"], correctAnswer: "Bình Ngô sách", explanation: "Kế sách kháng Minh." },
  { content: "Trận thắng Rạch Gầm - Xoài Mút do ai chỉ huy?", options: ["Nguyễn Huệ", "Ngô Quyền", "Trần Hưng Đạo", "Trương Định"], correctAnswer: "Nguyễn Huệ", explanation: "Chống Xiêm thế kỷ XVIII." },
  { content: "Hội nghị Diên Hồng gắn với thời kỳ nào?", options: ["Nhà Trần chống Nguyên", "Nhà Lý chống Tống", "Khởi nghĩa Lam Sơn", "Phong trào Cần Vương"], correctAnswer: "Nhà Trần chống Nguyên", explanation: "Hỏi dân có đánh giặc hay không." },
  { content: "Lý Thường Kiệt chủ trương chiến thuật nào chống Tống?", options: ["Tiên phát chế nhân", "Cố thủ trong thành", "Dã chiến núi", "Giảng hòa"], correctAnswer: "Tiên phát chế nhân", explanation: "Tấn công trước để chủ động." },
  { content: "Phòng tuyến sông Như Nguyệt gắn với cuộc kháng chiến nào?", options: ["Chống Tống thời Lý", "Chống Minh", "Chống Pháp", "Chống Nguyên"], correctAnswer: "Chống Tống thời Lý", explanation: "Bài thơ Nam quốc sơn hà." },
  { content: "Năm 1075 - 1077 gắn với sự kiện nào?", options: ["Lý Thường Kiệt đánh Tống", "Ngô Quyền diệt Nam Hán", "Trần Hưng Đạo hịch tướng sĩ", "Lê Lợi dựng cờ"], correctAnswer: "Lý Thường Kiệt đánh Tống", explanation: "Chiến thắng trên biên giới phía Bắc." },
  { content: "Ai lãnh đạo khởi nghĩa Hai Bà Trưng?", options: ["Trưng Trắc và Trưng Nhị", "Bà Triệu", "Mỵ Châu", "Lê Chân"], correctAnswer: "Trưng Trắc và Trưng Nhị", explanation: "Mùa xuân năm 40." },
  { content: "Đinh Bộ Lĩnh có công lớn nào?", options: ["Dẹp loạn 12 sứ quân", "Lập ra Nhà Trần", "Đánh Tống", "Đánh Pháp"], correctAnswer: "Dẹp loạn 12 sứ quân", explanation: "Thống nhất đất nước." },
  { content: "Ai là vua sáng lập nhà Tiền Lê?", options: ["Lê Hoàn", "Đinh Bộ Lĩnh", "Ngô Quyền", "Lý Công Uẩn"], correctAnswer: "Lê Hoàn", explanation: "Kháng chiến chống Tống năm 981, thống nhất đất nước." },
  { content: "Chiến thắng Chi Lăng - Xương Giang diễn ra khi đánh quân nào?", options: ["Nhà Minh", "Nhà Tống", "Xiêm", "Pháp"], correctAnswer: "Nhà Minh", explanation: "Gắn với Đại Việt thế kỷ XV." },
  { content: "Cao Thắng gắn với khởi nghĩa nào?", options: ["Hương Khê", "Yên Thế", "Lam Sơn", "Bãi Sậy"], correctAnswer: "Hương Khê", explanation: "Giúp chế tạo vũ khí cho Phan Đình Phùng." },
  { content: "Khẩu hiệu 'Bao giờ người Tây nhổ hết cỏ nước Nam...' là của ai?", options: ["Nguyễn Trung Trực", "Trương Định", "Phan Đình Phùng", "Hoàng Hoa Thám"], correctAnswer: "Nguyễn Trung Trực", explanation: "Thể hiện quyết tâm chống Pháp." },
  { content: "Phong trào nghĩa quân hoạt động ở Vũ Quang - Hà Tĩnh thường gắn với?", options: ["Phan Đình Phùng", "Hoàng Hoa Thám", "Nguyễn Thiện Thuật", "Trương Định"], correctAnswer: "Phan Đình Phùng", explanation: "Căn cứ khởi nghĩa Hương Khê." },
  { content: "Ông vua nào của nhà Nguyễn được các sĩ phu tôn làm 'Cần Vương' trong phong trào cuối XIX?", options: ["Hàm Nghi", "Bảo Đại", "Tự Đức", "Minh Mạng"], correctAnswer: "Hàm Nghi", explanation: "Nguyên tắc phong trào Cần Vương." },
];

export const picturePuzzleItems = [
  {
    images: [
      createClueCard({ label: "Cần", accent: "#f97316" }),
      createClueCard({ label: "Vương", accent: "#8b5cf6" }),
    ],
    answer: "Phong trào Cần Vương",
    acceptedAnswers: ["Phong trào Cần Vương", "Cần Vương"],
    explanation: "Ghép 'Cần' và 'Vương' để suy ra phong trào Cần Vương."
  },
  {
    images: [
      createClueCard({ label: "Yên", accent: "#22c55e" }),
      createClueCard({ label: "Thế", accent: "#14b8a6" }),
    ],
    answer: "Khởi nghĩa Yên Thế",
    acceptedAnswers: ["Khởi nghĩa Yên Thế", "Yên Thế"],
    explanation: "Ghép 'Yên' và 'Thế' để suy ra cuộc khởi nghĩa Yên Thế."
  },
  {
    images: [
      createClueCard({ label: "Lam", accent: "#38bdf8" }),
      createClueCard({ label: "Sơn", accent: "#0ea5e9" }),
    ],
    answer: "Khởi nghĩa Lam Sơn",
    acceptedAnswers: ["Khởi nghĩa Lam Sơn", "Lam Sơn"],
    explanation: "Ghép 'Lam' và 'Sơn' để suy ra cuộc khởi nghĩa Lam Sơn."
  },
  {
    images: [
      createClueCard({ label: "Bạch", accent: "#eab308" }),
      createClueCard({ label: "Đằng", accent: "#f59e0b" }),
    ],
    answer: "Chiến thắng Bạch Đằng",
    acceptedAnswers: ["Chiến thắng Bạch Đằng", "Bạch Đằng"],
    explanation: "Ghép 'Bạch' và 'Đằng' để suy ra chiến thắng Bạch Đằng."
  },
  {
    images: [
      createClueCard({ label: "Như", accent: "#fb7185" }),
      createClueCard({ label: "Nguyệt", accent: "#f43f5e" }),
    ],
    answer: "Phòng tuyến Như Nguyệt",
    acceptedAnswers: ["Phòng tuyến Như Nguyệt", "Như Nguyệt"],
    explanation: "Ghép 'Như' và 'Nguyệt' để suy ra phòng tuyến Như Nguyệt."
  },
  {
    images: [
      createClueCard({ label: "Hương", accent: "#34d399" }),
      createClueCard({ label: "Khê", accent: "#10b981" }),
    ],
    answer: "Khởi nghĩa Hương Khê",
    acceptedAnswers: ["Khởi nghĩa Hương Khê", "Hương Khê"],
    explanation: "Ghép 'Hương' và 'Khê' để suy ra cuộc khởi nghĩa Hương Khê."
  },
  {
    images: [
      createClueCard({ label: "Ngọc", accent: "#22d3ee" }),
      createClueCard({ label: "Hồi", accent: "#06b6d4" }),
      createClueCard({ label: "Đống", accent: "#c084fc" }),
      createClueCard({ label: "Đa", accent: "#a855f7" }),
    ],
    answer: "Chiến thắng Ngọc Hồi - Đống Đa",
    acceptedAnswers: ["Chiến thắng Ngọc Hồi - Đống Đa", "Ngọc Hồi - Đống Đa"],
    explanation: "Bốn mảnh gợi đến đại thắng Ngọc Hồi - Đống Đa của nghĩa quân Tây Sơn."
  },
  {
    images: [
      createClueCard({ label: "Chi", accent: "#f97316" }),
      createClueCard({ label: "Lăng", accent: "#fb923c" }),
      createClueCard({ label: "Xương", accent: "#60a5fa" }),
      createClueCard({ label: "Giang", accent: "#3b82f6" }),
    ],
    answer: "Chiến thắng Chi Lăng - Xương Giang",
    acceptedAnswers: ["Chiến thắng Chi Lăng - Xương Giang", "Chi Lăng - Xương Giang"],
    explanation: "Bốn mảnh gợi đến chiến thắng Chi Lăng - Xương Giang trước quân Minh."
  },
  {
    images: [
      createClueCard({ label: "Phan", accent: "#f59e0b" }),
      createClueCard({ label: "Đình", accent: "#eab308" }),
      createClueCard({ label: "Phùng", accent: "#84cc16" }),
    ],
    answer: "Phan Đình Phùng",
    acceptedAnswers: ["Phan Đình Phùng"],
    explanation: "Ghép ba từ khóa để nhận ra lãnh tụ tiêu biểu của khởi nghĩa Hương Khê."
  },
  {
    images: [
      createClueCard({ label: "Trương", accent: "#38bdf8" }),
      createClueCard({ label: "Định", accent: "#0ea5e9" }),
    ],
    answer: "Trương Định",
    acceptedAnswers: ["Trương Định"],
    explanation: "Ghép hai từ khóa để nhận ra Bình Tây Đại Nguyên soái Trương Định."
  }
];
