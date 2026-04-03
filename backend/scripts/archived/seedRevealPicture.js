const mongoose = require('mongoose');
const RevealPicture = require('../models/RevealPicture');
require('dotenv').config({ path: __dirname + '/../.env' }); // Load dot env from backend

const URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/history_game';

const seedData = async () => {
    try {
        await mongoose.connect(URI);
        console.log("Connected to MongoDB for RevealPicture seeding");

        // Clear existing games to replace broken original images
        await RevealPicture.deleteMany({});
        
        const pictures = [
            {
                imageUrl: "/assets/images/bach_dang_river_battle_1774158850773.png",
                answer: "Trận Bạch Đằng",
                difficulty: "easy",
                questions: [
                    { q: "Trận chiến lịch sử này diễn ra trên con sông nào?", a: "Bạch Đằng" },
                    { q: "Ai là người trực tiếp lãnh đạo và chỉ huy trận đánh này vào năm 938?", a: "Ngô Quyền" },
                    { q: "Kẻ thù của quân đội ta trong trận đánh này là triều đại nào?", a: "Nam Hán" },
                    { q: "Chiến thuật đặc biệt được quân ta sử dụng dưới đáy sông ngầm là gì?", a: "Cọc gỗ bọc sắt" },
                    { q: "Viên tướng chỉ huy thủy quân của giặc tử trận tên là gì?", a: "Hoằng Tháo" },
                    { q: "Trận thắng này đã chấm dứt ách đô hộ bao nhiêu năm của phương Bắc?", a: "1000 năm" },
                    { q: "Tại sao quân địch không nhìn thấy bãi cọc khi tiến vào cửa sông?", a: "Thủy triều lên" },
                    { q: "Ngô Quyền đã xưng vương vào năm nào sau thắng lợi vẻ vang này?", a: "Năm 939" },
                    { q: "Sự kiện lịch sử này mở ra thời đại nào cho dân tộc ta?", a: "Thời kỳ độc lập tự chủ" }
                ]
            },
            {
                imageUrl: "/assets/images/ly_thai_to_thang_long_1774158867366.png",
                answer: "Dời đô về Thăng Long",
                difficulty: "medium",
                questions: [
                    { q: "Vị vua nào đã ban hành chiếu chỉ quyết định việc dời đô?", a: "Lý Thái Tổ" },
                    { q: "Sự kiện lịch sử trọng đại này diễn ra vào năm nào?", a: "Năm 1010" },
                    { q: "Tên kinh đô mới được vua Lý Thái Tổ chọn là gì?", a: "Thăng Long" },
                    { q: "Đại La là tên cũ của địa danh nào trước khi được chọn làm kinh đô?", a: "Hà Nội" },
                    { q: "Tương truyền, khi thuyền rồng cập bến, Vua trông thấy hiện tượng dị thường gì bay lên?", a: "Rồng vàng" },
                    { q: "Văn bản lịch sử công bố rộng rãi việc dời đô tên là gì?", a: "Thiên đô chiếu" },
                    { q: "Triều đại nào đã đóng đô ở Hoa Lư trước khi Lý Thái Tổ chuyển dời?", a: "Nhà Tiền Lê" },
                    { q: "Cố đô Hoa Lư uy nghi cổ kính xưa thuộc tỉnh nào hiện nay?", a: "Ninh Bình" },
                    { q: "Kinh đô mới được gọi với ý nghĩa tốt lành sâu sắc gì?", a: "Khát vọng rồng bay" }
                ]
            },
            {
                imageUrl: "/assets/images/matching_le_loi_1774160648244.png",
                answer: "Lê Lợi",
                difficulty: "easy",
                questions: [
                    { q: "Vị anh hùng dân tộc này là người khởi xướng cuộc khởi nghĩa nào?", a: "Khởi nghĩa Lam Sơn" },
                    { q: "Kẻ thù mà ngài đã đánh bại để giành lại độc lập là triều đại nào?", a: "Nhà Minh" },
                    { q: "Tên thanh gươm thần huyền thoại gắn liền với sự tích trả gươm của ngài là gì?", a: "Thuận Thiên" },
                    { q: "Hồ nước thiêng ở thủ đô Hà Nội nơi ngài hoàn trả biểu tượng của thần kim quy tên gì?", a: "Hồ Gươm" },
                    { q: "Ai là vị quân sư lỗi lạc, tác giả của 'Bình Ngô Đại Cáo' đã phò tá ngài?", a: "Nguyễn Trãi" },
                    { q: "Hội thề lịch sử nào đã gắn kết ngài và các tướng sĩ thành anh em ruột thịt?", a: "Hội thề Lũng Nhai" },
                    { q: "Trận đánh quyết định nào đã chém rơi đầu Liễu Thăng, tiêu diệt viện binh địch?", a: "Chi Lăng" },
                    { q: "Sau khi lên ngôi hoàng đế, ngài lấy niên hiệu là gì?", a: "Lê Thái Tổ" },
                    { q: "Triều đại huy hoàng do ngài sáng lập được gọi là gì trong sử sách?", a: "Hậu Lê" }
                ]
            },
            {
                imageUrl: "/assets/images/matching_ly_thuong_kiet_1774160614363.png",
                answer: "Lý Thường Kiệt",
                difficulty: "medium",
                questions: [
                    { q: "Vị danh tướng này là tổng chỉ huy quân đội của triều đại nào?", a: "Nhà Lý" },
                    { q: "Năm 1077, ngài đã đánh tan quân xâm lược nào trên phòng tuyến tiền tiêu?", a: "Quân Tống" },
                    { q: "Tên dòng sông huyền thoại nơi ngài lập phòng tuyến chặn giặc là gì?", a: "Sông Như Nguyệt" },
                    { q: "Nơi này hiện nay tương ứng với dòng sông nào ở miền Bắc?", a: "Sông Cầu" },
                    { q: "Bài thơ thần nổi tiếng nào được vang lên trong đêm tối để cổ vũ tinh thần quân sĩ?", a: "Nam Quốc Sơn Hà" },
                    { q: "Bài thơ này được giới sử học đánh giá có ý nghĩa như văn kiện gì?", a: "Bản tuyên ngôn độc lập" },
                    { q: "Chiến thuật đánh đòn phủ đầu sang đất giặc gọi là gì?", a: "Tiên phát chế nhân" },
                    { q: "Thành trì nào của địch bị quân ta hạ gục nhanh chóng trong đợt tấn công ấy?", a: "Thành Ung Châu" },
                    { q: "Ông đã dùng loại địa hình nào dăng bãi cọc kết hợp rào tre để phòng thủ dọc bờ sông?", a: "Chiến hào" }
                ]
            },
            {
                imageUrl: "/assets/images/matching_ngo_quyen_1774160599192.png",
                answer: "Duyệt binh Bạch Đằng",
                difficulty: "hard",
                questions: [
                    { q: "Trùng tên với trận đánh nổi tiếng, sự kiện này đánh dấu sự kết thúc của thời kỳ nào?", a: "Bắc thuộc" },
                    { q: "Cha vợ của vị anh hùng này, vốn là một Tiết độ sứ tự chủ của người Việt, tên là gì?", a: "Dương Đình Nghệ" },
                    { q: "Kẻ phản trắc nào đã sát hại cha vợ của ông để cướp quyền?", a: "Kiều Công Tiễn" },
                    { q: "Thế trận bãi cọc ngầm được đóng ở khu vực nào của lòng sông Bạch Đằng?", a: "Cửa biển" },
                    { q: "Lý do quân địch tiến sâu vào trận địa cọc là do bị lực lượng nào giả vờ thua dụ vào?", a: "Thuyền nhỏ" },
                    { q: "Đúng lúc nào trong ngày thì thuyền giặc bị vướng và thủng bởi các cọc nhọn?", a: "Thủy triều rút" },
                    { q: "Sau khi lập chiến công hiển hách, ngài định đô ở vùng đất cổ xưa nào?", a: "Cổ Loa" },
                    { q: "Ông trị vì đất nước với tư cách một vị vua trong thời gian bao lâu?", a: "6 năm" },
                    { q: "Tên thường gọi tắt của triều đại do ông mở ra là gì?", a: "Nhà Ngô" }
                ]
            },
            {
                imageUrl: "/assets/images/matching_tran_hung_dao_1774160632285.png",
                answer: "Trần Hưng Đạo",
                difficulty: "easy",
                questions: [
                    { q: "Vị anh hùng vĩ đại này là Quốc công tiết chế của triều đại nào?", a: "Nhà Trần" },
                    { q: "Tên thật của Hưng Đạo Đại Vương là gì?", a: "Trần Quốc Tuấn" },
                    { q: "Ngài đã lãnh đạo quân dân Đại Việt đánh thắng đế quốc xâm lược nào?", a: "Mông Nguyên" },
                    { q: "Tác phẩm quân sự nổi tiếng ngài viết để khích lệ lòng yêu nước của tướng sĩ là gì?", a: "Hịch Tướng Sĩ" },
                    { q: "Hội nghị Diên Hồng lịch sử được triệu tập dưới thời vị vua nào?", a: "Trần Thánh Tông" },
                    { q: "Cụm từ hai chữ nổi tiếng mà quân sĩ thích lên cánh tay thể hiện quyết tâm diệt thù là gì?", a: "Sát Thát" },
                    { q: "Câu nói hào sảng: 'Nếu bệ hạ muốn hàng, xin hãy chém đầu thần trước đã' là trong trận chiến lần thứ mấy?", a: "Lần hai" },
                    { q: "Trận thủy chiến lừng lẫy năm 1288 tái sử dụng chiến thuật của Ngô Quyền diễn ra ở đâu?", a: "Sông Bạch Đằng" },
                    { q: "Tinh thần chiến đấu bất khuất thời kỳ này được gọi bằng cụm từ mang tính biểu tượng nào?", a: "Hào khí Đông A" }
                ]
            },
            {
                imageUrl: "/assets/images/vietnam_history_hero_1774157920838.png",
                answer: "Quang Trung",
                difficulty: "medium",
                questions: [
                    { q: "Tên thật của vị anh hùng áo vải cờ đào từ phong trào Tây Sơn là gì?", a: "Nguyễn Huệ" },
                    { q: "Cuộc hành quân thần tốc lật đổ thù trong giặc ngoài của ngài diễn ra vào dịp lễ nào trong năm?", a: "Tết Kỷ Dậu" },
                    { q: "Kẻ thù của dân tộc trong trận Ngọc Hồi - Đống Đa năm nay là quân đội nước nào?", a: "Quân Thanh" },
                    { q: "Trưởng tướng của địch, kẻ đã phải thắt cổ tự tử trên cây đa Gò Đống Đa, là ai?", a: "Sầm Nghi Đống" },
                    { q: "Vị trí trận địa Rạch Gầm - Xoài Mút, nơi oai phong đánh tan tành 5 vạn quân Xiêm, nay thuộc tỉnh nào?", a: "Tiền Giang" },
                    { q: "Chỉ huy chiến dịch đánh chiếm kinh thành Phú Xuân của quân Tây Sơn cũng chính là ngài. Đoạn sông lớn tại kinh thành tên gì?", a: "Sông Hương" },
                    { q: "Chính sách giáo dục đột phá mà vua Quang Trung áp dụng nhằm phổ biến loại ký tự nào?", a: "Chữ Nôm" },
                    { q: "Ai là người vợ danh giá, một nữ danh nhân thi ca kiệt xuất của Bắc Hà, đã theo hầu vua Quang Trung?", a: "Ngọc Hân Công chúa" },
                    { q: "Ngài lên ngôi Hoàng đế tại núi Bân và đặt niên hiệu là Quang Trung vào năm nào?", a: "1788" }
                ]
            },
            {
                imageUrl: "/assets/images/mode_millionaire_1774158037315.png",
                answer: "Khoa Cử Nho Học",
                difficulty: "hard",
                questions: [
                    { q: "Trường đại học đầu tiên của Việt Nam, biểu tượng của giáo dục thời phong kiến tên là gì?", a: "Quốc Tử Giám" },
                    { q: "Quần thể kiến trúc đền thờ Khổng Tử nằm ngay cạnh đó được gọi là gì?", a: "Văn Miếu" },
                    { q: "Vị vua nào của nhà Lý đã khởi xướng việc xây dựng nên cơ sở giáo dục quan trọng này?", a: "Lý Thánh Tông" },
                    { q: "Năm thành lập Quốc Tử Giám để làm nơi học tập cho các Hoàng thái tử là năm nào?", a: "1076" },
                    { q: "Người đạt điểm tuyệt đối, đỗ đầu trong các kỳ thi Đình được nhận danh hiệu cao quý nhất là gì?", a: "Trạng Nguyên" },
                    { q: "Danh hiệu đứng thứ hai sau Trạng Nguyên trong kỳ thi này có tên gọi là gì?", a: "Bảng Nhãn" },
                    { q: "Danh hiệu vinh dự đứng vị trí thứ 3 trong tam khôi thi Đình là gì?", a: "Thám Hoa" },
                    { q: "Để ghi danh những bậc hiền tài muôn đời, Vua Lê Thánh Tông ban lệnh dựng thứ gì tại Văn Miếu?", a: "Bia đá tiến sĩ" },
                    { q: "Bia tiến sĩ dùng hình dáng loài linh vật nào làm đế để đội tấm bia lên?", a: "Rùa" }
                ]
            },
            {
                imageUrl: "/assets/images/mode_territory_1774157937222.png",
                answer: "Mở Mang Bờ Cõi",
                difficulty: "medium",
                questions: [
                    { q: "Cuộc trường chinh mở rộng lãnh thổ của dân tộc Việt Nam chủ yếu về hướng địa lý nào?", a: "Hướng Nam" },
                    { q: "Sự kiện đất nước phân liệt thành hai phần Trịnh - Nguyễn gọi là giai đoạn lịch sử gì?", a: "Trịnh Nguyễn phân tranh" },
                    { q: "Dòng sông lịch sử trở thành ranh giới phân định hai bờ vĩ tuyến Đàng Ngoài - Đàng Trong là gì?", a: "Sông Gianh" },
                    { q: "Vị Chúa tài ba đặt nền tảng cho công cuộc mở rộng bờ cõi hùng vĩ ở Đàng Trong tên là gì?", a: "Nguyễn Hoàng" },
                    { q: "Kinh đô sầm uất và uy nghi nhất của Đàng Trong, nay thuộc thành phố Huế, mang tên gì?", a: "Phú Xuân" },
                    { q: "Công cuộc rèn luyện lực lượng trên bến cảng, mở rộng cảng thương quốc tế lớn nhất miền Nam diễn ra ở đâu?", a: "Hội An" },
                    { q: "Tầng lớp nhân dân khai phá tiên phong lập ấp ở phương Nam thường là ai?", a: "Nông dân và lưu dân" },
                    { q: "Trang phục áo dài truyền thống của Việt Nam được Chúa Nguyễn Phúc Khoát bắt đầu định hình vào thế kỷ nào?", a: "Thế kỷ 18" },
                    { q: "Xứ Sài Gòn Gia Định chính thức được xác lập thuộc chủ quyền Việt Nam dưới sự điều hành của vị tướng tài phiệt nào (tên Lễ Thành hầu)?", a: "Nguyễn Hữu Cảnh" }
                ]
            },
            {
                imageUrl: "/assets/images/mode_chronological_1774158020912.png",
                answer: "Văn Lang",
                difficulty: "easy",
                questions: [
                    { q: "Hàng ngàn năm trước, quốc gia đầu tiên trong lịch sử dân tộc Việt Nam mang tên là gì?", a: "Văn Lang" },
                    { q: "Dòng họ thống trị, truyền ngôi bao đời cho các vị vua hùng vĩ mang danh hiệu chung là gì?", a: "Hùng Vương" },
                    { q: "Trung tâm quyền lực, kinh đô kinh tế - chính trị của thời kỳ này đặt tại tỉnh nào hiện nay?", a: "Phú Thọ" },
                    { q: "Nhân dân thời này được chia thành nhiều bộ lạc, một người dân thường được gọi là gì?", a: "Lạc Việt" },
                    { q: "Sản phẩm đúc đồng thau đại diện cho nghệ thuật mỹ nghệ tuyệt đỉnh thời kỳ này là gì?", a: "Trống đồng Đông Sơn" },
                    { q: "Hoàng tử Lang Liêu đã tạo ra thứ gì làm bằng gạo nếp dâng lên Vua cha? (Cái có hình tròn)", a: "Bánh giầy" },
                    { q: "Loại bánh vuông vắn tượng trưng cho đất, gói bằng lá dong, là gì?", a: "Bánh chưng" },
                    { q: "Nhà nước huyền thoại nối tiếp sau Văn Lang ở kỷ nguyên tiếp theo mang tên gì?", a: "Âu Lạc" },
                    { q: "Loại vũ khí mũi tên bằng đồng nổi bật làm nao núng quân giặc của người Âu Lạc là gì?", a: "Nỏ Liên Châu" }
                ]
            }
        ];

        for (const pic of pictures) {
            // Check if already exists to avoid dupes
            const existing = await RevealPicture.findOne({ answer: pic.answer });
            if (!existing) {
                await RevealPicture.create(pic);
                console.log(`Inserted: ${pic.answer}`);
            } else {
                console.log(`Already exists: ${pic.answer}`);
                // Optional: await RevealPicture.updateOne({ _id: existing._id }, pic);
            }
        }

        console.log("Seeding complete.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedData();
