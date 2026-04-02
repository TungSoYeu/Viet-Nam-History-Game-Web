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

export const revealPictureSets = [
  {
    imageUrl: localImage("le_loi.png"),
    answer: "Lê Lợi",
    acceptedAnswers: ["Lê Lợi", "Lê Thái Tổ", "Bình Định Vương"],
    caption: "Ảnh tượng đài lịch sử được dùng để lật mở trang sử.",
    questions: [
      { q: "Lê Lợi phất cờ khởi nghĩa ở đâu?", a: "Lam Sơn" },
      { q: "Khởi nghĩa Lam Sơn bùng nổ vào năm nào?", a: "1418" },
      { q: "Danh xưng của Lê Lợi trước khi lên ngôi là gì?", a: "Bình Định Vương" },
      { q: "Ai là quân sư kiệt xuất đồng hành với Lê Lợi?", a: "Nguyễn Trãi" },
      { q: "Viện binh nhà Minh bị đánh tan năm 1427 ở trận nào?", a: "Chi Lăng - Xương Giang" },
      { q: "Văn kiện lớn tuyên bố thắng lợi sau khởi nghĩa là gì?", a: "Bình Ngô Đại Cáo" },
      { q: "Triều đại do Lê Lợi sáng lập sau thắng lợi là gì?", a: "Hậu Lê" },
      { q: "Lê Lợi lên ngôi hoàng đế vào năm nào?", a: "1428" },
      { q: "Nghĩa quân Lam Sơn khởi phát từ vùng nào của Thanh Hóa?", a: "Lam Sơn" },
    ],
  },
  {
    imageUrl: localImage("nguyen_trai.png"),
    answer: "Nguyễn Trãi",
    acceptedAnswers: ["Nguyễn Trãi", "Ức Trai"],
    caption: "Ảnh chân dung truyền thống trong kho tư liệu lịch sử.",
    questions: [
      { q: "Hiệu nổi tiếng của Nguyễn Trãi là gì?", a: "Ức Trai" },
      { q: "Nguyễn Trãi dâng kế sách gì cho Lê Lợi?", a: "Bình Ngô sách" },
      { q: "Ông gắn với chiến lược đánh giặc nào?", a: "Tâm công" },
      { q: "Tác phẩm được xem là bản tuyên ngôn độc lập thứ hai là gì?", a: "Bình Ngô Đại Cáo" },
      { q: "Nguyễn Trãi là khai quốc công thần của triều đại nào?", a: "Hậu Lê" },
      { q: "UNESCO vinh danh Nguyễn Trãi là gì?", a: "Danh nhân văn hóa thế giới" },
      { q: "Ai giao cho Nguyễn Trãi soạn Bình Ngô Đại Cáo?", a: "Lê Lợi" },
      { q: "Vụ án lịch sử gắn với bi kịch của Nguyễn Trãi là gì?", a: "Lệ Chi Viên" },
      { q: "Quê gốc của Nguyễn Trãi thuộc tỉnh nào ngày nay?", a: "Hải Dương" },
    ],
  },
  {
    imageUrl: localImage("nguyen_trung_truc.png"),
    answer: "Nguyễn Trung Trực",
    acceptedAnswers: ["Nguyễn Trung Trực"],
    caption: "Ảnh chân dung tư liệu tại đền thờ, có sẵn trong kho ảnh của dự án.",
    questions: [
      { q: "Nguyễn Trung Trực nổi tiếng với chiến công đốt tàu nào của Pháp?", a: "L'Espérance" },
      { q: "Chiến công đốt tàu của ông diễn ra trên dòng sông nào?", a: "Nhật Tảo" },
      { q: "Ông chỉ huy nghĩa quân đánh chiếm đồn nào ở Rạch Giá?", a: "Đồn Kiên Giang" },
      { q: "Kẻ thù trực tiếp mà ông chống lại là ai?", a: "Thực dân Pháp" },
      { q: "Câu nói bất hủ của ông kết thúc bằng mệnh đề nào?", a: "Mới hết người Nam đánh Tây" },
      { q: "Nguyễn Trung Trực gắn với phong trào kháng chiến ở khu vực nào?", a: "Nam Kỳ" },
      { q: "Nguyễn Trung Trực hi sinh vào năm nào?", a: "1868" },
      { q: "Đền thờ lớn tưởng niệm Nguyễn Trung Trực hiện ở tỉnh nào?", a: "Kiên Giang" },
      { q: "Câu nói nổi tiếng của ông bắt đầu bằng cụm nào?", a: "Bao giờ người Tây nhổ hết cỏ nước Nam" },
    ],
  },
  {
    imageUrl: localImage("phan_dinh_phung.png"),
    answer: "Phan Đình Phùng",
    acceptedAnswers: ["Phan Đình Phùng"],
    caption: "Ảnh chân dung đen trắng mang giá trị tư liệu lịch sử.",
    questions: [
      { q: "Phan Đình Phùng là lãnh tụ của cuộc khởi nghĩa nào?", a: "Hương Khê" },
      { q: "Khởi nghĩa Hương Khê thuộc phong trào nào?", a: "Cần Vương" },
      { q: "Căn cứ lớn của nghĩa quân Phan Đình Phùng là vùng nào?", a: "Vũ Quang" },
      { q: "Ai là cộng sự nổi bật giúp nghĩa quân chế tạo súng trường?", a: "Cao Thắng" },
      { q: "Khởi nghĩa Hương Khê gắn với địa bàn tỉnh nào?", a: "Hà Tĩnh" },
      { q: "Vai trò lịch sử của khởi nghĩa Hương Khê trong phong trào Cần Vương là gì?", a: "Đỉnh cao" },
      { q: "Phan Đình Phùng quê ở đâu?", a: "Hà Tĩnh" },
      { q: "Nghĩa quân Hương Khê cùng Cao Thắng tự chế loại vũ khí nào?", a: "Súng trường" },
      { q: "Khởi nghĩa Hương Khê bùng nổ vào năm nào?", a: "1885" },
    ],
  },
  {
    imageUrl: localImage("hoang_hoa_tham.png"),
    answer: "Hoàng Hoa Thám",
    acceptedAnswers: ["Hoàng Hoa Thám", "Đề Thám"],
    caption: "Ảnh chân dung lịch sử được lưu trong tư liệu của dự án.",
    questions: [
      { q: "Biệt danh nổi tiếng của Hoàng Hoa Thám là gì?", a: "Hùm thiêng Yên Thế" },
      { q: "Ông là thủ lĩnh của cuộc khởi nghĩa nào?", a: "Yên Thế" },
      { q: "Căn cứ quan trọng của nghĩa quân Yên Thế là ở đâu?", a: "Phồn Xương" },
      { q: "Khởi nghĩa Yên Thế chống lại kẻ thù nào?", a: "Thực dân Pháp" },
      { q: "Khởi nghĩa Yên Thế kéo dài gần bao lâu?", a: "Gần 30 năm" },
      { q: "Tính chất tiêu biểu của cuộc đấu tranh Yên Thế là gì?", a: "Khởi nghĩa nông dân" },
      { q: "Khởi nghĩa Yên Thế diễn ra chủ yếu ở tỉnh nào ngày nay?", a: "Bắc Giang" },
      { q: "Tên gọi khác thường dùng của Hoàng Hoa Thám là gì?", a: "Đề Thám" },
      { q: "Lực lượng nòng cốt của khởi nghĩa Yên Thế thuộc tầng lớp nào?", a: "Nông dân" },
    ],
  },
];

