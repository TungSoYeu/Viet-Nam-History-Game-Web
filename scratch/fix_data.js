import fs from "fs";
import path from "path";

const dataPath = path.resolve("frontend/src/data/theme4GameData.js");
let dataContent = fs.readFileSync(dataPath, "utf-8");

// Fix 1: Năm 40
dataContent = dataContent.replace(
  `{ q: "Cuộc khởi nghĩa lớn mở đầu thời Bắc thuộc bùng nổ vào năm nào?", a: "Năm 40", acceptedAnswers: ["40"], hint: "Năm 40" }`,
  `{ q: "Cuộc khởi nghĩa lớn mở đầu thời Bắc thuộc bùng nổ vào năm nào?", a: "40", acceptedAnswers: ["Năm 40", "40"], hint: "40" }`
);

// Fix 2: Năm 938
dataContent = dataContent.replace(
  `{ q: "Chiến thắng quyết định chấm dứt hơn một nghìn năm Bắc thuộc diễn ra vào năm nào?", a: "Năm 938", acceptedAnswers: ["938"], hint: "Năm 938" }`,
  `{ q: "Chiến thắng quyết định chấm dứt hơn một nghìn năm Bắc thuộc diễn ra vào năm nào?", a: "938", acceptedAnswers: ["Năm 938", "938"], hint: "938" }`
);

// Fix 3: Hán / Kháng chiến
dataContent = dataContent.replace(
  `{
        q: "Chiến thuật đóng cọc trên sông được vận dụng nổi bật trong cuộc kháng chiến nào ở thế kỉ X?",`,
  `{
        q: "Cuộc chiến chống ngoại xâm nào ở thế kỉ X đã vận dụng nổi bật chiến thuật đóng cọc trên sông?",`
);
dataContent = dataContent.replace(
  `{ q: "Chiến thuật đóng cọc trên sông được vận dụng nổi bật trong cuộc kháng chiến nào ở thế kỉ X?", a: "Chống quân Nam Hán"`,
  `{ q: "Cuộc chiến chống ngoại xâm nào ở thế kỉ X đã vận dụng nổi bật chiến thuật đóng cọc trên sông?", a: "Chống quân Nam Hán"`
);


// Fix 4: Sông Bạch Đằng -> Bạch Đằng
dataContent = dataContent.replace(
  `{ q: "Dòng sông nào ba lần ghi dấu những chiến công lớn trong lịch sử chống ngoại xâm của dân tộc?", a: "Sông Bạch Đằng", hint: "Sông Bạch Đằng" }`,
  `{ q: "Dòng sông nào ba lần ghi dấu những chiến công lớn trong lịch sử chống ngoại xâm của dân tộc?", a: "Bạch Đằng", acceptedAnswers: ["Sông Bạch Đằng", "Bạch Đằng"], hint: "Bạch Đằng" }`
);

// Fix 5: Năm 981
dataContent = dataContent.replace(
  `{ q: "Cuộc kháng chiến chống quân Tống đầu tiên thời Tiền Lê diễn ra vào năm nào?", a: "Năm 981", acceptedAnswers: ["981"], hint: "Năm 981" }`,
  `{ q: "Cuộc kháng chiến chống quân Tống đầu tiên thời Tiền Lê diễn ra vào năm nào?", a: "981", acceptedAnswers: ["Năm 981", "981"], hint: "981" }`
);

// Fix 6: Sông Bạch Đằng -> Bạch Đằng
dataContent = dataContent.replace(
  `{ q: "Dòng sông gắn với chiến thắng lớn trước quân Tống năm 981 là sông nào?", a: "Sông Bạch Đằng", hint: "Sông Bạch Đằng" }`,
  `{ q: "Dòng sông gắn với chiến thắng lớn trước quân Tống năm 981 là sông nào?", a: "Bạch Đằng", acceptedAnswers: ["Sông Bạch Đằng", "Bạch Đằng"], hint: "Bạch Đằng" }`
);

// Fix 7: Trận Như Nguyệt -> Như Nguyệt
dataContent = dataContent.replace(
  `{ q: "Trận quyết chiến chiến lược trên phòng tuyến sông nào đã làm phá sản ý đồ xâm lược của quân Tống?", a: "Trận Như Nguyệt", acceptedAnswers: ["Như Nguyệt", "Phòng tuyến Như Nguyệt"], hint: "Như Nguyệt" }`,
  `{ q: "Tên phòng tuyến nào trên sông đã làm phá sản ý đồ xâm lược của quân Tống?", a: "Như Nguyệt", acceptedAnswers: ["Trận Như Nguyệt", "Phòng tuyến Như Nguyệt", "Sông Như Nguyệt"], hint: "Như Nguyệt" }`
);

