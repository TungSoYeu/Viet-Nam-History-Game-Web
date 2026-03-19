const mongoose = require('mongoose');
const Question = require('../models/Question');
const Lesson = require('../models/Lesson');
require('dotenv').config({ path: './backend/.env' });

const questionsBatch = [
    // --- VĂN LANG & ÂU LẠC (Remaining 39 to reach 100) ---
    { content: "Người Lạc Việt thường xăm mình để làm gì?", options: ["Làm đẹp", "Tránh thủy quái", "Phân biệt bộ tộc", "Thể hiện sức mạnh"], correctAnswer: "Tránh thủy quái", explanation: "Người Việt cổ xăm mình hình rồng, giao long để không bị thủy quái làm hại khi xuống nước.", difficulty: 2 },
    { content: "Công cụ sản xuất chính của cư dân Văn Lang là gì?", options: ["Đồ đá", "Đồ đồng", "Đồ sắt", "Đồ nhựa"], correctAnswer: "Đồ đồng", explanation: "Thời kỳ này là đỉnh cao của kỹ thuật đúc đồng (Văn hóa Đông Sơn).", difficulty: 1 },
    { content: "Sự tích 'Trầu Cau' ra đời dưới thời kỳ nào?", options: ["Hùng Vương", "An Dương Vương", "Bắc thuộc", "Nhà Lý"], correctAnswer: "Hùng Vương", explanation: "Sự tích giải thích phong tục ăn trầu của người Việt có từ thời vua Hùng.", difficulty: 1 },
    { content: "Vị quan nào giúp việc cho Vua Hùng ở trung ương?", options: ["Lạc hầu", "Lạc tướng", "Bồ chính", "Quan nội thị"], correctAnswer: "Lạc hầu", explanation: "Lạc hầu giúp việc vua ở trung ương, Lạc tướng cai quản các bộ.", difficulty: 2 },
    { content: "Đồ đựng và nấu ăn phổ biến thời Văn Lang là gì?", options: ["Chảo gang", "Nồi đất, thạp đồng", "Nồi áp suất", "Bát sứ"], correctAnswer: "Nồi đất, thạp đồng", explanation: "Cư dân đã biết dùng đất nung và đồng để làm đồ gia dụng.", difficulty: 2 },
    { content: "Người dân Văn Lang ở loại nhà nào?", options: ["Nhà rông", "Nhà sàn", "Nhà ngói", "Nhà hang"], correctAnswer: "Nhà sàn", explanation: "Nhà sàn mái cong hình thuyền hoặc hình mui luyện là đặc trưng.", difficulty: 1 },
    { content: "Cây lương thực chính của cư dân Văn Lang là gì?", options: ["Ngô", "Khoai", "Lúa nước", "Sắn"], correctAnswer: "Lúa nước", explanation: "Lúa nước là nguồn lương thực chính của nền văn minh sông Hồng.", difficulty: 1 },
    { content: "Tục ăn trầu có ý nghĩa gì trong văn hóa Việt?", options: ["Chữa bệnh", "Làm đẹp", "Khởi đầu câu chuyện", "Tăng sức mạnh"], correctAnswer: "Khởi đầu câu chuyện", explanation: "Miếng trầu là đầu câu chuyện, thể hiện sự hiếu khách.", difficulty: 1 },
    { content: "Thục Phán đã thống nhất những bộ tộc nào để lập nước Âu Lạc?", options: ["Âu Việt và Lạc Việt", "Mân Việt và Lạc Việt", "Lạc Việt và Chăm", "Âu Việt và Khơ-me"], correctAnswer: "Âu Việt và Lạc Việt", explanation: "Sau khi thắng quân Tần, Thục Phán thống nhất hai tộc người chính.", difficulty: 1 },
    { content: "Nước Âu Lạc có thành tựu quân sự nổi bật nào?", options: ["Súng thần cơ", "Thành Cổ Loa và Nỏ thần", "Tàu chiến bọc đồng", "Voi chiến"], correctAnswer: "Thành Cổ Loa và Nỏ thần", explanation: "Kiến trúc thành Ốc và vũ khí nỏ liên châu là những phát minh vượt thời đại.", difficulty: 1 },
    { content: "Vì sao gọi là thành 'Cổ Loa'?", options: ["Thành rất cũ", "Thành hình loa", "Thành hình xoáy trôn ốc", "Thành có nhiều loa"], correctAnswer: "Thành hình xoáy trôn ốc", explanation: "Cấu trúc vòng thành xoắn như vỏ ốc nên gọi là Loa thành.", difficulty: 1 },
    { content: "Trọng Thủy là con của ai?", options: ["Lạc Long Quân", "Triệu Đà", "Tần Thủy Hoàng", "An Dương Vương"], correctAnswer: "Triệu Đà", explanation: "Trọng Thủy là con trai của Triệu Đà, vua nước Nam Việt.", difficulty: 1 },
    { content: "Mỵ Châu đã dùng vật gì để đánh dấu đường cho Trọng Thủy?", options: ["Lá cây", "Lông ngỗng", "Cát trắng", "Mảnh sành"], correctAnswer: "Lông ngỗng", explanation: "Mỵ Châu rắc lông ngỗng từ chiếc áo của mình.", difficulty: 1 },
    { content: "Theo truyền thuyết, Mỵ Châu bị vua cha chém ở đâu?", options: ["Trong cung", "Bờ biển", "Trên núi", "Ngoài đồng"], correctAnswer: "Bờ biển", explanation: "An Dương Vương chém Mỵ Châu ở bờ biển Diễn Châu trước khi xuống biển theo Kim Quy.", difficulty: 2 },
    { content: "Hình ảnh phổ biến nhất trên trống đồng là gì?", options: ["Mặt trời", "Hình người nhảy múa", "Chim lạc", "Tất cả các đáp án trên"], correctAnswer: "Tất cả các đáp án trên", explanation: "Trống đồng khắc họa sinh động đời sống và niềm tin tâm linh.", difficulty: 2 },
    { content: "Thời kỳ Văn Lang kết thúc vào năm nào?", options: ["258 TCN", "179 TCN", "111 TCN", "40"], correctAnswer: "258 TCN", explanation: "Năm 258 TCN là mốc chuyển giao từ Văn Lang sang Âu Lạc (theo sử cũ).", difficulty: 3 },
    { content: "Bồ chính đứng đầu đơn vị nào?", options: ["Bộ", "Quận", "Chiềng, chạ", "Huyện"], correctAnswer: "Chiềng, chạ", explanation: "Bồ chính là người đứng đầu làng xã thời bấy giờ.", difficulty: 3 },
    { content: "Người dân Văn Lang thường dùng phương tiện giao thông gì?", options: ["Xe ngựa", "Thuyền", "Voi", "Cưỡi hổ"], correctAnswer: "Thuyền", explanation: "Giao thông đường thủy rất phát triển do hệ thống sông ngòi dày đặc.", difficulty: 2 },
    { content: "Nỏ thần của An Dương Vương do ai chế tạo?", options: ["An Dương Vương", "Cao Lỗ", "Lý Ông Trọng", "Yết Kiêu"], correctAnswer: "Cao Lỗ", explanation: "Cao Lỗ là vị tướng tài năng về kỹ thuật quân sự.", difficulty: 2 },
    { content: "An Dương Vương chọn nơi nào để xây thành?", options: ["Sóc Sơn", "Đông Anh", "Ba Vì", "Hoa Lư"], correctAnswer: "Đông Anh", explanation: "Cổ Loa thuộc huyện Đông Anh, Hà Nội ngày nay.", difficulty: 1 },

    // --- THỜI BẮC THUỘC (Selected 20 samples to start) ---
    { content: "Cuộc khởi nghĩa đầu tiên chống lại ách đô hộ phương Bắc là gì?", options: ["Khởi nghĩa Hai Bà Trưng", "Khởi nghĩa Lý Bí", "Khởi nghĩa Bà Triệu", "Khởi nghĩa Ngô Quyền"], correctAnswer: "Khởi nghĩa Hai Bà Trưng", explanation: "Năm 40, Hai Bà Trưng phất cờ khởi nghĩa tại Hát Môn.", difficulty: 1 },
    { content: "Hai Bà Trưng quê ở đâu?", options: ["Mê Linh", "Phong Châu", "Cổ Loa", "Luy Lâu"], correctAnswer: "Mê Linh", explanation: "Trưng Trắc và Trưng Nhị là con gái Lạc tướng Mê Linh.", difficulty: 1 },
    { content: "Chồng bà Trưng Trắc là ai?", options: ["Thi Sách", "Trần Bình Trọng", "Lý Nam Đế", "Cao Lỗ"], correctAnswer: "Thi Sách", explanation: "Thi Sách bị thái thú Tô Định giết hại, là ngòi nổ cho cuộc khởi nghĩa.", difficulty: 1 },
    { content: "Bà Triệu lãnh đạo khởi nghĩa chống quân nào?", options: ["Quân Hán", "Quân Ngô", "Quân Lương", "Quân Tống"], correctAnswer: "Quân Ngô", explanation: "Bà Triệu khởi nghĩa năm 248 chống quân Đông Ngô.", difficulty: 2 },
    { content: "Câu nói: 'Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ' là của ai?", options: ["Trưng Trắc", "Bà Triệu", "Lý Chiêu Hoàng", "Thái hậu Dương Vân Nga"], correctAnswer: "Bà Triệu", explanation: "Đây là tuyên ngôn hào hùng về ý chí độc lập của bà.", difficulty: 1 },
    { content: "Lý Bí lập ra nhà nước nào?", options: ["Vạn Xuân", "Đại Việt", "Đại Nam", "Việt Nam"], correctAnswer: "Vạn Xuân", explanation: "Năm 544, Lý Bí lên ngôi Hoàng đế (Lý Nam Đế), đặt tên nước là Vạn Xuân.", difficulty: 1 },
    { content: "Vị tướng nào được mệnh danh là 'Dạ Trạch Vương'?", options: ["Lý Bí", "Triệu Quang Phục", "Mai Thúc Loan", "Phùng Hưng"], correctAnswer: "Triệu Quang Phục", explanation: "Ông dùng chiến thuật du kích tại đầm Dạ Trạch chống quân Lương.", difficulty: 2 },
    { content: "Mai Thúc Loan còn được gọi là gì?", options: ["Mai Nam Đế", "Mai Hắc Đế", "Mai Đại Đế", "Mai Vương"], correctAnswer: "Mai Hắc Đế", explanation: "Ông khởi nghĩa chống quân Đường, có nước da đen nên gọi là Hắc Đế.", difficulty: 2 },
    { content: "Cuộc khởi nghĩa Phùng Hưng diễn ra vào triều đại phương Bắc nào?", options: ["Nhà Hán", "Nhà Đường", "Nhà Tống", "Nhà Ngô"], correctAnswer: "Nhà Đường", explanation: "Phùng Hưng khởi nghĩa chống lại sự đô hộ của nhà Đường.", difficulty: 2 },
    { content: "Phùng Hưng được nhân dân tôn xưng là gì?", options: ["Bố Cái Đại Vương", "Vạn Thắng Vương", "Bình Tây Đại Nguyên Soái", "Lý Nam Đế"], correctAnswer: "Bố Cái Đại Vương", explanation: "Bố Cái có nghĩa là Cha Mẹ, thể hiện sự kính trọng của nhân dân.", difficulty: 1 },
    { content: "Khúc Thừa Dụ đã giành quyền tự chủ bằng chức danh gì?", options: ["Hoàng đế", "Tiết độ sứ", "Vua", "Thái thú"], correctAnswer: "Tiết độ sứ", explanation: "Năm 905, ông tự xưng là Tiết độ sứ, mở đầu thời kỳ tự chủ.", difficulty: 3 },
    { content: "Chính sách cai trị thâm hiểm nhất của các triều đại phương Bắc là gì?", options: ["Thuế nặng", "Bóc lột lâm sản", "Đồng hóa văn hóa", "Bắt lính"], correctAnswer: "Đồng hóa văn hóa", explanation: "Họ muốn biến người Việt thành người Hán để xóa bỏ dân tộc ta.", difficulty: 2 },
    { content: "Vị thái thú nào nổi tiếng tàn bạo, dẫn đến khởi nghĩa Hai Bà Trưng?", options: ["Sĩ Nhiếp", "Tô Định", "Mã Viện", "Cao Biền"], correctAnswer: "Tô Định", explanation: "Tô Định tham lam, tàn bạo khiến nhân dân căm phẫn.", difficulty: 1 },
    { content: "Hai Bà Trưng tự vẫn tại dòng sông nào?", options: ["Sông Hồng", "Sông Đáy", "Sông Hát", "Sông Bạch Đằng"], correctAnswer: "Sông Hát", explanation: "Hai Bà đã gieo mình xuống sông Hát sau khi thất bại trước Mã Viện.", difficulty: 2 },
    { content: "Lý Nam Đế đặt kinh đô ở đâu?", options: ["Hoa Lư", "Cửa sông Tô Lịch", "Thăng Long", "Huế"], correctAnswer: "Cửa sông Tô Lịch", explanation: "Ông dựng thành lũy và đóng đô ở cửa sông Tô Lịch (Hà Nội).", difficulty: 3 },
    { content: "Triệu Quang Phục đánh bại quân xâm lược nào?", options: ["Quân Lương", "Quân Tống", "Quân Minh", "Quân Hán"], correctAnswer: "Quân Lương", explanation: "Ông kế tục Lý Nam Đế đánh tan quân Lương năm 550.", difficulty: 2 },
    { content: "Mai Hắc Đế chọn căn cứ ở đâu?", options: ["Núi Ba Vì", "Sa Nam (Nghệ An)", "Yên Thế", "Cố Đô"], correctAnswer: "Sa Nam (Nghệ An)", explanation: "Khởi nghĩa Mai Thúc Loan bùng nổ ở vùng Hoan Châu (Nghệ An).", difficulty: 3 },
    { content: "Người anh hùng nào lãnh đạo khởi nghĩa đánh chiếm thành Tống Bình năm 791?", options: ["Phùng Hưng", "Mai Thúc Loan", "Khúc Thừa Dụ", "Dương Diên Nghệ"], correctAnswer: "Phùng Hưng", explanation: "Phùng Hưng bao vây và chiếm thành Tống Bình từ tay quan đô hộ nhà Đường.", difficulty: 3 },
    { content: "Khúc Thừa Dụ tận dụng thời cơ nào để giành quyền tự chủ?", options: ["Nhà Đường suy yếu", "Nhà Hán sụp đổ", "Giặc Nguyên Mông xâm lược", "Bắc triều nội chiến"], correctAnswer: "Nhà Đường suy yếu", explanation: "Cuối thế kỷ IX, nhà Đường lâm vào cảnh loạn lạc.", difficulty: 3 },
    { content: "Dương Diên Nghệ đã đánh bại quân nào năm 931?", options: ["Quân Nam Hán", "Quân Hán", "Quân Tống", "Quân Ngô"], correctAnswer: "Quân Nam Hán", explanation: "Ông quét sạch quân Nam Hán khỏi thành Đại La, tiếp tục nền tự chủ.", difficulty: 3 }
];

const seedPart = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const vlLesson = await Lesson.findOne({ title: /Văn Lang/ });
        const btLesson = await Lesson.findOne({ title: /Bắc Thuộc/ });

        const vlQuestions = questionsBatch.slice(0, 20).map(q => ({ ...q, lessonId: vlLesson._id }));
        const btQuestions = questionsBatch.slice(20, 40).map(q => ({ ...q, lessonId: btLesson._id }));

        await Question.insertMany([...vlQuestions, ...btQuestions]);
        console.log(`✅ Đã nạp thêm: 20 câu Văn Lang, 20 câu Bắc Thuộc.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedPart();