export const teammatePackages = [
  {
    id: "leaders",
    title: "Gói 1: Nhân Vật",
    keywords: [
      "Hai Bà Trưng",
      "Bà Triệu",
      "Ngô Quyền",
      "Lê Hoàn",
      "Lý Thường Kiệt",
      "Trần Hưng Đạo",
      "Lê Lợi",
      "Nguyễn Trãi",
      "Phan Đình Phùng",
      "Hoàng Hoa Thám",
    ],
  },
  {
    id: "places",
    title: "Gói 2: Địa Danh",
    keywords: [
      "Hát Môn",
      "Mê Linh",
      "Núi Nưa",
      "Sông Bạch Đằng",
      "Chi Lăng",
      "Sông Như Nguyệt",
      "Lam Sơn",
      "Vũ Quang",
      "Phồn Xương",
      "Nhật Tảo",
    ],
  },
  {
    id: "events",
    title: "Gói 3: Sự Kiện - Phong Trào",
    keywords: [
      "Khởi nghĩa Hai Bà Trưng",
      "Khởi nghĩa Bà Triệu",
      "Chiến thắng Bạch Đằng 938",
      "Kháng chiến chống Tống 981",
      "Phòng tuyến Như Nguyệt",
      "Ba lần kháng chiến chống Nguyên Mông",
      "Khởi nghĩa Lam Sơn",
      "Bình Ngô Đại Cáo",
      "Phong trào Cần Vương",
      "Khởi nghĩa Yên Thế",
    ],
  },
  {
    id: "symbols",
    title: "Gói 4: Biểu Tượng Lịch Sử",
    keywords: [
      "Cọc gỗ",
      "Voi trận",
      "Nam quốc sơn hà",
      "Hịch tướng sĩ",
      "Bình Ngô Đại Cáo",
      "Hội thề Lũng Nhai",
      "Tâm công",
      "Hùm thiêng Yên Thế",
      "Bình Tây Đại Nguyên Soái",
      "Cao Thắng",
    ],
  },
  {
    id: "timeline",
    title: "Gói 5: Mốc Thời Gian",
    keywords: [
      "Năm 40",
      "Năm 248",
      "Năm 938",
      "Năm 981",
      "Năm 1075-1077",
      "Năm 1258-1288",
      "Năm 1418",
      "Năm 1427",
      "Năm 1885",
      "Năm 1884-1913",
    ],
  },
];