// Fix 8: Sông Gianh -> Gianh
dataContent = dataContent.replace(
  `{ q: "Con sông từng là ranh giới chia cắt Đàng Trong và Đàng Ngoài trong các thế kỉ XVII - XVIII là sông nào?", a: "Sông Gianh", hint: "Sông Gianh" }`,
  `{ q: "Con sông từng là ranh giới chia cắt Đàng Trong và Đàng Ngoài trong các thế kỉ XVII - XVIII là sông nào?", a: "Gianh", acceptedAnswers: ["Sông Gianh", "Gianh"], hint: "Gianh" }`
);

// Fix 9: Tây Sơn tam kiệt
dataContent = dataContent.replace(
  `{ q: "Tên gọi chung của ba anh em lãnh đạo phong trào Tây Sơn là gì?", a: "Tây Sơn tam kiệt", hint: "Tam kiệt" }`,
  `{ q: "Ba anh em Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ tụ nghĩa khởi binh thường được dân gian ngợi ca bằng danh xưng nào?", a: "Tây Sơn tam kiệt", acceptedAnswers: ["Tây Sơn tam kiệt", "Tam kiệt Tây Sơn"], hint: "Tây Sơn tam kiệt" }`
);

// Fix 10: Phong trào Tây Sơn
dataContent = dataContent.replace(
  `{ q: "Phong trào nào đã đặt cơ sở cho việc thống nhất đất nước vào cuối thế kỉ XVIII?", a: "Phong trào Tây Sơn", hint: "Tây Sơn" }`,
  `{ q: "Cuộc khởi nghĩa nông dân bùng nổ ở Bình Định nào đã đặt cơ sở cho việc thống nhất đất nước vào cuối thế kỉ XVIII?", a: "Tây Sơn", acceptedAnswers: ["Phong trào Tây Sơn", "Khởi nghĩa Tây Sơn", "Tây Sơn"], hint: "Tây Sơn" }`
);

// Fix 11: Kháng chiến chống thực dân Pháp
dataContent = dataContent.replace(
  `{
        q: "Cuộc kháng chiến nào của nhân dân ta diễn ra vào nửa sau thế kỉ XIX nhưng không giành thắng lợi cuối cùng?",
        a: "Kháng chiến chống thực dân Pháp (1858 - 1884)",`,
  `{
        q: "Cuộc đụng độ lịch sử nào của nhân dân ta chống lại quân đội phương tây chiếm đóng diễn ra vào nửa sau thế kỉ XIX nhưng không giành thắng lợi?",
        a: "Chống thực dân Pháp (1858 - 1884)",`
);

// Fix 12: Sự kiện nổ súng
dataContent = dataContent.replace(
  `{
        q: "Sự kiện mở đầu cho quá trình Pháp xâm lược Việt Nam là gì?",
        a: "Pháp nổ súng tấn công Đà Nẵng ngày 1/9/1858",`,
  `{
        q: "Cuộc đột kích nào bằng pháo hạm mở đầu cho quá trình phương Tây đánh chiếm Việt Nam?",
        a: "Liên quân Pháp - Tây Ban Nha nổ súng tấn công Đà Nẵng",`
);

// Fix 13: Hai hiệp ước
dataContent = dataContent.replace(
  `{
        q: "Hai hiệp ước nào đánh dấu việc Pháp cơ bản hoàn thành cuộc xâm lược Việt Nam?",
        a: "Hiệp ước Hác-măng và Pa-tơ-nốt",`,
  `{
        q: "Hai văn kiện đầu hàng nào đánh dấu việc triều đình nhà Nguyễn chính thức công nhận sự bảo hộ của phương Tây?",
        a: "Hác-măng và Pa-tơ-nốt",`
);

// Fix 14: Mục đích
dataContent = dataContent.replace(
  `correctAnswer: "Mục đích chiến tranh",`,
  `correctAnswer: "Mục đích",`
);
dataContent = dataContent.replace(
  `options: ["Mục đích chiến tranh",`,
  `options: ["Mục đích",`
);
dataContent = dataContent.replace(
  `boardAnswer: "Mục đích",`,
  `boardAnswer: "Mục đích",`
);

fs.writeFileSync(dataPath, dataContent, "utf-8");
console.log("Done patching theme4GameData.");
