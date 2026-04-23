const HISTORICAL_EVENTS = {
  "01-01": [{ year: "1946", event: "Việt Nam Dân chủ Cộng hòa bắt đầu thực hiện Tổng tuyển cử trên toàn quốc.", category: "Chính trị" }],
  "01-06": [{ year: "1946", event: "Tổng tuyển cử đầu tiên của nước Việt Nam Dân chủ Cộng hòa.", category: "Chính trị" }],
  "01-13": [{ year: "1941", event: "Khởi nghĩa Đô Lương nổ ra ở Nghệ An.", category: "Khởi nghĩa" }],
  "01-18": [{ year: "1946", event: "Quốc hội khóa I họp phiên đầu tiên tại Nhà hát Lớn Hà Nội.", category: "Chính trị" }],
  "02-03": [{ year: "1930", event: "Đảng Cộng sản Việt Nam thành lập tại Hương Cảng.", category: "Chính trị" }],
  "02-12": [{ year: "1418", event: "Lê Lợi dựng cờ khởi nghĩa Lam Sơn.", category: "Khởi nghĩa" }],
  "02-17": [{ year: "1859", event: "Thực dân Pháp tấn công thành Gia Định.", category: "Quân sự" }],
  "03-08": [{ year: "40", event: "Hai Bà Trưng khởi nghĩa chống ách đô hộ nhà Đông Hán.", category: "Khởi nghĩa" }],
  "03-26": [{ year: "1931", event: "Xô viết Nghệ Tĩnh — chính quyền nhân dân đầu tiên.", category: "Chính trị" }],
  "03-29": [{ year: "1975", event: "Giải phóng Đà Nẵng trong chiến dịch Mùa Xuân.", category: "Quân sự" }],
  "04-07": [{ year: "1975", event: "Quân giải phóng tiến vào Phan Rang trong chiến dịch Mùa Xuân 1975.", category: "Quân sự" }],
  "04-12": [{ year: "1975", event: "Chiến dịch Xuân Lộc — trận đánh ác liệt cuối cùng trước giải phóng miền Nam.", category: "Quân sự" }],
  "04-21": [{ year: "1975", event: "Nguyễn Văn Thiệu từ chức Tổng thống Việt Nam Cộng hòa.", category: "Chính trị" }],
  "04-30": [{ year: "1975", event: "Giải phóng Sài Gòn — thống nhất đất nước.", category: "Quân sự" }],
  "05-01": [{ year: "1904", event: "Phan Bội Châu thành lập Hội Duy Tân.", category: "Chính trị" }],
  "05-07": [{ year: "1954", event: "Chiến thắng Điện Biên Phủ — kết thúc chiến tranh Đông Dương.", category: "Quân sự" }],
  "05-19": [{ year: "1890", event: "Chủ tịch Hồ Chí Minh sinh tại Nghệ An.", category: "Danh nhân" }],
  "06-05": [{ year: "1911", event: "Nguyễn Tất Thành ra đi tìm đường cứu nước.", category: "Danh nhân" }],
  "06-11": [{ year: "1948", event: "Bác Hồ ra Lời kêu gọi Thi đua ái quốc.", category: "Chính trị" }],
  "07-20": [{ year: "1954", event: "Ký Hiệp định Genève — chấm dứt chiến tranh Đông Dương.", category: "Chính trị" }],
  "07-27": [{ year: "1947", event: "Ngày Thương binh Liệt sĩ Việt Nam.", category: "Tưởng niệm" }],
  "08-19": [{ year: "1945", event: "Cách mạng Tháng Tám thành công tại Hà Nội.", category: "Cách mạng" }],
  "08-25": [{ year: "1945", event: "Cách mạng Tháng Tám thành công tại Sài Gòn.", category: "Cách mạng" }],
  "09-02": [{ year: "1945", event: "Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình.", category: "Chính trị" }],
  "09-23": [{ year: "1945", event: "Nam Bộ kháng chiến chống Pháp xâm lược lần hai.", category: "Quân sự" }],
  "10-01": [{ year: "1949", event: "Nước Cộng hòa Nhân dân Trung Hoa thành lập.", category: "Quốc tế" }],
  "10-10": [{ year: "1954", event: "Giải phóng Thủ đô — bộ đội ta tiếp quản Hà Nội.", category: "Quân sự" }],
  "10-20": [{ year: "1930", event: "Hội nghị Trung ương lần I — chuyển sang tên Đảng Cộng sản Đông Dương.", category: "Chính trị" }],
  "11-20": [{ year: "1946", event: "Quốc hội khóa I thông qua bản Hiến pháp đầu tiên của nước Việt Nam Dân chủ Cộng hòa.", category: "Chính trị" }],
  "11-23": [{ year: "1940", event: "Khởi nghĩa Nam Kỳ nổ ra chống Nhật-Pháp.", category: "Khởi nghĩa" }],
  "12-19": [{ year: "1946", event: "Toàn quốc kháng chiến bắt đầu.", category: "Quân sự" }],
  "12-22": [{ year: "1944", event: "Đội Việt Nam Tuyên truyền Giải phóng quân thành lập.", category: "Quân sự" }],
  "12-24": [{ year: "1972", event: "Chiến thắng 'Hà Nội — Điện Biên Phủ trên không' (B-52).", category: "Quân sự" }],
};

export function getTodayEvent() {
  const now = new Date();
  const key = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  if (HISTORICAL_EVENTS[key]) {
    return { ...HISTORICAL_EVENTS[key][0], date: key };
  }
  const allKeys = Object.keys(HISTORICAL_EVENTS).sort();
  let closest = allKeys[0];
  for (const k of allKeys) {
    if (k <= key) closest = k;
    else break;
  }

  return { ...HISTORICAL_EVENTS[closest][0], date: closest };
}
export function getRandomEvent() {
  const keys = Object.keys(HISTORICAL_EVENTS);
  const key = keys[Math.floor(Math.random() * keys.length)];
  return { ...HISTORICAL_EVENTS[key][0], date: key };
}

export default HISTORICAL_EVENTS;