const nhuNguyetDiagram = createDiagram({
  title: "Lược Đồ Phòng Tuyến",
  subtitle: "Tiến trình chiến tuyến sông Cầu - Như Nguyệt",
  boxes: [
    { heading: "1075", line1: "Tiến công Ung Châu", line2: "Chủ động ra đòn trước" },
    { heading: "1076", line1: "Lập phòng tuyến sông", line2: "Như Nguyệt" },
    { heading: "1077", line1: "Bài thơ thần và phản công", line2: "Đánh bại quân Tống" },
  ],
});

const bachDangDiagram = createDiagram({
  title: "Lược Đồ Trận Sông",
  subtitle: "Thủy triều, bãi cọc và trận địa phục kích trên sông Bạch Đằng",
  boxes: [
    { heading: "Chuẩn bị", line1: "Bố trí bãi cọc ngầm", line2: "Chờ nước triều lên" },
    { heading: "Nhử địch", line1: "Quân địch vào sông", line2: "Thủy quân tiến sâu" },
    { heading: "Tổng công kích", line1: "Nước triều rút", line2: "Địch bị tiêu diệt" },
  ],
  accent: "#0ea5e9",
});

const lamSonDiagram = createDiagram({
  title: "Lược Đồ Khởi Nghĩa",
  subtitle: "Lam Sơn từ căn cứ địa đến thắng lợi giải phóng dân tộc",
  boxes: [
    { heading: "1418", line1: "Lam Sơn khởi nghĩa", line2: "Căn cứ Thanh Hóa" },
    { heading: "1424-1426", line1: "Tiến quân vào Nam ra Bắc", line2: "Mở rộng vùng giải phóng" },
    { heading: "1427-1428", line1: "Chi Lăng - Xương Giang", line2: "Khôi phục độc lập" },
  ],
  accent: "#22c55e",
});

