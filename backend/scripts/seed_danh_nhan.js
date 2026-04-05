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
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("Biến môi trường MONGO_URI chưa được thiết lập. Vui lòng kiểm tra file .env");
    }
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
      { content: "Ai là tên thái thú tàn bạo của nhà Hán mà Hai Bà Trưng đã đánh đuổi?", options: ["Mã Viện", "Tiêu Tư", "Hoằng Tháo", "Tô Định"], correctAnswer: "Tô Định", explanation: "Tô Định làm Thái thú cai trị Giao Chỉ rất tàn ác.", lessonId: lesson1Id, type: "territory", location: "HatMon" },

      // Bà Triệu
      { content: "Câu nói: 'Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông' là của ai?", options: ["Trưng Nữ Vương", "Bà Triệu", "Bùi Thị Xuân", "Nguyễn Thị Minh Khai"], correctAnswer: "Bà Triệu", explanation: "Bà Triệu Thị Trinh đã dõng dạc nói câu này từ chối kiếp làm tì thiếp.", lessonId: lesson1Id, type: "millionaire" },
      { content: "Cuộc khởi nghĩa của Bà Triệu (248) nổ ra ở địa danh thuộc tỉnh nào hiện nay?", options: ["Hà Nội", "Ninh Bình", "Thanh Hóa", "Hải Phòng"], correctAnswer: "Thanh Hóa", explanation: "Bà khởi nghĩa ở ngàn Nưa, thuộc tỉnh Thanh Hóa ngày nay.", lessonId: lesson1Id, type: "territory", location: "NganNua" },

      // Lý Bí
      { content: "Lý Bí sau khi đánh đuổi giặc Lương, lập nước Vạn Xuân đã xưng là gì?", options: ["Lý Thái Tổ", "Vạn Xuân Vương", "Lý Nam Đế", "Lý Thái Tông"], correctAnswer: "Lý Nam Đế", explanation: "Lý Bí lên ngôi năm 544, xưng là Lý Nam Đế.", lessonId: lesson1Id, difficulty: "medium" },

      // Ngô Quyền
      { content: "Điều gì tạo nên sự đột phá trong chiến thuật của Ngô Quyền năm 938?", options: ["Sử dụng hỏa công", "Cắm cọc nhọn bọc sắt dưới lòng sông", "Sử dụng súng thần công", "Đánh úp ban đêm"], correctAnswer: "Cắm cọc nhọn bọc sắt dưới lòng sông", explanation: "Chiến thuật cọc gỗ trên sông Bạch Đằng là đặc sản quân sự của Ngô Quyền.", lessonId: lesson1Id, type: "survival" },
      { content: "Lưu Hoằng Tháo - chủ tướng quân Nam Hán đã chết trận tại dòng sông nào?", options: ["Sông Hồng", "Sông Cầu", "Sông Bạch Đằng", "Sông Lô"], correctAnswer: "Sông Bạch Đằng", explanation: "Thất bại thảm hại tại Bạch Đằng khiến nhà Nam Hán bỏ mộng xâm lược nước ta.", lessonId: lesson1Id, type: "territory", location: "BachDang" },

      // Lê Hoàn
      { content: "Vị vua nào từng nhậm chức Thập đạo tướng quân của nhà Đinh trước khi lên ngôi hoàng đế chống Tống?", options: ["Ngô Quyền", "Lê Lợi", "Lý Công Uẩn", "Lê Hoàn"], correctAnswer: "Lê Hoàn", explanation: "Lê Hoàn được Thái hậu Dương Vân Nga trao áo long cổn khi Tống chuẩn bị xâm lược.", lessonId: lesson1Id, type: "time-attack" },
      { content: "Đạo quân Tống xâm lược nước ta thời Tiền Lê (981) bị đánh bại chủ yếu tại đâu?", options: ["Bạch Đằng - Chi Lăng", "Phòng tuyến Như Nguyệt", "Cửa Tòa", "Sông Cầu"], correctAnswer: "Bạch Đằng - Chi Lăng", explanation: "Trận Bạch Đằng (thuỷ) và Chi Lăng (bộ) đập tan âm mưu xâm lược của nhà Tống.", lessonId: lesson1Id, type: "territory", location: "ChiLang" },

      // Lý Thường Kiệt
      { content: "Sông Như Nguyệt (nơi Lý Thường Kiệt chặn đứng quân Tống) ngày nay là sông nào?", options: ["Sông Cầu", "Sông Hồng", "Sông Bạch Đằng", "Sông Mã"], correctAnswer: "Sông Cầu", explanation: "Sông Như Nguyệt chính là sông Cầu (Bắc Ninh ngày nay).", lessonId: lesson1Id, difficulty: "hard" },
      { content: "Lý Thường Kiệt từng mang quân đánh châu Khâm, châu Ung của Tống để bảo vệ kinh đô nào?", options: ["Hoa Lư", "Thăng Long", "Phú Xuân", "Cổ Loa"], correctAnswer: "Thăng Long", explanation: "Bảo vệ kinh đô Thăng Long và cõi bờ biên giới phía Bắc.", lessonId: lesson1Id, type: "territory", location: "ThangLong" },

      // Trần Hưng Đạo
      { content: "Tác phẩm quân sự nổi tiếng nào được Trần Hưng Đạo soạn ra nhằm răn dạy, khích lệ tướng sĩ?", options: ["Vạn Kiếp tông bí truyền thư", "Binh thư yếu lược", "Hịch tướng sĩ", "Đại Việt sử ký"], correctAnswer: "Hịch tướng sĩ", explanation: "Hịch Tướng Sĩ nêu cao trách nhiệm và tình yêu đất nước trước họa xâm lăng.", lessonId: lesson1Id },
      { content: "Trần Hưng Đạo đã lãnh đạo chiến đấu chiến thắng quân xâm lược nào 3 lần?", options: ["Quân Tống và Nguyên", "Quân Mông-Nguyên", "Quân Minh", "Quân Thanh"], correctAnswer: "Quân Mông-Nguyên", explanation: "Nhà Trần với sự chỉ huy trực tiếp của ông ở 2 lần sau đã 3 lần đánh bại giặc Mông-Nguyên hùng mạnh.", lessonId: lesson1Id, type: "general" },

      // Lê Lợi & Nguyễn Trãi
      { content: "Căn cứ địa chính của cuộc khởi nghĩa Lam Sơn thời kỳ đầu là ở ngọn núi / rừng nào?", options: ["Chí Linh", "Lam Sơn", "Lam Kinh", "Ngàn Nưa"], correctAnswer: "Lam Sơn", explanation: "Khởi nghĩa bắt đầu ở đất Lam Sơn, Thanh Hóa (1418).", lessonId: lesson1Id, type: "territory", location: "LamSon" },
      { content: "Chiến thuật 'Tâm công', viết thư dụ hàng hàng chục vạn quân Minh là do ai chủ trì đề xuất?", options: ["Trần Hưng Đạo", "Lý Thường Kiệt", "Nguyễn Trãi", "Lê Lợi"], correctAnswer: "Nguyễn Trãi", explanation: "Nguyễn Trãi dùng ngòi bút làm vũ khí, đánh gục ý chí quân địch không cần đổ máu.", lessonId: lesson1Id, type: "time-attack" },

      // Trương Định
      { content: "Nhân dân Nam Kỳ chống Pháp suy tôn danh hiệu 'Bình Tây Đại Nguyên Soái' cho người anh hùng nào ở Gò Công?", options: ["Nguyễn Trung Trực", "Trương Định", "Thiên Hộ Diệu", "Thủ Khoa Huân"], correctAnswer: "Trương Định", explanation: "Mặc lệnh bãi binh của triều đình, Trương Định ở lại cùng nhân dân kháng Pháp tại Gia Định, Gò Công.", lessonId: lesson2Id, type: "territory", location: "GiaDinh" },

      // Nguyễn Trung Trực
      { content: "Chiến công hiển hách đốt cháy tàu chiến L'Espérance của Pháp (1861) diễn ra trên dòng sông nào?", options: ["Sông Tiền", "Sông Hậu", "Sông Sài Gòn", "Vàm Cỏ Đông (Nhật Tảo)"], correctAnswer: "Vàm Cỏ Đông (Nhật Tảo)", explanation: "Chiến thắng trên sông Vàm Cỏ Đông (vàm sông Nhật Tảo) làm chấn động quân Pháp.", lessonId: lesson2Id, type: "territory", location: "VamCoDong" },
      { content: "Cuộc khởi nghĩa của Nguyễn Trung Trực cuối cùng bị chặn đứng, và ông bị xử chém tại đâu năm 1868?", options: ["Gò Công", "Rạch Giá", "Tân An", "Biên Hòa"], correctAnswer: "Rạch Giá", explanation: "Nguyễn Trung Trực hiến mình cứu nhân dân và bị giặc Pháp hành hình tại Rạch Giá (Kiên Giang).", lessonId: lesson2Id, type: "territory", location: "RachGia" },

      // Phan Đình Phùng
      { content: "Khởi nghĩa Hương Khê do Phan Đình Phùng lãnh đạo là đỉnh cao phong trào Cần Vương, đã diễn ra tại tỉnh nào?", options: ["Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Bình"], correctAnswer: "Hà Tĩnh", explanation: "Trung tâm chỉ huy đặt tại Hương Khê, Hà Tĩnh, địa bàn mở rộng khắp 4 tỉnh miền Trung.", lessonId: lesson2Id, type: "territory", location: "HuongKhe" },
      { content: "Ai là vị tướng đắc lực của Phan Đình Phùng đã chế tạo thành công súng trường kiểu Pháp?", options: ["Cao Thắng", "Đinh Công Tráng", "Nguyễn Thiện Thuật", "Hoàng Hoa Thám"], correctAnswer: "Cao Thắng", explanation: "Cao Thắng rất tài giỏi trong tổ chức sản xuất vũ khí, đúc súng kiểu 1874 của thực dân Pháp.", lessonId: lesson2Id, type: "time-attack" },

      // Hoàng Hoa Thám
      { content: "Hoàng Hoa Thám (Hùm thiêng Yên Thế) đã duy trì cuộc khởi nghĩa nông dân chống Pháp kéo dài bao lâu?", options: ["Khoảng 10 năm", "Khoảng 15 năm", "Gần 30 năm", "Hơn 50 năm"], correctAnswer: "Gần 30 năm", explanation: "Khởi nghĩa Yên Thế kéo dài từ 1884 đến 1913, lớn nhất trong lịch sử thời đó.", lessonId: lesson2Id },
      { content: "Căn cứ địa khởi nghĩa Yên Thế nằm ở vùng rừng núi của tỉnh nào?", options: ["Bắc Giang", "Thái Nguyên", "Lạng Sơn", "Cao Bằng"], correctAnswer: "Bắc Giang", explanation: "Địa bàn hiểm trở của Yên Thế Thượng và Phồn Xương, Bắc Giang.", lessonId: lesson2Id, type: "territory", location: "YenThe" },
    ];
    
    // Tích hợp dữ liệu Ai Là Triệu Phú
    const millionaireRaw = require('./millionaire_data');
    const enrichedMillionaire = millionaireRaw.map(mq => ({
      content: mq.content,
      options: mq.options,
      correctAnswer: mq.correctAnswer,
      type: mq.type,
      lessonId: mq.period === 1 ? lesson1Id : lesson2Id
    }));
    
    const allQuestions = [...questions, ...enrichedMillionaire];
    await Question.insertMany(allQuestions);
    console.log(`✅ Đã tạo ${allQuestions.length} Questions (Bao gồm các mode thường và Ai Là Triệu Phú).`);

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
      },
      {
        title: "Nhân vật và Kẻ thù của họ",
        type: "Custom",
        difficulty: 2,
        pairs: [
          { left: "Lê Lợi", right: "Chống quân Minh" },
          { left: "Bà Triệu", right: "Chống quân Đông Ngô" },
          { left: "Lê Hoàn", right: "Chống quân Tống" },
          { left: "Ngô Quyền", right: "Chống quân Nam Hán" },
          { left: "Trần Hưng Đạo", right: "Chống quân Mông Nguyên" }
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
      },
      {
        name: "Trần Hưng Đạo",
        aliases: ["Trần Quốc Tuấn", "Quốc công tiết chế", "Đức Thánh Trần"],
        clues: [
          "Quê quán tại hương Tức Mặc, phủ Thiên Trường.",
          "Ông được phong tước Hưng Đạo đại vương.",
          "Ba lần cùng triều đình nhà Trần gian nan chống giặc phương Bắc.",
          "Tác giả của tác phẩm Binh thư yếu lược và Vạn Kiếp tông bí truyền thư.",
          "Tác giả bài Hịch kêu gọi lòng yêu nước của tướng sĩ thiết tha, sâu sắc."
        ],
        difficulty: "easy"
      },
      {
        name: "Ngô Quyền",
        aliases: ["Tiền Ngô Vương"],
        clues: [
          "Ông người thôn Đường Lâm, Ba Vì ngày nay.",
          "Con rể của Dương Đình Nghệ.",
          "Mang quân từ Châu Ái ra Bắc để tiêu diệt phản tặc Kiều Công Tiễn.",
          "Bố trí bãi cọc nhọn bọc sắt dưới cửa sông Bạch Đằng.",
          "Chấm dứt 1000 năm Bắc Thuộc, mở ra kỷ nguyên độc lập lâu dài."
        ],
        difficulty: "easy"
      },
      {
        name: "Lý Thường Kiệt",
        aliases: ["Việt Quốc công"],
        clues: [
          "Ông là tướng lĩnh tài ba bậc nhất triều đại nhà Lý.",
          "Tiến hành chiến lược chủ động tấn công 'Tiên phát chế nhân'.",
          "Chỉ huy đánh tàn phá các thành Ung Châu, Khâm Châu, Liêm Châu.",
          "Xây dựng phòng tuyến kiên cố bên bờ nam sông Như Nguyệt.",
          "Đọc bài thơ 'Nam quốc sơn hà' giữa đêm khuya để khích lệ tướng sĩ."
        ],
        difficulty: "medium"
      },
      {
        name: "Trương Định",
        aliases: ["Trương Công Định", "Bình Tây Đại Nguyên Soái"],
        clues: [
          "Ông quê ở Quảng Ngãi, nhưng theo cha lập nghiệp ở vùng đất Nam Kỳ.",
          "Ban đầu ông theo nghề nông, lập đồn điền lớn ở Gò Công.",
          "Ông tự chiêu mộ nghĩa binh chống lại Pháp ngay khi chúng xâm lược.",
          "Bị triều đình Huế ép bãi binh nhưng ông kháng lệnh cứu nước.",
          "Được nhân dân suy tôn làm Bình Tây Đại Nguyên Soái."
        ],
        difficulty: "medium"
      },
      {
        name: "Nguyễn Trung Trực",
        aliases: ["Nguyễn Văn Lịch", "Quản Chơn"],
        clues: [
          "Sinh ra ở xóm Nghề, thôn Bình Nhựt, phủ Tân An (nay thuộc Long An).",
          "Ông có biệt tài bơi ngao du dưới nước, thường lãnh đạo nghĩa quân thuỷ chiến.",
          "Chỉ huy quân cảm tử thiêu lụi tàu chiến L'Espérance (Hy Vọng).",
          "Bị bắt và hy sinh oanh liệt ở tuổi 30 tại mảnh đất Rạch Giá (Kiên Giang).",
          "Nổi tiếng với câu nói: Bao giờ Tây nhổ hết cỏ nước Nam..."
        ],
        difficulty: "medium"
      }
    ];
    await GuessCharacter.insertMany(guessCharacters);
    console.log("✅ Đã tạo Đoán Nhân Vật.");

    // 5. REVEAL PICTURE
    const revealPictures = [
      {
        imageUrl: "/assets/images/hoang_hoa_tham.png",
        answer: "Hoàng Hoa Thám",
        difficulty: "medium",
        questions: [
          { q: "Quê gốc làng Dị Chế (Hưng Yên) nhưng lập nghiệp ở Bắc Giang. Ông là ai?", a: "Hoàng Hoa Thám" },
          { q: "Từ 1892 đến 1913 ông lãnh đạo cuộc khởi nghĩa nông dân chống Pháp kéo dài gần 30 năm ở đâu?", a: "Yên Thế" },
          { q: "Thực dân Pháp gọi ông là danh xưng gì có từ 'thiêng' ở đầu?", a: "Hùm thiêng Yên Thế" },
          { q: "Ông đã hai lần buộc Pháp giảng hòa vào năm 1894 và năm nào?", a: "1897" },
          { q: "Năm 1908, cuộc khởi nghĩa nào ở Hà Nội có sự cổ vũ của Yên Thế?", a: "Hà Thành đầu độc" },
          { q: "Để sinh tồn, nghĩa quân Yên Thế làm nghề gì trong thời gian giảng hòa?", a: "Làm ruộng" },
          { q: "Cuộc khởi nghĩa Yên Thế thuộc phong trào cứu nước cuối thế kỷ bao nhiêu?", a: "Thế kỷ XIX" },
          { q: "Căn cứ địa nổi tiếng nhất của nghĩa quân ở Yên Thế tên là gì?", a: "Phồn Xương" },
          { q: "Vợ ba của Đề Thám, một nữ tướng tài ba có tên là gì?", a: "Cô Giang" }
        ]
      },
      {
        imageUrl: "/assets/images/tran_hung_dao.png",
        answer: "Trần Hưng Đạo",
        difficulty: "hard",
        questions: [
          { q: "Tên thật của Trần Hưng Đạo là gì?", a: "Trần Quốc Tuấn" },
          { q: "Ông đã lãnh đạo quân đội nhà Trần đánh bại quân đội nào 2 lần?", a: "Mông Nguyên" },
          { q: "Trận thủy chiến lẫy lừng năm 1288 diễn ra trên sông nào?", a: "Bạch Đằng" },
          { q: "Tác phẩm quân sự nổi tiếng ông viết để răn dạy, khích lệ tướng sĩ?", a: "Hịch tướng sĩ" },
          { q: "Câu nói: 'Nếu bệ hạ muốn hàng, xin hãy chém đầu thần trước đã' là nói với ai?", a: "Trần Nhân Tông" },
          { q: "Tước phong cao nhất mà nhà Trần ban cho ông (Quốc công...)?", a: "Tiết chế" },
          { q: "Nhân dân tôn kính gọi ông là đấng thiêng liêng gì?", a: "Đức Thánh Trần" },
          { q: "Trận Vạn Kiếp, Tây Kết... gắn liền với chiến thắng quân Mông Nguyên lần thứ mấy?", a: "Lần 2 (1285)" },
          { q: "Cha của ông là An Sinh Vương tên thật là gì?", a: "Trần Liễu" }
        ]
      },
      {
        imageUrl: "/assets/images/hai_ba_trung.png",
        answer: "Hai Bà Trưng",
        difficulty: "medium",
        questions: [
          { q: "Chị em ruột lãnh đạo cuộc khởi nghĩa năm 40 là ai?", a: "Trưng Trắc, Trưng Nhị" },
          { q: "Khởi nghĩa Hai Bà Trưng nổ ra ở đâu?", a: "Hát Môn" },
          { q: "Thái thú nhà Đông Hán bị Hai Bà Trưng đánh đuổi tên là gì?", a: "Tô Định" },
          { q: "Hai Bà Trưng đóng đô ở vùng đất nào?", a: "Mê Linh" },
          { q: "Câu ca: 'Một xin rửa sạch nước thù/Hai xin dựng lại nghiệp xưa họ...' (Họ gì?)", a: "Hùng" },
          { q: "Vị tướng Đông Hán sang đàn áp khởi nghĩa Hai Bà Trưng năm 42?", a: "Mã Viện" },
          { q: "Con vật được Hai Bà Trưng cưỡi khi ra trận theo truyền thuyết?", a: "Voi" },
          { q: "Khởi nghĩa lật đổ ách thống trị của triều đại phong kiến nào bên Trung Quốc?", a: "Đông Hán" },
          { q: "Đền thờ chính của Hai Bà Trưng hiện nay nằm ở huyện nào của Hà Nội?", a: "Mê Linh" }
        ]
      },
      {
        imageUrl: "/assets/images/nguyen_trai.png",
        answer: "Nguyễn Trãi",
        difficulty: "hard",
        questions: [
          { q: "Nguyễn Trãi là cánh tay đắc lực của vị vua nào trong khởi nghĩa Lam Sơn?", a: "Lê Lợi" },
          { q: "Tác phẩm được coi là Tuyên ngôn độc lập thứ hai của nước ta?", a: "Bình Ngô đại cáo" },
          { q: "Chiến thuật tâm lý đánh vào lòng người do Nguyễn Trãi khởi xướng gọi là gì?", a: "Tâm công" },
          { q: "Vụ án oan nổi tiếng khiến ba đời nhà Nguyễn Trãi bị tru di tên là gì?", a: "Lệ Chi Viên" },
          { q: "Tập danh thơ chữ Nôm nổi tiếng nhất của ông là gì?", a: "Quốc âm thi tập" },
          { q: "Cha của Nguyễn Trãi tên là gì?", a: "Nguyễn Phi Khanh" },
          { q: "Hiệu của Nguyễn Trãi là gì?", a: "Ức Trai" },
          { q: "Khởi nghĩa Lam Sơn đánh đuổi quân xâm lược của triều đại nào?", a: "Nhà Minh" },
          { q: "Tổ chức nào công nhận Nguyễn Trãi là Danh nhân văn hóa thế giới năm 1980?", a: "UNESCO" }
        ]
      },
      {
        imageUrl: "/assets/images/ngo_quyen.png",
        answer: "Ngô Quyền",
        difficulty: "medium",
        questions: [
          { q: "Quê hương của ông ở vùng đất nào (nay thuộc Hà Nội)?", a: "Đường Lâm" },
          { q: "Ông là con rể của vị tướng nào?", a: "Dương Đình Nghệ" },
          { q: "Ông đã lãnh đạo nhân dân đánh bại quân nào năm 938?", a: "Nam Hán" },
          { q: "Trận chiến lịch sử của ông diễn ra trên sông nào?", a: "Bạch Đằng" },
          { q: "Ông đã giết tên phản tặc nào để báo thù cho bố vợ?", a: "Kiều Công Tiễn" },
          { q: "Chiến thuật nổi tiếng của ông ở cửa sông là cắm thứ gì?", a: "Cọc nhọn" },
          { q: "Chủ tướng giặc Nam Hán tử trận dưới tay ông là ai?", a: "Hoằng Tháo" },
          { q: "Ông lên ngôi xưng vương vào năm nào?", a: "939" },
          { q: "Chiến thắng Bạch Đằng của ông đã chấm dứt hơn 1000 năm thời kỳ gì?", a: "Bắc thuộc" }
        ]
      },
      {
        imageUrl: "/assets/images/nguyen_trung_truc.png",
        answer: "Nguyễn Trung Trực",
        difficulty: "hard",
        questions: [
          { q: "Tên thật của vị anh hùng Nguyễn Trung Trực là gì?", a: "Nguyễn Văn Lịch" },
          { q: "Ông đã chỉ huy nghĩa quân đốt cháy tàu chiến nào của Pháp?", a: "Hy Vọng (L'Espérance)" },
          { q: "Trận đốt tàu Pháp của ông diễn ra trên ngã ba sông nào?", a: "Nhật Tảo" },
          { q: "Ông và nghĩa quân đã tập kích đánh chiếm đồn nào năm 1868?", a: "Kiên Giang" },
          { q: "Ông xuất thân từ gia đình làm nghề gì ở xóm Nghề?", a: "Chài lưới" },
          { q: "Ông hy sinh oanh liệt năm 1868 tại đâu?", a: "Rạch Giá" },
          { q: "Thực dân Pháp từng nể phục ông là vị tướng tài ba của chiến thuật gì?", a: "Thuỷ chiến" },
          { q: "Câu nói: 'Bao giờ Tây nhổ hết... nước Nam mới hết người Nam đánh Tây' (Thiếu từ gì?)", a: "Cỏ" },
          { q: "Để cứu nhân dân và mẹ già trước sự tàn độc của giặc, ông đã làm gì?", a: "Nộp mình" }
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
