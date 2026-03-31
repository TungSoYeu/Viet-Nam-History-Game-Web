const mongoose = require('mongoose');
const Question = require('../models/Question');
const Lesson = require('../models/Lesson');
require('dotenv').config({ path: './backend/.env' });

const questionsBatch1 = [
    { content: "Nhà nước đầu tiên của người Việt có tên là gì?", options: ["Văn Lang", "Âu Lạc", "Đại Việt", "Vạn Xuân"], correctAnswer: "Văn Lang", explanation: "Văn Lang là nhà nước đầu tiên của người Việt, do Hùng Vương đứng đầu.", difficulty: 1 },
    { content: "Kinh đô của nước Văn Lang đặt tại đâu?", options: ["Phong Châu", "Cổ Loa", "Hoa Lư", "Thăng Long"], correctAnswer: "Phong Châu", explanation: "Vua Hùng đóng đô ở Phong Châu (nay thuộc Phú Thọ).", difficulty: 1 },
    { content: "Đứng đầu nhà nước Văn Lang là ai?", options: ["Hùng Vương", "An Dương Vương", "Lạc Long Quân", "Kinh Dương Vương"], correctAnswer: "Hùng Vương", explanation: "Người đứng đầu nhà nước Văn Lang là Hùng Vương.", difficulty: 1 },
    { content: "Chức quan đứng đầu các bộ trong nước Văn Lang gọi là gì?", options: ["Lạc hầu", "Lạc tướng", "Bồ chính", "Thái thú"], correctAnswer: "Lạc tướng", explanation: "Lạc tướng đứng đầu các bộ, Lạc hầu giúp việc vua.", difficulty: 2 },
    { content: "Người dân Văn Lang chủ yếu làm nghề gì?", options: ["Săn bắn", "Trồng lúa nước", "Buôn bán", "Thủ công nghiệp"], correctAnswer: "Trồng lúa nước", explanation: "Cư dân Văn Lang chủ yếu làm nghề nông trồng lúa nước.", difficulty: 1 },
    { content: "Truyền thuyết nào nói về việc chống giặc ngoại xâm của người Việt cổ?", options: ["Thánh Gióng", "Sơn Tinh Thủy Tinh", "Sự tích Trầu Cau", "Thạch Sanh"], correctAnswer: "Thánh Gióng", explanation: "Thánh Gióng tượng trưng cho sức mạnh chống giặc Ân của người Việt.", difficulty: 1 },
    { content: "Loại nhạc cụ tiêu biểu nhất của thời kỳ Văn Lang là gì?", options: ["Đàn tranh", "Đàn bầu", "Trống đồng", "Sáo trúc"], correctAnswer: "Trống đồng", explanation: "Trống đồng Đông Sơn là biểu tượng văn hóa rực rỡ thời kỳ này.", difficulty: 1 },
    { content: "Nghề thủ công nào rất phát triển thời Văn Lang - Âu Lạc?", options: ["Dệt lụa", "Đúc đồng", "Làm gốm", "Chạm khắc đá"], correctAnswer: "Đúc đồng", explanation: "Kỹ thuật đúc đồng đạt trình độ cao, tiêu biểu là trống đồng.", difficulty: 2 },
    { content: "Ai là người thay thế Hùng Vương cai quản đất nước?", options: ["Thục Phán", "Triệu Đà", "Lý Bí", "Ngô Quyền"], correctAnswer: "Thục Phán", explanation: "Thục Phán đánh bại vua Hùng cuối cùng, lập ra nước Âu Lạc.", difficulty: 1 },
    { content: "An Dương Vương đổi tên nước từ Văn Lang thành gì?", options: ["Đại Cồ Việt", "Âu Lạc", "Vạn Xuân", "Đại Nam"], correctAnswer: "Âu Lạc", explanation: "Năm 257 TCN, Thục Phán lập nước Âu Lạc.", difficulty: 1 },
    { content: "Thành Cổ Loa có bao nhiêu vòng thành?", options: ["1 vòng", "2 vòng", "3 vòng", "4 vòng"], correctAnswer: "3 vòng", explanation: "Thành Cổ Loa được xây dựng với 3 vòng xoáy trôn ốc.", difficulty: 2 },
    { content: "Vũ khí đặc biệt của quân đội An Dương Vương là gì?", options: ["Gươm báu", "Nỏ thần", "Giáp sắt", "Súng hỏa mai"], correctAnswer: "Nỏ thần", explanation: "Nỏ thần (Linh Quang Kim Trảo Thần Nỏ) có thể bắn nhiều mũi tên một lúc.", difficulty: 1 },
    { content: "Câu chuyện 'Mỵ Châu - Trọng Thủy' gắn liền với sự kiện nào?", options: ["Khởi nghĩa Hai Bà Trưng", "Thất bại của Âu Lạc", "Sự tích Bánh Chưng", "Thánh Gióng"], correctAnswer: "Thất bại của Âu Lạc", explanation: "Câu chuyện giải thích nguyên nhân mất nước Âu Lạc vào tay Triệu Đà.", difficulty: 1 },
    { content: "Nước Âu Lạc rơi vào tay Triệu Đà vào năm nào?", options: ["111 TCN", "179 TCN", "208 TCN", "40"], correctAnswer: "179 TCN", explanation: "Năm 179 TCN, Âu Lạc bị Triệu Đà xâm lược.", difficulty: 2 },
    { content: "Thời kỳ Văn Lang có bao nhiêu đời vua Hùng?", options: ["10 đời", "15 đời", "18 đời", "20 đời"], correctAnswer: "18 đời", explanation: "Sử sách chép lại có 18 đời vua Hùng Vương.", difficulty: 1 },
    { content: "Dưới thời Hùng Vương, người dân thường mặc gì?", options: ["Áo dài", "Đóng khố", "Mặc comple", "Áo yếm"], correctAnswer: "Đóng khố", explanation: "Nam đóng khố, nữ mặc váy là trang phục phổ biến thời Văn Lang.", difficulty: 1 },
    { content: "Lễ hội tiêu biểu nhất để nhớ ơn các vua Hùng là gì?", options: ["Lễ hội Gióng", "Giỗ Tổ Hùng Vương", "Hội Lim", "Lễ hội Chùa Hương"], correctAnswer: "Giỗ Tổ Hùng Vương", explanation: "Giỗ Tổ Hùng Vương diễn ra vào mùng 10 tháng 3 âm lịch.", difficulty: 1 },
    { content: "Vật tổ của cư dân Văn Lang thường được khắc trên trống đồng là gì?", options: ["Con Rồng", "Con Chim Lạc", "Con Hổ", "Con Voi"], correctAnswer: "Con Chim Lạc", explanation: "Chim Lạc là hình tượng vật tổ phổ biến trên trống đồng Đông Sơn.", difficulty: 1 },
    { content: "Tầng lớp thấp nhất trong xã hội Văn Lang là ai?", options: ["Nô tỳ", "Dân tự do", "Bồ chính", "Lạc tướng"], correctAnswer: "Nô tỳ", explanation: "Nô tỳ là tầng lớp dưới cùng, phục vụ trong các gia đình quý tộc.", difficulty: 2 },
    { content: "An Dương Vương thuộc tộc người nào?", options: ["Lạc Việt", "Âu Việt", "Chăm", "Khmer"], correctAnswer: "Âu Việt", explanation: "Thục Phán là thủ lĩnh của tộc người Âu Việt ở phía Bắc.", difficulty: 2 },
    { content: "Thành Cổ Loa ngày nay thuộc huyện nào của Hà Nội?", options: ["Gia Lâm", "Đông Anh", "Sóc Sơn", "Mê Linh"], correctAnswer: "Đông Anh", explanation: "Di tích Cổ Loa thuộc xã Cổ Loa, huyện Đông Anh.", difficulty: 2 },
    { content: "Món ăn nào gắn liền với sự tích Lang Liêu?", options: ["Bánh đậu xanh", "Bánh chưng", "Bánh phu thê", "Bánh cáy"], correctAnswer: "Bánh chưng", explanation: "Lang Liêu đã tạo ra bánh chưng và bánh giầy.", difficulty: 1 },
    { content: "Sơn Tinh là vị thần cai quản vùng núi nào?", options: ["Núi Ba Vì", "Núi Fansipan", "Núi Yên Tử", "Núi Tam Đảo"], correctAnswer: "Núi Ba Vì", explanation: "Sơn Tinh là Tản Viên Sơn Thánh, cai quản núi Ba Vì.", difficulty: 1 },
    { content: "Chữ viết của người Việt cổ thời này được cho là gì?", options: ["Chữ Nôm", "Chữ Hán", "Chữ Khoa Đẩu", "Chữ Quốc Ngữ"], correctAnswer: "Chữ Khoa Đẩu", explanation: "Một số giả thuyết cho rằng người Việt cổ có chữ viết hình nòng nọc (Khoa Đẩu).", difficulty: 3 },
    { content: "Kỹ thuật luyện kim thời Đông Sơn chủ yếu là gì?", options: ["Luyện sắt", "Luyện đồng", "Luyện vàng", "Luyện bạc"], correctAnswer: "Luyện đồng", explanation: "Văn hóa Đông Sơn nổi tiếng với kỹ thuật đúc đồng tinh xảo.", difficulty: 2 },
    { content: "Hình ảnh ngôi nhà phổ biến thời Văn Lang là gì?", options: ["Nhà tầng", "Nhà sàn", "Nhà đất", "Nhà tranh"], correctAnswer: "Nhà sàn", explanation: "Để tránh thú dữ và ẩm thấp, người dân thường ở nhà sàn.", difficulty: 1 },
    { content: "Tại sao An Dương Vương thua Triệu Đà?", options: ["Quân yếu", "Mất nỏ thần", "Bị phản bội", "Hết lương thực"], correctAnswer: "Mất nỏ thần", explanation: "Do chủ quan và mất nỏ thần nên An Dương Vương thất bại.", difficulty: 1 },
    { content: "Sự kiện Triệu Đà chiếm Âu Lạc mở đầu cho thời kỳ nào?", options: ["Bắc thuộc", "Tự chủ", "Phong kiến", "Cộng hòa"], correctAnswer: "Bắc thuộc", explanation: "Đây là khởi đầu của hơn 1000 năm Bắc thuộc.", difficulty: 1 },
    { content: "Vị vua cuối cùng của triều đại Hùng Vương là đời thứ mấy?", options: ["16", "17", "18", "19"], correctAnswer: "18", explanation: "Hùng Vương thứ 18 là vị vua cuối cùng của nước Văn Lang.", difficulty: 1 },
    { content: "Lạc Long Quân có nguồn gốc từ đâu?", options: ["Trên trời", "Dưới biển", "Trong hang", "Từ rừng"], correctAnswer: "Dưới biển", explanation: "Lạc Long Quân là con của Sùng Lãm, nguồn gốc từ loài Rồng dưới nước.", difficulty: 2 },
    { content: "Âu Cơ có nguồn gốc từ đâu?", options: ["Dưới nước", "Trên núi", "Trong mây", "Dưới đất"], correctAnswer: "Trên núi", explanation: "Âu Cơ là dòng dõi tiên trên núi.", difficulty: 2 },
    { content: "Thục Phán đã đánh bại bộ tộc nào để lên ngôi?", options: ["Giặc Ân", "Giặc Tần", "Giặc Minh", "Giặc Nguyên"], correctAnswer: "Giặc Tần", explanation: "Thục Phán lãnh đạo cuộc kháng chiến chống quân Tần xâm lược.", difficulty: 3 },
    { content: "Tên hiệu của Thục Phán sau khi lên ngôi là gì?", options: ["Bắc Đẩu", "An Dương Vương", "Lý Nam Đế", "Mai Hắc Đế"], correctAnswer: "An Dương Vương", explanation: "An Dương Vương là tên hiệu của Thục Phán.", difficulty: 1 },
    { content: "Trống đồng Ngọc Lũ thuộc nền văn hóa nào?", options: ["Văn hóa Sa Huỳnh", "Văn hóa Đông Sơn", "Văn hóa Hòa Bình", "Văn hóa Óc Eo"], correctAnswer: "Văn hóa Đông Sơn", explanation: "Trống đồng Ngọc Lũ là báu vật của văn hóa Đông Sơn.", difficulty: 2 },
    { content: "Tên gọi Âu Lạc là sự kết hợp của hai bộ tộc nào?", options: ["Âu Việt và Lạc Việt", "Âu Việt và Mân Việt", "Lạc Việt và Điền Việt", "Chăm và Việt"], correctAnswer: "Âu Việt và Lạc Việt", explanation: "Âu Lạc ghép từ tên của hai bộ tộc Âu Việt và Lạc Việt.", difficulty: 1 },
    { content: "Đồ uống phổ biến của người Văn Lang là gì?", options: ["Rượu gạo", "Nước chè", "Nước vối", "Nước dừa"], correctAnswer: "Rượu gạo", explanation: "Người Văn Lang đã biết dùng gạo để nấu rượu.", difficulty: 2 },
    { content: "Phong tục nhuộm răng đen có từ thời kỳ nào?", options: ["Văn Lang", "Nhà Trần", "Nhà Lê", "Nhà Nguyễn"], correctAnswer: "Văn Lang", explanation: "Tục nhuộm răng, ăn trầu có từ thời Hùng Vương.", difficulty: 2 },
    { content: "Vua Hùng chọn người nối ngôi dựa trên tiêu chí nào trong sự tích Lang Liêu?", options: ["Sức mạnh", "Sự giàu sang", "Lòng hiếu thảo và tài năng", "Sắc đẹp"], correctAnswer: "Lòng hiếu thảo và tài năng", explanation: "Lang Liêu được chọn vì tấm lòng hướng về tổ tiên và sự sáng tạo.", difficulty: 1 },
    { content: "Địa danh nào gắn liền với truyền thuyết Thánh Gióng?", options: ["Làng Sen", "Làng Phù Đổng", "Làng Vân", "Làng Ước Lễ"], correctAnswer: "Làng Phù Đổng", explanation: "Thánh Gióng còn được gọi là Phù Đổng Thiên Vương.", difficulty: 1 },
    { content: "Thánh Gióng bay về trời từ đỉnh núi nào?", options: ["Núi Ba Vì", "Núi Sóc", "Núi Yên Tử", "Núi Hồng Lĩnh"], correctAnswer: "Núi Sóc", explanation: "Gióng bay về trời sau khi đánh tan giặc tại núi Sóc (Sóc Sơn).", difficulty: 2 },
    { content: "Cây gậy của Thánh Gióng làm bằng gì?", options: ["Đồng", "Sắt", "Tre", "Gỗ"], correctAnswer: "Sắt", explanation: "Gióng yêu cầu vua đúc gậy sắt, ngựa sắt, giáp sắt.", difficulty: 1 },
    { content: "Khi gậy sắt gãy, Thánh Gióng dùng gì để đánh giặc?", options: ["Tay không", "Đá núi", "Tre ngà", "Sóng nước"], correctAnswer: "Tre ngà", explanation: "Gióng đã nhổ những cụm tre bên đường để tiếp tục chiến đấu.", difficulty: 1 },
    { content: "Mai An Tiêm gắn liền với sự tích loại quả nào?", options: ["Quả khế", "Quả dưa hấu", "Quả dừa", "Quả cam"], correctAnswer: "Quả dưa hấu", explanation: "Mai An Tiêm là người tìm ra và trồng giống dưa hấu trên đảo hoang.", difficulty: 1 },
    { content: "Mai An Tiêm bị đày ra đảo nào?", options: ["Đảo Phú Quốc", "Đảo Cồn Cỏ", "Đảo Nga Sơn", "Đảo Lý Sơn"], correctAnswer: "Đảo Nga Sơn", explanation: "Theo truyền thuyết, ông bị đày ra vùng ven biển nay thuộc Nga Sơn, Thanh Hóa.", difficulty: 3 },
    { content: "Chữ 'Văn' trong Văn Lang có nghĩa là gì theo một số giải thích?", options: ["Văn học", "Người xăm mình", "Vẻ đẹp", "Văn minh"], correctAnswer: "Người xăm mình", explanation: "Tục xăm mình phổ biến để tránh thủy quái, 'Văn' có thể chỉ những hình xăm.", difficulty: 3 },
    { content: "Tổ chức xã hội thời Văn Lang dựa trên đơn vị nào?", options: ["Làng bộ", "Công xã thị tộc", "Tỉnh", "Quận"], correctAnswer: "Công xã thị tộc", explanation: "Xã hội Văn Lang vẫn mang đậm dấu ấn của công xã thị tộc.", difficulty: 2 },
    { content: "Ai là người trực tiếp thu thuế và cai quản việc chung ở các chiềng, chạ?", options: ["Lạc hầu", "Lạc tướng", "Bồ chính", "Nô tỳ"], correctAnswer: "Bồ chính", explanation: "Bồ chính là người đứng đầu các chiềng, chạ (làng).", difficulty: 2 },
    { content: "Triệu Đà là người nước nào?", options: ["Nước Việt", "Nước Tần", "Nước Nam Hán", "Nước Hán"], correctAnswer: "Nước Tần", explanation: "Triệu Đà vốn là một tướng của nhà Tần (Trung Quốc).", difficulty: 2 },
    { content: "Thành Cổ Loa còn có tên gọi khác là gì?", options: ["Thành Ốc", "Thành Rồng", "Thành Phượng Hoàng", "Thành Hoa Lư"], correctAnswer: "Thành Ốc", explanation: "Do kiến trúc xoắn trôn ốc nên gọi là Thành Ốc.", difficulty: 1 },
    { content: "Đâu là tên một bộ trong 15 bộ của nước Văn Lang?", options: ["Giao Chỉ", "Mê Linh", "Quận Huyện", "Thanh Nghệ"], correctAnswer: "Giao Chỉ", explanation: "Giao Chỉ là một bộ lớn của nước Văn Lang.", difficulty: 3 }
];

const seedBatch = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const lesson = await Lesson.findOne({ title: /Văn Lang/ });
        if (!lesson) throw new Error("Không tìm thấy bài học Văn Lang");

        const data = questionsBatch1.map(q => ({ ...q, lessonId: lesson._id }));
        await Question.insertMany(data);
        console.log(`✅ Đã nạp thêm ${data.length} câu cho Văn Lang & Âu Lạc`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedBatch();