export const historicalRecognitionItems = [
  {
    id: "recognition-le-loi",
    type: "image",
    imageUrl: localImage("le_loi.png"),
    title: "Nhận diện nhân vật",
    prompt: "Nhân vật lịch sử nào được thể hiện trong bức ảnh tượng đài này?",
    acceptedAnswers: ["Lê Lợi", "Lê Thái Tổ", "Bình Định Vương"],
    explanation: "Đây là Lê Lợi, lãnh tụ khởi nghĩa Lam Sơn và là người sáng lập triều Hậu Lê.",
  },
  {
    id: "recognition-nguyen-trai",
    type: "image",
    imageUrl: localImage("nguyen_trai.png"),
    title: "Nhận diện nhân vật",
    prompt: "Hãy xác định nhà chiến lược, tác giả gắn liền với Bình Ngô Đại Cáo.",
    acceptedAnswers: ["Nguyễn Trãi", "Ức Trai"],
    explanation: "Đây là Nguyễn Trãi, quân sư quan trọng của nghĩa quân Lam Sơn và là danh nhân văn hóa lớn.",
  },
  {
    id: "recognition-nguyen-trung-truc",
    type: "image",
    imageUrl: localImage("nguyen_trung_truc.png"),
    title: "Nhận diện nhân vật",
    prompt: "Vị anh hùng chống Pháp nào được tôn vinh trong bức ảnh chân dung tại đền thờ này?",
    acceptedAnswers: ["Nguyễn Trung Trực"],
    explanation: "Nguyễn Trung Trực gắn với chiến công Nhật Tảo và trận đánh Kiên Giang.",
  },
  {
    id: "recognition-phan-dinh-phung",
    type: "image",
    imageUrl: localImage("phan_dinh_phung.png"),
    title: "Nhận diện nhân vật",
    prompt: "Nhân vật trong ảnh là lãnh tụ của cuộc khởi nghĩa Hương Khê nào?",
    acceptedAnswers: ["Phan Đình Phùng"],
    explanation: "Phan Đình Phùng là lãnh tụ khởi nghĩa Hương Khê, đỉnh cao của phong trào Cần Vương.",
  },
  {
    id: "recognition-hoang-hoa-tham",
    type: "image",
    imageUrl: localImage("hoang_hoa_tham.png"),
    title: "Nhận diện nhân vật",
    prompt: "Nhân vật trong bức chân dung lịch sử này là ai, người nổi tiếng với khởi nghĩa Yên Thế?",
    acceptedAnswers: ["Hoàng Hoa Thám", "Đề Thám"],
    explanation: "Hoàng Hoa Thám, tức Đề Thám, là thủ lĩnh cuộc khởi nghĩa Yên Thế kéo dài nhiều năm.",
  },
  {
    id: "diagram-nhu-nguyet",
    type: "diagram",
    imageUrl: nhuNguyetDiagram,
    title: "Nhận diện lược đồ",
    prompt: "Lược đồ này thể hiện phòng tuyến sông sau cuộc tiến công vào Ung Châu. Đó là cuộc kháng chiến nào?",
    acceptedAnswers: [
      "Kháng chiến chống Tống thời Lý",
      "Phòng tuyến Như Nguyệt",
      "Trận Như Nguyệt",
      "Kháng chiến chống Tống 1075-1077",
    ],
    explanation: "Các dữ kiện cho thấy đây là cuộc kháng chiến chống Tống thời Lý gắn với phòng tuyến Như Nguyệt của Lý Thường Kiệt.",
  },
  {
    id: "diagram-bach-dang",
    type: "diagram",
    imageUrl: bachDangDiagram,
    title: "Nhận diện lược đồ",
    prompt: "Lược đồ có bãi cọc, thủy triều và trận địa phục kích trên sông. Đây là chiến thắng lịch sử nào?",
    acceptedAnswers: [
      "Bạch Đằng",
      "Chiến thắng Bạch Đằng",
      "Trận Bạch Đằng",
      "Chiến thắng Bạch Đằng 938",
    ],
    explanation: "Bãi cọc và thế trận lợi dụng thủy triều là dấu hiệu điển hình của chiến thắng Bạch Đằng.",
  },
  {
    id: "diagram-lam-son",
    type: "diagram",
    imageUrl: lamSonDiagram,
    title: "Nhận diện lược đồ",
    prompt: "Cuộc khởi nghĩa này bùng lên từ Thanh Hóa, thắng lớn ở Chi Lăng - Xương Giang và khôi phục độc lập. Đó là gì?",
    acceptedAnswers: ["Khởi nghĩa Lam Sơn", "Lam Sơn", "Khởi nghĩa Lam Son"],
    explanation: "Lược đồ mô tả tiến trình khởi nghĩa Lam Sơn từ năm 1418 đến thắng lợi năm 1427-1428.",
  },
];

