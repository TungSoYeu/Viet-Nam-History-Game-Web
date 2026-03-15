const guessCharacterQuestions = [
  {
    name: "Lý Thường Kiệt",
    aliases: ["Ngô Tuấn"],
    clues: [
      "Ông là một vị thái úy tài ba dưới triều đại nhà Lý.",
      "Ông là tổng chỉ huy cuộc kháng chiến chống quân Tống (1075-1077).",
      "Ông đã chủ động đem quân đánh sang đất Tống để phá âm mưu xâm lược.",
      "Ông xây dựng tuyến phòng thủ vững chắc trên sông Như Nguyệt.",
      "Ông được cho là tác giả của bài thơ thần 'Nam quốc sơn hà'."
    ]
  },
  {
    name: "Trần Quốc Tuấn",
    aliases: ["Trần Hưng Đạo", "Hưng Đạo Đại Vương"],
    clues: [
      "Ông là một vị vương gia thời nhà Trần, có tài thao lược xuất chúng.",
      "Ông là tác giả của hai bộ binh thư: Binh thư yếu lược và Vạn Kiếp tông bí truyền thư.",
      "Ông đã lãnh đạo quân dân Đại Việt ba lần đánh bại quân Nguyên Mông.",
      "Ông nổi tiếng với câu nói 'Khoan thư sức dân để làm kế sâu rễ bền gốc'.",
      "Ông là tác giả của bài 'Hịch tướng sĩ' nổi tiếng."
    ]
  },
  {
    name: "Lê Lợi",
    aliases: ["Lê Thái Tổ", "Bình Định Vương"],
    clues: [
      "Ông xuất thân là một hào trưởng ở vùng Thanh Hóa.",
      "Ông đã tổ chức Hội thề Lũng Nhai cùng 18 người anh em kết nghĩa.",
      "Ông là người đã sử dụng chiến thuật 'vây thành diệt viện' để đánh giặc.",
      "Ông lãnh đạo cuộc khởi nghĩa Lam Sơn ròng rã 10 năm.",
      "Ông là người đánh đuổi giặc Minh, lập ra triều đại Hậu Lê."
    ]
  },
  {
    name: "Nguyễn Huệ",
    aliases: ["Quang Trung", "Bắc Bình Vương"],
    clues: [
      "Ông là một trong ba anh em lãnh đạo cuộc khởi nghĩa nông dân lớn nhất thế kỷ 18.",
      "Ông có tài cầm quân bách chiến bách thắng, hành quân thần tốc.",
      "Ông đánh tan 5 vạn quân Xiêm tại trận Rạch Gầm - Xoài Mút.",
      "Ông lật đổ chúa Nguyễn ở Đàng Trong và chúa Trịnh ở Đàng Ngoài.",
      "Ông đại phá 29 vạn quân Thanh trong dịp Tết Kỷ Dậu 1789."
    ]
  },
  {
    name: "Võ Nguyên Giáp",
    aliases: ["Anh Văn", "Đại tướng Võ Nguyên Giáp"],
    clues: [
      "Ông từng là một thầy giáo dạy lịch sử trước khi tham gia cách mạng.",
      "Ông được Bác Hồ giao nhiệm vụ thành lập Đội Việt Nam Tuyên truyền Giải phóng quân.",
      "Ông là Đại tướng đầu tiên của Quân đội nhân dân Việt Nam.",
      "Ông nổi tiếng với chiến thuật 'Đánh chắc, tiến chắc'.",
      "Ông là Tổng tư lệnh chiến dịch Điện Biên Phủ năm 1954."
    ]
  },
  {
    name: "Hồ Chí Minh",
    aliases: ["Nguyễn Sinh Cung", "Nguyễn Tất Thành", "Nguyễn Ái Quốc", "Bác Hồ"],
    clues: [
      "Người sinh ra tại làng Sen, xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An.",
      "Người ra đi tìm đường cứu nước năm 1911 từ bến cảng Nhà Rồng.",
      "Người là người sáng lập Đảng Cộng sản Việt Nam năm 1930.",
      "Người trực tiếp đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình năm 1945.",
      "Người là vị lãnh tụ vĩ đại của dân tộc Việt Nam."
    ]
  },
  {
    name: "Bà Triệu",
    aliases: ["Triệu Thị Trinh", "Lệ Hải Bà Vương"],
    clues: [
      "Bà sinh ra ở vùng núi Quan Yên, nay thuộc tỉnh Thanh Hóa.",
      "Bà thường mặc áo giáp vàng, đi guốc ngà, cưỡi voi trắng ra trận.",
      "Bà nổi dậy chống lại sự cai trị của quân Đông Ngô vào năm 248.",
      "Câu nói nổi tiếng: 'Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông...'.",
      "Bà là nữ anh hùng dân tộc tiêu biểu thời kỳ Bắc thuộc."
    ]
  },
  {
    name: "Đinh Bộ Lĩnh",
    aliases: ["Đinh Tiên Hoàng", "Vạn Thắng Vương"],
    clues: [
      "Lúc nhỏ, ông thường rủ trẻ chăn trâu chơi trò đánh trận giả bằng cờ lau.",
      "Ông quê ở động Hoa Lư, châu Đại Hoàng (nay thuộc Ninh Bình).",
      "Ông có công dẹp loạn 12 sứ quân, thống nhất đất nước.",
      "Ông lên ngôi Hoàng đế năm 968, đặt tên nước là Đại Cồ Việt.",
      "Ông là vị Hoàng đế đầu tiên của nước ta sau thời kỳ Bắc thuộc."
    ]
  },
  {
    name: "Lý Công Uẩn",
    aliases: ["Lý Thái Tổ"],
    clues: [
      "Ông sinh ra ở làng Cổ Pháp (Bắc Ninh) và được thiền sư Vạn Hạnh nuôi dạy từ nhỏ.",
      "Ông từng làm chức Điện tiền chỉ huy sứ dưới triều nhà Tiền Lê.",
      "Ông được bá quan văn võ suy tôn lên ngôi vua vào năm 1009.",
      "Ông đã viết 'Chiếu dời đô' để chuyển kinh đô đất nước.",
      "Ông là người quyết định dời đô từ Hoa Lư về Thăng Long năm 1010."
    ]
  },
  {
    name: "Chu Văn An",
    aliases: ["Chu An", "Tư nghiệp Quốc Tử Giám"],
    clues: [
      "Ông là một người cương trực, thanh cao, không cầu danh lợi.",
      "Ông từng mở trường dạy học ở quê nhà (Thanh Trì, Hà Nội), học trò có nhiều người thành đạt.",
      "Ông được vua Trần Minh Tông mời ra làm Tư nghiệp Quốc Tử Giám.",
      "Ông từng dâng 'Thất trảm sớ' xin chém 7 tên nịnh thần nhưng không được vua nghe.",
      "Ông được suy tôn là 'Vạn thế sư biểu' (Người thầy của muôn đời) của Việt Nam."
    ]
  },
  {
    name: "Nguyễn Trãi",
    aliases: ["Ức Trai"],
    clues: [
      "Ông là một nhà chính trị, nhà quân sự, nhà ngoại giao, nhà văn hóa lỗi lạc.",
      "Ông đã dâng 'Bình Ngô sách' cho Lê Lợi để vạch ra chiến lược đánh giặc.",
      "Ông là tác giả của áng thiên cổ hùng văn 'Bình Ngô Đại Cáo'.",
      "Ông bị hàm oan trong vụ án Lệ Chi Viên nổi tiếng lịch sử.",
      "Ông được UNESCO công nhận là Danh nhân văn hóa thế giới năm 1980."
    ]
  },
  {
    name: "Trương Định",
    aliases: ["Trương Công Định", "Bình Tây Đại Nguyên Soái"],
    clues: [
      "Ông quê ở Quảng Ngãi nhưng theo cha vào Nam lập nghiệp từ nhỏ.",
      "Khi Pháp đánh chiếm Gia Định, ông đã chiêu mộ nghĩa dũng đánh giặc.",
      "Triều đình Huế ký hiệp ước Nhâm Tuất (1862) và hạ lệnh cho ông bãi binh.",
      "Ông đã cự tuyệt lệnh vua, tiếp tục ở lại Gò Công lãnh đạo nhân dân kháng chiến.",
      "Ông được nhân dân tôn xưng là 'Bình Tây Đại Nguyên Soái'."
    ]
  },
  {
    name: "Phan Bội Châu",
    aliases: ["Phan Sào Nam", "Sào Nam Tử"],
    clues: [
      "Ông là một trong những nhà yêu nước lớn nhất của Việt Nam đầu thế kỷ XX.",
      "Ông đã thành lập Hội Duy Tân để tổ chức lực lượng đánh Pháp.",
      "Ông là người khởi xướng và lãnh đạo phong trào Đông Du.",
      "Ông viết nhiều tác phẩm thơ văn yêu nước như 'Hải ngoại huyết thư', 'Việt Nam vong quốc sử'.",
      "Ông từng bị Pháp bắt giam và an trí tại Huế cho đến cuối đời."
    ]
  },
  {
    name: "Ngô Quyền",
    aliases: ["Tiền Ngô Vương"],
    clues: [
      "Ông là một tướng tài và là con rể của Tiết độ sứ Dương Đình Nghệ.",
      "Ông đã đem quân từ Ái Châu (Thanh Hóa) ra Bắc trừng trị tên phản đồ Kiều Công Tiễn.",
      "Ông đã lợi dụng thủy triều lên xuống để đánh giặc.",
      "Ông đã đánh tan quân Nam Hán bằng trận địa cọc ngầm trên sông.",
      "Chiến thắng lịch sử của ông năm 938 đã chấm dứt hơn 1000 năm Bắc thuộc."
    ]
  },
  {
    name: "Hai Bà Trưng",
    aliases: ["Trưng Trắc", "Trưng Nhị"],
    clues: [
      "Họ là con gái của Lạc tướng huyện Mê Linh.",
      "Họ có mối thù sâu nặng với thái thú Tô Định tàn bạo.",
      "Họ đã phất cờ khởi nghĩa tại Hát Môn vào mùa xuân năm 40.",
      "Khởi nghĩa của họ đã giành lại độc lập cho đất nước trong 3 năm.",
      "Họ là hai vị nữ anh hùng dân tộc đầu tiên của Việt Nam."
    ]
  },
  {
    name: "Trần Quốc Toản",
    aliases: ["Hoài Văn Hầu Trần Quốc Toản"],
    clues: [
      "Ông là một tôn thất nhà Trần, sống vào thời kỳ kháng chiến chống Nguyên lần 2.",
      "Khi giặc xâm lược, ông còn ít tuổi nên không được dự hội nghị Bình Than.",
      "Vì căm giận giặc và bức xúc không được bàn việc nước, ông đã vô tình bóp nát quả cam trong tay.",
      "Ông tự lập đội quân hơn ngàn người, thêu sáu chữ 'Phá cường địch, báo hoàng ân' lên cờ.",
      "Ông đã lập nhiều chiến công trong cuộc kháng chiến năm 1285."
    ]
  },
  {
    name: "Nguyễn Trung Trực",
    aliases: ["Nguyễn Văn Lịch"],
    clues: [
      "Ông là một thủ lĩnh phong trào khởi nghĩa chống Pháp ở Nam Kỳ.",
      "Ông nổi tiếng với chiến công đốt cháy tàu L'Espérance (Hy Vọng) của Pháp trên sông Nhật Tảo.",
      "Ông đã lãnh đạo nghĩa quân đánh chiếm đồn Kiên Giang (Rạch Giá).",
      "Ông bị thực dân Pháp bắt và xử chém tại Rạch Giá năm 1868.",
      "Ông để lại câu nói bất hủ: 'Bao giờ Tây nhổ hết cỏ nước Nam mới hết người Nam đánh Tây'."
    ]
  },
  {
    name: "Phan Đình Phùng",
    aliases: ["Đình nguyên Tiến sĩ Phan Đình Phùng"],
    clues: [
      "Ông từng thi đỗ Đình nguyên Tiến sĩ và làm quan Ngự sử triều Nguyễn.",
      "Ông là người nổi tiếng khảng khái, từng bị cách chức vì can ngăn vua Tự Đức.",
      "Ông hưởng ứng chiếu Cần Vương, lập căn cứ tại vùng núi Vũ Quang (Hà Tĩnh).",
      "Dưới sự chỉ huy của ông, nghĩa quân đã tự chế tạo được súng trường kiểu Pháp.",
      "Ông là thủ lĩnh tối cao của cuộc khởi nghĩa Hương Khê, đỉnh cao của phong trào Cần Vương."
    ]
  },
  {
    name: "Hoàng Hoa Thám",
    aliases: ["Đề Thám", "Hùm thiêng Yên Thế"],
    clues: [
      "Ông xuất thân trong một gia đình nghèo ở Hưng Yên, sau lên Yên Thế (Bắc Giang) sinh sống.",
      "Ông là một vị thủ lĩnh quân sự mưu trí, dũng cảm, giỏi đánh du kích.",
      "Căn cứ khởi nghĩa của ông được xây dựng rất kiên cố tại Phồn Xương.",
      "Cuộc khởi nghĩa do ông lãnh đạo kéo dài gần 30 năm, gây cho quân Pháp nhiều tổn thất.",
      "Ông được mệnh danh là 'Hùm thiêng Yên Thế'."
    ]
  },
  {
    name: "Nguyễn Thái Học",
    aliases: [] ,
    clues: [
      "Ông là một trí thức yêu nước đầu thế kỷ XX.",
      "Ông là người sáng lập và lãnh đạo Việt Nam Quốc dân Đảng.",
      "Đảng của ông chủ trương tiến hành bạo động vũ trang để giành độc lập.",
      "Ông là người tổ chức và lãnh đạo cuộc khởi nghĩa Yên Bái (1930).",
      "Trước khi bị thực dân Pháp xử chém, ông thốt lên: 'Không thành công cũng thành nhân'."
    ]
  },
  {
    name: "Trần Thủ Độ",
    aliases: ["Thái sư Trần Thủ Độ"],
    clues: [
      "Ông là người có vai trò quyết định trong việc thành lập vương triều Trần.",
      "Ông đã dàn xếp để Lý Chiêu Hoàng nhường ngôi cho Trần Cảnh.",
      "Ông là vị Thái sư quyền lực nhất trong những năm đầu nhà Trần.",
      "Câu nói nổi tiếng: 'Đầu tôi chưa rơi xuống đất, xin bệ hạ đừng lo'.",
      "Ông có công lớn trong cuộc kháng chiến chống Nguyên Mông lần thứ nhất."
    ]
  },
  {
    name: "Trần Quang Khải",
    aliases: ["Thượng tướng Thái sư Trần Quang Khải"],
    clues: [
      "Ông là một vương tử, nhà quân sự, nhà thơ lớn thời nhà Trần.",
      "Ông là tác giả của bài thơ 'Tụng giá hoàn kinh sư' nổi tiếng.",
      "Ông có công lao to lớn trong các cuộc kháng chiến chống quân Nguyên Mông.",
      "Ông là người chỉ huy chiến thắng Chương Dương vang dội.",
      "Ông giữ chức Thượng tướng Thái sư, đứng đầu triều đình dưới thời vua Trần Nhân Tông."
    ]
  },
  {
    name: "Phạm Ngũ Lão",
    aliases: ["Điện súy Thượng tướng quân Phạm Ngũ Lão"],
    clues: [
      "Ông vốn là một nông dân nghèo ở làng Phù Ủng (Hưng Yên).",
      "Truyền thuyết kể rằng ông mải mê nghĩ việc nước đến mức bị giáo đâm vào đùi mà không biết.",
      "Ông được Hưng Đạo Vương Trần Quốc Tuấn phát hiện tài năng và gả con gái cho.",
      "Ông là tác giả bài thơ 'Thuật hoài' (Tỏ lòng) hào hùng.",
      "Ông là vị tướng bách chiến bách thắng, chưa bao giờ thất bại trong sự nghiệp cầm quân."
    ]
  },
  {
    name: "Yết Kiêu",
    aliases: ["Phạm Hữu Thế"],
    clues: [
      "Ông là một gia nô trung thành của Hưng Đạo Vương Trần Quốc Tuấn.",
      "Ông nổi tiếng với tài bơi lội và lặn dưới nước hàng giờ đồng hồ.",
      "Ông đã dùng thuật lặn để đục thủng thuyền của quân Nguyên Mông.",
      "Ông có công lao lớn trong các cuộc kháng chiến chống ngoại xâm thời Trần.",
      "Tên của ông thường được đặt cho các đơn vị đặc công nước hiện nay."
    ]
  },
  {
    name: "Dã Tượng",
    aliases: [],
    clues: [
      "Ông là một trong năm thuộc hạ tài giỏi và trung thành nhất của Trần Hưng Đạo.",
      "Ông có tài điều khiển voi chiến rất giỏi.",
      "Ông cùng với Yết Kiêu là những người kề vai sát cánh bên chủ soái trong những lúc gian nguy.",
      "Ông nổi tiếng với sự trung nghĩa, không màng danh lợi.",
      "Ông góp phần quan trọng vào chiến thắng của quân dân nhà Trần trước quân Nguyên."
    ]
  },
  {
    name: "Mạc Đĩnh Chi",
    aliases: ["Trạng Nguyên xứ Bắc", "Lưỡng quốc Trạng nguyên"],
    clues: [
      "Ông là người làng Lũng Động, huyện Chí Linh (Hải Dương).",
      "Ông có ngoại hình xấu xí nhưng trí tuệ cực kỳ uyên bác.",
      "Ông đỗ Trạng nguyên dưới triều vua Trần Anh Tông.",
      "Khi sang sứ nhà Nguyên, ông đã dùng tài đối đáp khiến hoàng đế phương Bắc nể phục.",
      "Ông được phong là 'Lưỡng quốc Trạng nguyên' (Trạng nguyên hai nước)."
    ]
  },
  {
    name: "Nguyễn Bỉnh Khiêm",
    aliases: ["Trạng Trình"],
    clues: [
      "Ông là một nhà văn hóa giáo dục lớn, một nhà tiên tri nổi tiếng trong lịch sử Việt Nam.",
      "Ông đỗ Trạng nguyên và làm quan dưới triều nhà Mạc.",
      "Ông thường đưa ra những lời khuyên chiến lược cho các tập đoàn phong kiến (Mạc, Trịnh, Nguyễn).",
      "Câu nói nổi tiếng về vùng đất phía Nam: 'Hoành Sơn nhất đái, vạn đại dung thân'.",
      "Người đời tôn sùng ông là Trạng Trình."
    ]
  },
  {
    name: "Cao Bá Quát",
    aliases: ["Chu Thần", "Thánh Quát"],
    clues: [
      "Ông là nhà thơ lớn, người có tài năng lỗi lạc và tính cách hiên ngang.",
      "Ông nổi tiếng với tài viết chữ đẹp và văn hay, được người đời tôn là Thánh.",
      "Ông từng giữ chức Giáo thụ ở phủ Quốc Oai và làm quan ở Bộ Lễ.",
      "Ông lãnh đạo cuộc khởi nghĩa Mỹ Lương chống lại triều đình nhà Nguyễn.",
      "Câu nói bất hủ của ông: 'Nhất sinh đê thủ bái mai hoa' (Một đời chỉ cúi đầu lạy hoa mai)."
    ]
  },
  {
    name: "Nguyễn Khuyến",
    aliases: ["Tam Nguyên Yên Đổ"],
    clues: [
      "Ông quê ở làng Và, xã Yên Đổ, huyện Bình Lục (Hà Nam).",
      "Ông đỗ đầu cả ba kỳ thi (Hương, Hội, Đình) nên được gọi là Tam Nguyên.",
      "Ông là một nhà thơ trào phúng và trữ tình xuất sắc của văn học Việt Nam.",
      "Ông nổi tiếng with chùm thơ thu (Thu điếu, Thu vịnh, Thu ẩm).",
      "Ông cáo quan về quê dạy học vì không muốn cộng tác với chính quyền thực dân Pháp."
    ]
  },
  {
    name: "Phan Chu Trinh",
    aliases: ["Phan Tây Hồ", "Hy Mã"],
    clues: [
      "Ông là nhà cải cách lớn nhất của Việt Nam đầu thế kỷ XX.",
      "Ông chủ trương cứu nước bằng con đường 'Khai dân trí, chấn dân khí, hậu dân sinh'.",
      "Ông phản đối bạo động vũ trang, chủ trương dựa vào Pháp để cải cách.",
      "Ông là người khởi xướng phong trào Duy Tân.",
      "Đám tang của ông năm 1926 đã trở thành một cuộc biểu dương lực lượng yêu nước rộng lớn."
    ]
  },
  {
    name: "Trần Phú",
    aliases: [],
    clues: [
      "Ông là Tổng Bí thư đầu tiên của Đảng Cộng sản Việt Nam.",
      "Ông là người soạn thảo bản Luận cương Chính trị năm 1930.",
      "Ông bị thực dân Pháp bắt tại Sài Gòn và tra tấn dã man cho đến chết.",
      "Lời nhắn nhủ cuối cùng của ông trước khi hy sinh: 'Hãy giữ vững chí khí chiến đấu'.",
      "Ông hy sinh khi mới 27 tuổi tại nhà thương Chợ Quán."
    ]
  },
  {
    name: "Lê Hồng Phong",
    aliases: [],
    clues: [
      "Ông là Tổng Bí thư thứ hai của Đảng Cộng sản Đông Dương.",
      "Ông là đại biểu của Đảng ta tại Quốc tế Cộng sản.",
      "Ông là chồng của nữ chiến sĩ cách mạng Nguyễn Thị Minh Khai.",
      "Ông bị thực dân Pháp bắt và đày ra nhà tù Côn Đảo.",
      "Ông hy sinh tại nhà tù Côn Đảo năm 1942."
    ]
  },
  {
    name: "Nguyễn Văn Cừ",
    aliases: [],
    clues: [
      "Ông trở thành Tổng Bí thư của Đảng khi mới 26 tuổi.",
      "Ông là tác giả của tác phẩm 'Tự chỉ trích' nổi tiếng.",
      "Ông là người đề ra chủ trương thành lập Mặt trận Thống nhất Dân tộc Phản đế Đông Dương.",
      "Ông bị thực dân Pháp bắt và xử bắn tại ngã ba Giồng (Hóc Môn) sau khởi nghĩa Nam Kỳ.",
      "Ông được đánh giá là một tài năng trẻ tuổi, lỗi lạc của cách mạng Việt Nam."
    ]
  },
  {
    name: "Huỳnh Thúc Kháng",
    aliases: ["Mính Viên"],
    clues: [
      "Ông đỗ Giải nguyên kỳ thi Hương và đỗ Tiến sĩ năm 1904.",
      "Ông là một trong những lãnh đạo của phong trào Duy Tân ở miền Trung.",
      "Ông là người sáng lập và chủ bút báo Tiếng Dân.",
      "Ông từng giữ chức Bộ trưởng Bộ Nội vụ và Quyền Chủ tịch nước năm 1946.",
      "Ông là một nhân sĩ yêu nước có uy tín lớn, được Bác Hồ hết sức trân trọng."
    ]
  },
  {
    name: "Nguyễn Thị Minh Khai",
    aliases: ["Vịnh"],
    clues: [
      "Bà là một trong những nữ chiến sĩ cộng sản đầu tiên của Việt Nam.",
      "Bà từng học tập tại trường Đại học Phương Đông (Liên Xô) và dự Đại hội Quốc tế Cộng sản.",
      "Bà là Bí thư Thành ủy Sài Gòn - Chợ Lớn.",
      "Bà bị thực dân Pháp bắt và xử bắn sau cuộc khởi nghĩa Nam Kỳ năm 1941.",
      "Trước khi ra pháp trường, bà đã tước mảnh vải đỏ từ áo mình để làm cờ."
    ]
  },
  {
    name: "Võ Thị Sáu",
    aliases: ["Nguyễn Thị Sáu"],
    clues: [
      "Bà tham gia cách mạng từ năm 14 tuổi, làm nhiệm vụ liên lạc và diệt ác ôn.",
      "Bà bị thực dân Pháp bắt khi đang thực hiện một vụ ném lựu đạn.",
      "Bà là người tử tù trẻ nhất bị thực dân Pháp xử bắn tại Côn Đảo.",
      "Hình ảnh bà cài hoa lê-ma-ga lên tóc trước khi ra pháp trường đã trở thành huyền thoại.",
      "Bà được tôn vinh là nữ anh hùng trẻ tuổi tiêu biểu của đất đỏ miền Đông."
    ]
  },
  {
    name: "Kim Đồng",
    aliases: ["Nông Văn Dền"],
    clues: [
      "Em là người dân tộc Nùng, quê ở làng Nà Mạ, tỉnh Cao Bằng.",
      "Em là người đội trưởng đầu tiên của Đội Nhi đồng Cứu quốc (nay là Đội Thiếu niên Tiền phong HCM).",
      "Em làm nhiệm vụ giao liên, bảo vệ cán bộ cách mạng.",
      "Em hy sinh anh dũng khi đang làm nhiệm vụ đánh lạc hướng quân địch để bảo vệ cán bộ.",
      "Mộ của em hiện nằm dưới chân núi Tèo Lài, gần hang Pác Bó."
    ]
  },
  {
    name: "Nguyễn Văn Trỗi",
    aliases: [],
    clues: [
      "Ông là một công nhân điện lực tại Sài Gòn tham gia biệt động tự vệ.",
      "Ông đã thực hiện kế hoạch đặt mìn tại cầu Công Lý để ám sát Bộ trưởng Quốc phòng Mỹ McNamara.",
      "Kế hoạch không thành, ông bị bắt và bị kết án tử hình.",
      "Trước khi bị bắn, ông hô vang: 'Hồ Chí Minh muôn năm!' ba lần.",
      "Tên của ông được đặt cho nhiều con đường và trường học trên khắp cả nước."
    ]
  },
  {
    name: "Đặng Thùy Trâm",
    aliases: [],
    clues: [
      "Bà là một bác sĩ trẻ tốt nghiệp Đại học Y Hà Nội, tình nguyện vào chiến trường miền Nam.",
      "Bà làm việc tại một bệnh viện dã chiến ở Quảng Ngãi trong những năm ác liệt nhất.",
      "Bà hy sinh anh dũng trong một trận càn của quân Mỹ khi đang bảo vệ thương binh.",
      "Cuốn nhật ký của bà được một sĩ quan Mỹ lưu giữ và trả lại cho gia đình sau nhiều năm.",
      "Tác phẩm 'Nhật ký Đặng Thùy Trâm' đã gây xúc động mạnh mẽ cho hàng triệu độc giả."
    ]
  },
  {
    name: "Phạm Văn Đồng",
    aliases: ["Anh Tô"],
    clues: [
      "Ông là một nhà ngoại giao xuất sắc, từng giữ chức Thủ tướng Chính phủ Việt Nam lâu nhất.",
      "Ông là người đứng đầu phái đoàn Việt Nam tại Hội nghị Giơ-ne-vơ năm 1954.",
      "Ông là người học trò xuất sắc và là cộng sự gần gũi của Chủ tịch Hồ Chí Minh.",
      "Ông có đóng góp to lớn vào việc xây dựng nền văn hóa và giáo dục của đất nước.",
      "Ông quê ở huyện Mộ Đức, tỉnh Quảng Ngãi."
    ]
  },
  {
    name: "Trường Chinh",
    aliases: ["Đặng Xuân Khu"],
    clues: [
      "Ông là nhà lý luận chiến lược của cách mạng Việt Nam.",
      "Ông từng giữ chức Tổng Bí thư Đảng Cộng sản Việt Nam trong nhiều thời kỳ.",
      "Bút danh của ông có nghĩa là cuộc hành trình dài (Long March).",
      "Ông là tác giả của tác phẩm 'Kháng chiến nhất định thắng lợi'.",
      "Ông có vai trò quan trọng trong việc khởi xướng đường lối Đổi mới năm 1986."
    ]
  },
  {
    name: "Nguyễn Văn Linh",
    aliases: ["Mười Cúc", "N.V.L"],
    clues: [
      "Ông là Tổng Bí thư của Đảng trong những năm đầu thời kỳ Đổi mới.",
      "Ông nổi tiếng with loạt bài viết 'Những việc cần làm ngay' trên báo Nhân Dân.",
      "Ông được coi là 'kiến trúc sư' của công cuộc Đổi mới tại Việt Nam.",
      "Ông từng có nhiều năm lãnh đạo cách mạng tại chiến trường miền Nam.",
      "Ông luôn nhấn mạnh việc đổi mới tư duy và chống tiêu cực."
    ]
  },
  {
    name: "Văn Tiến Dũng",
    aliases: [],
    clues: [
      "Ông là một đại tướng của Quân đội nhân dân Việt Nam.",
      "Ông là Tổng Tham mưu trưởng trong chiến dịch Điện Biên Phủ.",
      "Ông là Tư lệnh chiến dịch Hồ Chí Minh lịch sử năm 1975.",
      "Ông là tác giả cuốn hồi ký 'Đại thắng mùa Xuân'.",
      "Ông từng giữ chức Bộ trưởng Bộ Quốc phòng."
    ]
  },
  {
    name: "Nguyễn Chí Thanh",
    aliases: ["Nguyễn Vịnh"],
    clues: [
      "Ông là vị đại tướng có đóng góp to lớn trong việc xây dựng quân đội về mặt chính trị.",
      "Ông nổi tiếng với phong trào 'Gió Đại Phong' trong nông nghiệp.",
      "Ông được giao nhiệm vụ vào miền Nam chỉ đạo kháng chiến chống Mỹ.",
      "Ông là người đề ra chiến thuật 'Nắm thắt lưng địch mà đánh'.",
      "Ông qua đời đột ngột tại Hà Nội năm 1967 trước khi kịp trở lại miền Nam."
    ]
  },
  {
    name: "Lê Trọng Tấn",
    aliases: ["Nguyễn Hữu An"],
    clues: [
      "Ông được mệnh danh là 'Zhukov của Việt Nam'.",
      "Ông là vị tướng tài ba thường được giao chỉ huy các mặt trận trọng yếu.",
      "Ông là Tư lệnh quân đoàn 2 tiến vào giải phóng dinh Độc Lập.",
      "Ông nổi tiếng with sự quyết đoán và tài điều binh khiển tướng.",
      "Ông giữ chức Tổng Tham mưu trưởng Quân đội nhân dân Việt Nam cho đến khi qua đời."
    ]
  },
  {
    name: "Phan Đình Phùng",
    aliases: ["Đình nguyên Tiến sĩ"],
    clues: [
      "Ông là thủ lĩnh cao nhất của cuộc khởi nghĩa Hương Khê.",
      "Ông từng đỗ Đình nguyên Tiến sĩ và làm Ngự sử trong triều đình.",
      "Ông nổi tiếng with việc tự chế tạo súng trường theo mẫu của Pháp.",
      "Ông đã cự tuyệt mọi lời dụ dỗ đầu hàng của thực dân Pháp.",
      "Cuộc khởi nghĩa của ông là đỉnh cao nhất của phong trào Cần Vương."
    ]
  },
  {
    name: "Nguyễn Trung Trực",
    aliases: ["Nguyễn Văn Lịch"],
    clues: [
      "Ông là một lãnh tụ nghĩa quân chống Pháp ở Nam Bộ.",
      "Chiến công nổi tiếng nhất của ông là đốt cháy tàu Hy Vọng (L'Espérance) trên sông Nhật Tảo.",
      "Ông đã lãnh đạo cuộc tấn công đồn Rạch Giá.",
      "Khi bị hành hình, ông khẳng định: 'Bao giờ người Tây nhổ hết cỏ nước Nam mới hết người Nam đánh Tây'.",
      "Ông được nhân dân nhiều nơi lập đền thờ phụng."
    ]
  },
  {
    name: "Trần Quốc Toản",
    aliases: ["Hoài Văn Hầu"],
    clues: [
      "Ông là một thiếu niên anh hùng thời nhà Trần.",
      "Vì còn nhỏ không được dự hội nghị quân sự, ông đã bóp nát quả cam trong tay.",
      "Ông đã tự chiêu mộ quân đội, thêu cờ sáu chữ vàng.",
      "Sáu chữ trên lá cờ của ông là: 'Phá cường địch, báo hoàng ân'.",
      "Ông hy sinh trong cuộc kháng chiến chống quân Nguyên lần thứ hai."
    ]
  },
  {
    name: "An Dương Vương",
    aliases: ["Thục Phán"],
    clues: [
      "Ông là người lập nên nước Âu Lạc sau khi thống nhất bộ tộc Tây Âu và Lạc Việt.",
      "Ông đã cho xây dựng thành Cổ Loa với kiến trúc hình xoáy trôn ốc độc đáo.",
      "Ông sở hữu vũ khí huyền thoại là Nỏ Thần bắn một phát ra hàng trăm mũi tên.",
      "Triều đại của ông kết thúc sau khi bị Triệu Đà dùng mưu kế xâm chiếm.",
      "Truyền thuyết về ông gắn liền with câu chuyện về Mỵ Châu - Trọng Thủy."
    ]
  },
  {
    name: "Lý Bí",
    aliases: ["Lý Nam Đế"],
    clues: [
      "Ông là người lãnh đạo cuộc khởi nghĩa đánh đuổi quân Lương vào thế kỷ VI.",
      "Ông là người đầu tiên xưng đế trong lịch sử Việt Nam.",
      "Ông đặt tên nước là Vạn Xuân với mong muốn đất nước bền vững muôn đời.",
      "Ông đã cho xây dựng chùa Trấn Quốc bên bờ sông Hồng.",
      "Ông là vị vua khai sáng ra nhà Tiền Lý."
    ]
  },
  {
    name: "Triệu Quang Phục",
    aliases: ["Triệu Việt Vương"],
    clues: [
      "Ông là tướng quân tài ba dưới thời Lý Nam Đế.",
      "Ông nổi tiếng with chiến thuật đánh du kích trong đầm lầy.",
      "Căn cứ kháng chiến của ông nằm ở đầm Dạ Trạch (Hưng Yên).",
      "Ông được nhân dân tôn xưng là 'Dạ Trạch Vương'.",
      "Ông đã đánh bại quân Lương, khôi phục lại nền độc lập cho nước Vạn Xuân."
    ]
  },
  {
    name: "Mai Thúc Loan",
    aliases: ["Mai Hắc Đế"],
    clues: [
      "Ông là người lãnh đạo cuộc khởi nghĩa chống lại sự đô hộ của nhà Đường.",
      "Ông quê ở Hà Tĩnh, vốn xuất thân từ tầng lớp lao động nghèo khổ.",
      "Ông đã xây dựng căn cứ tại thành Vạn An (Nghệ An).",
      "Vì ông có nước da đen nên nhân dân gọi ông là 'Vua Đen'.",
      "Ông liên kết with nhân dân các nước lân cận để chống lại quân xâm lược."
    ]
  },
  {
    name: "Phùng Hưng",
    aliases: ["Bố Cái Đại Vương"],
    clues: [
      "Ông là người làng Đường Lâm, nổi tiếng with sức khỏe phi thường, có thể tay không đánh hổ.",
      "Ông đã lãnh đạo nhân dân nổi dậy khởi nghĩa chống lại ách đô hộ của nhà Đường.",
      "Nghĩa quân của ông đã bao vây và chiếm được thành Tống Bình.",
      "After khi ông mất, nhân dân tôn xưng ông là 'Bố Cái Đại Vương' (Cha mẹ của dân).",
      "Ông là một trong những vị anh hùng dân tộc tiêu biểu thời kỳ Bắc thuộc."
    ]
  },
  {
    name: "Lê Hoàn",
    aliases: ["Lê Đại Hành"],
    clues: [
      "Ông là vị vua khai sáng ra triều đại nhà Tiền Lê.",
      "Ông được Thái hậu Dương Vân Nga trao áo long cổn mời lên ngôi vua.",
      "Ông là người trực tiếp chỉ huy đánh tan quân xâm lược Tống năm 981.",
      "Ông là vị vua đầu tiên thực hiện nghi lễ cày ruộng tịch điền.",
      "Ông đã xây dựng một triều đại vững mạnh, bảo vệ vững chắc nền độc lập."
    ]
  },
  {
    name: "Lý Thánh Tông",
    aliases: ["Lý Nhật Tôn"],
    clues: [
      "Ông là vị vua thứ ba của nhà Lý, nổi tiếng là người nhân hậu và thương dân.",
      "Ông đã đổi quốc hiệu từ Đại Cồ Việt thành Đại Việt vào năm 1054.",
      "Ông là người ra lệnh xây dựng Văn Miếu tại Thăng Long.",
      "Ông đã đánh bại quân Chiêm Thành và thu phục được ba châu địa lý.",
      "Under thời ông, triều đại nhà Lý bước vào giai đoạn phát triển rực rỡ."
    ]
  },
  {
    name: "Lý Nhân Tông",
    aliases: ["Lý Càn Đức"],
    clues: [
      "Ông lên ngôi vua khi mới 7 tuổi, là vị vua ở ngôi lâu nhất trong lịch sử Việt Nam (56 năm).",
      "Ông là người cho tổ chức khoa thi đầu tiên của nước ta (khoa thi Minh kinh bác học).",
      "Under thời ông, quân dân Đại Việt đã đánh bại cuộc xâm lược của nhà Tống (1075-1077).",
      "Ông là người ra lệnh xây dựng Quốc Tử Giám.",
      "Ông nổi tiếng with việc chăm lo phát triển nông nghiệp và đê điều."
    ]
  },
  {
    name: "Trần Thái Tông",
    aliases: ["Trần Cảnh"],
    clues: [
      "Ông là vị vua đầu tiên của triều đại nhà Trần.",
      "Ông lên ngôi after khi được Lý Chiêu Hoàng nhường ngôi.",
      "Ông là vị vua trực tiếp lãnh đạo cuộc kháng chiến chống quân Nguyên lần thứ nhất (1258).",
      "Ông là tác giả của tác phẩm 'Khóa hư lục' nổi tiếng về Phật giáo.",
      "After khi nhường ngôi cho con, ông trở thành Thái thượng hoàng chỉ đạo việc nước."
    ]
  },
  {
    name: "Trần Nhân Tông",
    aliases: ["Trần Khâm", "Trúc Lâm Đại Sĩ"],
    clues: [
      "Ông là vị vua anh minh, trực tiếp lãnh đạo quân dân đánh bại quân Nguyên lần 2 và lần 3.",
      "Ông là người triệu tập Hội nghị Bình Than và Hội nghị Diên Hồng.",
      "After khi nhường ngôi, ông đi tu và sáng lập ra Thiền phái Trúc Lâm Yên Tử.",
      "Ông được người đời tôn xưng là 'Phật hoàng'.",
      "Ông là biểu tượng của sự kết hợp giữa vương quyền và thần quyền trong lịch sử Việt Nam."
    ]
  },
  {
    name: "Lê Thánh Tông",
    aliases: ["Lê Tư Thành"],
    clues: [
      "Ông là vị vua có thời gian trị vì dài nhất và rực rỡ nhất của nhà Hậu Lê.",
      "Ông là người ban hành bộ luật Hồng Đức nổi tiếng.",
      "Ông sáng lập ra hội Tao Đàn và tự xưng là Tao Đàn nguyên soái.",
      "Ông đã thực hiện cuộc cải cách hành chính lớn nhất lịch sử phong kiến Việt Nam.",
      "Under thời ông, cương vực lãnh thổ của Đại Việt được mở rộng đáng kể."
    ]
  },
  {
    name: "Mạc Đăng Dung",
    aliases: ["Mạc Thái Tổ"],
    clues: [
      "Ông vốn là một võ quan có sức khỏe phi thường, từng đỗ Đô lực sĩ.",
      "Ông đã phế bỏ nhà Lê sơ để lập nên triều đại nhà Mạc.",
      "Ông quê ở làng Cổ Trai, huyện Nghi Dương (Hải Phòng).",
      "Ông nổi tiếng with tài bắn cung và sử dụng đại đao.",
      "Triều đại do ông lập nên đã tồn tại và có nhiều đóng góp về văn hóa, giáo dục."
    ]
  },
  {
    name: "Gia Long",
    aliases: ["Nguyễn Phúc Ánh"],
    clues: [
      "Ông là vị vua khai sáng ra triều đại nhà Nguyễn.",
      "Ông đã thống nhất đất nước after nhiều năm nội chiến kéo dài.",
      "Ông chính thức đặt tên nước là Việt Nam.",
      "Ông cho xây dựng kinh thành Huế và bắt đầu biên soạn bộ luật Gia Long.",
      "Ông là người đã củng cố chủ quyền của Việt Nam tại quần đảo Hoàng Sa và Trường Sa."
    ]
  },
  {
    name: "Minh Mạng",
    aliases: ["Nguyễn Phúc Đảm"],
    clues: [
      "Ông là vị vua thứ hai của nhà Nguyễn, được đánh giá là người làm việc cần mẫn.",
      "Ông đã thực hiện cuộc cải cách hành chính, chia cả nước thành 30 tỉnh và 1 phủ.",
      "Ông cho xây dựng nhiều công trình kiến trúc nổi tiếng tại kinh đô Huế.",
      "Ông là người có tư tưởng quyết liệt trong việc cấm đạo Thiên Chúa.",
      "Under thời ông, uy thế của nước Đại Nam đạt đến mức cao nhất trong khu vực."
    ]
  },
  {
    name: "Tự Đức",
    aliases: ["Nguyễn Phúc Hồng Nhậm"],
    clues: [
      "Ông là vị vua ở ngôi lâu nhất của nhà Nguyễn (36 năm).",
      "Ông là một nhà thơ, nhà văn uyên bác nhưng lại gặp nhiều khó khăn trong việc trị nước.",
      "Under thời ông, thực dân Pháp đã nổ súng xâm lược Việt Nam.",
      "Ông phải ký kết các hiệp ước nhượng đất cho thực dân Pháp.",
      "Ông qua đời mà không có con nối dõi, để lại nhiều tiếc nuối cho triều đại."
    ]
  },
  {
    name: "Hàm Nghi",
    aliases: ["Nguyễn Phúc Ưng Lịch"],
    clues: [
      "Ông lên ngôi khi mới 13 tuổi, là vị vua yêu nước chống Pháp.",
      "Ông đã rời bỏ kinh đô, xuống chiếu Cần Vương kêu gọi nhân dân kháng chiến.",
      "Ông bị thực dân Pháp bắt và đày sang Algérie (Châu Phi).",
      "Ông sống cả phần đời còn lại ở nước ngoài nhưng vẫn luôn hướng về tổ quốc.",
      "Ông là một họa sĩ tài năng with nhiều tác phẩm được đánh giá cao."
    ]
  },
  {
    name: "Duy Tân",
    aliases: ["Nguyễn Phúc Vĩnh San"],
    clues: [
      "Ông lên ngôi khi còn rất nhỏ tuổi nhưng có tư tưởng chống Pháp quyết liệt.",
      "Ông từng nói: 'Để tôi ra ngoài kia cho nước nó thấm, nước bẩn thì rửa mới sạch'.",
      "Ông tham gia cuộc khởi nghĩa năm 1916 cùng with Thái Phiên và Trần Cao Vân.",
      "After khi khởi nghĩa thất bại, ông bị Pháp đày ra đảo Réunion.",
      "Ông hy sinh trong một tai nạn máy bay khi đang trên đường về nước năm 1945."
    ]
  },
  {
    name: "Bảo Đại",
    aliases: ["Nguyễn Phúc Vĩnh Thụy"],
    clues: [
      "Ông là vị hoàng đế cuối cùng của lịch sử phong kiến Việt Nam.",
      "Ông từng học tập tại Pháp và mong muốn cải cách đất nước theo hướng hiện đại.",
      "Ông đã tuyên bố thoái vị tại Ngọ Môn (Huế) vào tháng 8 năm 1945.",
      "Câu nói nổi tiếng: 'Thà làm dân một nước độc lập hơn làm vua một nước nô lệ'.",
      "Sau này ông từng làm Quốc trưởng của chính phủ quốc gia Việt Nam."
    ]
  },
  {
    name: "Lương Văn Can",
    aliases: ["Cụ cử Can"],
    clues: [
      "Ông là một nhà giáo, nhà yêu nước, người sáng lập trường Đông Kinh Nghĩa Thục.",
      "Ông chủ trương cứu nước bằng con đường duy tân, cải cách văn hóa giáo dục.",
      "Ông là người biên soạn nhiều sách giáo khoa tiến bộ cho học sinh.",
      "Ông bị thực dân Pháp bắt và đày sang Campuchia after khi trường bị đóng cửa.",
      "Ông được tôn vinh là người thầy của phong trào Duy Tân ở Bắc Kỳ."
    ]
  },
  {
    name: "Nguyễn An Ninh",
    aliases: [],
    clues: [
      "Ông là một trí thức yêu nước nổi tiếng ở miền Nam đầu thế kỷ XX.",
      "Ông là người sáng lập và chủ bút báo 'Chuông rè' (La Cloche Fêlée).",
      "Ông có tài hùng biện xuất sắc, thu hút đông đảo thanh niên tham gia đấu tranh.",
      "Ông bị thực dân Pháp bắt giam nhiều lần và hy sinh tại nhà tù Côn Đảo.",
      "Tên của ông được đặt cho nhiều con đường lớn tại TP. Hồ Chí Minh."
    ]
  },
  {
    name: "Hà Huy Tập",
    aliases: [],
    clues: [
      "Ông là Tổng Bí thư thứ ba của Đảng Cộng sản Đông Dương.",
      "Ông từng học tập tại trường Đại học Phương Đông (Liên Xô).",
      "Ông là người trực tiếp chỉ đạo phục hồi hệ thống tổ chức Đảng after thời kỳ bị đàn áp.",
      "Ông bị thực dân Pháp bắt và xử bắn tại ngã ba Giồng năm 1941.",
      "Ông là một nhà lý luận sắc sảo của cách mạng Việt Nam."
    ]
  },
  {
    name: "Hoàng Văn Thụ",
    aliases: [],
    clues: [
      "Ông là một lãnh đạo cao cấp của Đảng, người dân tộc Tày (Lạng Sơn).",
      "Ông có đóng góp lớn trong việc xây dựng căn cứ địa Bắc Sơn - Võ Nhai.",
      "Ông là người trực tiếp bồi dưỡng và kết nạp nhiều chiến sĩ cách mạng tiêu biểu.",
      "Before khi bị xử bắn, ông ung dung ngâm bài thơ 'Nhắn bạn' đầy hào hùng.",
      "Câu nói nổi tiếng: 'Trong cuộc đấu tranh sinh tử giữa chúng tôi và các ông... phần thắng cuối cùng sẽ thuộc về chúng tôi'."
    ]
  },
  {
    name: "Phạm Hùng",
    aliases: ["Hai Hùng"],
    clues: [
      "Ông là một nhà lãnh đạo kiên cường, từng bị thực dân Pháp kết án tử hình.",
      "Ông có nhiều năm bị giam cầm tại nhà tù Côn Đảo ('địa ngục trần gian').",
      "Ông từng giữ chức Bí thư Trung ương Cục miền Nam trong kháng chiến chống Mỹ.",
      "Ông là vị Chủ tịch Hội đồng Bộ trưởng (Thủ tướng) của Việt Nam thời kỳ đầu đổi mới.",
      "Ông quê ở tỉnh Vĩnh Long, nổi tiếng with phong cách làm việc quyết đoán."
    ]
  },
  {
    name: "Lê Duẩn",
    aliases: ["Anh Ba"],
    clues: [
      "Ông là Tổng Bí thư của Đảng trong một thời gian dài (1960 - 1986).",
      "Ông là người đề ra 'Đường lối cách mạng miền Nam' tại Hội nghị Trung ương 15.",
      "Ông có đóng góp quyết định vào chiến thắng của cuộc kháng chiến chống Mỹ cứu nước.",
      "Ông là nhà chiến lược lớn, luôn trăn trở về con đường phát triển của đất nước.",
      "Ông quê ở tỉnh Quảng Trị, xuất thân từ một gia đình nông dân nghèo."
    ]
  },
  {
    name: "Võ Văn Kiệt",
    aliases: ["Sáu Dân"],
    clues: [
      "Ông là một vị Thủ tướng có tư tưởng đổi mới mạnh mẽ và gần gũi with nhân dân.",
      "Ông gắn liền with những công trình lớn như đường dây 500kV Bắc - Nam, đường Hồ Chí Minh.",
      "Ông là người có vai trò quan trọng trong việc xóa bỏ cơ chế bao cấp.",
      "Ông nổi tiếng with phong cách lãnh đạo thực tiễn, dám nghĩ, dám làm, dám chịu trách nhiệm.",
      "Ông được nhân dân yêu mến gọi bằng cái tên thân thương 'Bác Sáu Dân'."
    ]
  },
  {
    name: "Lê Đức Thọ",
    aliases: ["Sáu Thọ"],
    clues: [
      "Ông là một nhà ngoại giao tài ba, người trực tiếp đàm phán with Kissinger tại Paris.",
      "Ông là người Việt Nam duy nhất được trao giải Nobel Hòa bình nhưng đã từ chối.",
      "Ông có đóng góp quan trọng trong công tác tổ chức và xây dựng Đảng.",
      "Ông từng là cố vấn Ban Chấp hành Trung ương Đảng.",
      "Ông nổi tiếng with bản lĩnh kiên cường và tư duy chiến lược sắc bén."
    ]
  },
  {
    name: "Trần Đại Nghĩa",
    aliases: ["Phạm Quang Lễ"],
    clues: [
      "Ông là một nhà khoa học quân sự lỗi lạc, được mệnh danh là 'Cha đẻ của ngành quân giới'.",
      "Ông từ bỏ cuộc sống giàu sang ở Pháp để theo Bác Hồ về nước kháng chiến.",
      "Ông là người chế tạo thành công súng Bazooka và súng không giật (SKZ).",
      "Ông đã giúp quân đội ta có những vũ khí hiện đại để đánh bại xe tăng và tàu chiến của địch.",
      "Ông được phong quân hàm Thiếu tướng ngay trong đợt đầu tiên năm 1948."
    ]
  },
  {
    name: "Lương Định Của",
    aliases: [],
    clues: [
      "Ông là một nhà nông học xuất sắc, người có công lớn trong việc lai tạo các giống lúa mới.",
      "Ông từ Nhật Bản trở về nước cống hiến theo lời kêu gọi của Chủ tịch Hồ Chí Minh.",
      "Ông được mệnh danh là 'Nhà bác học của đồng ruộng'.",
      "Ông đã lai tạo thành công giống lúa Nông nghiệp 1 cho năng suất cao.",
      "Ông luôn gắn bó mật thiết with nông dân và nông thôn Việt Nam."
    ]
  },
  {
    name: "Tôn Đức Thắng",
    aliases: ["Bác Tôn"],
    clues: [
      "Ông là người kế nhiệm Chủ tịch Hồ Chí Minh giữ chức Chủ tịch nước.",
      "Ông là người sáng lập tổ chức Công hội đỏ đầu tiên ở Việt Nam.",
      "Ông từng tham gia cuộc phản chiến trên biển Hắc Hải để ủng hộ Cách mạng tháng Mười Nga.",
      "Ông có 15 năm bị giam cầm tại nhà tù Côn Đảo.",
      "Ông là biểu tượng của tinh thần đại đoàn kết dân tộc và giai cấp công nhân Việt Nam."
    ]
  },
  {
    name: "Nguyễn Phan Chánh",
    aliases: [],
    clues: [
      "Ông là họa sĩ bậc thầy, người đặt nền móng cho hội họa tranh lụa hiện đại Việt Nam.",
      "Tác phẩm nổi tiếng nhất của ông là bức 'Chơi ô ăn quan'.",
      "Tranh của ông mang đậm tâm hồn Việt, giản dị mà tinh tế.",
      "Ông là một trong những họa sĩ Việt Nam đầu tiên có tranh được trưng bày quốc tế.",
      "Ông quê ở Hà Tĩnh, nổi tiếng with phong cách vẽ tranh lụa độc bản."
    ]
  },
  {
    name: "Nguyễn Thị Định",
    aliases: ["Ba Định"],
    clues: [
      "Bà là nữ tướng đầu tiên của Quân đội nhân dân Việt Nam trong thời đại Hồ Chí Minh.",
      "Bà là người lãnh đạo phong trào Đồng khởi ở Bến Tre năm 1960.",
      "Bà từng giữ chức Phó Chủ tịch Hội đồng Nhà nước.",
      "Bà là biểu tượng của 'Đội quân tóc dài' huyền thoại.",
      "Tên của bà gắn liền with những chiến công hiển hách của phụ nữ miền Nam."
    ]
  },
  {
    name: "Nguyễn Hữu Thọ",
    aliases: ["Anh Nghĩa"],
    clues: [
      "Ông là một luật sư yêu nước, từng tham gia các phong trào đấu tranh của trí thức Sài Gòn.",
      "Ông là Chủ tịch đầu tiên của Mặt trận Dân tộc Giải phóng miền Nam Việt Nam.",
      "Ông từng giữ chức Quyền Chủ tịch nước và Chủ tịch Quốc hội.",
      "Ông là một nhà lãnh đạo có uy tín lớn đối với nhân dân miền Nam và bạn bè quốc tế.",
      "Ông quê ở tỉnh Long An, suốt đời phấn đấu vì sự nghiệp đại đoàn kết dân tộc."
    ]
  },
  {
    name: "Huỳnh Tấn Phát",
    aliases: [],
    clues: [
      "Ông là một kiến trúc sư tài năng và là một nhà cách mạng kiên cường.",
      "Ông là Chủ tịch Chính phủ Cách mạng lâm thời Cộng hòa miền Nam Việt Nam.",
      "Ông từng giữ chức Phó Thủ tướng Chính phủ và Phó Chủ tịch Hội đồng Bộ trưởng.",
      "Ông là người thiết kế nhiều công trình kiến trúc có giá trị.",
      "Ông là biểu tượng của tinh thần yêu nước và tài năng của trí thức cách mạng miền Nam."
    ]
  },
  {
    name: "Trần Văn Trà",
    aliases: ["Nguyễn Việt Châu"],
    clues: [
      "Ông là một thượng tướng tài ba, từng giữ chức Tư lệnh Quân giải phóng miền Nam.",
      "Ông có vai trò quan trọng trong việc chỉ đạo các chiến dịch quân sự lớn ở chiến trường B2.",
      "Ông là tác giả cuốn hồi ký 'Kết thúc cuộc chiến tranh 30 năm'.",
      "Ông là người trực tiếp tham gia chỉ huy chiến dịch Hồ Chí Minh lịch sử.",
      "Ông nổi tiếng with sự sâu sát thực tế và tài thao lược xuất chúng."
    ]
  },
  {
    name: "Hoàng Văn Thái",
    aliases: ["Hoàng Văn Xiêm"],
    clues: [
      "Ông là vị Tổng Tham mưu trưởng đầu tiên của Quân đội nhân dân Việt Nam.",
      "Ông có đóng góp to lớn trong việc xây dựng cơ quan tham mưu chiến lược của quân đội.",
      "Ông trực tiếp tham gia chỉ đạo nhiều chiến dịch lớn trong cả hai cuộc kháng chiến.",
      "Ông được phong quân hàm Đại tướng năm 1980.",
      "Ông là một nhà quân sự học lỗi lạc with nhiều công trình nghiên cứu giá trị."
    ]
  },
  {
    name: "Phan Đăng Lưu",
    aliases: [],
    clues: [
      "Ông là một nhà lãnh đạo tiền bối xuất sắc của Đảng Cộng sản Việt Nam.",
      "Ông có đóng góp quan trọng trong phong trào dân chủ 1936-1939.",
      "Ông là người chỉ đạo cuộc khởi nghĩa Nam Kỳ tại Sài Gòn.",
      "Ông bị thực dân Pháp bắt và xử bắn tại ngã ba Giồng năm 1941.",
      "Ông quê ở tỉnh Nghệ An, nổi tiếng with tinh thần hiếu học và lòng yêu nước cháy bỏng."
    ]
  },
  {
    name: "Nguyễn Phú Trọng",
    aliases: [],
    clues: [
      "Ông là Tổng Bí thư Đảng Cộng sản Việt Nam trong nhiều nhiệm kỳ liên tiếp.",
      "Ông là người khởi xướng và lãnh đạo quyết liệt công cuộc đấu tranh chống tham nhũng, tiêu cực.",
      "Ông gắn liền with hình ảnh 'đốt lò' để làm sạch bộ máy Đảng và Nhà nước.",
      "Ông là nhà lý luận xuất sắc, có nhiều tác phẩm quan trọng về xây dựng Đảng và con đường lên CNXH.",
      "Ông luôn nhấn mạnh việc giữ gìn bản sắc văn hóa dân tộc và đạo đức cách mạng."
    ]
  },
  {
    name: "Nguyễn Xuân Phúc",
    aliases: [],
    clues: [
      "Ông từng giữ chức Thủ tướng Chính phủ và Chủ tịch nước CHXHCN Việt Nam.",
      "Ông gắn liền with thông điệp về một Chính phủ kiến tạo, liêm chính và hành động.",
      "Under thời ông làm Thủ tướng, Việt Nam đã kiểm soát tốt đại dịch COVID-19 giai đoạn đầu.",
      "Ông tích cực thúc đẩy hội nhập kinh tế quốc tế và cải thiện môi trường đầu tư.",
      "Ông quê ở tỉnh Quảng Nam, có phong cách lãnh đạo gần gũi và quyết liệt."
    ]
  },
  {
    name: "Nguyễn Minh Triết",
    aliases: ["Sáu Phong"],
    clues: [
      "Ông từng giữ chức Chủ tịch nước CHXHCN Việt Nam giai đoạn 2006-2011.",
      "Before đó, ông là Bí thư Thành ủy Thành phố Hồ Chí Minh.",
      "Ông nổi tiếng with phong cách giản dị, cởi mở và chân thành.",
      "Ông có đóng góp quan trọng trong việc thúc đẩy quan hệ đối ngoại của Việt Nam.",
      "Ông quê ở tỉnh Bình Dương, là một nhà lãnh đạo trưởng thành từ phong trào thanh niên."
    ]
  },
  {
    name: "Trương Tấn Sang",
    aliases: ["Tư Sang"],
    clues: [
      "Ông từng giữ chức Chủ tịch nước CHXHCN Việt Nam giai đoạn 2011-2016.",
      "Ông từng là Thường trực Ban Bí thư và Bí thư Thành ủy TP. Hồ Chí Minh.",
      "Ông có tiếng là nhà lãnh đạo thẳng thắn, quyết liệt trong đấu tranh chống tiêu cực.",
      "Ông tích cực thúc đẩy cải cách tư pháp và củng cố khối đại đoàn kết dân tộc.",
      "Ông quê ở tỉnh Long An, luôn trăn trở về sự nghiệp phát triển bền vững của đất nước."
    ]
  },
  {
    name: "Trần Đức Lương",
    aliases: [],
    clues: [
      "Ông từng giữ chức Chủ tịch nước CHXHCN Việt Nam trong hai nhiệm kỳ (1997-2006).",
      "Ông vốn là một kỹ sư địa chất before khi trở thành chính trị gia chuyên nghiệp.",
      "Under thời ông, Việt Nam đã đạt được nhiều thành tựu quan trọng về kinh tế và đối ngoại.",
      "Ông là người ký lệnh ban hành nhiều bộ luật quan trọng của thời kỳ đổi mới.",
      "Ông quê ở tỉnh Quảng Ngãi, nổi tiếng with phong cách điềm đạm và am hiểu thực tiễn."
    ]
  },
  {
    name: "Trần Đại Quang",
    aliases: [],
    clues: [
      "Ông từng giữ chức Chủ tịch nước CHXHCN Việt Nam giai đoạn 2016-2018.",
      "Before đó, ông là Đại tướng, Bộ trưởng Bộ Công an.",
      "Ông có đóng góp quan trọng trong việc giữ vững an ninh quốc gia và trật tự an toàn xã hội.",
      "Ông chủ trì nhiều sự kiện quốc tế quan trọng tổ chức tại Việt Nam như APEC 2017.",
      "Ông quê ở tỉnh Ninh Bình, là một giáo sư, tiến sĩ luật học."
    ]
  },
  {
    name: "Lê Đức Anh",
    aliases: ["Sáu Nam"],
    clues: [
      "Ông là một đại tướng, từng giữ chức Chủ tịch nước và Bộ trưởng Bộ Quốc phòng.",
      "Ông có vai trò quan trọng trong việc chỉ huy quân tình nguyện Việt Nam tại Campuchia.",
      "Ông là người trực tiếp chỉ đạo việc bảo vệ chủ quyền tại quần đảo Trường Sa năm 1988.",
      "Ông có đóng góp to lớn trong việc bình thường hóa quan hệ with Trung Quốc và Hoa Kỳ.",
      "Ông quê ở tỉnh Thừa Thiên Huế, là một nhà quân sự - chính trị kiên cường."
    ]
  },
  {
    name: "Chu Huy Mân",
    aliases: ["Chu Văn Điều"],
    clues: [
      "Ông là một đại tướng, từng giữ chức Phó Chủ tịch Hội đồng Nhà nước.",
      "Ông nổi tiếng with tài chỉ huy chiến dịch và công tác chính trị trong quân đội.",
      "Ông gắn liền with những chiến thắng vang dội tại chiến trường Tây Nguyên và khu V.",
      "Ông được mệnh danh là 'vị tướng hai vai' (giỏi cả quân sự và chính trị).",
      "Ông quê ở tỉnh Nghệ An, suốt đời tận trung with Đảng, tận hiếu with dân."
    ]
  },
  {
    name: "Hoàng Minh Thảo",
    aliases: [],
    clues: [
      "Ông là một thượng tướng, giáo sư, nhà lý luận quân sự lỗi lạc của Việt Nam.",
      "Ông là Tư lệnh chiến dịch Tây Nguyên giải phóng Buôn Ma Thuột năm 1975.",
      "Ông có nhiều công trình nghiên cứu giá trị về nghệ thuật quân sự Việt Nam.",
      "Ông từng giữ chức Viện trưởng Học viện Quốc phòng lâu nhất.",
      "Ông được coi là một trong những học trò xuất sắc của Đại tướng Võ Nguyên Giáp."
    ]
  },
  {
    name: "Lê Thiết Hùng",
    aliases: [],
    clues: [
      "Ông là vị tướng đầu tiên được phong quân hàm của Quân đội nhân dân Việt Nam.",
      "Ông từng là Hiệu trưởng đầu tiên của Trường Lục quân Trần Quốc Tuấn.",
      "Ông có đóng góp quan trọng trong việc đào tạo những thế hệ cán bộ quân đội đầu tiên.",
      "Ông từng tham gia hoạt động cách mạng tại Trung Quốc cùng with Bác Hồ.",
      "Ông quê ở tỉnh Nghệ An, là một người lính già tận tụy."
    ]
  },
  {
    name: "Hồ Tùng Mậu",
    aliases: ["Lương Văn Chính"],
    clues: [
      "Ông là một nhà cách mạng tiền bối, người bạn chiến đấu thân thiết của Bác Hồ.",
      "Ông là thành viên sáng lập Tâm tâm xã và sau đó là Hội Việt Nam Cách mạng Thanh niên.",
      "Ông từng bị chính quyền phong kiến và thực dân bắt giam nhiều lần.",
      "Ông hy sinh trên đường đi công tác do máy bay Pháp bắn phá năm 1951.",
      "Ông quê ở tỉnh Nghệ An, nổi tiếng with sự trung kiên và đức tính liêm khiết."
    ]
  },
  {
    name: "Nguyễn Sinh Sắc",
    aliases: ["Cụ Phó bảng"],
    clues: [
      "Ông là thân sinh của Chủ tịch Hồ Chí Minh.",
      "Ông đỗ Phó bảng kỳ thi Hội và từng làm quan ở bộ Lễ, sau đó làm Tri huyện Bình Khê.",
      "Ông là một nhà nho có tư tưởng tiến bộ, luôn trăn trở về cảnh nước mất nhà tan.",
      "After khi bị cách chức, ông đi vào miền Nam dạy học và bốc thuốc chữa bệnh cho dân nghèo.",
      "Mộ của ông hiện tọa lạc tại thành phố Cao Lãnh, tỉnh Đồng Tháp."
    ]
  },
  {
    name: "Hoàng Thị Loan",
    aliases: [],
    clues: [
      "Bà là thân mẫu của Chủ tịch Hồ Chí Minh.",
      "Bà là biểu tượng của người phụ nữ Việt Nam đảm đang, hiền hậu và giàu đức hy sinh.",
      "Bà một mình nuôi con tại kinh thành Huế trong điều kiện vô cùng khó khăn.",
      "Bà qua đời ở tuổi 33 khi Bác Hồ mới 11 tuổi.",
      "Phần mộ của bà hiện nằm trên núi Chung, xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An."
    ]
  },
  {
    name: "Lê Hồng Sơn",
    aliases: ["Lê Văn Phan"],
    clues: [
      "Ông là một nhà cách mạng tiền bối, thành viên sáng lập Tâm tâm xã.",
      "Ông là người cộng sự đắc lực của Nguyễn Ái Quốc trong việc thành lập Hội Việt Nam Cách mạng Thanh niên.",
      "Ông đã tham gia huấn luyện nhiều cán bộ cách mạng tại Quảng Châu.",
      "Ông bị thực dân Pháp bắt và xử bắn tại Vinh năm 1933.",
      "Ông quê ở huyện Nam Đàn, tỉnh Nghệ An."
    ]
  },
  {
    name: "Phùng Chí Kiên",
    aliases: ["Nguyễn Vĩ"],
    clues: [
      "Ông là một nhà quân sự tài ba, từng học tại Trường Quân sự Hoàng Phố.",
      "Ông là người đầu tiên được phong hàm tướng (mặc dù là truy phong) của quân đội ta.",
      "Ông là người chỉ huy Đội cứu quốc quân I.",
      "Ông hy sinh anh dũng trong một trận càn của quân Pháp tại Bắc Sơn năm 1941.",
      "Ông là Ủy viên Trung ương Đảng, một người học trò xuất sắc của Bác Hồ."
    ]
  },
  {
    name: "Lê Quang Đạo",
    aliases: ["Nguyễn Thừa Đạt"],
    clues: [
      "Ông là một trung tướng, nhà hoạt động chính trị lỗi lạc của Việt Nam.",
      "Ông từng giữ chức Chủ tịch Quốc hội Việt Nam.",
      "Ông có đóng góp to lớn trong công tác tư tưởng và chính trị của quân đội.",
      "Ông là người chỉ huy trực tiếp chiến dịch Đường 9 - Nam Lào.",
      "Ông quê ở tỉnh Bắc Ninh, là một trí thức cách mạng tiêu biểu."
    ]
  }
];

module.exports = guessCharacterQuestions;
