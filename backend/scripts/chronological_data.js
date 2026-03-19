const chronologicalQuestions = [
  {
    title: "Các sự kiện tiêu tiêu biểu thời kỳ Hồng Bàng - Âu Lạc",
    events: [
      { text: "Lạc Long Quân và Âu Cơ đẻ ra bọc trăm trứng", order: 1 },
      { text: "Hùng Vương lập nước Văn Lang", order: 2 },
      { text: "Thánh Gióng đánh tan giặc Ân", order: 3 },
      { text: "Thục Phán lên ngôi, lập nước Âu Lạc", order: 4 },
      { text: "An Dương Vương xây thành Cổ Loa", order: 5 }
    ]
  },
  {
    title: "Diễn biến cuộc khởi nghĩa Hai Bà Trưng",
    events: [
      { text: "Thi Sách bị thái thú Tô Định giết hại", order: 1 },
      { text: "Hai Bà Trưng phất cờ khởi nghĩa tại Hát Môn", order: 2 },
      { text: "Nghĩa quân chiếm được thành Liên Lâu", order: 3 },
      { text: "Trưng Trắc lên ngôi vua, đóng đô ở Mê Linh", order: 4 },
      { text: "Mã Viện chỉ huy quân Hán sang tái chiếm", order: 5 }
    ]
  },
  {
    title: "Tiến trình giành độc lập thế kỷ X",
    events: [
      { text: "Khúc Thừa Dụ tự xưng Tiết độ sứ", order: 1 },
      { text: "Dương Đình Nghệ đánh tan quân Nam Hán lần 1", order: 2 },
      { text: "Kiều Công Tiễn giết Dương Đình Nghệ", order: 3 },
      { text: "Ngô Quyền đại thắng quân Nam Hán trên sông Bạch Đằng", order: 4 },
      { text: "Ngô Quyền lên ngôi vua, đóng đô ở Cổ Loa", order: 5 }
    ]
  },
  {
    title: "Thống nhất đất nước và thời kỳ Tiền Lê",
    events: [
      { text: "Đinh Bộ Lĩnh dẹp loạn 12 sứ quân", order: 1 },
      { text: "Nhà Đinh đặt quốc hiệu là Đại Cồ Việt", order: 2 },
      { text: "Lê Hoàn lên ngôi vua (Lê Đại Hành)", order: 3 },
      { text: "Kháng chiến chống Tống lần thứ nhất thắng lợi", order: 4 },
      { text: "Lê Long Đĩnh qua đời, nhà Tiền Lê kết thúc", order: 5 }
    ]
  },
  {
    title: "Sự nghiệp của triều đại nhà Lý",
    events: [
      { text: "Lý Công Uẩn lên ngôi vua", order: 1 },
      { text: "Dời đô từ Hoa Lư về Thăng Long", order: 2 },
      { text: "Lý Thánh Tông đổi tên nước thành Đại Việt", order: 3 },
      { text: "Xây dựng Văn Miếu - Quốc Tử Giám", order: 4 },
      { text: "Phòng tuyến Như Nguyệt đánh tan quân Tống", order: 5 }
    ]
  },
  {
    title: "Kháng chiến chống Nguyên Mông lần thứ hai (1285)",
    events: [
      { text: "Quân Nguyên ồ ạt tiến vào biên giới phía Bắc", order: 1 },
      { text: "Hội nghị Diên Hồng thể hiện quyết tâm đánh giặc", order: 2 },
      { text: "Toa Đô đánh từ phía Nam ra, thoát hoan đánh từ phía Bắc xuống", order: 3 },
      { text: "Chiến thắng Tây Kết, Hàm Tử, Chương Dương", order: 4 },
      { text: "Thoát Hoan chui vào ống đồng chạy trốn về nước", order: 5 }
    ]
  },
  {
    title: "Sự sụp đổ của nhà Trần và sự trỗi dậy của nhà Hồ",
    events: [
      { text: "Chế Bồng Nga đem quân Chiêm Thành tấn công Thăng Long", order: 1 },
      { text: "Hồ Quý Ly bắt đầu thực hiện các chính sách cải cách", order: 2 },
      { text: "Nhà Hồ phát hành tiền giấy Thông bảo hội sao", order: 3 },
      { text: "Hồ Quý Ly truất ngôi nhà Trần, lập ra nhà Hồ", order: 4 },
      { text: "Quân Minh xâm lược, cha con Hồ Quý Ly bị bắt", order: 5 }
    ]
  },
  {
    title: "Cuộc khởi nghĩa Lam Sơn",
    events: [
      { text: "Lê Lợi dựng cờ khởi nghĩa tại Lam Sơn", order: 1 },
      { text: "Nghĩa quân thực hiện chiến thuật 'vây thành diệt viện'", order: 2 },
      { text: "Chiến thắng Tốt Động - Chúc Động", order: 3 },
      { text: "Chiến thắng Chi Lăng - Xương Giang, chém đầu Liễu Thăng", order: 4 },
      { text: "Hội thề Đông Quan, quân Minh rút về nước", order: 5 }
    ]
  },
  {
    title: "Sự nghiệp của vua Quang Trung",
    events: [
      { text: "Anh em Tây Sơn nổi dậy tại Quy Nhơn", order: 1 },
      { text: "Đánh tan 5 vạn quân Xiêm tại Rạch Gầm - Xoài Mút", order: 2 },
      { text: "Tiến quân ra Bắc lật đổ chúa Trịnh", order: 3 },
      { text: "Lên ngôi Hoàng đế tại núi Bân (Huế)", order: 4 },
      { text: "Đại phá quân Thanh trong Tết Kỷ Dậu 1789", order: 5 }
    ]
  },
  {
    title: "Quá trình thực dân Pháp xâm lược Việt Nam",
    events: [
      { text: "Liên quân Pháp - Tây Ban Nha tấn công Đà Nẵng", order: 1 },
      { text: "Pháp đánh chiếm Gia Định và các tỉnh Nam Kỳ", order: 2 },
      { text: "Triều đại nhà Nguyễn ký hiệp ước Nhâm Tuất", order: 3 },
      { text: "Pháp tấn công thành Hà Nội lần thứ nhất", order: 4 },
      { text: "Ký hiệp ước Patenôtre, Việt Nam chính thức mất độc lập", order: 5 }
    ]
  },
  {
    title: "Lịch sử Việt Nam giai đoạn 1930 - 1945",
    events: [
      { text: "Thành lập Đảng Cộng sản Việt Nam", order: 1 },
      { text: "Phong trào Xô Viết Nghệ Tĩnh", order: 2 },
      { text: "Thành lập Mặt trận Việt Minh", order: 3 },
      { text: "Thành lập Đội Việt Nam Tuyên truyền Giải phóng quân", order: 4 },
      { text: "Cách mạng tháng Tám thắng lợi", order: 5 }
    ]
  },
  {
    title: "Chiến dịch Điện Biên Phủ (1954)",
    events: [
      { text: "Quân ta tấn công tập đoàn cứ điểm Điện Biên Phủ", order: 1 },
      { text: "Tiêu diệt trung tâm đề kháng Him Lam", order: 2 },
      { text: "Đánh chiếm các cao điểm phía Đông (A1, C1...)", order: 3 },
      { text: "Tổng công kích vào khu trung tâm mường Thanh", order: 4 },
      { text: "Tướng De Castries bị bắt sống, chiến dịch toàn thắng", order: 5 }
    ]
  },
  {
    title: "Các chiến lược chiến tranh của Mỹ tại Việt Nam",
    events: [
      { text: "Chiến tranh đơn phương", order: 1 },
      { text: "Chiến tranh đặc biệt", order: 2 },
      { text: "Chiến tranh cục bộ", order: 3 },
      { text: "Việt Nam hóa chiến tranh", order: 4 },
      { text: "Cuộc tổng tiến công và nổi dậy Xuân 1975", order: 5 }
    ]
  },
  {
    title: "Quá trình thống nhất đất nước về mặt Nhà nước",
    events: [
      { text: "Hiệp định Paris được ký kết", order: 1 },
      { text: "Giải phóng hoàn toàn miền Nam", order: 2 },
      { text: "Hội nghị Hiệp thương chính trị thống nhất đất nước", order: 3 },
      { text: "Tổng tuyển cử bầu Quốc hội chung cả nước", order: 4 },
      { text: "Đổi tên nước thành Cộng hòa Xã hội Chủ nghĩa Việt Nam", order: 5 }
    ]
  },
  {
    title: "Lịch sử phát triển kinh tế thời kỳ Đổi mới",
    events: [
      { text: "Đại hội VI đề ra đường lối Đổi mới", order: 1 },
      { text: "Xóa bỏ cơ chế bao cấp, chuyển sang kinh tế thị trường", order: 2 },
      { text: "Việt Nam gia nhập ASEAN", order: 3 },
      { text: "Việt Nam chính thức gia nhập WTO", order: 4 },
      { text: "Việt Nam ký kết hiệp định EVFTA", order: 5 }
    ]
  },
  {
    title: "Các triều đại phong kiến Việt Nam",
    events: [
      { text: "Nhà Đinh - Tiền Lê", order: 1 },
      { text: "Nhà Lý", order: 2 },
      { text: "Nhà Trần", order: 3 },
      { text: "Nhà Hậu Lê", order: 4 },
      { text: "Nhà Nguyễn", order: 5 }
    ]
  },
  {
    title: "Các cuộc kháng chiến chống phương Bắc tiêu biểu",
    events: [
      { text: "Kháng chiến chống Tống (nhà Tiền Lê)", order: 1 },
      { text: "Kháng chiến chống Tống (nhà Lý)", order: 2 },
      { text: "Kháng chiến chống Nguyên Mông (nhà Trần)", order: 3 },
      { text: "Kháng chiến chống Minh (nhà Hồ)", order: 4 },
      { text: "Kháng chiến chống Thanh (Tây Sơn)", order: 5 }
    ]
  },
  {
    title: "Quá trình phát triển của chữ viết Việt Nam",
    events: [
      { text: "Sử dụng chữ Hán trong giao dịch và học thuật", order: 1 },
      { text: "Sáng tạo ra chữ Nôm để ghi âm tiếng Việt", order: 2 },
      { text: "Các giáo sĩ phương Tây sáng tạo ra chữ Quốc ngữ", order: 3 },
      { text: "Chữ Quốc ngữ được phổ biến qua báo chí, văn học", order: 4 },
      { text: "Chữ Quốc ngữ trở thành chữ viết chính thức của dân tộc", order: 5 }
    ]
  },
  {
    title: "Cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh",
    events: [
      { text: "Ra đi tìm đường cứu nước tại bến Nhà Rồng", order: 1 },
      { text: "Gửi bản Yêu sách của nhân dân An Nam tới Hội nghị Versailles", order: 2 },
      { text: "Đọc Luận cương của Lenin và tìm thấy con đường cứu nước", order: 3 },
      { text: "Về nước lãnh đạo cách mạng tại hang Pác Bó", order: 4 },
      { text: "Đọc bản Tuyên ngôn Độc lập khai sinh nước VNDCCH", order: 5 }
    ]
  },
  {
    title: "Diễn biến chiến dịch Hồ Chí Minh lịch sử",
    events: [
      { text: "Giải phóng Phước Long mở đầu khả năng thắng lớn", order: 1 },
      { text: "Chiến thắng Buôn Ma Thuột giải phóng Tây Nguyên", order: 2 },
      { text: "Giải phóng Huế - Đà Nẵng", order: 3 },
      { text: "Đập tan tuyến phòng thủ Xuân Lộc", order: 4 },
      { text: "Xe tăng húc đổ cổng dinh Độc Lập", order: 5 }
    ]
  },
  {
    title: "Kháng chiến chống quân Minh xâm lược (Nhà Hồ)",
    events: [
      { text: "Nhà Minh lấy cớ 'phù Trần diệt Hồ' sang xâm lược", order: 1 },
      { text: "Hồ Quý Ly xây dựng thành Tây Đô (Thanh Hóa)", order: 2 },
      { text: "Quân Minh chiếm thành Đa Bang", order: 3 },
      { text: "Cha con Hồ Quý Ly bị bắt tại núi Cao Vọng", order: 4 },
      { text: "Đất nước rơi vào ách đô hộ của nhà Minh", order: 5 }
    ]
  },
  {
    title: "Cải cách hành chính của vua Minh Mạng",
    events: [
      { text: "Vua Minh Mạng lên ngôi kế vị vua Gia Long", order: 1 },
      { text: "Bãi bỏ các Bắc Thành và Gia Định Thành", order: 2 },
      { text: "Chia cả nước thành 30 tỉnh và 1 phủ Thừa Thiên", order: 3 },
      { text: "Thành lập các cơ quan Nội các và Cơ mật viện", order: 4 },
      { text: "Hoàn thiện hệ thống quản lý từ trung ương đến địa phương", order: 5 }
    ]
  },
  {
    title: "Phong trào Cần Vương (1885 - 1896)",
    events: [
      { text: "Phe chủ chiến tấn công Pháp tại kinh thành Huế", order: 1 },
      { text: "Tôn Thất Thuyết đưa vua Hàm Nghi ra Tân Sở (Quảng Trị)", order: 2 },
      { text: "Vua Hàm Nghi xuống chiếu Cần Vương lần thứ nhất", order: 3 },
      { text: "Các cuộc khởi nghĩa Bãi Sậy, Ba Đình bùng nổ", order: 4 },
      { text: "Khởi nghĩa Hương Khê thất bại, phong trào kết thúc", order: 5 }
    ]
  },
  {
    title: "Diễn biến khởi nghĩa Yên Bái (1930)",
    events: [
      { text: "Việt Nam Quốc dân Đảng họp bàn kế hoạch khởi nghĩa", order: 1 },
      { text: "Cuộc khởi nghĩa bùng nổ tại Yên Bái, Phú Thọ...", order: 2 },
      { text: "Quân khởi nghĩa chiếm được trại lính tại Yên Bái", order: 3 },
      { text: "Thực dân Pháp huy động máy bay ném bom Cổ Am", order: 4 },
      { text: "Nguyễn Thái Học và các đồng chí bị hành hình", order: 5 }
    ]
  },
  {
    title: "Chiến dịch Biên giới Thu Đông 1950",
    events: [
      { text: "Ta mở màn bằng trận tiêu diệt cứ điểm Đông Khê", order: 1 },
      { text: "Địch rút chạy khỏi Cao Bằng theo đường số 4", order: 2 },
      { text: "Hai cánh quân của Lơ-pa-giơ và Sác-tông bị chặn đánh", order: 3 },
      { text: "Ta tiêu diệt hoàn toàn hai binh đoàn tinh nhuệ của Pháp", order: 4 },
      { text: "Khai thông biên giới Việt - Trung, mở rộng căn cứ địa", order: 5 }
    ]
  },
  {
    title: "Tiến trình tiến tới Hiệp định Giơ-ne-vơ 1954",
    events: [
      { text: "Hội nghị Giơ-ne-vơ bắt đầu thảo luận về vấn đề Đông Dương", order: 1 },
      { text: "Chiến thắng Điện Biên Phủ vang dội năm châu", order: 2 },
      { text: "Các bên ký kết bản Hiệp định đình chỉ chiến sự", order: 3 },
      { text: "Lấy vĩ tuyến 17 làm giới tuyến quân sự tạm thời", order: 4 },
      { text: "Quân Pháp rút khỏi miền Bắc Việt Nam", order: 5 }
    ]
  },
  {
    title: "Phong trào Đồng Khởi (1959 - 1960)",
    events: [
      { text: "Hội nghị Trung ương Đảng lần thứ 15 đề ra đường lối cách mạng miền Nam", order: 1 },
      { text: "Nhân dân huyện Vĩnh Thạnh, Bắc Ái nổi dậy đầu tiên", order: 2 },
      { text: "Cuộc nổi dậy đồng loạt tại tỉnh Bến Tre", order: 3 },
      { text: "Phá vỡ từng mảng lớn bộ máy kìm kẹp của địch ở nông thôn", order: 4 },
      { text: "Mặt trận Dân tộc Giải phóng miền Nam Việt Nam ra đời", order: 5 }
    ]
  },
  {
    title: "Trận Ấp Bắc (1963) - Bước ngoặt chiến tranh",
    events: [
      { text: "Mỹ - Diệm huy động lực lượng lớn tấn công vào Ấp Bắc", order: 1 },
      { text: "Quân ta sử dụng súng trường đánh bại trực thăng vận", order: 2 },
      { text: "Địch huy động xe thiết giáp M113 nhưng vẫn bị bẻ gãy", order: 3 },
      { text: "Quân dân ta đập tan cuộc càn quét sau một ngày chiến đấu", order: 4 },
      { text: "Dấy lên phong trào 'Thi đua Ấp Bắc, giết giặc lập công'", order: 5 }
    ]
  },
  {
    title: "Sự kiện Vịnh Bắc Bộ và Mỹ leo thang chiến tranh",
    events: [
      { text: "Mỹ dựng lên 'Sự kiện Vịnh Bắc Bộ' để vu khống miền Bắc", order: 1 },
      { text: "Quốc hội Mỹ thông qua Nghị quyết Vịnh Bắc Bộ", order: 2 },
      { text: "Mỹ bắt đầu chiến dịch 'Sấm rền' ném bom miền Bắc", order: 3 },
      { text: "Quân và dân miền Bắc bắn rơi máy bay Mỹ đầu tiên", order: 4 },
      { text: "Miền Bắc chuyển sang trạng thái chiến tranh phá hoại", order: 5 }
    ]
  },
  {
    title: "Cuộc Tổng tiến công và nổi dậy Tết Mậu Thân 1968",
    events: [
      { text: "Ta mở màn bằng trận nghi binh tại Khe Sanh", order: 1 },
      { text: "Đúng đêm giao thừa, quân ta tấn công vào các đô thị miền Nam", order: 2 },
      { text: "Biệt động Sài Gòn tấn công Tòa Đại sứ Mỹ và Dinh Độc Lập", order: 3 },
      { text: "Cuộc chiến đấu ác liệt diễn ra tại Cố đô Huế", order: 4 },
      { text: "Mỹ phải chấp nhận ngồi vào bàn đàm phán tại Paris", order: 5 }
    ]
  },
  {
    title: "Chiến dịch Điện Biên Phủ trên không (12/1972)",
    events: [
      { text: "Mỹ tuyên bố ngừng đàm phán và mở chiến dịch Linebacker II", order: 1 },
      { text: "B-52 bắt đầu rải thảm bom xuống Hà Nội, Hải Phòng", order: 2 },
      { text: "Pháo cao xạ và tên lửa ta đánh trả quyết liệt", order: 3 },
      { text: "Chiếc B-52 đầu tiên bị bắn rơi tại chỗ", order: 4 },
      { text: "Mỹ buộc phải ký Hiệp định Paris rút quân về nước", order: 5 }
    ]
  },
  {
    title: "Quá trình ký kết Hiệp định Paris 1973",
    events: [
      { text: "Đàm phán kéo dài từ năm 1968 với nhiều khó khăn", order: 1 },
      { text: "Mỹ thất bại trong việc dùng sức mạnh không quân ép ta", order: 2 },
      { text: "Bốn bên ký tắt bản hiệp định chính thức", order: 3 },
      { text: "Lễ ký kết chính thức diễn ra tại Trung tâm Hội nghị Quốc tế Paris", order: 4 },
      { text: "Những người lính Mỹ cuối cùng rời khỏi Việt Nam", order: 5 }
    ]
  },
  {
    title: "Diễn biến chiến dịch Tây Nguyên (3/1975)",
    events: [
      { text: "Ta thực hiện nghi binh tại Kon Tum và Pleiku", order: 1 },
      { text: "Quân ta tấn công bất ngờ và giải phóng Buôn Ma Thuột", order: 2 },
      { text: "Địch ra lệnh rút quân khỏi Tây Nguyên theo đường số 7", order: 3 },
      { text: "Ta truy kích tiêu diệt toàn bộ quân địch rút chạy", order: 4 },
      { text: "Tây Nguyên hoàn toàn giải phóng, mở ra thời cơ chiến lược", order: 5 }
    ]
  },
  {
    title: "Chiến dịch Huế - Đà Nẵng (3/1975)",
    events: [
      { text: "Quân ta tấn công giải phóng tỉnh Quảng Trị", order: 1 },
      { text: "Tiến quân giải phóng Cố đô Huế", order: 2 },
      { text: "Đập tan căn cứ quân sự liên hợp lớn nhất của địch tại Đà Nẵng", order: 3 },
      { text: "Giải phóng hoàn toàn các tỉnh duyên hải miền Trung", order: 4 },
      { text: "Lực lượng địch ở miền Trung bị tiêu diệt hoàn toàn", order: 5 }
    ]
  },
  {
    title: "Thời kỳ Bao cấp tại Việt Nam",
    events: [
      { text: "Đất nước thống nhất, áp dụng mô hình kinh tế kế hoạch hóa", order: 1 },
      { text: "Hàng hóa được phân phối qua tem phiếu", order: 2 },
      { text: "Chủ trương 'ngăn sông cấm chợ' làm kinh tế đình trệ", order: 3 },
      { text: "Khủng hoảng kinh tế - xã hội trầm trọng những năm đầu 80", order: 4 },
      { text: "Đại hội VI quyết định xóa bỏ cơ chế bao cấp", order: 5 }
    ]
  },
  {
    title: "Cuộc chiến đấu bảo vệ biên giới Tây Nam (1978-1979)",
    events: [
      { text: "Tập đoàn Pol Pot xâm phạm lãnh thổ, tàn sát dân thường", order: 1 },
      { text: "Quân ta tiến hành phản công trên toàn tuyến biên giới", order: 2 },
      { text: "Quân tình nguyện Việt Nam cùng lực lượng yêu nước Campuchia tiến vào Phnom Penh", order: 3 },
      { text: "Lật đổ chế độ diệt chủng Khmer Đỏ", order: 4 },
      { text: "Giúp nhân dân Campuchia hồi sinh đất nước", order: 5 }
    ]
  },
  {
    title: "Cuộc chiến đấu bảo vệ biên giới phía Bắc (1979)",
    events: [
      { text: "Trung Quốc huy động lực lượng lớn tấn công dọc biên giới phía Bắc", order: 1 },
      { text: "Quân và dân ta chiến đấu anh dũng bảo vệ từng tấc đất", order: 2 },
      { text: "Địch chiếm được một số thị xã như Lạng Sơn, Cao Bằng", order: 3 },
      { text: "Ta huy động quân chủ lực tiến lên phía Bắc chuẩn bị phản công", order: 4 },
      { text: "Trung Quốc tuyên bố rút quân, chiến sự kết thúc", order: 5 }
    ]
  },
  {
    title: "Quá trình Việt Nam gia nhập Liên Hợp Quốc",
    events: [
      { text: "Việt Nam nộp đơn xin gia nhập Liên Hợp Quốc lần đầu", order: 1 },
      { text: "Mỹ dùng quyền phủ quyết để ngăn cản Việt Nam", order: 2 },
      { text: "Đại hội đồng Liên Hợp Quốc bỏ phiếu tán thành việc gia nhập", order: 3 },
      { text: "Việt Nam chính thức trở thành thành viên thứ 149", order: 4 },
      { text: "Lễ kéo cờ đỏ sao vàng tại trụ sở Liên Hợp Quốc (New York)", order: 5 }
    ]
  },
  {
    title: "Tiến trình Đổi mới đất nước (1986)",
    events: [
      { text: "Hội nghị Trung ương 8 khóa V quyết định 'giá - lương - tiền'", order: 1 },
      { text: "Tổng bí thư Lê Duẩn qua đời, ông Trường Chinh làm Tổng bí thư", order: 2 },
      { text: "Đại hội Đảng toàn quốc lần thứ VI họp tại Hà Nội", order: 3 },
      { text: "Đưa ra đường lối Đổi mới toàn diện đất nước", order: 4 },
      { text: "Chuyển sang nền kinh tế thị trường định hướng XHCN", order: 5 }
    ]
  },
  {
    title: "Bình thường hóa quan hệ Việt Nam - Hoa Kỳ",
    events: [
      { text: "Việt Nam tích cực hợp tác tìm kiếm người Mỹ mất tích (MIA)", order: 1 },
      { text: "Tổng thống Bill Clinton tuyên bố bỏ cấm vận thương mại", order: 2 },
      { text: "Hai nước chính thức thiết lập quan hệ ngoại giao", order: 3 },
      { text: "Hai bên trao đổi Đại sứ đầu tiên", order: 4 },
      { text: "Nâng cấp quan hệ lên Đối tác chiến lược toàn diện", order: 5 }
    ]
  },
  {
    title: "Thành lập Mặt trận Dân tộc Giải phóng miền Nam Việt Nam",
    events: [
      { text: "Phong trào Đồng Khởi phát triển mạnh mẽ", order: 1 },
      { text: "Đại hội thành lập Mặt trận diễn ra tại vùng giải phóng Tây Ninh", order: 2 },
      { text: "Bầu ra Ban Chấp hành Trung ương lâm thời", order: 3 },
      { text: "Công bố chương trình hành động 10 điểm", order: 4 },
      { text: "Trở thành ngọn cờ tập hợp lực lượng cách mạng miền Nam", order: 5 }
    ]
  },
  {
    title: "Các sự kiện năm 1940 tại Việt Nam",
    events: [
      { text: "Nhật xâm lược Đông Dương", order: 1 },
      { text: "Khởi nghĩa Bắc Sơn bùng nổ", order: 2 },
      { text: "Hội nghị Trung ương Đảng lần thứ 7", order: 3 },
      { text: "Khởi nghĩa Nam Kỳ bùng nổ", order: 4 },
      { text: "Đội du kích Bắc Sơn chính thức ra đời", order: 5 }
    ]
  },
  {
    title: "Quá trình thành lập quân đội ta (1944)",
    events: [
      { text: "Lãnh tụ Hồ Chí Minh ra chỉ thị thành lập Đội tự vệ vũ trang", order: 1 },
      { text: "Đội Việt Nam Tuyên truyền Giải phóng quân thành lập tại Cao Bằng", order: 2 },
      { text: "Trận Phai Khắt - Nà Ngần mở đầu truyền thống quyết thắng", order: 3 },
      { text: "Hợp nhất với Cứu quốc quân thành Việt Nam Giải phóng quân", order: 4 },
      { text: "Trở thành lực lượng nòng cốt trong Tổng khởi nghĩa", order: 5 }
    ]
  },
  {
    title: "Cách mạng tháng Tám 1945 tại Hà Nội",
    events: [
      { text: "Nhật đảo chính Pháp, nắm quyền thống trị Đông Dương", order: 1 },
      { text: "Hội nghị Tân Trào quyết định Tổng khởi nghĩa", order: 2 },
      { text: "Quần chúng mít tinh tại Nhà hát Lớn Hà Nội", order: 3 },
      { text: "Nghĩa quân chiếm Phủ Khâm sai Bắc Kỳ", order: 4 },
      { text: "Chính quyền tại Hà Nội hoàn toàn về tay nhân dân", order: 5 }
    ]
  },
  {
    title: "Sự kiện thành lập Đảng Cộng sản Việt Nam",
    events: [
      { text: "Các tổ chức cộng sản ở Việt Nam ra đời nhưng hoạt động riêng rẽ", order: 1 },
      { text: "Nguyễn Ái Quốc chủ trì Hội nghị hợp nhất tại Hương Cảng", order: 2 },
      { text: "Thống nhất các tổ chức thành Đảng Cộng sản Việt Nam", order: 3 },
      { text: "Thông qua Chính cương vắn tắt, Sách lược vắn tắt", order: 4 },
      { text: "Ban Chấp hành Trung ương lâm thời được thành lập", order: 5 }
    ]
  },
  {
    title: "Kháng chiến chống Tống thời Tiền Lê (981)",
    events: [
      { text: "Nhà Tống nhân lúc vua Đinh còn nhỏ để sang xâm lược", order: 1 },
      { text: "Thái hậu Dương Vân Nga trao áo long cổn cho Lê Hoàn", order: 2 },
      { text: "Quân Tống tiến vào nước ta bằng hai đường thủy bộ", order: 3 },
      { text: "Lê Hoàn chỉ huy đánh tan quân Tống trên sông Bạch Đằng", order: 4 },
      { text: "Hầu Nhân Bảo bị chém chết, quân Tống rút về nước", order: 5 }
    ]
  },
  {
    title: "Cuộc khởi nghĩa của Mai Thúc Loan",
    events: [
      { text: "Nhân dân căm phẫn vì chính sách cống nạp vải quả (vải thiều)", order: 1 },
      { text: "Mai Thúc Loan kêu gọi nhân dân nổi dậy khởi nghĩa", order: 2 },
      { text: "Nghĩa quân chiếm được thành Vạn An", order: 3 },
      { text: "Mai Thúc Loan lên ngôi vua, xưng là Mai Hắc Đế", order: 4 },
      { text: "Nhà Đường huy động quân sang đàn áp cuộc khởi nghĩa", order: 5 }
    ]
  },
  {
    title: "Cuộc khởi nghĩa của Phùng Hưng",
    events: [
      { text: "Anh em Phùng Hưng nổi dậy tại Đường Lâm", order: 1 },
      { text: "Nghĩa quân đánh chiếm thành Tống Bình (Hà Nội)", order: 2 },
      { text: "Viên đô hộ Cao Chính Bình lo sợ mà lâm bệnh chết", order: 3 },
      { text: "Phùng Hưng cai trị đất nước, được nhân dân tôn là Bố Cái Đại Vương", order: 4 },
      { text: "Con trai Phùng Hải nối ngôi nhưng sau đó bị nhà Đường tái chiếm", order: 5 }
    ]
  },
  {
    title: "Kháng chiến chống Nguyên lần thứ nhất (1258)",
    events: [
      { text: "Tướng Ngột Lương Hợp Thai dẫn quân xâm lược Đại Việt", order: 1 },
      { text: "Vua Trần Thái Tông trực tiếp chỉ huy trận Bình Lệ Nguyên", order: 2 },
      { text: "Ta thực hiện chiến thuật 'vườn không nhà trống' tại Thăng Long", order: 3 },
      { text: "Quân dân nhà Trần phản công quyết liệt tại Đông Bộ Đầu", order: 4 },
      { text: "Quân Nguyên rút chạy, ta giành thắng lợi hoàn toàn", order: 5 }
    ]
  },
  {
    title: "Cuộc khởi nghĩa của Lý Bí (Nhà Tiền Lý)",
    events: [
      { text: "Lý Bí liên kết với hào kiệt các châu nổi dậy khởi nghĩa", order: 1 },
      { text: "Nghĩa quân đánh chiếm thành Long Biên", order: 2 },
      { text: "Đánh tan các cuộc phản công của quân Lương", order: 3 },
      { text: "Lý Bí lên ngôi Hoàng đế (Lý Nam Đế)", order: 4 },
      { text: "Đặt tên nước là Vạn Xuân, đóng đô ở vùng cửa sông Tô Lịch", order: 5 }
    ]
  },
  {
    title: "Sự nghiệp của Triệu Quang Phục (Triệu Việt Vương)",
    events: [
      { text: "Lý Nam Đế trao quyền chỉ huy kháng chiến cho Triệu Quang Phục", order: 1 },
      { text: "Triệu Quang Phục chọn đầm Dạ Trạch làm căn cứ kháng chiến", order: 2 },
      { text: "Sử dụng chiến thuật đánh du kích gây tiêu hao sinh lực địch", order: 3 },
      { text: "Nhà Lương có loạn, Trần Bá Tiên phải rút quân về nước", order: 4 },
      { text: "Triệu Quang Phục phản công, chiếm lại thành Long Biên", order: 5 }
    ]
  },
  {
    title: "Thời kỳ Nam Bắc triều tại Việt Nam (Thế kỷ XVI)",
    events: [
      { text: "Mạc Đăng Dung ép vua Lê nhường ngôi, lập ra nhà Mạc", order: 1 },
      { text: "Nguyễn Kim chạy vào Thanh Hóa, lập vua Lê Chiêu Tông (Lê Trung Hưng)", order: 2 },
      { text: "Chiến tranh giữa nhà Mạc (Bắc triều) và nhà Lê (Nam triều) bùng nổ", order: 3 },
      { text: "Trịnh Tùng chiếm lại được Thăng Long", order: 4 },
      { text: "Nhà Mạc phải chạy lên Cao Bằng, đất nước cơ bản thống nhất", order: 5 }
    ]
  },
  {
    title: "Sự kiện Nguyễn Hoàng vào trấn thủ phía Nam",
    events: [
      { text: "Trịnh Kiểm nắm quyền hành, tìm cách loại trừ anh em họ Nguyễn", order: 1 },
      { text: "Nguyễn Hoàng xin vào trấn thủ vùng đất Thuận Hóa", order: 2 },
      { text: "Nguyễn Hoàng thực hiện chính sách vỗ về dân chúng, mở mang bờ cõi", order: 3 },
      { text: "Các chúa Nguyễn kế nghiệp bắt đầu xây dựng chính quyền riêng", order: 4 },
      { text: "Bắt đầu thời kỳ phân chia Đàng Trong - Đàng Ngoài", order: 5 }
    ]
  },
  {
    title: "Diễn biến chiến tranh Trịnh - Nguyễn (1627 - 1672)",
    events: [
      { text: "Chúa Trịnh huy động quân tấn công vào phía Nam lần thứ nhất", order: 1 },
      { text: "Quân Nguyễn xây dựng hệ thống lũy Thầy kiên cố để ngăn chặn", order: 2 },
      { text: "Hai bên giao chiến ác liệt nhiều lần tại vùng Quảng Bình - Hà Tĩnh", order: 3 },
      { text: "Trận chiến cuối cùng tại sông Gianh không phân thắng bại", order: 4 },
      { text: "Hai bên lấy sông Gianh làm ranh giới, đình chỉ chiến sự", order: 5 }
    ]
  },
  {
    title: "Quá trình thực dân Pháp đánh chiếm Bắc Kỳ lần thứ nhất",
    events: [
      { text: "Pháp lấy cớ giải quyết vụ Đuy-puy để đưa quân ra Bắc", order: 1 },
      { text: "Gác-ni-ê chỉ huy quân Pháp tấn công thành Hà Nội", order: 2 },
      { text: "Nguyễn Tri Phương bị trọng thương và hy sinh", order: 3 },
      { text: "Nghĩa quân ta phối hợp với quân Cờ Đen phục kích tại Cầu Giấy", order: 4 },
      { text: "Gác-ni-ê tử trận, Pháp buộc phải ký hiệp ước Giáp Tuất", order: 5 }
    ]
  },
  {
    title: "Quá trình thực dân Pháp đánh chiếm Bắc Kỳ lần thứ hai",
    events: [
      { text: "Ri-vi-ê chỉ huy quân Pháp nổ súng tấn công thành Hà Nội", order: 1 },
      { text: "Hoàng Diệu chỉ huy quân sĩ chiến đấu và tự vẫn để bảo toàn khí tiết", order: 2 },
      { text: "Pháp đánh chiếm các mỏ than ở Hòn Gai, Quảng Yên", order: 3 },
      { text: "Quân ta giành thắng lợi trong trận Cầu Giấy lần thứ hai", order: 4 },
      { text: "Ri-vi-ê tử trận, nhưng thực dân Pháp vẫn quyết tâm xâm lược", order: 5 }
    ]
  },
  {
    title: "Phong trào yêu nước đầu thế kỷ XX",
    events: [
      { text: "Phan Bội Châu thành lập Hội Duy Tân", order: 1 },
      { text: "Phong trào Đông Du đưa thanh niên sang Nhật học tập", order: 2 },
      { text: "Phan Chu Trinh khởi xướng phong trào Duy Tân ở miền Trung", order: 3 },
      { text: "Thành lập trường Đông Kinh Nghĩa Thục tại Hà Nội", order: 4 },
      { text: "Vụ đầu độc lính Pháp tại Hà Nội (Hà Thành đầu độc)", order: 5 }
    ]
  },
  {
    title: "Hoạt động của Nguyễn Ái Quốc (1911 - 1920)",
    events: [
      { text: "Làm phụ bếp trên tàu Đô đốc Latouche-Tréville ra nước ngoài", order: 1 },
      { text: "Tham gia Đảng Xã hội Pháp tại Paris", order: 2 },
      { text: "Gửi bản Yêu sách của nhân dân An Nam tới Hội nghị Versailles", order: 3 },
      { text: "Đọc bản Sơ thảo lần thứ nhất những luận cương về vấn đề dân tộc và thuộc địa", order: 4 },
      { text: "Tham gia sáng lập Đảng Cộng sản Pháp tại Đại hội Tua", order: 5 }
    ]
  },
  {
    title: "Hoạt động của Nguyễn Ái Quốc (1921 - 1930)",
    events: [
      { text: "Sáng lập Hội Liên hiệp thuộc địa và báo Người cùng khổ (Le Paria)", order: 1 },
      { text: "Đến Liên Xô học tập và dự Đại hội Quốc tế Cộng sản", order: 2 },
      { text: "Thành lập Hội Việt Nam Cách mạng Thanh niên tại Quảng Châu", order: 3 },
      { text: "Mở các lớp huấn luyện cán bộ và xuất bản tác phẩm 'Đường Kách mệnh'", order: 4 },
      { text: "Chủ trì hội nghị thành lập Đảng Cộng sản Việt Nam", order: 5 }
    ]
  },
  {
    title: "Phong trào cách mạng 1930 - 1931",
    events: [
      { text: "Bãi công của công nhân Vinh - Bến Thủy nhân ngày Quốc tế Lao động", order: 1 },
      { text: "Cuộc biểu tình của nông dân huyện Hưng Nguyên (Nghệ An)", order: 2 },
      { text: "Thành lập các Xô viết tại Nghệ An và Hà Tĩnh", order: 3 },
      { text: "Chính quyền thực dân thực hiện chính sách 'Khủng bố trắng'", order: 4 },
      { text: "Hội nghị Trung ương Đảng tháng 10/1930 tại Hương Cảng", order: 5 }
    ]
  },
  {
    title: "Phong trào dân chủ 1936 - 1939",
    events: [
      { text: "Chính phủ Mặt trận Nhân dân lên cầm quyền tại Pháp", order: 1 },
      { text: "Cuộc vận động Đông Dương đại hội thu thập dân nguyện", order: 2 },
      { text: "Các cuộc bãi công, biểu tình đòi tự do, cơm áo, hòa bình", order: 3 },
      { text: "Cuộc mít tinh khổng lồ tại khu đấu xảo Hà Nội (1/5/1938)", order: 4 },
      { text: "Thực dân Pháp bắt đầu đàn áp, phong trào lắng xuống", order: 5 }
    ]
  },
  {
    title: "Tiến tới Tổng khởi nghĩa tháng Tám 1945",
    events: [
      { text: "Hội nghị Trung ương Đảng lần thứ 8 tại Pác Bó", order: 1 },
      { text: "Thành lập Mặt trận Việt Minh", order: 2 },
      { text: "Nhật đảo chính Pháp, Đảng ra chỉ thị 'Nhật - Pháp bắn nhau và hành động của chúng ta'", order: 3 },
      { text: "Thành lập Khu giải phóng Việt Bắc", order: 4 },
      { text: "Đại hội Quốc dân Tân Trào thông qua quyết định Tổng khởi nghĩa", order: 5 }
    ]
  },
  {
    title: "Những năm đầu sau Cách mạng tháng Tám (1945 - 1946)",
    events: [
      { text: "Tổng tuyển cử bầu Quốc hội khóa I trên cả nước", order: 1 },
      { text: "Thông qua Hiến pháp đầu tiên của nước VNDCCH", order: 2 },
      { text: "Ký Hiệp định Sơ bộ (6/3) và Tạm ước (14/9)", order: 3 },
      { text: "Pháp nổ súng tấn công tại Hải Phòng, Lạng Sơn", order: 4 },
      { text: "Chủ tịch Hồ Chí Minh ra Lời kêu gọi toàn quốc kháng chiến", order: 5 }
    ]
  },
  {
    title: "Chiến dịch Việt Bắc Thu Đông 1947",
    events: [
      { text: "Pháp mở chiến dịch tiến công lên căn cứ địa Việt Bắc", order: 1 },
      { text: "Ta tổ chức bao vây, chia cắt các cánh quân địch", order: 2 },
      { text: "Chiến thắng vang dội trên sông Lô và đường số 4", order: 3 },
      { text: "Pháp buộc phải rút khỏi Việt Bắc", order: 4 },
      { text: "Căn cứ Việt Bắc được bảo vệ, quân ta ngày càng trưởng thành", order: 5 }
    ]
  },
  {
    title: "Đại hội đại biểu toàn quốc lần thứ II của Đảng (1951)",
    events: [
      { text: "Họp tại Chiêm Hóa (Tuyên Quang)", order: 1 },
      { text: "Quyết định đưa Đảng ra hoạt động công khai", order: 2 },
      { text: "Đổi tên Đảng thành Đảng Lao động Việt Nam", order: 3 },
      { text: "Bầu đồng chí Hồ Chí Minh làm Chủ tịch Đảng", order: 4 },
      { text: "Đề ra nhiệm vụ hoàn thành giải phóng dân tộc", order: 5 }
    ]
  },
  {
    title: "Các chiến dịch quân sự năm 1952 - 1953",
    events: [
      { text: "Chiến dịch Hòa Bình tiêu diệt tập đoàn cứ điểm của Pháp", order: 1 },
      { text: "Chiến dịch Tây Bắc giải phóng nhiều vùng đất đai", order: 2 },
      { text: "Liên quân Lào - Việt mở chiến dịch Thượng Lào", order: 3 },
      { text: "Pháp đề ra kế hoạch Na-va nhằm xoay chuyển tình thế", order: 4 },
      { text: "Ta chuẩn bị cho cuộc tiến công chiến lược Đông Xuân 1953-1954", order: 5 }
    ]
  },
  {
    title: "Chiến lược 'Chiến tranh đặc biệt' của Mỹ",
    events: [
      { text: "Mỹ đưa cố vấn quân sự và vũ khí vào miền Nam", order: 1 },
      { text: "Đẩy mạnh chính sách lập 'Ấp chiến lược' để tách dân khỏi cách mạng", order: 2 },
      { text: "Ta giành thắng lợi lớn trong trận Ấp Bắc", order: 3 },
      { text: "Chiến thắng Bình Giã, Ba Gia, Đồng Xoài làm phá sản chiến lược", order: 4 },
      { text: "Cuộc đảo chính giết chết anh em Diệm - Nhu", order: 5 }
    ]
  },
  {
    title: "Chiến lược 'Chiến tranh cục bộ' của Mỹ",
    events: [
      { text: "Mỹ ồ ạt đưa quân viễn chinh và quân đồng minh vào miền Nam", order: 1 },
      { text: "Mở các cuộc phản công chiến lược mùa khô nhằm 'tìm diệt' và 'bình định'", order: 2 },
      { text: "Quân và dân ta giành thắng lợi tại Vạn Tường mở đầu cao trào diệt Mỹ", order: 3 },
      { text: "Đập tan hai cuộc phản công chiến lược mùa khô của địch", order: 4 },
      { text: "Cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968", order: 5 }
    ]
  },
  {
    title: "Chiến lược 'Việt Nam hóa chiến tranh' của Mỹ",
    events: [
      { text: "Mỹ thực hiện rút quân dần nhưng tăng cường quân lực Việt Nam Cộng hòa", order: 1 },
      { text: "Mở rộng chiến tranh sang Lào và Campuchia", order: 2 },
      { text: "Quân ta phối hợp với quân dân Lào chiến thắng tại Đường 9 - Nam Lào", order: 3 },
      { text: "Cuộc tiến công chiến lược năm 1972 của quân ta", order: 4 },
      { text: "Mỹ leo thang đánh phá trở lại miền Bắc lần thứ hai", order: 5 }
    ]
  },
  {
    title: "Thành lập các tổ chức Cộng sản năm 1929",
    events: [
      { text: "Đông Dương Cộng sản Đảng thành lập tại Hà Nội", order: 1 },
      { text: "An Nam Cộng sản Đảng thành lập từ nhóm thanh niên ở Nam Kỳ", order: 2 },
      { text: "Đông Dương Cộng sản Liên đoàn thành lập từ Tân Việt Cách mệnh Đảng", order: 3 },
      { text: "Phong trào đấu tranh của công nhân và nhân dân phát triển mạnh", order: 4 },
      { text: "Yêu cầu cấp thiết phải có một Đảng cộng sản duy nhất lãnh đạo", order: 5 }
    ]
  },
  {
    title: "Phong trào Xô viết Nghệ Tĩnh (1930 - 1931)",
    events: [
      { text: "Nông dân biểu tình tại Hưng Nguyên bị máy bay Pháp ném bom", order: 1 },
      { text: "Bộ máy chính quyền thực dân ở xã, thôn bị tan rã", order: 2 },
      { text: "Các Ban chấp hành nông hội xã đứng ra điều hành công việc", order: 3 },
      { text: "Thực hiện các chính sách kinh tế, văn hóa, xã hội tiến bộ", order: 4 },
      { text: "Thực dân Pháp tập trung lực lượng đàn áp đẫm máu", order: 5 }
    ]
  },
  {
    title: "Sự kiện Nhật đảo chính Pháp (9/3/1945)",
    events: [
      { text: "Nhật bất ngờ tấn công Pháp trên toàn Đông Dương", order: 1 },
      { text: "Quân Pháp nhanh chóng đầu hàng hoặc bỏ chạy", order: 2 },
      { text: "Nhật độc chiếm Đông Dương, dựng lên chính phủ Trần Trọng Kim", order: 3 },
      { text: "Đảng ra chỉ thị xác định kẻ thù chính là phát xít Nhật", order: 4 },
      { text: "Phong trào kháng Nhật cứu nước phát triển mạnh mẽ", order: 5 }
    ]
  },
  {
    title: "Chiến thắng trên sông Bạch Đằng (1288)",
    events: [
      { text: "Quân Nguyên thất bại trong việc chiếm đóng, tìm đường rút về nước", order: 1 },
      { text: "Trần Hưng Đạo dự đoán đường rút lui và bố trí trận địa cọc ngầm", order: 2 },
      { text: "Ta nhử địch tiến sâu vào sông Bạch Đằng khi triều dâng", order: 3 },
      { text: "Khi triều rút, thuyền địch bị vướng cọc và bị ta tấn công dồn dập", order: 4 },
      { text: "Toàn bộ hạm đội quân Nguyên bị tiêu diệt, Ô Mã Nhi bị bắt", order: 5 }
    ]
  },
  {
    title: "Cuộc cải cách của vua Lê Thánh Tông",
    events: [
      { text: "Vua Lê Thánh Tông lên ngôi, mở ra thời kỳ cực thịnh của nhà Lê", order: 1 },
      { text: "Hoàn thiện bộ máy hành chính từ trung ương đến địa phương", order: 2 },
      { text: "Ban hành bộ Luật Hồng Đức (Quốc triều hình luật)", order: 3 },
      { text: "Thực hiện chính sách quân điền và khuyến khích nông nghiệp", order: 4 },
      { text: "Vẽ bản đồ đất nước (Bản đồ Hồng Đức)", order: 5 }
    ]
  },
  {
    title: "Diễn biến trận Ngọc Hồi - Đống Đa (1789)",
    events: [
      { text: "Quang Trung tiến quân ra Bắc thần tốc vào dịp Tết", order: 1 },
      { text: "Quân Tây Sơn hạ đồn Hà Hồi bằng cách vây kín uy hiếp", order: 2 },
      { text: "Tấn công quyết liệt vào đồn Ngọc Hồi bằng lá chắn rơm thấm nước", order: 3 },
      { text: "Cánh quân của Đô đốc Long bất ngờ đánh úp đồn Đống Đa", order: 4 },
      { text: "Sầm Nghi Đống thắt cổ tự tử, Tôn Sĩ Nghị bỏ chạy về nước", order: 5 }
    ]
  },
  {
    title: "Phong trào kháng chiến chống Pháp ở Nam Kỳ (Thế kỷ XIX)",
    events: [
      { text: "Nguyễn Trung Trực đốt cháy tàu Hy Vọng của Pháp", order: 1 },
      { text: "Trương Định từ chối lệnh bãi binh, được dân tôn là Bình Tây Đại Nguyên Soái", order: 2 },
      { text: "Thủ Khoa Huân lãnh đạo nhân dân khởi nghĩa tại Mỹ Tho", order: 3 },
      { text: "Nguyễn Hữu Huân và nhiều thủ lĩnh khác bị bắt và hy sinh", order: 4 },
      { text: "Pháp hoàn thành việc chiếm 6 tỉnh Nam Kỳ", order: 5 }
    ]
  },
  {
    title: "Hội nghị hiệp thương chính trị thống nhất đất nước (1975)",
    events: [
      { text: "Sau ngày giải phóng, nhu cầu thống nhất đất nước trở nên cấp thiết", order: 1 },
      { text: "Đoàn đại biểu hai miền gặp nhau tại Sài Gòn", order: 2 },
      { text: "Thống nhất hoàn toàn về chủ trương, bước đi của quá trình thống nhất", order: 3 },
      { text: "Quyết định tổ chức Tổng tuyển cử bầu Quốc hội chung", order: 4 },
      { text: "Mở đường cho việc thành lập một Nhà nước thống nhất", order: 5 }
    ]
  },
  {
    title: "Việt Nam gia nhập Tổ chức Thương mại Thế giới (WTO)",
    events: [
      { text: "Việt Nam chính thức nộp đơn xin gia nhập WTO", order: 1 },
      { text: "Trải qua hơn 10 năm đàm phán với các thành viên", order: 2 },
      { text: "Ký kết các hiệp định song phương và đa phương", order: 3 },
      { text: "Đại hội đồng WTO chính thức kết nạp Việt Nam làm thành viên thứ 150", order: 4 },
      { text: "Mở ra cơ hội và thách thức lớn cho kinh tế đất nước", order: 5 }
    ]
  },
  {
    title: "Quá trình mở rộng quan hệ đối ngoại của Việt Nam",
    events: [
      { text: "Bình thường hóa quan hệ với Trung Quốc", order: 1 },
      { text: "Gia nhập Hiệp hội các quốc gia Đông Nam Á (ASEAN)", order: 2 },
      { text: "Thiết lập quan hệ ngoại giao với Hoa Kỳ", order: 3 },
      { text: "Gia nhập Diễn đàn Hợp tác Kinh tế Châu Á - Thái Bình Dương (APEC)", order: 4 },
      { text: "Trở thành Ủy viên không thường trực Hội đồng Bảo an Liên Hợp Quốc", order: 5 }
    ]
  },
  {
    title: "Các bản Hiến pháp của nước Việt Nam hiện đại",
    events: [
      { text: "Hiến pháp đầu tiên của nước VNDCCH được thông qua", order: 1 },
      { text: "Hiến pháp thời kỳ xây dựng CNXH ở miền Bắc và đấu tranh thống nhất", order: 2 },
      { text: "Hiến pháp đầu tiên của nước CHXHCN Việt Nam thống nhất", order: 3 },
      { text: "Hiến pháp thời kỳ đầu Đổi mới", order: 4 },
      { text: "Hiến pháp hiện hành được Quốc hội khóa XIII thông qua", order: 5 }
    ]
  },
  {
    title: "Diễn biến chính trị thời kỳ sau năm 1975",
    events: [
      { text: "Cuộc Tổng tuyển cử bầu Quốc hội chung cả nước khóa VI", order: 1 },
      { text: "Quốc hội quyết định tên nước, quốc kỳ, quốc ca và thủ đô", order: 2 },
      { text: "Thành lập Mặt trận Tổ quốc Việt Nam trên cơ sở hợp nhất các mặt trận", order: 3 },
      { text: "Đại hội Đảng lần thứ IV xác định đường lối xây dựng CNXH", order: 4 },
      { text: "Hoàn thành thống nhất đất nước về mặt Nhà nước", order: 5 }
    ]
  },
  {
    title: "Các sự kiện lịch sử thế kỷ X (sau Ngô Quyền)",
    events: [
      { text: "Ngô Quyền mất, đất nước rơi vào loạn 12 sứ quân", order: 1 },
      { text: "Đinh Bộ Lĩnh dẹp loạn, thống nhất đất nước", order: 2 },
      { text: "Nhà Đinh đặt quốc hiệu là Đại Cồ Việt", order: 3 },
      { text: "Lê Hoàn lên ngôi vua, sáng lập nhà Tiền Lê", order: 4 },
      { text: "Kháng chiến chống Tống lần thứ nhất thắng lợi", order: 5 }
    ]
  },
  {
    title: "Sự nghiệp của nhà Hậu Lê thời kỳ đầu",
    events: [
      { text: "Lê Lợi lên ngôi vua, khôi phục quốc hiệu Đại Việt", order: 1 },
      { text: "Xây dựng bộ máy nhà nước quân chủ chuyên chế trung ương tập quyền", order: 2 },
      { text: "Thực hiện chính sách quân điền và phục hưng kinh tế", order: 3 },
      { text: "Vua Lê Thái Tông tiếp nối các chính sách của vua cha", order: 4 },
      { text: "Vua Lê Thánh Tông đưa triều đại đạt đến đỉnh cao", order: 5 }
    ]
  },
  {
    title: "Cuộc đấu tranh giành độc lập thời Bắc thuộc (Thế kỷ VII-IX)",
    events: [
      { text: "Khởi nghĩa Lý Tự Tiên và Đinh Kiến", order: 1 },
      { text: "Khởi nghĩa Mai Thúc Loan (Mai Hắc Đế)", order: 2 },
      { text: "Khởi nghĩa Phùng Hưng (Bố Cái Đại Vương)", order: 3 },
      { text: "Khởi nghĩa Dương Thanh", order: 4 },
      { text: "Khúc Thừa Dụ giành quyền tự chủ", order: 5 }
    ]
  },
  {
    title: "Chiến dịch Đông Xuân 1953 - 1954",
    events: [
      { text: "Ta tấn công lên Lai Châu và giải phóng toàn tỉnh", order: 1 },
      { text: "Phối hợp với quân giải phóng Lào mở chiến dịch Trung Lào", order: 2 },
      { text: "Ta mở chiến dịch Hạ Lào và Đông Bắc Campuchia", order: 3 },
      { text: "Tiến công địch ở Tây Nguyên và giải phóng Kontum", order: 4 },
      { text: "Địch phải phân tán lực lượng ra 5 nơi tập trung quân", order: 5 }
    ]
  },
  {
    title: "Quá trình thành lập Mặt trận dân tộc thống nhất",
    events: [
      { text: "Thành lập Hội Phản đế đồng minh", order: 1 },
      { text: "Thành lập Mặt trận Thống nhất nhân dân phản đế Đông Dương", order: 2 },
      { text: "Thành lập Mặt trận Việt Nam Độc lập Đồng minh (Việt Minh)", order: 3 },
      { text: "Thành lập Mặt trận Liên Việt", order: 4 },
      { text: "Thành lập Mặt trận Tổ quốc Việt Nam", order: 5 }
    ]
  },
  {
    title: "Lịch sử Việt Nam thời kỳ Nhà Mạc",
    events: [
      { text: "Mạc Đăng Dung lập ra nhà Mạc", order: 1 },
      { text: "Nhà Mạc tổ chức các kỳ thi đình để tuyển chọn nhân tài", order: 2 },
      { text: "Chiến tranh Nam - Bắc triều kéo dài nhiều thập kỷ", order: 3 },
      { text: "Nhà Mạc mất Thăng Long, rút về Cao Bằng", order: 4 },
      { text: "Thế lực nhà Mạc hoàn toàn bị chấm dứt", order: 5 }
    ]
  },
  {
    title: "Các cuộc khởi nghĩa trong phong trào Cần Vương",
    events: [
      { text: "Khởi nghĩa Ba Đình (Thanh Hóa)", order: 1 },
      { text: "Khởi nghĩa Bãi Sậy (Hưng Yên)", order: 2 },
      { text: "Khởi nghĩa Hùng Lĩnh", order: 3 },
      { text: "Khởi nghĩa Hương Khê (Hà Tĩnh)", order: 4 },
      { text: "Phong trào Cần Vương thất bại", order: 5 }
    ]
  },
  {
    title: "Lịch sử Việt Nam giai đoạn 1941 - 1945",
    events: [
      { text: "Nguyễn Ái Quốc về nước trực tiếp lãnh đạo cách mạng", order: 1 },
      { text: "Thành lập Mặt trận Việt Minh tại Hội nghị Trung ương 8", order: 2 },
      { text: "Xây dựng các căn cứ địa cách mạng tại Cao - Bắc - Lạng", order: 3 },
      { text: "Thành lập Đội Việt Nam Tuyên truyền Giải phóng quân", order: 4 },
      { text: "Chớp thời cơ Nhật hàng Đồng minh để Tổng khởi nghĩa", order: 5 }
    ]
  },
  {
    title: "Lịch sử Việt Nam giai đoạn 1954 - 1960",
    events: [
      { text: "Tiếp quản thủ đô Hà Nội từ tay Pháp", order: 1 },
      { text: "Hoàn thành cải cách ruộng đất ở miền Bắc", order: 2 },
      { text: "Khôi phục kinh tế và phát triển văn hóa ở miền Bắc", order: 3 },
      { text: "Phong trào Đồng khởi bùng nổ ở miền Nam", order: 4 },
      { text: "Đại hội Đảng lần thứ III đề ra hai nhiệm vụ chiến lược", order: 5 }
    ]
  },
  {
    title: "Lịch sử Việt Nam giai đoạn 1973 - 1975",
    events: [
      { text: "Mỹ rút quân khỏi Việt Nam theo Hiệp định Paris", order: 1 },
      { text: "Hội nghị Trung ương Đảng lần thứ 21 xác định nhiệm vụ cách mạng miền Nam", order: 2 },
      { text: "Chiến thắng Phước Long tạo tiền đề cho cuộc tổng tiến công", order: 3 },
      { text: "Mở chiến dịch Tây Nguyên giải phóng Buôn Ma Thuột", order: 4 },
      { text: "Tổng tiến công và nổi dậy Xuân 1975 toàn thắng", order: 5 }
    ]
  },
  {
    title: "Quá trình hội nhập kinh tế quốc tế từ năm 2000",
    events: [
      { text: "Ký kết Hiệp định Thương mại song phương Việt - Mỹ (BTA)", order: 1 },
      { text: "Việt Nam chính thức trở thành thành viên WTO", order: 2 },
      { text: "Tham gia sáng lập Cộng đồng Kinh tế ASEAN (AEC)", order: 3 },
      { text: "Ký kết Hiệp định Đối tác Toàn diện và Tiến bộ xuyên Thái Bình Dương (CPTPP)", order: 4 },
      { text: "Hiệp định Thương mại tự do Việt Nam - EU (EVFTA) có hiệu lực", order: 5 }
    ]
  },
  {
    title: "Sự phát triển của giáo dục Việt Nam thời phong kiến",
    events: [
      { text: "Mở khoa thi đầu tiên dưới thời nhà Lý", order: 1 },
      { text: "Xây dựng Quốc Tử Giám làm trường đại học quốc gia", order: 2 },
      { text: "Nhà Trần mở rộng giáo dục và thi cử", order: 3 },
      { text: "Dựng bia Tiến sĩ tại Văn Miếu dưới thời vua Lê Thánh Tông", order: 4 },
      { text: "Giáo dục Nho học đạt mức cực thịnh", order: 5 }
    ]
  },
  {
    title: "Các cuộc kháng chiến chống quân xâm lược nhà Tống",
    events: [
      { text: "Kháng chiến chống Tống lần thứ nhất (Lê Hoàn)", order: 1 },
      { text: "Lý Thường Kiệt chủ động tấn công vào đất Tống", order: 2 },
      { text: "Xây dựng phòng tuyến sông Như Nguyệt", order: 3 },
      { text: "Đánh tan quân Tống tại phòng tuyến sông Như Nguyệt", order: 4 },
      { text: "Giữ vững nền độc lập dân tộc trước nhà Tống", order: 5 }
    ]
  },
  {
    title: "Quá trình mở mang bờ cõi về phía Nam",
    events: [
      { text: "Lý Thánh Tông thu nhận 3 châu địa lý của Chiêm Thành", order: 1 },
      { text: "Huyền Trân công chúa gả cho vua Chiêm, Đại Việt có thêm châu Ô, châu Lý", order: 2 },
      { text: "Lê Thánh Tông sát nhập vùng đất phía Nam đến đèo Cù Mông", order: 3 },
      { text: "Các chúa Nguyễn khai phá vùng đất Nam Bộ", order: 4 },
      { text: "Vua Minh Mạng hoàn thiện hệ thống hành chính cả nước", order: 5 }
    ]
  },
  {
    title: "Lịch sử Đảng Cộng sản Việt Nam từ khi thành lập",
    events: [
      { text: "Hội nghị hợp nhất tại Hương Cảng (Trung Quốc)", order: 1 },
      { text: "Luận cương chính trị tháng 10/1930", order: 2 },
      { text: "Đại hội đại biểu toàn quốc lần thứ I tại Ma Cao", order: 3 },
      { text: "Đại hội đại biểu toàn quốc lần thứ II tại Tuyên Quang", order: 4 },
      { text: "Đại hội đại biểu toàn quốc lần thứ III tại Hà Nội", order: 5 }
    ]
  },
  {
    title: "Các sự kiện lớn thời kỳ đổi mới (1986 - 2000)",
    events: [
      { text: "Đại hội VI đề ra đường lối đổi mới toàn diện", order: 1 },
      { text: "Rút quân tình nguyện Việt Nam khỏi Campuchia", order: 2 },
      { text: "Việt Nam bình thường hóa quan hệ với các nước lớn", order: 3 },
      { text: "Việt Nam gia nhập ASEAN năm 1995", order: 4 },
      { text: "Ký kết Hiệp định biên giới trên đất liền Việt - Trung", order: 5 }
    ]
  },
  {
    title: "Quá trình đàm phán Hiệp định CPTPP",
    events: [
      { text: "Bắt đầu đàm phán với tư cách là Hiệp định TPP", order: 1 },
      { text: "Hoa Kỳ tuyên bố rút khỏi hiệp định TPP", order: 2 },
      { text: "Các nước còn lại thảo luận để duy trì hiệp định", order: 3 },
      { text: "Ký kết chính thức Hiệp định CPTPP tại Chile", order: 4 },
      { text: "Hiệp định chính thức có hiệu lực đối với Việt Nam", order: 5 }
    ]
  },
  {
    title: "Cuộc khởi nghĩa của Dương Thanh (819 - 820)",
    events: [
      { text: "Dương Thanh làm hào trưởng, bất bình với quan đô hộ", order: 1 },
      { text: "Lợi dụng thời cơ, Dương Thanh cùng nghĩa quân tấn công thành Tống Bình", order: 2 },
      { text: "Giết chết đô hộ Lý Tượng Cổ và chiếm giữ thành", order: 3 },
      { text: "Nhà Đường huy động lực lượng lớn sang đàn áp", order: 4 },
      { text: "Cuộc khởi nghĩa thất bại, Dương Thanh hy sinh anh dũng", order: 5 }
    ]
  },
  {
    title: "Sự nghiệp của vua Gia Long (1802 - 1820)",
    events: [
      { text: "Nguyễn Ánh đánh bại quân Tây Sơn, thống nhất đất nước", order: 1 },
      { text: "Lên ngôi Hoàng đế, lấy niên hiệu là Gia Long", order: 2 },
      { text: "Đặt quốc hiệu là Việt Nam, đóng đô ở Huế", order: 3 },
      { text: "Xây dựng kinh thành Huế và củng cố bộ máy nhà nước", order: 4 },
      { text: "Ban hành bộ Hoàng triều luật lệ (Luật Gia Long)", order: 5 }
    ]
  }
];

module.exports = chronologicalQuestions;
