const mongoose = require('mongoose');
const Question = require('../models/Question');
const Lesson = require('../models/Lesson');
require('dotenv').config({ path: './backend/.env' });

const questionsBatch = [
    // --- NHÀ NGÔ - ĐINH - TIỀN LÊ ---
    { content: "Ngô Quyền lên ngôi vua vào năm nào?", options: ["938", "939", "944", "968"], correctAnswer: "939", explanation: "Sau chiến thắng Bạch Đằng, Ngô Quyền lên ngôi vua năm 939.", difficulty: 1 },
    { content: "Ngô Quyền đóng đô ở đâu?", options: ["Hoa Lư", "Cổ Loa", "Thăng Long", "Huế"], correctAnswer: "Cổ Loa", explanation: "Ông quyết định đóng đô ở Cổ Loa để nối tiếp truyền thống xưa.", difficulty: 1 },
    { content: "Sau khi Ngô Quyền mất, đất nước rơi vào tình trạng gì?", options: ["Giặc ngoại xâm", "Loạn 12 sứ quân", "Thịnh trị", "Nội chiến giữa các triều đại"], correctAnswer: "Loạn 12 sứ quân", explanation: "Các thế lực địa phương nổi dậy chia cắt đất nước.", difficulty: 1 },
    { content: "Ai là người có công dẹp loạn 12 sứ quân?", options: ["Ngô Xương Văn", "Đinh Bộ Lĩnh", "Lê Hoàn", "Lý Công Uẩn"], correctAnswer: "Đinh Bộ Lĩnh", explanation: "Đinh Bộ Lĩnh thống nhất đất nước, lập ra nhà Đinh.", difficulty: 1 },
    { content: "Đinh Bộ Lĩnh lên ngôi Hoàng đế, đặt quốc hiệu là gì?", options: ["Vạn Xuân", "Đại Cồ Việt", "Đại Việt", "Đại Nam"], correctAnswer: "Đại Cồ Việt", explanation: "Năm 968, ông lên ngôi, đặt tên nước là Đại Cồ Việt.", difficulty: 1 },
    { content: "Nhà Đinh đóng đô ở đâu?", options: ["Cổ Loa", "Thăng Long", "Hoa Lư", "Gia Định"], correctAnswer: "Hoa Lư", explanation: "Ông chọn vùng núi non hiểm trở Hoa Lư làm kinh đô.", difficulty: 1 },
    { content: "Vị vua nào được mệnh danh là 'Vạn Thắng Vương'?", options: ["Ngô Quyền", "Đinh Bộ Lĩnh", "Lê Đại Hành", "Lý Thái Tổ"], correctAnswer: "Đinh Bộ Lĩnh", explanation: "Do tài bách chiến bách thắng khi dẹp loạn sứ quân.", difficulty: 1 },
    { content: "Ai là người sáng lập ra nhà Tiền Lê?", options: ["Lê Lợi", "Lê Hoàn", "Lê Thánh Tông", "Lê Hiến Tông"], correctAnswer: "Lê Hoàn", explanation: "Lê Hoàn lên ngôi năm 980 để lãnh đạo kháng chiến chống Tống.", difficulty: 1 },
    { content: "Thái hậu nào đã trao áo long bào cho Lê Hoàn?", options: ["Dương Vân Nga", "Ỷ Lan", "Lý Chiêu Hoàng", "Nam Phương"], correctAnswer: "Dương Vân Nga", explanation: "Vì lợi ích dân tộc, bà đã nhường ngôi cho người có tài.", difficulty: 1 },
    { content: "Nhà Tiền Lê đã đánh bại quân xâm lược nào năm 981?", options: ["Quân Hán", "Quân Tống", "Quân Nguyên", "Quân Minh"], correctAnswer: "Quân Tống", explanation: "Lê Đại Hành trực tiếp chỉ huy đánh tan quân Tống trên sông Bạch Đằng.", difficulty: 1 },
    { content: "Sông Bạch Đằng gắn liền với bao nhiêu chiến thắng lớn?", options: ["1 lần", "2 lần", "3 lần", "4 lần"], correctAnswer: "3 lần", explanation: "Năm 938 (Ngô Quyền), 981 (Lê Hoàn), 1288 (Trần Hưng Đạo).", difficulty: 2 },
    { content: "Đinh Bộ Lĩnh hồi nhỏ thường chơi trò gì với chúng bạn?", options: ["Cưỡi ngựa gỗ", "Cưỡi trâu đánh trận giả, rước cờ lau", "Bắn cung", "Đánh cờ"], correctAnswer: "Cưỡi trâu đánh trận giả, rước cờ lau", explanation: "Đây là hình ảnh gắn liền với tuổi thơ của ông.", difficulty: 1 },
    { content: "Đinh Tiên Hoàng đặt niên hiệu là gì?", options: ["Thái Bình", "Thuận Thiên", "Thiên Phúc", "Đại Hữu"], correctAnswer: "Thái Bình", explanation: "Ông là vị vua đầu tiên đặt niên hiệu (Thái Bình).", difficulty: 2 },
    { content: "Tại sao Đinh Bộ Lĩnh chọn Hoa Lư làm kinh đô?", options: ["Gần biển", "Núi non hiểm trở dễ phòng thủ", "Đất đai màu mỡ", "Trung tâm buôn bán"], correctAnswer: "Núi non hiểm trở dễ phòng thủ", explanation: "Hoa Lư có địa thế quân sự tuyệt vời.", difficulty: 2 },
    { content: "Nhà Đinh có bao nhiêu đời vua?", options: ["1 đời", "2 đời", "3 đời", "4 đời"], correctAnswer: "2 đời", explanation: "Đinh Tiên Hoàng và Đinh Toàn.", difficulty: 3 },
    { content: "Lê Hoàn làm chức quan gì dưới thời nhà Đinh?", options: ["Thập đạo tướng quân", "Thái sư", "Tể tướng", "Lạc tướng"], correctAnswer: "Thập đạo tướng quân", explanation: "Ông là người tổng chỉ huy quân đội nhà Đinh.", difficulty: 2 },
    { content: "Trận chiến Chi Lăng năm 981 do ai chỉ huy tiêu diệt tướng Tống?", options: ["Ngô Quyền", "Lê Hoàn", "Trần Hưng Đạo", "Lý Thường Kiệt"], correctAnswer: "Lê Hoàn", explanation: "Tướng Tống Hầu Nhân Bảo bị tiêu diệt tại đây.", difficulty: 2 },
    { content: "Niên hiệu của vua Lê Đại Hành là gì?", options: ["Thiên Phúc", "Thái Bình", "Thuận Thiên", "Đại Hữu"], correctAnswer: "Thiên Phúc", explanation: "Thiên Phúc là niên hiệu của nhà Tiền Lê.", difficulty: 3 },
    { content: "Nhà Tiền Lê kết thúc với vị vua nào nổi tiếng ăn chơi?", options: ["Lê Hoàn", "Lê Long Đĩnh", "Lê Trung Tông", "Lê Ngọa Triều"], correctAnswer: "Lê Long Đĩnh", explanation: "Còn gọi là Lê Ngọa Triều.", difficulty: 2 },
    { content: "Lễ hội Tịch điền bắt đầu từ thời vua nào?", options: ["Đinh Tiên Hoàng", "Lê Đại Hành", "Lý Thái Tổ", "Lê Thánh Tông"], correctAnswer: "Lê Đại Hành", explanation: "Ông là vị vua đầu tiên xuống ruộng cày để khuyến khích nông nghiệp.", difficulty: 2 },

    // --- NHÀ LÝ (Adding 20 more) ---
    { content: "Lý Công Uẩn sinh ở đâu?", options: ["Cổ Pháp (Bắc Ninh)", "Hoa Lư", "Thăng Long", "Lam Sơn"], correctAnswer: "Cổ Pháp (Bắc Ninh)", explanation: "Ông quê ở làng Diên Uẩn, Cổ Pháp.", difficulty: 2 },
    { content: "Ai là người nuôi dưỡng Lý Công Uẩn từ nhỏ?", options: ["Sư Vạn Hạnh", "Lý Khánh Văn", "Tô Hiến Thành", "Đỗ Anh Vũ"], correctAnswer: "Sư Vạn Hạnh", explanation: "Ông được nuôi dạy trong chùa cổ.", difficulty: 2 },
    { content: "Lý Thái Tổ dời đô vì lý do chính nào?", options: ["Hoa Lư quá chật hẹp", "Thăng Long có địa thế rồng cuộn hổ ngồi", "Muốn ở gần quê", "Tránh giặc"], correctAnswer: "Thăng Long có địa thế rồng cuộn hổ ngồi", explanation: "Thăng Long là trung tâm của đất trời, thuận lợi phát triển lâu dài.", difficulty: 1 },
    { content: "Quân đội nhà Lý thực hiện chính sách gì để vừa sản xuất vừa chiến đấu?", options: ["Ngụ binh ư nông", "Tất cả là lính", "Tuyển quân hàng năm", "Thuê quân ngoại bang"], correctAnswer: "Ngụ binh ư nông", explanation: "Gửi binh ở nhà nông, khi có giặc thì ra trận.", difficulty: 2 },
    { content: "Vị vua nào nhà Lý đặt tên nước là Đại Việt?", options: ["Lý Thái Tổ", "Lý Thánh Tông", "Lý Nhân Tông", "Lý Cao Tông"], correctAnswer: "Lý Thánh Tông", explanation: "Năm 1054, sau khi lên ngôi, ông đổi tên nước là Đại Việt.", difficulty: 1 },
    { content: "Thái hậu nổi tiếng về tài trị quốc thời Lý là ai?", options: ["Ỷ Lan", "Dương Vân Nga", "Lý Chiêu Hoàng", "Nam Phương"], correctAnswer: "Ỷ Lan", explanation: "Bà hai lần nhiếp chính giúp đất nước hưng thịnh.", difficulty: 1 },
    { content: "Nhà Lý đã đánh bại quân xâm lược nào ở phương Nam?", options: ["Quân Chăm-pa", "Quân Chân Lạp", "Quân Xiêm", "Quân Mông Cổ"], correctAnswer: "Quân Chăm-pa", explanation: "Nhà Lý nhiều lần tiến quân bình định phía Nam bảo vệ biên giới.", difficulty: 2 },
    { content: "Vị quan nào nhà Lý nổi tiếng về sự chính trực, không nhận hối lộ?", options: ["Tô Hiến Thành", "Trần Thủ Độ", "Chu Văn An", "Mạc Đĩnh Chi"], correctAnswer: "Tô Hiến Thành", explanation: "Ông phò tá vua trẻ, giữ vững kỷ cương triều đình.", difficulty: 2 },
    { content: "Khoa thi đầu tiên của nước ta tổ chức vào năm nào?", options: ["1070", "1075", "1076", "1010"], correctAnswer: "1075", explanation: "Khoa thi Minh kinh bác học và Nho học tam trường.", difficulty: 3 },
    { content: "Tượng Phật A-di-đà nổi tiếng thời Lý nằm ở chùa nào?", options: ["Chùa Một Cột", "Chùa Phật Tích", "Chùa Dâu", "Chùa Bái Đính"], correctAnswer: "Chùa Phật Tích", explanation: "Kiệt tác điêu khắc đá thời Lý.", difficulty: 3 },
    { content: "Đặc điểm nổi bật của rồng thời Lý là gì?", options: ["Mập mạp", "Thân dài mềm mại như hình chữ S", "Hung dữ", "Có cánh"], correctAnswer: "Thân dài mềm mại như hình chữ S", explanation: "Rồng thời Lý mang vẻ đẹp nhẹ nhàng, thanh thoát.", difficulty: 2 },
    { content: "Hệ thống đê điều bắt đầu được chú trọng xây dựng mạnh mẽ từ triều đại nào?", options: ["Nhà Ngô", "Nhà Lý", "Nhà Trần", "Nhà Lê"], correctAnswer: "Nhà Lý", explanation: "Đê Cơ Xá là một ví dụ tiêu biểu.", difficulty: 2 },
    { content: "Nhà Lý tồn tại bao nhiêu năm?", options: ["116 năm", "216 năm", "316 năm", "416 năm"], correctAnswer: "216 năm", explanation: "Từ 1009 đến 1225.", difficulty: 3 },
    { content: "Ai là người có công lớn giúp nhà Lý giữ vững biên giới phía Bắc?", options: ["Lý Thường Kiệt", "Thân Cảnh Phúc", "Cả hai đều đúng", "Không ai cả"], correctAnswer: "Cả hai đều đúng", explanation: "Lý Thường Kiệt chỉ huy chung, Thân Cảnh Phúc là thủ lĩnh dân tộc thiểu số tài năng.", difficulty: 3 },
    { content: "Lý Thường Kiệt từng làm chức vụ gì cao nhất?", options: ["Thái sư", "Thái úy", "Tể tướng", "Hoàng đế"], correctAnswer: "Thái úy", explanation: "Thái úy là chức quan võ cao nhất.", difficulty: 2 },
    { content: "Nhà Lý suy yếu vào cuối thế kỷ nào?", options: ["Thế kỷ XI", "Thế kỷ XII", "Thế kỷ XIII", "Thế kỷ XIV"], correctAnswer: "Thế kỷ XII", explanation: "Bắt đầu từ thời Lý Cao Tông.", difficulty: 3 },
    { content: "Lý Chiêu Hoàng nhường ngôi cho Trần Cảnh vào tháng năm nào?", options: ["Tháng 12/1225", "Tháng 1/1226", "Tháng 2/1225", "Tháng 10/1010"], correctAnswer: "Tháng 12/1225", explanation: "Sử chép là cuối năm Ất Dậu.", difficulty: 3 },
    { content: "Chùa Diên Hựu là tên gọi khác của chùa nào?", options: ["Chùa Một Cột", "Chùa Hương", "Chùa Trấn Quốc", "Chùa Phật Tích"], correctAnswer: "Chùa Một Cột", explanation: "Diên Hựu có nghĩa là 'Phúc dài lâu'.", difficulty: 2 },
    { content: "Vua Lý Nhân Tông là người như thế nào?", options: ["Giỏi văn chương, yêu dân", "Tàn bạo", "Chỉ lo ăn chơi", "Nhu nhược"], correctAnswer: "Giỏi văn chương, yêu dân", explanation: "Ông là vị vua anh minh, trị vì lâu nhất lịch sử.", difficulty: 2 },
    { content: "Dòng họ nào đã giúp đỡ nhà Lý rất nhiều trong việc đánh quân Tống?", options: ["Họ Trần", "Họ Thân", "Họ Lê", "Họ Nguyễn"], correctAnswer: "Họ Thân", explanation: "Các tù trưởng họ Thân ở Lạng Sơn.", difficulty: 3 },

    // --- NHÀ TRẦN (Adding 20) ---
    { content: "Ai là vị vua đầu tiên của nhà Trần?", options: ["Trần Thái Tông", "Trần Thánh Tông", "Trần Nhân Tông", "Trần Thủ Độ"], correctAnswer: "Trần Thái Tông", explanation: "Trần Cảnh lên ngôi lấy hiệu là Thái Tông.", difficulty: 1 },
    { content: "Người có công sáng lập ra nhà Trần là ai?", options: ["Trần Thừa", "Trần Thủ Độ", "Trần Hưng Đạo", "Trần Quang Khải"], correctAnswer: "Trần Thủ Độ", explanation: "Ông là người đạo diễn cuộc chuyển giao quyền lực từ Lý sang Trần.", difficulty: 1 },
    { content: "Nhà Trần đã mấy lần đánh thắng quân Nguyên Mông?", options: ["1 lần", "2 lần", "3 lần", "4 lần"], correctAnswer: "3 lần", explanation: "Năm 1258, 1285, 1288.", difficulty: 1 },
    { content: "Câu nói: 'Đầu thần chưa rơi xuống đất, xin bệ hạ đừng lo' là của ai?", options: ["Trần Hưng Đạo", "Trần Thủ Độ", "Trần Quang Khải", "Trần Bình Trọng"], correctAnswer: "Trần Thủ Độ", explanation: "Ông nói với vua Trần Thái Tông trong cuộc kháng chiến lần thứ nhất.", difficulty: 1 },
    { content: "Vị tướng nào nhà Trần được mệnh danh là 'Hưng Đạo Đại Vương'?", options: ["Trần Quốc Tuấn", "Trần Nhật Duật", "Trần Khánh Dư", "Trần Quốc Toản"], correctAnswer: "Trần Quốc Tuấn", explanation: "Trần Hưng Đạo là tước hiệu của ông.", difficulty: 1 },
    { content: "Trần Quốc Toản đã làm gì khi không được dự hội nghị Bình Than?", options: ["Bỏ về", "Khóc nức nở", "Bóp nát quả cam", "Nổi loạn"], correctAnswer: "Bóp nát quả cam", explanation: "Vì còn quá trẻ nên không được dự, ông phẫn chí bóp nát quả cam trong tay.", difficulty: 1 },
    { content: "Hội nghị Diên Hồng tập hợp những ai để bàn kế đánh giặc?", options: ["Các tướng lĩnh", "Các bậc phụ lão", "Các quan lại", "Thanh niên"], correctAnswer: "Các bậc phụ lão", explanation: "Vua Trần Nhân Tông triệu tập các cụ già để hỏi ý kiến đánh hay hàng.", difficulty: 1 },
    { content: "Câu nói: 'Ta thà làm ma nước Nam, chứ không thèm làm vương đất Bắc' là của ai?", options: ["Trần Hưng Đạo", "Trần Bình Trọng", "Trần Thủ Độ", "Yết Kiêu"], correctAnswer: "Trần Bình Trọng", explanation: "Ông hy sinh anh dũng sau khi bị quân Nguyên bắt.", difficulty: 1 },
    { content: "Tác giả của 'Hịch tướng sĩ' là ai?", options: ["Trần Nhân Tông", "Trần Quốc Tuấn", "Trần Quang Khải", "Trần Nhật Duật"], correctAnswer: "Trần Quốc Tuấn", explanation: "Bài hịch bất hủ để khích lệ tinh thần quân sĩ.", difficulty: 1 },
    { content: "Trận chiến trên sông Bạch Đằng năm 1288 sử dụng chiến thuật gì?", options: ["Hỏa công", "Cắm cọc gỗ đầu bịt sắt", "Đánh úp", "Vây thành"], correctAnswer: "Cắm cọc gỗ đầu bịt sắt", explanation: "Kế thừa Ngô Quyền, Trần Hưng Đạo đã tiêu diệt hoàn toàn thủy quân Nguyên.", difficulty: 1 },
    { content: "Vị vua nào nhà Trần đi tu và sáng lập thiền phái Trúc Lâm?", options: ["Trần Thái Tông", "Trần Thánh Tông", "Trần Nhân Tông", "Trần Anh Tông"], correctAnswer: "Trần Nhân Tông", explanation: "Ông được tôn là Phật Hoàng Trần Nhân Tông.", difficulty: 1 },
    { content: "Hai vị tướng tài có tài bơi lội và lặn giỏi dưới thời Trần là ai?", options: ["Yết Kiêu và Dã Tượng", "Yết Kiêu và Cao Lỗ", "Dã Tượng và Phạm Ngũ Lão", "Trần Bình Trọng và Yết Kiêu"], correctAnswer: "Yết Kiêu và Dã Tượng", explanation: "Họ là gia nô trung thành và tài giỏi của Trần Hưng Đạo.", difficulty: 2 },
    { content: "Phạm Ngũ Lão nổi tiếng với sự tích ngồi đan sọt mà không biết gì khi?", options: ["Đang ngủ", "Bị quân lính đâm giáo vào đùi", "Bị mắng", "Trời mưa"], correctAnswer: "Bị quân lính đâm giáo vào đùi", explanation: "Vì mải mê suy nghĩ việc nước nên ông không thấy đau.", difficulty: 2 },
    { content: "Nhà Trần đặt ra chức quan gì chuyên chăm lo việc đê điều?", options: ["Hà đê sứ", "Khuyến nông sứ", "Đồn điền sứ", "Thái sư"], correctAnswer: "Hà đê sứ", explanation: "Nông nghiệp rất được chú trọng thời Trần.", difficulty: 2 },
    { content: "Tên hiệu của quân đội nhà Trần thường thích lên cánh tay là gì?", options: ["Sát Thát", "Đại Việt", "Trần Gia", "Bình Nguyên"], correctAnswer: "Sát Thát", explanation: "Có nghĩa là 'Giết giặc Mông Cổ'.", difficulty: 1 },
    { content: "Vị quan nào nhà Trần đã dâng 'Thất trảm sớ'?", options: ["Chu Văn An", "Trương Hán Siêu", "Lê Văn Hưu", "Phạm Sư Mạnh"], correctAnswer: "Chu Văn An", explanation: "Ông đòi chém 7 nịnh thần thời Trần Dụ Tông.", difficulty: 2 },
    { content: "Tác giả của bộ 'Đại Việt sử ký' - bộ quốc sử đầu tiên là ai?", options: ["Lê Văn Hưu", "Phan Phu Tiên", "Ngô Sĩ Liên", "Nguyễn Trãi"], correctAnswer: "Lê Văn Hưu", explanation: "Ông hoàn thành bộ sử này năm 1272.", difficulty: 3 },
    { content: "Trần Quang Khải nổi tiếng với bài thơ nào sau chiến thắng?", options: ["Tụng giá hoàn kinh sư", "Hịch tướng sĩ", "Nam quốc sơn hà", "Thuật hoài"], correctAnswer: "Tụng giá hoàn kinh sư", explanation: "Hào khí Đông A thể hiện rõ trong bài thơ.", difficulty: 2 },
    { content: "Công chúa nào nhà Trần đã được gả cho vua Chăm-pa để đổi lấy hai châu Ô, Lý?", options: ["Huyền Trân", "An Tư", "Ngọc Hân", "Ngọc Vạn"], correctAnswer: "Huyền Trân", explanation: "Mở rộng lãnh thổ đất nước về phía Nam.", difficulty: 2 },
    { content: "Công chúa An Tư đã làm gì trong cuộc kháng chiến chống Nguyên lần 2?", options: ["Cầm quân ra trận", "Tự nguyện sang trại giặc để hoãn binh", "Đi tu", "Làm thơ"], correctAnswer: "Tự nguyện sang trại giặc để hoãn binh", explanation: "Sự hy sinh thầm lặng của một công chúa nhà Trần.", difficulty: 2 }
];

const seedPart2 = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const l1 = await Lesson.findOne({ title: /Ngô - Đinh/ });
        const l2 = await Lesson.findOne({ title: /Nhà Lý/ });
        const l3 = await Lesson.findOne({ title: /Nhà Trần/ });

        const q1 = questionsBatch.slice(0, 20).map(q => ({ ...q, lessonId: l1._id }));
        const q2 = questionsBatch.slice(20, 40).map(q => ({ ...q, lessonId: l2._id }));
        const q3 = questionsBatch.slice(40, 60).map(q => ({ ...q, lessonId: l3._id }));

        await Question.insertMany([...q1, ...q2, ...q3]);
        console.log(`✅ Đã nạp thêm: 20 Ngô-Đinh-Lê, 20 Lý, 20 Trần.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedPart2();
