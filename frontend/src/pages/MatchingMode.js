import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PeriodSelector from '../components/PeriodSelector';

export default function MatchingMode() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [game, setGame] = useState(null);
  
  const [leftItems, setLeftItems] = useState([]); // Những mục dữ kiện
  const [rightItems, setRightItems] = useState([]); // Những ô đích
  const [results, setResults] = useState({}); // Lịch sử ghép đúng: { rightId: leftItem }
  
  // STATE MỚI: Lưu trữ thẻ bên trái đang được người dùng bấm chọn
  const [selectedLeftItem, setSelectedLeftItem] = useState(null);
  
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedPeriod) return;

    setLoading(true);
    fetch(`http://localhost:5000/api/matching/random?lessonId=${selectedPeriod}`)
      .then(res => {
        if (!res.ok) return res.json().then(err => { throw new Error(err.message) });
        return res.json();
      })
      .then(data => {
        if (!data || !data.pairs) throw new Error("Dữ liệu không hợp lệ!");
        setGame(data);
        
        // Lấy ngẫu nhiên 5 cặp dữ kiện
        const sampledPairs = data.pairs
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);

        // Xáo trộn cột trái
        setLeftItems(sampledPairs.map((p, i) => ({ id: `left-${i}`, content: p.left, match: p.right })).sort(() => Math.random() - 0.5));
        // Xáo trộn cột phải
        setRightItems(sampledPairs.map((p, i) => ({ id: `right-${i}`, content: p.right })).sort(() => Math.random() - 0.5));
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi Mode 4:", err);
        setGame({ error: err.message });
        setLoading(false);
      });
  }, [selectedPeriod]);

  // Hàm xử lý khi người dùng bấm vào ô đích bên phải
  const handleRightItemClick = (rightBox) => {
    // 1. Nếu ô đích đã được ghép đúng rồi thì không làm gì cả
    if (results[rightBox.id]) return;

    // 2. Nếu chưa chọn thẻ bên trái thì nhắc nhở
    if (!selectedLeftItem) {
        alert("Hãy chọn một thẻ 'Dữ Kiện' bên trên trước nhé!");
        return;
    }

    // 3. Kiểm tra tính chính xác
    if (selectedLeftItem.match === rightBox.content) {
        // Ghép đúng
        const newResults = { ...results, [rightBox.id]: selectedLeftItem };
        setResults(newResults);
        
        // Xóa thẻ bên trái khỏi danh sách chờ
        setLeftItems(prev => prev.filter(item => item.id !== selectedLeftItem.id));
        setScore(prev => prev + 10);
        setSelectedLeftItem(null); // Bỏ trạng thái đang chọn

        // Kiểm tra chiến thắng
        if (Object.keys(newResults).length === rightItems.length) {
            setIsFinished(true);
        }
    } else {
        // Ghép sai
        alert("Chưa chính xác! Dữ kiện này không thuộc về mốc lịch sử đó.");
        setSelectedLeftItem(null); // Hủy chọn để ng chơi chọn lại
    }
  };

  if (!selectedPeriod) {
    return (
      <PeriodSelector 
        title="Nối Dữ Kiện Sử"
        description="Chọn một triều đại để bắt đầu thử thách ghép nối các sự kiện, nhân vật!"
        onSelect={(id) => setSelectedPeriod(id)}
        onBack={() => navigate('/modes')}
      />
    );
  }

  if (loading || !game) return <div className="p-8 text-center text-amber-900 font-bold text-xl">Đang thiết lập sa bàn...</div>;

  if (game?.error) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-800 mb-4 font-bold text-xl">{game.error}</p>
        <button onClick={() => setSelectedPeriod(null)} className="btn-historical">Chọn thời kỳ khác</button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 min-h-screen max-w-5xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow border-2 border-amber-200">
        <button onClick={() => navigate('/modes')} className="font-bold text-amber-900 hover:text-red-600 transition flex items-center gap-2">
           <span className="text-2xl"></span> Thoát
        </button>
        <h2 className="text-xl md:text-3xl font-black text-amber-900 uppercase tracking-widest text-center">{game?.title || "Nối Dữ Kiện"}</h2>
        <div className="text-lg md:text-xl font-black text-amber-700 bg-amber-100 px-4 py-2 rounded-lg">Điểm: {score}</div>
      </div>

      {/* HIỂN THỊ HƯỚNG DẪN DÀNH RIÊNG CHO ĐIỆN THOẠI */}
      <div className="mb-6 text-center text-amber-800 font-bold bg-amber-100 p-3 rounded-lg border border-amber-300 w-full animate-fade-in">
         {selectedLeftItem ? (
            <span className="text-blue-700">👇 Đang chọn: <b>{selectedLeftItem.content}</b>. Hãy chạm vào ô đích phù hợp bên dưới!</span>
         ) : (
            <span>💡 Mẹo: Chạm vào 1 thẻ "Dữ kiện" rồi chạm vào "Điểm đến" tương ứng để ghép.</span>
         )}
      </div>

      <div className="flex flex-col md:flex-row w-full gap-8 justify-between items-stretch">
        
        {/* CỘT TRÁI: DANH SÁCH DỮ KIỆN CẦN CHỌN */}
        <div className="flex-1 bg-amber-50 p-4 md:p-6 rounded-xl border-2 border-solid border-amber-300 shadow-inner">
          <h3 className="text-center font-black mb-6 text-amber-900 uppercase tracking-widest border-b-2 border-amber-200 pb-2">📦 Dữ kiện chờ ghép</h3>
          
          <div className="flex flex-col gap-3">
              {leftItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setSelectedLeftItem(item)}
                    className={`p-4 rounded-xl shadow-md font-bold text-center transition-all duration-200 transform ${
                        selectedLeftItem?.id === item.id 
                        ? 'bg-amber-600 text-white border-4 border-amber-800 scale-[1.02] shadow-xl ring-4 ring-amber-300' 
                        : 'bg-white text-gray-800 border-2 border-amber-700 hover:bg-amber-100'
                    }`}
                >
                    {item.content}
                </button>
              ))}
              {leftItems.length === 0 && (
                  <div className="text-center text-green-600 font-bold italic py-8">Đã ghép hết dữ kiện!</div>
              )}
          </div>
        </div>

        {/* CỘT PHẢI: CÁC Ô ĐÍCH ĐỂ NHẬN DỮ KIỆN */}
        <div className="flex-1 flex flex-col gap-4">
          <h3 className="text-center font-black mb-2 text-amber-900 uppercase tracking-widest border-b-2 border-amber-200 pb-2">🎯 Điểm đến</h3>
          
          {rightItems.map((rightBox) => {
              const isMatched = results[rightBox.id];
              
              return (
                  <button
                    key={rightBox.id}
                    onClick={() => handleRightItemClick(rightBox)}
                    disabled={isMatched} // Khóa nút nếu đã ghép đúng
                    className={`p-4 md:p-6 rounded-xl border-2 transition-all flex flex-col items-center justify-center min-h-[100px] w-full text-center ${
                        isMatched 
                        ? 'bg-green-100 border-green-600 border-solid shadow-inner cursor-default opacity-90' 
                        : selectedLeftItem 
                            ? 'bg-blue-50 border-blue-500 border-dashed hover:bg-blue-100 hover:scale-[1.02] cursor-pointer animate-pulse' 
                            : 'bg-white border-gray-400 border-dashed hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    {isMatched ? (
                      <div className="animate-bounce-in w-full">
                        <span className="text-green-900 font-black text-lg block mb-2">{isMatched.content}</span>
                        <div className="text-sm text-green-700 font-bold border-t-2 border-green-300 pt-2 w-full">
                           ✓ {rightBox.content}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 font-bold text-base md:text-lg">
                          {rightBox.content}
                      </span>
                    )}
                  </button>
              );
          })}
        </div>
      </div>

      {isFinished && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border-4 border-amber-600 animate-bounce-in">
            <span className="text-6xl mb-4 block">🏆</span>
            <h2 className="text-3xl md:text-4xl font-black text-green-600 mb-2 uppercase">Thông suốt!</h2>
            <p className="text-gray-600 font-bold mb-8 italic">Bạn đã ghi được {score} XP vào sử sách.</p>
            <div className="flex gap-4">
                <button onClick={() => window.location.reload()} className="btn-historical flex-1 py-4 text-sm bg-green-700">
                    Chơi lại
                </button>
                <button onClick={() => navigate('/modes')} className="btn-historical flex-1 py-4 text-sm bg-amber-900">
                    Thoát
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}