export const connectingHistoryRounds = [
  {
    id: "fact-fact",
    title: "Vòng 1: Thông tin - Thông tin",
    instruction: "Nối dữ kiện ở cột bên trái với nhân vật hoặc sự kiện lịch sử đúng ở cột bên phải.",
    pairs: [
      { left: "Khởi nghĩa nổ ra vào mùa xuân năm 40", right: "Hai Bà Trưng" },
      { left: "Năm 248, cưỡi voi xung trận", right: "Bà Triệu" },
      { left: "Nam quốc sơn hà", right: "Lý Thường Kiệt" },
      { left: "Bình Ngô Đại Cáo", right: "Nguyễn Trãi" },
      { left: "Khởi nghĩa kéo dài gần 30 năm", right: "Hoàng Hoa Thám" },
    ],
  },
  {
    id: "image-fact",
    title: "Vòng 2: Hình ảnh - Thông tin",
    instruction: "Nối mỗi hình ảnh lịch sử với sự kiện, cuộc khởi nghĩa hoặc nhãn lịch sử phù hợp.",
    pairs: [
      { left: "Lê Lợi", right: "Khởi nghĩa Lam Sơn", image: localImage("le_loi.png") },
      { left: "Nguyễn Trung Trực", right: "Nhật Tảo - Kiên Giang", image: localImage("nguyen_trung_truc.png") },
      { left: "Phan Đình Phùng", right: "Khởi nghĩa Hương Khê", image: localImage("phan_dinh_phung.png") },
      { left: "Hoàng Hoa Thám", right: "Khởi nghĩa Yên Thế", image: localImage("hoang_hoa_tham.png") },
      { left: "Lý Thường Kiệt", right: "Kháng chiến chống Tống 1075-1077", image: localImage("ly_thuong_kiet.png") },
    ],
  },
];

