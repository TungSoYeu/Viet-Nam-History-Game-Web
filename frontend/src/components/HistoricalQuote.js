import { useState, useEffect, useCallback } from 'react';

const QUOTES = [
  { text: 'Nam quốc sơn hà Nam đế cư, Tiệt nhiên định phận tại thiên thư.', author: 'Lý Thường Kiệt', year: '1077' },
  { text: 'Từ Triệu, Đinh, Lý, Trần bao đời gây nền độc lập, cùng Hán, Đường, Tống, Nguyên mỗi bên xưng đế một phương.', author: 'Nguyễn Trãi', year: '1428' },
  { text: 'Đánh cho để dài tóc, đánh cho để đen răng. Đánh cho nó chích luân bất phản, đánh cho nó phiến giáp bất hoàn.', author: 'Quang Trung', year: '1789' },
  { text: 'Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông.', author: 'Bà Triệu', year: '248' },
  { text: 'Nếu bệ hạ muốn hàng, xin hãy chém đầu thần trước đã!', author: 'Trần Hưng Đạo', year: '1285' },
  { text: 'Một xin rửa sạch nước thù, hai xin dựng lại nghiệp xưa họ Hùng.', author: 'Hai Bà Trưng', year: '40' },
  { text: 'Bao giờ người Tây nhổ hết cỏ nước Nam thì mới hết người Nam đánh Tây.', author: 'Nguyễn Trung Trực', year: '1868' },
  { text: 'Không có gì quý hơn độc lập, tự do.', author: 'Hồ Chí Minh', year: '1966' },
  { text: 'Các vua Hùng đã có công dựng nước, Bác cháu ta phải cùng nhau giữ lấy nước.', author: 'Hồ Chí Minh', year: '1954' },
  { text: 'Ta thà làm quỷ nước Nam, chứ không thèm làm vương đất Bắc.', author: 'Trần Bình Trọng', year: '1285' },
];

export default function HistoricalQuote() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [animClass, setAnimClass] = useState('quote-enter');

  const cycle = useCallback(() => {
    setAnimClass('quote-exit');
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
      setAnimClass('quote-enter');
    }, 600);
  }, []);

  useEffect(() => {
    const timer = setInterval(cycle, 8000);
    return () => clearInterval(timer);
  }, [cycle]);

  const quote = QUOTES[index];

  return (
    <div
      className="relative mx-auto text-center px-6 py-4 rounded-[28px] border border-white/10 bg-black/20 backdrop-blur-md"
      style={{ minHeight: 132, maxWidth: 700 }}
    >
      <div className={animClass} key={index}>
        <p
          className="text-lg lg:text-2xl leading-relaxed mb-3"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            color: 'rgba(240, 212, 138, 0.85)',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          "{quote.text}"
        </p>
        <p className="text-xs uppercase tracking-[0.2em] font-bold" style={{ color: 'rgba(255,255,255,0.58)' }}>
          — {quote.author}, {quote.year}
        </p>
      </div>
    </div>
  );
}
