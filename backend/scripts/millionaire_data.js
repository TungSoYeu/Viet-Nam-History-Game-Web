const millionaireQuestions = [
  // --- THỜI KỲ HỒNG BÀNG & ÂU LẠC ---
  {
    content: "Theo truyền thuyết, Lạc Long Quân và Âu Cơ đã sinh ra bao nhiêu người con?",
    options: ["50 người con", "100 người con", "18 người con", "12 người con"],
    correctAnswer: "100 người con",
    type: "millionaire"
  },
  {
    content: "Nhà nước đầu tiên của người Việt có tên gọi là gì?",
    options: ["Âu Lạc", "Vạn Xuân", "Văn Lang", "Đại Việt"],
    correctAnswer: "Văn Lang",
    type: "millionaire"
  },
  {
    content: "Vị vua cuối cùng của nước Âu Lạc là ai?",
    options: ["Hùng Vương", "An Dương Vương", "Triệu Đà", "Thục Phán"],
    correctAnswer: "An Dương Vương",
    type: "millionaire"
  },
  {
    content: "Thành Cổ Loa được xây dựng theo hình dáng gì?",
    options: ["Hình vuông", "Hình chữ nhật", "Hình xoáy trôn ốc", "Hình tròn"],
    correctAnswer: "Hình xoáy trôn ốc",
    type: "millionaire"
  },
  {
    content: "Tên thật của An Dương Vương là gì?",
    options: ["Lý Bí", "Thục Phán", "Ngô Quyền", "Mai Thúc Loan"],
    correctAnswer: "Thục Phán",
    type: "millionaire"
  },
  {
    content: "Ai là người đã chế tạo ra 'Nỏ thần' giúp An Dương Vương giữ nước?",
    options: ["Cao Lỗ", "Lý Phục Man", "Phạm Ngũ Lão", "Dã Tượng"],
    correctAnswer: "Cao Lỗ",
    type: "millionaire"
  },
  {
    content: "Vị vua nào trong truyền thuyết đã dùng 100 người con để chia nhau cai quản đất nước?",
    options: ["Hùng Vương", "Kinh Dương Vương", "Lạc Long Quân", "Đế Minh"],
    correctAnswer: "Lạc Long Quân",
    type: "millionaire"
  },
  {
    content: "Sự tích nào giải thích nguồn gốc của bánh Chưng, bánh Giầy?",
    options: ["Sự tích Mai An Tiêm", "Sự tích Lang Liêu", "Sự tích Trầu Cau", "Sự tích Thạch Sanh"],
    correctAnswer: "Sự tích Lang Liêu",
    type: "millionaire"
  },
  {
    content: "Nghề thủ công nào phát triển rực rỡ nhất thời kỳ Đông Sơn?",
    options: ["Nghề dệt", "Nghề đúc đồng", "Nghề làm gốm", "Nghề chạm khắc đá"],
    correctAnswer: "Nghề đúc đồng",
    type: "millionaire"
  },
  {
    content: "Địa danh nào sau đây là kinh đô của nước Văn Lang?",
    options: ["Phong Châu", "Cổ Loa", "Hoa Lư", "Thăng Long"],
    correctAnswer: "Phong Châu",
    type: "millionaire"
  },

  // --- THỜI KỲ BẮC THUỘC & KHỞI NGHĨA ---
  {
    content: "Cuộc khởi nghĩa Hai Bà Trưng bùng nổ vào năm nào?",
    options: ["Năm 40", "Năm 938", "Năm 542", "Năm 248"],
    correctAnswer: "Năm 40",
    type: "millionaire"
  },
  {
    content: "Ai là người đã thốt lên câu nói: 'Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông'?",
    options: ["Trưng Trắc", "Trưng Nhị", "Bà Triệu", "Thái hậu Dương Vân Nga"],
    correctAnswer: "Bà Triệu",
    type: "millionaire"
  },
  {
    content: "Lý Bí lên ngôi Hoàng đế lấy hiệu là gì?",
    options: ["Mai Hắc Đế", "Lý Nam Đế", "Đinh Tiên Hoàng", "Lý Thái Tổ"],
    correctAnswer: "Lý Nam Đế",
    type: "millionaire"
  },
  {
    content: "Nhà nước Vạn Xuân do ai thành lập?",
    options: ["Lý Bí", "Triệu Quang Phục", "Khúc Thừa Dụ", "Mai Thúc Loan"],
    correctAnswer: "Lý Bí",
    type: "millionaire"
  },
  {
    content: "Vị anh hùng dân tộc nào được mệnh danh là 'Dạ Trạch Vương'?",
    options: ["Lý Bí", "Triệu Quang Phục", "Phùng Hưng", "Mai Thúc Loan"],
    correctAnswer: "Triệu Quang Phục",
    type: "millionaire"
  },
  {
    content: "Cuộc khởi nghĩa của Mai Thúc Loan còn được gọi là gì?",
    options: ["Khởi nghĩa Lam Sơn", "Khởi nghĩa Mai Hắc Đế", "Khởi nghĩa Bãi Sậy", "Khởi nghĩa Hương Khê"],
    correctAnswer: "Khởi nghĩa Mai Hắc Đế",
    type: "millionaire"
  },
  {
    content: "Ai là người được nhân dân tôn xưng là 'Bố Cái Đại Vương'?",
    options: ["Phùng Hưng", "Mai Thúc Loan", "Lý Bí", "Khúc Thừa Dụ"],
    correctAnswer: "Phùng Hưng",
    type: "millionaire"
  },
  {
    content: "Dòng họ nào đã mở đầu thời kỳ tự chủ cho dân tộc Việt Nam vào đầu thế kỷ X?",
    options: ["Họ Lý", "Họ Trần", "Họ Khúc", "Họ Ngô"],
    correctAnswer: "Họ Khúc",
    type: "millionaire"
  },
  {
    content: "Khúc Thừa Dụ đã tự xưng là gì khi giành quyền tự chủ từ tay nhà Đường?",
    options: ["Hoàng đế", "Vương", "Tiết độ sứ", "Thái thú"],
    correctAnswer: "Tiết độ sứ",
    type: "millionaire"
  },
  {
    content: "Chiến thắng Bạch Đằng năm 938 do ai lãnh đạo?",
    options: ["Lê Hoàn", "Ngô Quyền", "Trần Hưng Đạo", "Lý Thường Kiệt"],
    correctAnswer: "Ngô Quyền",
    type: "millionaire"
  },

  // --- NGÔ - ĐINH - TIỀN LÊ ---
  {
    content: "Ngô Quyền đóng đô ở đâu sau khi lên ngôi vua?",
    options: ["Hoa Lư", "Cổ Loa", "Thăng Long", "Phú Xuân"],
    correctAnswer: "Cổ Loa",
    type: "millionaire"
  },
  {
    content: "Vị vua nào đã dẹp loạn 12 sứ quân để thống nhất đất nước?",
    options: ["Ngô Quyền", "Đinh Bộ Lĩnh", "Lê Hoàn", "Lý Công Uẩn"],
    correctAnswer: "Đinh Bộ Lĩnh",
    type: "millionaire"
  },
  {
    content: "Đinh Bộ Lĩnh lên ngôi Hoàng đế vào năm nào?",
    options: ["Năm 938", "Năm 968", "Năm 980", "Năm 1010"],
    correctAnswer: "Năm 968",
    type: "millionaire"
  },
  {
    content: "Quốc hiệu nước ta dưới thời nhà Đinh là gì?",
    options: ["Đại Việt", "Vạn Xuân", "Đại Cồ Việt", "Việt Nam"],
    correctAnswer: "Đại Cồ Việt",
    type: "millionaire"
  },
  {
    content: "Vị vua nào là người sáng lập ra triều đại Tiền Lê?",
    options: ["Lê Lợi", "Lê Hoàn", "Lê Thánh Tông", "Lê Long Đĩnh"],
    correctAnswer: "Lê Hoàn",
    type: "millionaire"
  },
  {
    content: "Chiến thắng Bạch Đằng lần thứ hai (năm 981) chống lại quân xâm lược nào?",
    options: ["Quân Nam Hán", "Quân Tống", "Quân Nguyên", "Quân Minh"],
    correctAnswer: "Quân Tống",
    type: "millionaire"
  },
  {
    content: "Ai là người đã trao áo Long bào cho Lê Hoàn để ông lên ngôi vua?",
    options: ["Dương Vân Nga", "Ỷ Lan", "Lý Chiêu Hoàng", "Ngọc Hân"],
    correctAnswer: "Dương Vân Nga",
    type: "millionaire"
  },
  {
    content: "Kinh đô Hoa Lư gắn liền với triều đại nào?",
    options: ["Nhà Lý", "Nhà Trần", "Nhà Đinh và Tiền Lê", "Nhà Nguyễn"],
    correctAnswer: "Nhà Đinh và Tiền Lê",
    type: "millionaire"
  },
  {
    content: "Vị vua nào dưới thời Tiền Lê nổi tiếng với biệt danh 'Ngọa Triều'?",
    options: ["Lê Hoàn", "Lê Trung Tông", "Lê Long Đĩnh", "Lê Hiến Tông"],
    correctAnswer: "Lê Long Đĩnh",
    type: "millionaire"
  },
  {
    content: "Niên hiệu 'Thái Bình' là niên hiệu của vị vua nào?",
    options: ["Ngô Quyền", "Đinh Tiên Hoàng", "Lý Thái Tổ", "Trần Thái Tông"],
    correctAnswer: "Đinh Tiên Hoàng",
    type: "millionaire"
  },

  // --- NHÀ LÝ ---
  {
    content: "Lý Công Uẩn dời đô từ Hoa Lư về Thăng Long vào năm nào?",
    options: ["Năm 1009", "Năm 1010", "Năm 1054", "Năm 1075"],
    correctAnswer: "Năm 1010",
    type: "millionaire"
  },
  {
    content: "Vua Lý Thánh Tông đổi tên nước thành Đại Việt vào năm nào?",
    options: ["Năm 1010", "Năm 1054", "Năm 1072", "Năm 1100"],
    correctAnswer: "Năm 1054",
    type: "millionaire"
  },
  {
    content: "Ai là tác giả của bài thơ thần 'Nam quốc sơn hà'?",
    options: ["Lý Thường Kiệt", "Trần Hưng Đạo", "Nguyễn Trãi", "Chu Văn An"],
    correctAnswer: "Lý Thường Kiệt",
    type: "millionaire"
  },
  {
    content: "Hệ thống phòng tuyến nổi tiếng chống quân Tống của Lý Thường Kiệt nằm trên sông nào?",
    options: ["Sông Hồng", "Sông Cầu (Sông Như Nguyệt)", "Sông Mã", "Sông Bạch Đằng"],
    correctAnswer: "Sông Cầu (Sông Như Nguyệt)",
    type: "millionaire"
  },
  {
    content: "Văn Miếu - Quốc Tử Giám được xây dựng dưới triều đại nào?",
    options: ["Nhà Lý", "Nhà Trần", "Nhà Lê", "Nhà Nguyễn"],
    correctAnswer: "Nhà Lý",
    type: "millionaire"
  },
  {
    content: "Thái hậu nào thời Lý nổi tiếng với việc giúp vua trị nước và xây dựng nhiều chùa chiền?",
    options: ["Dương Vân Nga", "Ỷ Lan", "Ngọc Hân", "Nam Phương"],
    correctAnswer: "Ỷ Lan",
    type: "millionaire"
  },
  {
    content: "Vị vua nào nhà Lý là nữ hoàng duy nhất trong lịch sử Việt Nam?",
    options: ["Lý Chiêu Hoàng", "Lý Nam Đế", "Lý Huệ Tông", "Lý Nhân Tông"],
    correctAnswer: "Lý Chiêu Hoàng",
    type: "millionaire"
  },
  {
    content: "Chùa Một Cột (Liên Hoa Đài) được xây dựng theo giấc mơ của vị vua nào?",
    options: ["Lý Thái Tổ", "Lý Thái Tông", "Lý Thánh Tông", "Lý Nhân Tông"],
    correctAnswer: "Lý Thái Tông",
    type: "millionaire"
  },
  {
    content: "Chính sách quân đội 'Ngụ binh ư nông' bắt đầu từ triều đại nào?",
    options: ["Nhà Đinh", "Nhà Lý", "Nhà Trần", "Nhà Lê"],
    correctAnswer: "Nhà Lý",
    type: "millionaire"
  },
  {
    content: "Khoa thi Nho học đầu tiên của nước ta được tổ chức dưới thời vua nào?",
    options: ["Lý Thái Tổ", "Lý Nhân Tông", "Trần Thái Tông", "Lê Thánh Tông"],
    correctAnswer: "Lý Nhân Tông",
    type: "millionaire"
  },

  // --- NHÀ TRẦN - HỒ ---
  {
    content: "Ai là vị vua đầu tiên của nhà Trần?",
    options: ["Trần Thái Tông", "Trần Thánh Tông", "Trần Nhân Tông", "Trần Thủ Độ"],
    correctAnswer: "Trần Thái Tông",
    type: "millionaire"
  },
  {
    content: "Nhà Trần đã mấy lần chiến thắng quân xâm lược Nguyên Mông?",
    options: ["1 lần", "2 lần", "3 lần", "4 lần"],
    correctAnswer: "3 lần",
    type: "millionaire"
  },
  {
    content: "Hội nghị Diên Hồng do vua Trần Nhân Tông triệu tập thể hiện ý chí của tầng lớp nào?",
    options: ["Quan lại", "Tướng lĩnh", "Các bậc phụ lão", "Thanh niên"],
    correctAnswer: "Các bậc phụ lão",
    type: "millionaire"
  },
  {
    content: "Trận Bạch Đằng năm 1288 đánh tan quân xâm lược nào?",
    options: ["Quân Tống", "Quân Nguyên", "Quân Minh", "Quân Xiêm"],
    correctAnswer: "Quân Nguyên",
    type: "millionaire"
  },
  {
    content: "Vị tướng nào nhà Trần nổi tiếng với hành động bóp nát quả cam vì không được dự hội nghị bàn kế đánh giặc?",
    options: ["Trần Quang Khải", "Trần Nhật Duật", "Trần Quốc Toản", "Trần Bình Trọng"],
    correctAnswer: "Trần Quốc Toản",
    type: "millionaire"
  },
  {
    content: "Vua Trần Nhân Tông sau khi đi tu đã sáng lập ra thiền phái nào?",
    options: ["Thiền phái Thảo Đường", "Thiền phái Trúc Lâm", "Thiền phái Vô Ngôn Thông", "Thiền phái Tì-ni-đa-lưu-chi"],
    correctAnswer: "Thiền phái Trúc Lâm",
    type: "millionaire"
  },
  {
    content: "Hồ Quý Ly truất ngôi nhà Trần và lập ra nhà Hồ vào năm nào?",
    options: ["Năm 1390", "Năm 1400", "Năm 1407", "Năm 1428"],
    correctAnswer: "Năm 1400",
    type: "millionaire"
  },
  {
    content: "Thành Nhà Hồ (Thanh Hóa) có đặc điểm kiến trúc nổi bật gì?",
    options: ["Xây bằng gạch", "Xây bằng đá khối lớn", "Xây bằng gỗ", "Xây bằng đất"],
    correctAnswer: "Xây bằng đá khối lớn",
    type: "millionaire"
  },
  {
    content: "Loại tiền giấy đầu tiên của Việt Nam (Thông bảo hội sao) được phát hành dưới thời nào?",
    options: ["Nhà Trần", "Nhà Hồ", "Nhà Lê", "Nhà Nguyễn"],
    correctAnswer: "Nhà Hồ",
    type: "millionaire"
  },
  {
    content: "Quốc hiệu của nước ta dưới thời nhà Hồ là gì?",
    options: ["Đại Việt", "Đại Ngu", "Đại Nam", "Vạn Xuân"],
    correctAnswer: "Đại Ngu",
    type: "millionaire"
  },

  // --- NHÀ HẬU LÊ ---
  {
    content: "Cuộc khởi nghĩa Lam Sơn do ai lãnh đạo?",
    options: ["Lê Hoàn", "Lê Lợi", "Lê Thánh Tông", "Nguyễn Trãi"],
    correctAnswer: "Lê Lợi",
    type: "millionaire"
  },
  {
    content: "Chiến thắng nào đã kết thúc 20 năm đô hộ của nhà Minh?",
    options: ["Chiến thắng Bạch Đằng", "Chiến thắng Chi Lăng - Xương Giang", "Chiến thắng Rạch Gầm - Xoài Mút", "Chiến thắng Ngọc Hồi - Đống Đa"],
    correctAnswer: "Chiến thắng Chi Lăng - Xương Giang",
    type: "millionaire"
  },
  {
    content: "Ai là tác giả của bản 'Bình Ngô Đại Cáo'?",
    options: ["Lê Lợi", "Nguyễn Trãi", "Lê Thánh Tông", "Nguyễn Du"],
    correctAnswer: "Nguyễn Trãi",
    type: "millionaire"
  },
  {
    content: "Vị vua nào được coi là anh minh nhất thời Lê Sơ, người đã lập ra 'Tao Đàn nhị thập bát tú'?",
    options: ["Lê Thái Tổ", "Lê Thái Tông", "Lê Thánh Tông", "Lê Nhân Tông"],
    correctAnswer: "Lê Thánh Tông",
    type: "millionaire"
  },
  {
    content: "Bộ luật tiêu biểu nhất của thời Lê Sơ là gì?",
    options: ["Luật Gia Long", "Luật Hồng Đức", "Hình thư", "Hình luật"],
    correctAnswer: "Luật Hồng Đức",
    type: "millionaire"
  },
  {
    content: "Sự kiện 'Lệ Chi Viên' gắn liền với nỗi oan khiên của ai?",
    options: ["Chu Văn An", "Nguyễn Trãi", "Trần Nguyên Hãn", "Lê Văn Hưu"],
    correctAnswer: "Nguyễn Trãi",
    type: "millionaire"
  },
  {
    content: "Triều đại nào đã tồn tại song song với nhà Hậu Lê trong thời kỳ Nam - Bắc triều?",
    options: ["Nhà Trần", "Nhà Mạc", "Nhà Tây Sơn", "Nhà Nguyễn"],
    correctAnswer: "Nhà Mạc",
    type: "millionaire"
  },
  {
    content: "Ai là người có công lớn trong việc trung hưng nhà Lê, mở đầu thời kỳ vua Lê - chúa Trịnh?",
    options: ["Mạc Đăng Dung", "Nguyễn Kim", "Trịnh Kiểm", "Nguyễn Hoàng"],
    correctAnswer: "Nguyễn Kim",
    type: "millionaire"
  },
  {
    content: "Chúa Nguyễn nào là người đầu tiên vào trấn thủ Thuận Hóa, mở mang bờ cõi về phía Nam?",
    options: ["Nguyễn Kim", "Nguyễn Hoàng", "Nguyễn Phúc Nguyên", "Nguyễn Phúc Chu"],
    correctAnswer: "Nguyễn Hoàng",
    type: "millionaire"
  },
  {
    content: "Ranh giới chia cắt Đàng Trong và Đàng Ngoài trong hơn 200 năm là dòng sông nào?",
    options: ["Sông Hồng", "Sông Gianh", "Sông Bến Hải", "Sông Hương"],
    correctAnswer: "Sông Gianh",
    type: "millionaire"
  },

  // --- TÂY SƠN - NGUYỄN ---
  {
    content: "Ba anh em nhà Tây Sơn là ai?",
    options: ["Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ", "Nguyễn Ánh, Nguyễn Huệ, Nguyễn Nhạc", "Nguyễn Huệ, Nguyễn Du, Nguyễn Trãi", "Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Ánh"],
    correctAnswer: "Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ",
    type: "millionaire"
  },
  {
    content: "Chiến thắng Rạch Gầm - Xoài Mút (1785) đánh tan quân xâm lược nào?",
    options: ["Quân Thanh", "Quân Xiêm", "Quân Nguyên", "Quân Pháp"],
    correctAnswer: "Quân Xiêm",
    type: "millionaire"
  },
  {
    content: "Nguyễn Huệ lên ngôi Hoàng đế lấy hiệu là Quang Trung vào năm nào?",
    options: ["Năm 1785", "Năm 1788", "Năm 1789", "Năm 1802"],
    correctAnswer: "Năm 1788",
    type: "millionaire"
  },
  {
    content: "Chiến thắng Ngọc Hồi - Đống Đa đại phá quân xâm lược nào?",
    options: ["Quân Tống", "Quân Minh", "Quân Thanh", "Quân Pháp"],
    correctAnswer: "Quân Thanh",
    type: "millionaire"
  },
  {
    content: "Vị tướng quân Thanh nào đã phải thắt cổ tự tử sau thất bại tại gò Đống Đa?",
    options: ["Tôn Sĩ Nghị", "Sầm Nghi Đống", "Ô Mã Nhi", "Thoát Hoan"],
    correctAnswer: "Sầm Nghi Đống",
    type: "millionaire"
  },
  {
    content: "Ai là người lập ra nhà Nguyễn vào năm 1802?",
    options: ["Nguyễn Huệ", "Nguyễn Nhạc", "Nguyễn Ánh", "Nguyễn Phúc Ánh"],
    correctAnswer: "Nguyễn Ánh",
    type: "millionaire"
  },
  {
    content: "Vua Gia Long chọn nơi nào làm kinh đô của nhà Nguyễn?",
    options: ["Thăng Long", "Hoa Lư", "Phú Xuân (Huế)", "Gia Định"],
    correctAnswer: "Phú Xuân (Huế)",
    type: "millionaire"
  },
  {
    content: "Quốc hiệu 'Việt Nam' chính thức có từ thời vua nào?",
    options: ["Gia Long", "Minh Mạng", "Thiệu Trị", "Tự Đức"],
    correctAnswer: "Gia Long",
    type: "millionaire"
  },
  {
    content: "Vua Minh Mạng đổi tên nước thành Đại Nam vào năm nào?",
    options: ["Năm 1802", "Năm 1838", "Năm 1858", "Năm 1883"],
    correctAnswer: "Năm 1838",
    type: "millionaire"
  },
  {
    content: "Vị vua nào nhà Nguyễn nổi tiếng với tài làm thơ và là tác giả của 'Luận Ngữ diễn nghĩa'?",
    options: ["Minh Mạng", "Thiệu Trị", "Tự Đức", "Hàm Nghi"],
    correctAnswer: "Tự Đức",
    type: "millionaire"
  },

  // --- PHÁP THUỘC & KHÁNG CHIẾN CHỐNG PHÁP ---
  {
    content: "Thực dân Pháp bắt đầu nổ súng xâm lược Việt Nam tại đâu?",
    options: ["Sài Gòn", "Đà Nẵng", "Hà Nội", "Huế"],
    correctAnswer: "Đà Nẵng",
    type: "millionaire"
  },
  {
    content: "Cuộc kháng chiến của thực dân Pháp bắt đầu vào năm nào?",
    options: ["Năm 1858", "Năm 1862", "Năm 1884", "Năm 1945"],
    correctAnswer: "Năm 1858",
    type: "millionaire"
  },
  {
    content: "Ai là người được nhân dân tôn xưng là 'Bình Tây Đại Nguyên Soái'?",
    options: ["Trương Định", "Nguyễn Trung Trực", "Phan Đình Phùng", "Hoàng Hoa Thám"],
    correctAnswer: "Trương Định",
    type: "millionaire"
  },
  {
    content: "Người anh hùng nào đã đốt cháy tàu Hy Vọng của Pháp trên sông Nhật Tảo?",
    options: ["Nguyễn Hữu Huân", "Nguyễn Trung Trực", "Võ Duy Dương", "Trương Định"],
    correctAnswer: "Nguyễn Trung Trực",
    type: "millionaire"
  },
  {
    content: "Phong trào Cần Vương bùng nổ sau chiếu Cần Vương của vị vua nào?",
    options: ["Hàm Nghi", "Thành Thái", "Duy Tân", "Bảo Đại"],
    correctAnswer: "Hàm Nghi",
    type: "millionaire"
  },
  {
    content: "Lãnh đạo cuộc khởi nghĩa Hương Khê - cuộc khởi nghĩa tiêu biểu nhất trong phong trào Cần Vương là ai?",
    options: ["Phan Đình Phùng", "Đinh Công Tráng", "Nguyễn Thiện Thuật", "Phan Bội Châu"],
    correctAnswer: "Phan Đình Phùng",
    type: "millionaire"
  },
  {
    content: "Khởi nghĩa Yên Thế kéo dài gần 30 năm do ai lãnh đạo?",
    options: ["Phan Đình Phùng", "Hoàng Hoa Thám", "Nguyễn Thái Học", "Phan Bội Châu"],
    correctAnswer: "Hoàng Hoa Thám",
    type: "millionaire"
  },
  {
    content: "Nguyễn Tất Thành ra đi tìm đường cứu nước tại bến cảng nào?",
    options: ["Cảng Hải Phòng", "Cảng Đà Nẵng", "Cảng Nhà Rồng", "Cảng Cam Ranh"],
    correctAnswer: "Cảng Nhà Rồng",
    type: "millionaire"
  },
  {
    content: "Đảng Cộng sản Việt Nam được thành lập vào ngày tháng năm nào?",
    options: ["03/02/1930", "19/05/1941", "02/09/1945", "22/12/1944"],
    correctAnswer: "03/02/1930",
    type: "millionaire"
  },
  {
    content: "Cách mạng tháng Tám năm 1945 thành công đã dẫn tới sự ra đời của nước nào?",
    options: ["Việt Nam Dân chủ Cộng hòa", "Cộng hòa Xã hội Chủ nghĩa Việt Nam", "Chính phủ Lâm thời", "Đế quốc Việt Nam"],
    correctAnswer: "Việt Nam Dân chủ Cộng hòa",
    type: "millionaire"
  },

  // --- KHÁNG CHIẾN CHỐNG MỸ & HIỆN ĐẠI ---
  {
    content: "Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại đâu?",
    options: ["Phủ Chủ tịch", "Quảng trường Ba Đình", "Nhà hát Lớn", "Hang Pác Bó"],
    correctAnswer: "Quảng trường Ba Đình",
    type: "millionaire"
  },
  {
    content: "Chiến thắng Điện Biên Phủ 'lừng lẫy năm châu, chấn động địa cầu' diễn ra vào năm nào?",
    options: ["Năm 1945", "Năm 1954", "Năm 1968", "Năm 1975"],
    correctAnswer: "Năm 1954",
    type: "millionaire"
  },
  {
    content: "Vị đại tướng nào là tổng chỉ huy chiến dịch Điện Biên Phủ?",
    options: ["Võ Nguyên Giáp", "Văn Tiến Dũng", "Nguyễn Chí Thanh", "Lê Trọng Tấn"],
    correctAnswer: "Võ Nguyên Giáp",
    type: "millionaire"
  },
  {
    content: "Hiệp định Geneva năm 1954 chia cắt Việt Nam tại vĩ tuyến bao nhiêu?",
    options: ["Vĩ tuyến 13", "Vĩ tuyến 17", "Vĩ tuyến 20", "Vĩ tuyến 22"],
    correctAnswer: "Vĩ tuyến 17",
    type: "millionaire"
  },
  {
    content: "Phong trào 'Đồng khởi' (1959-1960) bắt đầu sớm nhất tại tỉnh nào?",
    options: ["Bến Tre", "Quảng Nam", "Bình Định", "Tây Ninh"],
    correctAnswer: "Bến Tre",
    type: "millionaire"
  },
  {
    content: "Chiến dịch mang tên vị lãnh tụ vĩ đại nhằm giải phóng hoàn toàn miền Nam là chiến dịch nào?",
    options: ["Chiến dịch Huế - Đà Nẵng", "Chiến dịch Tây Nguyên", "Chiến dịch Hồ Chí Minh", "Chiến dịch Quang Trung"],
    correctAnswer: "Chiến dịch Hồ Chí Minh",
    type: "millionaire"
  },
  {
    content: "Ngày giải phóng hoàn toàn miền Nam, thống nhất đất nước là ngày nào?",
    options: ["19/05/1975", "30/04/1975", "02/09/1975", "22/12/1975"],
    correctAnswer: "30/04/1975",
    type: "millionaire"
  },
  {
    content: "Vị vua cuối cùng của triều đại phong kiến Việt Nam là ai?",
    options: ["Hàm Nghi", "Thành Thái", "Bảo Đại", "Khải Định"],
    correctAnswer: "Bảo Đại",
    type: "millionaire"
  },
  {
    content: "Năm 1976, quốc hiệu nước ta được đổi thành gì?",
    options: ["Việt Nam Dân chủ Cộng hòa", "Cộng hòa Xã hội Chủ nghĩa Việt Nam", "Đại Nam", "Việt Nam Cộng hòa"],
    correctAnswer: "Cộng hòa Xã hội Chủ nghĩa Việt Nam",
    type: "millionaire"
  },
  {
    content: "Công cuộc 'Đổi mới' đất nước được khởi xướng từ Đại hội Đảng lần thứ mấy?",
    options: ["Đại hội IV", "Đại hội V", "Đại hội VI", "Đại hội VII"],
    correctAnswer: "Đại hội VI",
    type: "millionaire"
  },

  // --- CÂU HỎI TỔNG HỢP & VĂN HÓA ---
  {
    content: "Tác giả của tác phẩm 'Truyện Kiều' là ai?",
    options: ["Nguyễn Trãi", "Nguyễn Du", "Đoàn Thị Điểm", "Hồ Xuân Hương"],
    correctAnswer: "Nguyễn Du",
    type: "millionaire"
  },
  {
    content: "Hội thề nào thể hiện sự đồng lòng của nghĩa quân Lam Sơn?",
    options: ["Hội thề Lũng Nhai", "Hội thề Đông Quan", "Hội thề Bình Than", "Hội thề Diên Hồng"],
    correctAnswer: "Hội thề Lũng Nhai",
    type: "millionaire"
  },
  {
    content: "Vị trạng nguyên nào nổi tiếng với việc 'đối đáp' thông minh khi đi sứ phương Bắc?",
    options: ["Mạc Đĩnh Chi", "Lương Thế Vinh", "Nguyễn Hiền", "Phạm Sư Mạnh"],
    correctAnswer: "Mạc Đĩnh Chi",
    type: "millionaire"
  },
  {
    content: "Ai được mệnh danh là 'Trạng Lường' của Việt Nam?",
    options: ["Mạc Đĩnh Chi", "Lương Thế Vinh", "Nguyễn Bỉnh Khiêm", "Phùng Khắc Khoan"],
    correctAnswer: "Lương Thế Vinh",
    type: "millionaire"
  },
  {
    content: "Vị trạng nguyên trẻ tuổi nhất lịch sử khoa bảng Việt Nam là ai?",
    options: ["Nguyễn Hiền", "Lê Văn Hưu", "Mạc Đĩnh Chi", "Nguyễn Trực"],
    correctAnswer: "Nguyễn Hiền",
    type: "millionaire"
  },
  {
    content: "Quần thể di tích Cố đô Huế được UNESCO công nhận là Di sản Văn hóa Thế giới vào năm nào?",
    options: ["Năm 1993", "Năm 1999", "Năm 2003", "Năm 2010"],
    correctAnswer: "Năm 1993",
    type: "millionaire"
  },
  {
    content: "Tác phẩm quân sự nổi tiếng 'Binh thư yếu lược' là của ai?",
    options: ["Lý Thường Kiệt", "Trần Hưng Đạo", "Quang Trung", "Võ Nguyên Giáp"],
    correctAnswer: "Trần Hưng Đạo",
    type: "millionaire"
  },
  {
    content: "Địa danh nào được coi là 'Vịnh Hạ Long trên cạn'?",
    options: ["Tam Cốc - Bích Động", "Tràng An", "Phong Nha - Kẻ Bàng", "Vườn quốc gia Cúc Phương"],
    correctAnswer: "Tam Cốc - Bích Động",
    type: "millionaire"
  },
  {
    content: "Lễ hội Gióng ở đền Phù Đổng và đền Sóc gắn liền với vị thánh nào?",
    options: ["Sơn Tinh", "Thánh Gióng", "Chử Đồng Tử", "Liễu Hạnh Công chúa"],
    correctAnswer: "Thánh Gióng",
    type: "millionaire"
  },
  {
    content: "Vị vua nào đã cho xây dựng tháp Báo Thiên - một trong 'An Nam tứ đại khí'?",
    options: ["Lý Thái Tổ", "Lý Thái Tông", "Lý Thánh Tông", "Lý Nhân Tông"],
    correctAnswer: "Lý Thánh Tông",
    type: "millionaire"
  }
];

module.exports = millionaireQuestions;