export const crosswordSets = [
  {
    id: "bach-dang",
    keyword: "BACHDANG",
    title: "Từ khóa 1",
    theme: "Bảo vệ non sông và giành lại độc lập",
    clues: [
      {
        question: "Con sông nào gắn với chiến thắng năm 938?",
        options: ["Sông Gianh", "Sông Bạch Đằng", "Sông Hồng", "Sông Lam"],
        correctAnswer: "Sông Bạch Đằng",
      },
      {
        question: "Loại vũ khí nào được bố trí ngầm dưới lòng sông?",
        options: ["Giáo dài", "Cọc gỗ", "Mìn đá", "Lưới sắt"],
        correctAnswer: "Cọc gỗ",
      },
      {
        question: "Kẻ thù nào bị đánh bại trong trận chiến năm 938?",
        options: ["Nhà Minh", "Nhà Tống", "Nam Hán", "Đông Ngô"],
        correctAnswer: "Nam Hán",
      },
      {
        question: "Ai là người chỉ huy chiến thắng lịch sử năm 938?",
        options: ["Lê Hoàn", "Ngô Quyền", "Trần Hưng Đạo", "Lý Thường Kiệt"],
        correctAnswer: "Ngô Quyền",
      },
      {
        question: "Thắng lợi này đã chấm dứt thời kỳ lịch sử nào?",
        options: ["Nội chiến Trịnh - Nguyễn", "Thời Bắc thuộc", "Nhà Trần", "Phong trào Cần Vương"],
        correctAnswer: "Thời Bắc thuộc",
      },
    ],
    acceptedAnswers: ["Bạch Đằng", "Bach Dang"],
  },
  {
    id: "lam-son",
    keyword: "LAMSON",
    title: "Từ khóa 2",
    theme: "Một cuộc khởi nghĩa giải phóng khôi phục nền độc lập Đại Việt",
    clues: [
      {
        question: "Ai là người dựng cờ khởi nghĩa vào năm 1418?",
        options: ["Nguyễn Trãi", "Lê Lợi", "Trần Nguyên Hãn", "Lý Bí"],
        correctAnswer: "Lê Lợi",
      },
      {
        question: "Nhà chiến lược nào gắn bó nhất với Bình Ngô Đại Cáo?",
        options: ["Nguyễn Trãi", "Phan Đình Phùng", "Ngô Quyền", "Mai Thúc Loan"],
        correctAnswer: "Nguyễn Trãi",
      },
      {
        question: "Chiến dịch cuối nào đã tiêu diệt viện binh nhà Minh?",
        options: ["Tốt Động - Chúc Động", "Chi Lăng - Xương Giang", "Đống Đa", "Như Nguyệt"],
        correctAnswer: "Chi Lăng - Xương Giang",
      },
      {
        question: "Trước khi lên ngôi, Lê Lợi mang tước hiệu gì?",
        options: ["Tiền Ngô Vương", "Bình Định Vương", "Bình Tây Đại Nguyên Soái", "Đức Thánh Trần"],
        correctAnswer: "Bình Định Vương",
      },
      {
        question: "Cuộc khởi nghĩa bắt đầu ở vùng nào của Thanh Hóa?",
        options: ["Mê Linh", "Lam Sơn", "Phồn Xương", "Vũ Quang"],
        correctAnswer: "Lam Sơn",
      },
    ],
    acceptedAnswers: ["Lam Sơn", "Lam Son"],
  },
  {
    id: "can-vuong",
    keyword: "CANVUONG",
    title: "Từ khóa 3",
    theme: "Phong trào kháng chiến phò vua sau biến cố ở Huế",
    clues: [
      {
        question: "Lãnh tụ nào gắn với cuộc khởi nghĩa Hương Khê?",
        options: ["Nguyễn Trung Trực", "Phan Đình Phùng", "Hoàng Hoa Thám", "Cao Bá Quát"],
        correctAnswer: "Phan Đình Phùng",
      },
      {
        question: "Vị tướng tài nào giúp nghĩa quân chế tạo súng trường?",
        options: ["Cao Thắng", "Nguyễn Xí", "Trần Quang Khải", "Ngô Tuấn"],
        correctAnswer: "Cao Thắng",
      },
      {
        question: "Khởi nghĩa Hương Khê được xem là đỉnh cao của phong trào nào?",
        options: ["Đông Du", "Duy Tân", "Cần Vương", "Nam Kỳ"],
        correctAnswer: "Cần Vương",
      },
      {
        question: "Khẩu hiệu lớn nào đã cổ vũ phong trào sau năm 1885?",
        options: ["Lập thương cảng", "Phù vua cứu nước", "Nam tiến", "Bế quan tỏa cảng"],
        correctAnswer: "Phù vua cứu nước",
      },
      {
        question: "Vùng căn cứ Vũ Quang thuộc địa phương nào?",
        options: ["Lạng Sơn", "Hà Tĩnh", "Bắc Giang", "Long An"],
        correctAnswer: "Hà Tĩnh",
      },
    ],
    acceptedAnswers: ["Cần Vương", "Can Vuong"],
  },
];

export const historicalFlowSet = {
  title: "Dòng Chảy Lịch Sử: Khởi Nghĩa Lam Sơn",
  instruction:
    "Sắp xếp toàn bộ 10 câu có mốc thời gian vào đúng 4 dòng: Bối cảnh, Diễn biến, Kết quả và Di sản.",
  sentences: [
    {
      id: "A",
      text: "1407: Nhà Minh xâm lược và đặt ách đô hộ nặng nề lên Đại Việt.",
      group: "context",
    },
    {
      id: "B",
      text: "Đầu năm 1418: Lê Lợi dựng cờ khởi nghĩa tại Lam Sơn, Thanh Hóa.",
      group: "context",
    },
    {
      id: "C",
      text: "Cuối năm 1424: Nghĩa quân chuyển hướng vào Nghệ An và mở rộng vùng giải phóng.",
      group: "developments",
    },
    {
      id: "D",
      text: "Năm 1425: Tân Bình và Thuận Hóa lần lượt được giải phóng.",
      group: "developments",
    },
    {
      id: "E",
      text: "Cuối năm 1426: Nghĩa quân tiến ra Bắc và thắng lớn ở Tốt Động - Chúc Động.",
      group: "developments",
    },
    {
      id: "F",
      text: "Năm 1427: Viện binh nhà Minh bị tiêu diệt trong chiến dịch Chi Lăng - Xương Giang.",
      group: "developments",
    },
    {
      id: "G",
      text: "Cuối năm 1427: Nhà Minh buộc phải chấp nhận rút quân về nước.",
      group: "result",
    },
    {
      id: "H",
      text: "Đầu năm 1428: Lê Lợi lên ngôi, mở đầu triều Hậu Lê.",
      group: "result",
    },
    {
      id: "I",
      text: "Năm 1428: Bình Ngô Đại Cáo khẳng định nền độc lập và chủ quyền Đại Việt.",
      group: "legacy",
    },
    {
      id: "J",
      text: "Sau năm 1428: Thắng lợi Lam Sơn để lại bài học lớn về đoàn kết toàn dân và nghệ thuật chiến tranh nhân dân.",
      group: "legacy",
    },
  ],
};

