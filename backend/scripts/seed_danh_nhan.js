const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Lesson = require('../models/Lesson');
const Question = require('../models/Question');
const Matching = require('../models/Matching');
const GuessCharacter = require('../models/GuessCharacter');
const RevealPicture = require('../models/RevealPicture');
const Chronological = require('../models/Chronological');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/history_game';
    await mongoose.connect(mongoUri);
    console.log("🚀 Lấy năng lượng từ 13 vị anh hùng... (Kết nối Database)");

    // Xóa hết data cũ
    await Lesson.deleteMany({});
    await Question.deleteMany({});
    await Matching.deleteMany({});
    await GuessCharacter.deleteMany({});
    await RevealPicture.deleteMany({});
    await Chronological.deleteMany({});
    console.log("🧹 Đã dọn sạch cơ sở dữ liệu để làm bệ phóng cho các Danh nhân!");

    // 1. LESSON (HỌC TẬP)
    const lessons = [
      {
        title: "Chống phong kiến phương Bắc (trước 1858)",
        description: "Thời kỳ các vị anh hùng đặt nền móng và bảo vệ nền độc lập tự chủ.",
        order: 1,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Ky_niem_Ngung_Binh.jpg/300px-Ky_niem_Ngung_Binh.jpg",
        wiki: {
          content: `
# 1. Hai Bà Trưng
- **Tiểu sử & Hoàn cảnh**: Trưng Trắc và Trưng Nhị (mất năm 43 CN) là hai chị em quê ở Mê Linh. Đất nước đang chịu ách đô hộ của nhà Đông Hán, nhân dân bị áp bức bóc lột nặng nề bởi Thái thú Tô Định.
- **Vai trò & Chiến công**: Năm 40, Hai Bà Trưng phất cờ khởi nghĩa ở Hát Môn, đánh đuổi Tô Định, lập ra nhà nước độc lập đóng đô tại Mê Linh. Trưng Trắc xưng vương (Trưng Nữ Vương). 
- **Ý nghĩa & Di sản**: Cuộc khởi nghĩa đầu tiên trong lịch sử dân tộc sau Công nguyên, khẳng định sức mạnh và ý chí quật cường của phụ nữ Việt Nam.

# 2. Bà Triệu
- **Tiểu sử & Hoàn cảnh**: Triệu Thị Trinh (225–248), lãnh đạo cuộc khởi nghĩa chống lại ách đô hộ của nhà Đông Ngô. Câu nói nổi tiếng của bà: "Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông... chứ không chịu khom lưng làm tì thiếp cho người".
- **Vai trò & Chiến công**: Cuộc khởi nghĩa nổ ra ở ngàn Nưa (Thanh Hóa), đánh phá các thành ấp của nhà Ngô ở Cửu Chân.
- **Ý nghĩa & Di sản**: Thể hiện khí phách kiên cường, thà chết không chịu làm nô lệ của dân tộc Việt.

# 3. Lý Bí
- **Tiểu sử & Hoàn cảnh**: Lý Bí (503-548), người Thái Bình. Do căm phẫn ách thống trị tàn bạo của nhà Lương, ông đã tập hợp nghĩa quân nổi dậy.
- **Vai trò & Chiến công**: Lãnh đạo khởi nghĩa năm 542, đánh đuổi thứ sử Tiêu Tư. Năm 544, ông lên ngôi hoàng đế (Lý Nam Đế), lập ra nhà nước Vạn Xuân.
- **Ý nghĩa & Di sản**: Lần đầu tiên từ sau thời An Dương Vương, người Việt xưng "Hoàng đế" (Nam Đế), ngang hàng với hoàng đế Trung Hoa, khẳng định dân tộc là một quốc gia độc lập có quốc hiệu.

# 4. Ngô Quyền
- **Tiểu sử & Hoàn cảnh**: Ngô Quyền (898–944), người Đường Lâm, là bộ tướng của Dương Đình Nghệ. Sau khi Dương Đình Nghệ bị ám sát, ông đã kéo quân ra Bắc diệt phản tặc và phải đối mặt với quân Nam Hán xâm lược.
- **Vai trò & Chiến công**: Năm 938, với mưu trí cắm cọc nhọn bọc sắt dưới lòng sông Bạch Đằng, Ngô Quyền đã phá tan thủy quân Nam Hán.
- **Ý nghĩa & Di sản**: Chấm dứt hơn 1000 năm Bắc thuộc, mở ra kỷ nguyên độc lập, tự chủ lâu dài cho dân tộc.

# 5. Lê Hoàn
- **Tiểu sử & Hoàn cảnh**: Lê Hoàn (941–1005), xuất thân là Thập đạo tướng quân của nhà Đinh. Đinh Tiên Hoàng mất, Thái hậu Dương Vân Nga nhường ngôi cho ông để gánh vác việc nước khi quân Tống chuẩn bị xâm lược.
- **Vai trò & Chiến công**: Lên ngôi xưng Lê Đại Hành (980), lập chức chỉ huy đánh bại quân Tống năm 981 ở trận Chi Lăng - Bạch Đằng. Năm 982 tiến đánh Chiêm Thành, giữ yên bờ cõi phía Nam.
- **Ý nghĩa & Di sản**: Củng cố chính quyền trung ương tập quyền vững mạnh, kết hợp xuất sắc cả quân sự chiến thuật và ngoại giao uyển chuyển.

# 6. Lý Thường Kiệt
- **Tiểu sử & Hoàn cảnh**: Lý Thường Kiệt (1019-1105) là tướng tài triều Lý dưới các đời vua Lý Thái Tông, Thánh Tông, Nhân Tông.
- **Vai trò & Chiến công**: Chủ trương "Tiên phát chế nhân", mang quân đánh châu Khâm, châu Ung của Tống năm 1075 để phá hủy căn cứ địch. Năm 1077, lập phòng tuyến bờ nam sông Như Nguyệt, đánh bại quân Tống. Tác giả của bài thơ thần "Nam quốc sơn hà".
- **Ý nghĩa & Di sản**: Bài thơ "Nam quốc sơn hà" được xem là bản Tuyên ngôn độc lập đầu tiên của nước ta.

# 7. Trần Hưng Đạo
- **Tiểu sử & Hoàn cảnh**: Trần Quốc Tuấn (1228-1300), vị tướng tài ba của nhà Trần, đối diện với đạo quân Mông-Nguyên hùng mạnh nhất thế giới lúc bấy giờ.
- **Vai trò & Chiến công**: Được suy tôn là Quốc công tiết chế, chỉ huy tối cao quân đội. Lãnh đạo chiến thắng hai cuộc kháng chiến chống Nguyên (1285, 1288) với đỉnh cao là trận Bạch Đằng 1288. Tác giả của "Hịch tướng sĩ".
- **Ý nghĩa & Di sản**: Trở thành biểu tượng của tinh thần trung quân ái quốc, tài thao lược kiệt xuất và nghệ thuật chiến tranh nhân dân, được nhân dân tôn kính là Đức Thánh Trần.

# 8. Lê Lợi
- **Tiểu sử & Hoàn cảnh**: Lê Lợi (1385-1433) quê Thanh Hóa. Đầu thế kỷ 15, nhà Minh đô hộ tàn bạo nước Đại Ngu (sau khi diệt nhà Hồ), ông là một hào trưởng căm phẫn đứng lên dấy binh.
- **Vai trò & Chiến công**: Lãnh đạo cuộc Khởi nghĩa Lam Sơn kéo dài 10 năm (1418-1427). Đã chỉ huy tiêu diệt và bắt sống nhiều tướng giặc, trong đó có trận Chi Lăng - Xương Giang vang dội. Lập ra nhà Hậu Lê.
- **Ý nghĩa & Di sản**: Giải phóng đất nước thoát khỏi ách đô hộ ác liệt của nhà Minh, mở ra thời kỳ thịnh trị Hậu Lê.

# 9. Nguyễn Trãi
- **Tiểu sử & Hoàn cảnh**: Nguyễn Trãi (1380-1442), là văn thần tài ba, cánh tay đắc lực của Lê Lợi trong khởi nghĩa Lam Sơn.
- **Vai trò & Chiến công**: Vạch ra chiến lược "tâm công" (đánh vào lòng người), viết ra vô số thư từ ngoại giao dụ hàng tướng Minh. Tác giả của "Bình Ngô đại cáo" vĩ đại.
- **Ý nghĩa & Di sản**: "Bình Ngô đại cáo" là Tuyên ngôn độc lập thứ hai của nước ta. Ông được UNESCO công nhận là Danh nhân văn hóa thế giới.
          `,
          images: [],
          maps: [],
          videoUrl: ""
        },
        flashcards: [
          { front: "Hai Bà Trưng", back: "Chị em Trưng Trắc, Trưng Nhị khởi nghĩa ở Mê Linh (năm 40 CN), lập nên nhà nước độc lập đầu tiên sau thời Bắc thuộc." },
          { front: "Bà Triệu", back: "Khởi nghĩa năm 248 chống quân Đông Ngô. Câu nói: 'Tôi muốn cưỡi cơn gió mạnh... chém cá kình ở biển Đông!'" },
          { front: "Lý Bí", back: "Đánh đuổi quân Lương năm 542, lập tòa sen xưng Lý Nam Đế, đặt quốc hiệu là Vạn Xuân (544)." },
          { front: "Ngô Quyền", back: "Đóng cọc nhọn bọc sắt diệt quân Nam Hán trên sông Bạch Đằng năm 938, đánh dấu độc lập vững chắc." },
          { front: "Lê Hoàn", back: "Lê Đại Hành hoàng đế, người đánh bại quân Tống năm 981 ở trận Chi Lăng - Bạch Đằng." },
          { front: "Lý Thường Kiệt", back: "Tướng tài nhà Lý với chiến lược 'Tiên phát chế nhân'. Tác giả của 'Nam Quốc Sơn Hà'." },
          { front: "Trần Hưng Đạo", back: "Quốc công tiết chế đỉnh cao chỉ huy quân đội đại thắng quân Nguyên Mông (1285, 1288). Soạn 'Hịch tướng sĩ'." },
          { front: "Lê Lợi", back: "Lãnh tụ khởi nghĩa Lam Sơn 10 năm (1418-1427) đuổi quân Minh, sáng lập triều tiền Hậu Lê." },
          { front: "Nguyễn Trãi", back: "Mưu sĩ tuyệt đỉnh của Lê Lợi, viết 'Bình Ngô Đại Cáo' lừng danh, Danh nhân văn hóa thế giới." }
        ]
      },
      {
        title: "Chống thực dân phương Tây (1858 - 1945)",
        description: "Thời kỳ các thủ lĩnh phong trào kháng chiến và khởi nghĩa bảo vệ non sông trước đạn pháo phương Tây.",
        order: 2,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Ky_niem_Ngung_Binh.jpg/300px-Ky_niem_Ngung_Binh.jpg",
        wiki: {
          content: `
# 10. Trương Định
- **Tiểu sử & Hoàn cảnh**: Trương Định (1820–1864) là võ quan nhà Nguyễn. Khi thực dân Pháp xâm lược Gia Định (1859), triều đình nhu nhược ký hiệp ước cắt đất và ra lệnh cho ông bãi binh.
- **Vai trò & Chiến công**: Cự tuyệt lệnh triều đình, ông được nhân dân suy tôn làm "Bình Tây Đại Nguyên Soái", lãnh đạo khởi nghĩa vũ trang ở Gò Công, gây cho Pháp rất nhiều tổn thất lớn.
- **Ý nghĩa & Di sản**: Là ngọn cờ đầu và là biểu tượng của tinh thần kháng chiến bất khuất của nhân dân Nam Kỳ trong giai đoạn đầu Pháp xâm lược.

# 11. Nguyễn Trung Trực
- **Tiểu sử & Hoàn cảnh**: Nguyễn Trung Trực (1838–1868), xuất thân từ dân chài, tính tình khảng khái. Ông tham gia kháng chiến chống Pháp ngay khi chúng đánh chiếm Nam Kỳ.
- **Vai trò & Chiến công**: Tổ chức hỏa công đốt cháy tàu chiến L'Espérance (Hy Vọng) của Pháp trên sông Vàm Cỏ Đông (1861). Đánh úp kiên cường chiếm đồn Kiên Giang (1868).
- **Ý nghĩa & Di sản**: Bất hủ với câu nói hùng hồn trước khi bị hành hình: "Bao giờ Tây nhổ hết cỏ nước Nam mới hết người Nam đánh Tây". Ông là hình ảnh thu nhỏ của lòng yêu nước kiên trinh dân tộc Thủ lĩnh nông dân Đồng bằng sông Cửu Long.

# 12. Phan Đình Phùng
- **Tiểu sử & Hoàn cảnh**: Phan Đình Phùng (1847-1895) quê Hà Tĩnh, từng giữ chức Ngự sử triều Nguyễn. Hưởng ứng chiếu Cần Vương của vua Hàm Nghi sau khi kinh thành Huế thất thủ (1885).
- **Vai trò & Chiến công**: Lãnh đạo phong trào khởi nghĩa Hương Khê - cuộc khởi nghĩa quy mô lớn nhất, tổ chức chặt chẽ nhất trong phong trào Cần Vương. Cao Thắng (tướng của ông) đã chế tạo thành công súng trường theo kiểu Pháp.
- **Ý nghĩa & Di sản**: Khởi nghĩa Hương Khê tuy thất bại do tương quan lực lượng nhưng đã để lại bài học lớn về nghệ thuật lãnh đạo phong trào yêu nước dưới ngọn cờ phong kiến ở thế kỷ XIX.

# 13. Hoàng Hoa Thám
- **Tiểu sử & Hoàn cảnh**: Hoàng Hoa Thám (1858-1913), còn gọi là Đề Thám, Hùm thiêng Yên Thế. Ông lãnh đạo phong trào khởi nghĩa dân cày nghèo Yên Thế vùng rừng núi Bắc Giang.
- **Vai trò & Chiến công**: Chấp nhận chiến thuật du kích tài tình dựa vào địa hình rừng núi, Đề Thám đã duy trì cuộc khởi nghĩa Yên Thế dài nhất (gần 30 năm), buộc Pháp phải hai lần giảng hòa và nhượng bộ quyền kiểm soát.
- **Ý nghĩa & Di sản**: Cuộc khởi nghĩa nông dân điển hình nhất từ cuối thế kỷ 19 sang đầu thế kỷ 20, làm hao mòn lực lượng thực dân bộ phận lớn.
          `,
          images: [],
          maps: [],
          videoUrl: ""
        },
        flashcards: [
          { front: "Trương Định", back: "Được nhân dân suy tôn là 'Bình Tây Đại Nguyên Soái'. Bất tuân lệnh vua để ở lại miền Nam chống Pháp." },
          { front: "Nguyễn Trung Trực", back: "Chiến công đốt tàu Hy Vọng trên sông Nhật Tảo. Câu nói: 'Bao giờ Tây nhổ hết cỏ nước Nam mới hết người Nam đánh Tây'." },
          { front: "Phan Đình Phùng", back: "Thủ lĩnh tối cao của khởi nghĩa Hương Khê đỉnh cao phong trào Cần Vương; nghĩa quân chế tạo được súng trường kiểu Pháp." },
          { front: "Hoàng Hoa Thám", back: "Đệ nhất 'Hùm thiêng Yên Thế'. Khởi nghĩa nông dân dài nhất trong lịch sử chống Pháp (gần 30 năm)." }
        ]
      }
    ];

    const insertedLessons = await Lesson.insertMany(lessons);
    const lesson1Id = insertedLessons[0]._id; // Thời phong kiến
    const lesson2Id = insertedLessons[1]._id; // Thời thực dân

    // 2. QUESTION MODEL (Dùng cho General, Survival, Time Attack, Millionaire, Territory)
    const questions = [
      // Hai Bà Trưng
      { content: "Sự kiện được coi là khởi nghĩa độc lập đầu tiên sau thời kỳ Bắc thuộc do ai lãnh đạo?", options: ["Lý Bí", "Bà Triệu", "Hai Bà Trưng", "Ngô Quyền"], correctAnswer: "Hai Bà Trưng", explanation: "Hai Bà Trưng phất cờ khởi nghĩa vào năm 40 tại Hát Môn.", lessonId: lesson1Id },
      { content: "Ai là tên thái thú tàn bạo của nhà Hán mà Hai Bà Trưng đã đánh đuổi?", options: ["Mã Viện", "Tiêu Tư", "Hoằng Tháo", "Tô Định"], correctAnswer: "Tô Định", explanation: "Tô Định làm Thái thú cai trị Giao Chỉ rất tàn ác khiến nhân dân lầm than.", lessonId: lesson1Id, type: "territory", location: "Hát Môn" },

      // Bà Triệu
      { content: "Câu nói: 'Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông' là của ai?", options: ["Trưng Nữ Vương", "Bà Triệu", "Bùi Thị Xuân", "Nguyễn Thị Minh Khai"], correctAnswer: "Bà Triệu", explanation: "Bà Triệu Thị Trinh đã dõng dạc nói câu này từ chối kiếp làm tì thiếp cho người Ngô.", lessonId: lesson1Id, type: "millionaire" },
      { content: "Cuộc khởi nghĩa của Bà Triệu (248) nổ ra để chống lại thế lực phương Bắc nào?", options: ["Đông Ngô", "Đông Hán", "Nhà Lương", "Nhà Tùy"], correctAnswer: "Đông Ngô", explanation: "Đương thời nước ta bị nhà Đông Ngô (thời Tam Quốc) đô hộ.", lessonId: lesson1Id, difficulty: "hard" },

      // Lý Bí
      { content: "Lý Bí sau khi đánh đuổi giặc Lương, thành lập nước Vạn Xuân đã xưng là gì?", options: ["Lý Thái Tổ", "Vạn Xuân Vương", "Lý Nam Đế", "Lý Thái Tông"], correctAnswer: "Lý Nam Đế", explanation: "Lý Bí lên ngôi năm 544, xưng là Lý Nam Đế như một vị Hoàng đế độc lập.", lessonId: lesson1Id, difficulty: "medium" },

      // Ngô Quyền
      { content: "Điều gì tạo nên sự đột phá trong chiến thuật của Ngô Quyền trên sông Bạch Đằng năm 938?", options: ["Sử dụng hỏa công", "Cắm cọc nhọn bọc sắt dưới lòng sông", "Sử dụng súng thần công", "Đánh úp ban đêm"], correctAnswer: "Cắm cọc nhọn bọc sắt dưới lòng sông", explanation: "Cọc gỗ bọc sắt và lợi dụng thủy triều lên xuống là phát kiến quân sự tuyệt vời.", lessonId: lesson1Id, type: "survival" },
      { content: "Quân giặc nào nhận thất bại cay đắng và chấm dứt luôn 1000 năm Bắc thuộc tại trận Bạch Đằng 938?", options: ["Quân Tống", "Quân Nam Hán", "Quân Mông Nguyên", "Quân Lương"], correctAnswer: "Quân Nam Hán", explanation: "Lưu Hoằng Tháo chỉ huy quân Nam Hán đã chết trận, Nam Hán từ đó bỏ mộng xâm lược nước ta.", lessonId: lesson1Id },

      // Lê Hoàn
      { content: "Vị vua nào từng nhậm chức Thập đạo tướng quân của nhà Đinh trước khi lên ngôi hoàng đế chống Tống?", options: ["Ngô Quyền", "Lê Lợi", "Lý Công Uẩn", "Lê Hoàn"], correctAnswer: "Lê Hoàn", explanation: "Lê Hoàn được Thái hậu Dương Vân Nga trao áo long cổn khi Tống chuẩn bị xâm phạm Đại Cồ Việt.", lessonId: lesson1Id, type: "time-attack" },

      // Lý Thường Kiệt
      { content: "Sông Như Nguyệt (nơi Lý Thường Kiệt chặn đứng quân Tống) ngày nay là sông nào?", options: ["Sông Cầu", "Sông Hồng", "Sông Bạch Đằng", "Sông Mã"], correctAnswer: "Sông Cầu", explanation: "Sông Như Nguyệt chính là đoạn chảy qua tỉnh Bắc Ninh ngày nay của sông Cầu.", lessonId: lesson1Id, difficulty: "hard" },
      { content: "Bài thơ 'Nam quốc sơn hà' của Lý Thường Kiệt thường được ví von với danh hiệu gì?", options: ["Tuyệt tác văn học thời Lý", "Bản Tuyên ngôn độc lập đầu tiên", "Lời hịch tướng sĩ", "Chiếu dời đô"], correctAnswer: "Bản Tuyên ngôn độc lập đầu tiên", explanation: "Khẳng định chủ quyền với hai câu mở đầu lừng lẫy về sông núi nước Nam.", lessonId: lesson1Id, type: "millionaire" },

      // Trần Hưng Đạo
      { content: "Tác phẩm quân sự nổi tiếng nào được Trần Hưng Đạo soạn ra nhằm răn dạy, khích lệ tướng sĩ?", options: ["Binh thư yếu lược", "Vạn Kiếp tông bí truyền thư", "Hịch tướng sĩ", "Đại Việt sử ký"], correctAnswer: "Hịch tướng sĩ", explanation: "Hịch Tướng Sĩ nêu cao trách nhiệm quân công và tình yêu đất nước trước họa xâm lăng.", lessonId: lesson1Id },
      { content: "Trần Hưng Đạo đã lãnh đạo chiến đấu chiến thắng quân xâm lược nào?", options: ["Quân Tống và Nguyên", "Ba lần chống quân Mông-Nguyên", "Quân Minh", "Quân Thanh"], correctAnswer: "Ba lần chống quân Mông-Nguyên", explanation: "Dù chỉ làm Tổng chỉ huy (Quốc công tiết chế) trong 2 lần sau, nhưng công lao của ông đại diện cho cả 3 lần kháng Nguyên Mông.", lessonId: lesson1Id, type: "general" },

      // Lê Lợi & Nguyễn Trãi
      { content: "Căn cứ địa chính của cuộc khởi nghĩa Lam Sơn thời kỳ đầu là ở ngọn núi / rừng nào?", options: ["Chí Linh", "Lam Sơn", "Lam Kinh", "Ngàn Nưa"], correctAnswer: "Lam Sơn", explanation: "Khởi nghĩa bắt đầu ở đất Lam Sơn, Thanh Hóa (1418).", lessonId: lesson1Id, type: "territory", location: "LamSon" },
      { content: "Chiến thuật 'Tâm công', viết thư dụ hàng hàng chục vạn quân Minh là do ai chủ trì đề xuất?", options: ["Trần Hưng Đạo", "Lý Thường Kiệt", "Nguyễn Trãi", "Lê Lợi"], correctAnswer: "Nguyễn Trãi", explanation: "Nguyễn Trãi dùng ngòi bút làm vũ khí, đánh gục ý chí quân địch không cần đổ máu.", lessonId: lesson1Id, type: "time-attack" },

      // Trương Định
      { content: "Nhân dân Nam Kỳ chống Pháp suy tôn danh hiệu gì cho Trương Định?", options: ["Đại Nguyên Soái", "Bình Tây Đại Nguyên Soái", "Bình Nam Đại Nguyên Soái", "Thiên Hộ Diệu"], correctAnswer: "Bình Tây Đại Nguyên Soái", explanation: "Ông quyết tâm ở lại đánh 'Tây' mặc cho chiếu chỉ của triều đình Huế ép bãi binh.", lessonId: lesson2Id, type: "millionaire" },

      // Nguyễn Trung Trực
      { content: "Ông đã tạo nên chiến công lẫy lừng khi đốt cháy chiếc tàu chiến L'Espérance (Hy Vọng) của Pháp trên dòng sông nào?", options: ["Sông Tiền", "Sông Bạch Đằng", "Sông Cửu Long", "Sông Vàm Cỏ Đông (Nhật Tảo)"], correctAnswer: "Sông Vàm Cỏ Đông (Nhật Tảo)", explanation: "Chiến công tháng 12/1861 đã làm chấn động lực lượng Pháp ở Nam Kỳ.", lessonId: lesson2Id },
      { content: "Câu nói khẳng định ý chí quật cường: 'Bao giờ Tây nhổ hết cỏ nước Nam...' là của danh nhân nào?", options: ["Nguyễn Đình Chiểu", "Trương Định", "Hoàng Hoa Thám", "Nguyễn Trung Trực"], correctAnswer: "Nguyễn Trung Trực", explanation: "Ông thét lên sự phẫn nộ với Pháp trước giờ thọ hình ở Rạch Giá.", lessonId: lesson2Id, difficulty: "medium" },

      // Phan Đình Phùng
      { content: "Khởi nghĩa nào do Phan Đình Phùng lãnh đạo có quy mô thời gian dài nhất và có tính tổ chức nhất trong phong trào Cần Vương?", options: ["Khởi nghĩa Bãi Sậy", "Khởi nghĩa Yên Thế", "Khởi nghĩa Hương Khê", "Khởi nghĩa Ba Đình"], correctAnswer: "Khởi nghĩa Hương Khê", explanation: "Kéo dài khoảng 10 năm, căn cứ trải rộng khắp 4 tỉnh Thanh Hóa, Nghệ An, Hà Tĩnh, Quảng Bình.", lessonId: lesson2Id, type: "survival" },
      { content: "Ai là tướng đắc lực của Phan Đình Phùng người đã chế tạo súng trường theo kiểu Pháp?", options: ["Cao Thắng", "Hoàng Hoa Thám", "Trương Vĩnh Ký", "Đinh Công Tráng"], correctAnswer: "Cao Thắng", explanation: "Cao Thắng rất giỏi vũ khí, tổ chức xưởng đúc súng theo mẫu tiểu liên 1874 của Pháp.", lessonId: lesson2Id, type: "time-attack" },

      // Hoàng Hoa Thám
      { content: "Hoàng Hoa Thám còn được nhân dân kính trọng gọi bằng danh xưng nào?", options: ["Bình Tây Đại Nguyên Soái", "Đức Thánh Trần", "Hùm thiêng Yên Thế", "Lãnh binh Thăng"], correctAnswer: "Hùm thiêng Yên Thế", explanation: "Cuộc đấu tranh của Hoàng Hoa Thám (Đề Thám) ở vùng Yên Thế là đáng sợ nhất với quân Pháp suốt 30 năm.", lessonId: lesson2Id }
    ];
    await Question.insertMany(questions);
    console.log("✅ Đã tạo Questions (Tổng hợp các mode chơi).");

    // 3. MATCHING
    const matchings = [
      {
        title: "Danh nhân và Niên đại",
        type: "Event-Year",
        difficulty: 1,
        pairs: [
          { left: "Ngô Quyền", right: "Năm 938" },
          { left: "Lý Nam Đế", right: "Năm 544" },
          { left: "Hai Bà Trưng", right: "Năm 40" },
          { left: "Nguyễn Trãi", right: "Năm 1428 (Bình Ngô Đại Cáo)" },
          { left: "Phan Đình Phùng", right: "Cuối thế kỷ XIX" }
        ]
      },
      {
        title: "Nhân vật và Danh xưng/Chiến công",
        type: "Custom",
        difficulty: 2,
        pairs: [
          { left: "Lý Thường Kiệt", right: "Tiên phát chế nhân" },
          { left: "Nguyễn Trung Trực", right: "Đốt tàu Hy Vọng" },
          { left: "Trương Định", right: "Bình Tây Đại Nguyên Soái" },
          { left: "Trần Hưng Đạo", right: "Hịch Tướng Sĩ" },
          { left: "Hoàng Hoa Thám", right: "Hùm thiêng Yên Thế" }
        ]
      }
    ];
    await Matching.insertMany(matchings);
    console.log("✅ Đã tạo Matching Questions.");

    // 4. GUESS CHARACTER (Đoán nhân vật)
    const guessCharacters = [
      {
        name: "Lê Hoàn",
        aliases: ["Lê Đại Hành", "Lê Hoàn Hoàng Đế", "Thập đạo tướng quân"],
        clues: [
          "Ông xuất thân ở Ái Châu (Thanh Hóa ngày nay).",
          "Giữ chức Thập Đạo Tướng Quân thời vua Đinh.",
          "Được Thái hậu họ Dương khoác áo hoàng bào.",
          "Người sáng lập triều tiền Tiền Lê.",
          "Chỉ huy đánh đuổi giặc Tống năm Tân Tỵ (981)."
        ],
        difficulty: "medium"
      },
      {
        name: "Bà Triệu",
        aliases: ["Triệu Thị Trinh", "Nhụy Kiều tướng quân"],
        clues: [
          "Bà là một phụ nữ anh hùng ở vùng núi Quan Yên, Thanh Hóa.",
          "Thường mặc giáp vàng, cưỡi voi trắng ra trận.",
          "Lãnh đạo khởi nghĩa chống quân Đông Ngô năm 248.",
          "Được ngợi ca qua câu 'Muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ'.",
          "Lăng mộ của bà nằm tại núi Tùng (Thanh Hóa)."
        ],
        difficulty: "easy"
      },
      {
        name: "Nguyễn Trãi",
        aliases: ["Ức Trai", "Nguyễn Ức Trai"],
        clues: [
          "Bố là Nguyễn Phi Khanh, đỗ thái học sinh dưới triều Trần.",
          "Theo chân chủ tướng ròng rã 10 năm nằm gai nếm mật.",
          "Ông chủ trương dùng chiến lược 'tâm công' không đánh mà thắng.",
          "Tên tuổi gắn liền với vụ án Lệ Chi Viên oan nghiệt.",
          "Người chấp bút bản 'Bình Ngô đại cáo'."
        ],
        difficulty: "medium"
      }
    ];
    await GuessCharacter.insertMany(guessCharacters);
    console.log("✅ Đã tạo Đoán Nhân Vật.");

    // 5. REVEAL PICTURE
    const revealPictures = [
      {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Hoang-hoa-tham.jpg/250px-Hoang-hoa-tham.jpg",
        answer: "Hoàng Hoa Thám",
        difficulty: "medium",
        questions: [
          { q: "Quê gốc làng Dị Chế (Tiên Lữ, Hưng Yên) nhưng lập nghiệp ở Bắc Giang. Ông là ai?", a: "Hoàng Hoa Thám" },
          { q: "Từ 1892 đến 1913 ông lãnh đạo cuộc khởi nghĩa nông dân chống Pháp kéo dài gần 30 năm ở đâu?", a: "Yên Thế" },
          { q: "Thực dân Pháp gọi ông là danh xưng gì có từ 'thiêng' ở đầu?", a: "Hùm thiêng Yên Thế" },
          { q: "Ông đã hai lần buộc Pháp giảng hòa vào năm 1894 và năm nào?", a: "1897" },
          { q: "Năm 1908, cuộc khởi nghĩa nào ở Hà Nội có sự cổ vũ của Yên Thế (địch bị đầu độc)?", a: "Hà Thành đầu độc" },
          { q: "Để sinh tồn, nghĩa quân Yên Thế làm nghề gì trong thời gian hưu chiến?", a: "Làm ruộng (cày cấy)" },
          { q: "Cuộc khởi nghĩa Yên Thế thuộc phong trào cứu nước cuối thế kỷ bao nhiêu?", a: "Thế kỷ XIX" },
          { q: "Căn cứ địa nổi tiếng nhất của nghĩa quân ở Yên Thế tên là gì?", a: "Phồn Xương" },
          { q: "Vợ ba của Đề Thám, một nữ tướng tài ba có tên là gì?", a: "Cô Giang (Đặng Thị Nho)" }
        ]
      }
    ];
    await RevealPicture.insertMany(revealPictures);
    console.log("✅ Đã tạo Lật Mảnh Ghép.");

    // 6. CHRONOLOGICAL (DÒNG THỜI GIAN)
    const chronologies = [
      {
        title: "Tiến trình chống giặc thời phong kiến (Trận đánh tiêu biểu)",
        events: [
          { text: "Hai Bà Trưng giành độc lập (Lĩnh Nam rợn bóng cờ)", order: 1 },
          { text: "Khởi nghĩa Lý Bí (Lập nên nước Vạn Xuân)", order: 2 },
          { text: "Trận sông Bạch Đằng (Diệt Nam Hán của Ngô Quyền)", order: 3 },
          { text: "Phòng tuyến Như Nguyệt (Lý Thường Kiệt chặn nhà Tống)", order: 4 },
          { text: "Khởi nghĩa Lam Sơn (Lê Lợi và Nguyễn Trãi chống Minh)", order: 5 }
        ],
        difficulty: "medium"
      },
      {
        title: "Các anh hùng thời kỳ Pháp thuộc (Sự kiện)",
        events: [
          { text: "Trương Định khởi nghĩa Gò Công (Bình Tây Đại Nguyên Soái)", order: 1 },
          { text: "Nguyễn Trung Trực đốt tàu Pháp trên sông Vàm Cỏ Đông", order: 2 },
          { text: "Phan Đình Phùng khởi nghĩa ở Hương Khê", order: 3 },
          { text: "Hoàng Hoa Thám lãnh đạo nông dân ở Yên Thế", order: 4 }
        ],
        difficulty: "hard"
      }
    ];
    await Chronological.insertMany(chronologies);
    console.log("✅ Đã tạo Dòng Thời Gian.");

    console.log("✨✨ ĐÃ DỰNG THÀNH CÔNG HỆ THỐNG DANH NHÂN CHO GAME! ✨✨");
    process.exit(0);

  } catch (err) {
    console.error("❌ Lỗi nặng:", err);
    process.exit(1);
  }
};

seedData();