export const lightningFastQuestions = [
  {
    content: "Khởi nghĩa Hai Bà Trưng nổ ra năm nào?",
    options: ["40", "248", "938", "1418"],
    correctAnswer: "40",
    explanation: "Hai Bà Trưng phất cờ khởi nghĩa vào mùa xuân năm 40.",
  },
  {
    content: "Bà Triệu khởi nghĩa chống quân nào?",
    options: ["Nam Hán", "Đông Ngô", "Nhà Minh", "Nhà Tống"],
    correctAnswer: "Đông Ngô",
    explanation: "Bà Triệu lãnh đạo cuộc nổi dậy chống ách cai trị của Đông Ngô.",
  },
  {
    content: "Ai thắng trận Bạch Đằng năm 938?",
    options: ["Lê Hoàn", "Ngô Quyền", "Trần Hưng Đạo", "Lý Bí"],
    correctAnswer: "Ngô Quyền",
    explanation: "Ngô Quyền dùng trận địa cọc để đánh tan quân Nam Hán.",
  },
  {
    content: "Bài thơ thần gắn với Lý Thường Kiệt là gì?",
    options: ["Hịch tướng sĩ", "Bình Ngô Đại Cáo", "Nam quốc sơn hà", "Tụng giá hoàn kinh sư"],
    correctAnswer: "Nam quốc sơn hà",
    explanation: "Nam quốc sơn hà thường gắn với phòng tuyến Như Nguyệt.",
  },
  {
    content: "Ai là tác giả Hịch tướng sĩ?",
    options: ["Trần Hưng Đạo", "Nguyễn Trãi", "Trần Quang Khải", "Lê Lợi"],
    correctAnswer: "Trần Hưng Đạo",
    explanation: "Hịch tướng sĩ cổ vũ quyết tâm chống Nguyên Mông.",
  },
  {
    content: "Khởi nghĩa Lam Sơn bắt đầu ở đâu?",
    options: ["Phồn Xương", "Lam Sơn", "Vũ Quang", "Hát Môn"],
    correctAnswer: "Lam Sơn",
    explanation: "Lam Sơn ở Thanh Hóa là nơi Lê Lợi dựng cờ năm 1418.",
  },
  {
    content: "Ai viết Bình Ngô Đại Cáo?",
    options: ["Lê Thánh Tông", "Nguyễn Trãi", "Phan Đình Phùng", "Hoàng Hoa Thám"],
    correctAnswer: "Nguyễn Trãi",
    explanation: "Nguyễn Trãi là tác giả của áng thiên cổ hùng văn này.",
  },
  {
    content: "Khởi nghĩa Hương Khê do ai lãnh đạo?",
    options: ["Nguyễn Trung Trực", "Phan Đình Phùng", "Cao Bá Quát", "Trương Định"],
    correctAnswer: "Phan Đình Phùng",
    explanation: "Phan Đình Phùng là thủ lĩnh tiêu biểu của phong trào Cần Vương.",
  },
  {
    content: "Đề Thám là ai?",
    options: ["Hoàng Hoa Thám", "Ngô Quyền", "Lê Hoàn", "Nguyễn Trung Trực"],
    correctAnswer: "Hoàng Hoa Thám",
    explanation: "Đề Thám là biệt danh nổi tiếng của Hoàng Hoa Thám.",
  },
  {
    content: "Chi Lăng - Xương Giang gắn với cuộc khởi nghĩa nào?",
    options: ["Yên Thế", "Lam Sơn", "Hai Bà Trưng", "Bà Triệu"],
    correctAnswer: "Lam Sơn",
    explanation: "Chiến thắng 1427 quyết định thắng lợi của khởi nghĩa Lam Sơn.",
  },
];

export const picturePuzzleItems = [
  {
    imageUrl: localImage("le_loi.png"),
    answer: "Lê Lợi",
    options: ["Lê Lợi", "Ngô Quyền", "Trần Hưng Đạo", "Nguyễn Trung Trực"],
    explanation: "Ảnh tượng đài Lê Lợi, lãnh tụ khởi nghĩa Lam Sơn.",
  },
  {
    imageUrl: localImage("nguyen_trai.png"),
    answer: "Nguyễn Trãi",
    options: ["Nguyễn Trãi", "Phan Bội Châu", "Chu Văn An", "Cao Bá Quát"],
    explanation: "Chân dung Nguyễn Trãi, quân sư quan trọng của khởi nghĩa Lam Sơn.",
  },
  {
    imageUrl: localImage("ly_thuong_kiet.png"),
    answer: "Lý Thường Kiệt",
    options: ["Lý Thường Kiệt", "Lê Hoàn", "Lý Bí", "Mai Thúc Loan"],
    explanation: "Hình tượng Lý Thường Kiệt gắn với phòng tuyến Như Nguyệt trong kháng chiến chống Tống.",
  },
  {
    imageUrl: localImage("le_hoan.png"),
    answer: "Lê Hoàn",
    options: ["Lê Hoàn", "Lê Lợi", "Đinh Bộ Lĩnh", "Lý Công Uẩn"],
    explanation: "Tượng thờ Lê Đại Hành, người chỉ huy cuộc kháng chiến chống Tống năm 981.",
  },
  {
    imageUrl: localImage("tran_hung_dao.png"),
    answer: "Trần Hưng Đạo",
    options: ["Trần Hưng Đạo", "Trần Quang Khải", "Yết Kiêu", "Trần Quốc Toản"],
    explanation: "Tượng đài Trần Hưng Đạo, vị chỉ huy tiêu biểu trong các cuộc kháng chiến chống Nguyên Mông.",
  },
  {
    imageUrl: localImage("truong_dinh.png"),
    answer: "Trương Định",
    options: ["Trương Định", "Nguyễn Trung Trực", "Phan Đình Phùng", "Đinh Công Tráng"],
    explanation: "Tượng đài Trương Định, người được nhân dân suy tôn là Bình Tây Đại Nguyên Soái.",
  },
  {
    imageUrl: localImage("nguyen_trung_truc.png"),
    answer: "Nguyễn Trung Trực",
    options: ["Nguyễn Trung Trực", "Hoàng Hoa Thám", "Nguyễn Thái Học", "Phan Chu Trinh"],
    explanation: "Chân dung tư liệu của Nguyễn Trung Trực tại đền thờ.",
  },
  {
    imageUrl: localImage("phan_dinh_phung.png"),
    answer: "Phan Đình Phùng",
    options: ["Phan Đình Phùng", "Tôn Thất Thuyết", "Phan Chu Trinh", "Trần Phú"],
    explanation: "Ảnh chân dung lịch sử của lãnh tụ khởi nghĩa Hương Khê.",
  },
  {
    imageUrl: localImage("hoang_hoa_tham.png"),
    answer: "Hoàng Hoa Thám",
    options: ["Hoàng Hoa Thám", "Nguyễn Thiện Thuật", "Nguyễn Trung Trực", "Mai Xuân Thưởng"],
    explanation: "Ảnh chân dung lịch sử của Hoàng Hoa Thám, tức Đề Thám.",
  },
  {
    imageUrl: localImage("ba_trieu.png"),
    answer: "Bà Triệu",
    options: ["Bà Triệu", "Hai Bà Trưng", "Dương Vân Nga", "An Tư"],
    explanation: "Hình minh họa cổ điển về Bà Triệu, là dạng hình ảnh lịch sử phổ biến chứ không phải ảnh AI.",
  },
];
