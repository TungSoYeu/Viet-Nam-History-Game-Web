import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Target, Trophy, Lightbulb } from 'lucide-react';
import PeriodSelector from '../components/PeriodSelector';
import API_BASE_URL from '../config/api';

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
    fetch(`${API_BASE_URL}/api/matching/random?lessonId=${selectedPeriod}`)
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
        setLeftItems(sampledPairs.map((p, i) => ({ id: `left-${i}`, content: p.left, match: p.right, image: p.image })).sort(() => Math.random() - 0.5));
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
            // Save XP when game is completed
            const xpGained = score + 10; // current score + this match's points
            const userId = localStorage.getItem('userId');
            if (userId) {
              fetch(`${API_BASE_URL}/api/user/add-xp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, xp: xpGained })
              }).catch(err => console.error("Error saving XP:", err));
            }
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

  if (loading || !game) return <div className="min-h-screen flex items-center justify-center p-8 text-center text-amber-500 font-bold text-2xl" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>Đang thiết lập sa bàn...</div>;

  if (game?.error) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <p className="text-red-400 mb-6 font-bold text-xl drop-shadow-md">{game.error}</p>
        <button onClick={() => setSelectedPeriod(null)} className="btn-primary py-4 px-8 text-sm font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition">Chọn thời kỳ khác</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center mb-8 p-4 rounded-2xl shadow-xl border gap-2" style={{ background: '#16213e', borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex justify-start">
            <button onClick={() => navigate('/modes')} className="btn-primary px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm flex items-center gap-1 md:gap-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition">
               <ArrowLeft size={18} /> <span className="hidden sm:inline">Thoát</span>
            </button>
          </div>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-widest text-center text-transparent bg-clip-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ backgroundImage: 'linear-gradient(135deg, #f0d48a 0%, #d4a053 100%)' }}>{game?.title || "Nối Dữ Kiện"}</h2>
          <div className="flex justify-end">
            <div className="text-sm md:text-xl font-black text-amber-400 px-3 py-1.5 md:px-4 md:py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Điểm: {score}</div>
          </div>
        </div>

        {/* HIỂN THỊ HƯỚNG DẪN DÀNH RIÊNG CHO ĐIỆN THOẠI */}
        <div className="mb-8 text-center font-bold p-4 rounded-xl border w-full animate-fade-in flex flex-col sm:flex-row items-center justify-center gap-3 backdrop-blur-md shadow-lg" style={{ background: 'rgba(212,160,83,0.1)', borderColor: 'rgba(212,160,83,0.3)', color: '#f0d48a' }}>
           <Lightbulb size={24} className="text-amber-400 drop-shadow-md" />
           {selectedLeftItem ? (
              <span className="text-white">Đang chọn: <b className="text-amber-400 text-lg ml-1">{selectedLeftItem.content}</b>. Hãy chạm vào ô đích phù hợp bên dưới!</span>
           ) : (
              <span>Mẹo: Chạm vào 1 thẻ "Dữ kiện" (Trái) rồi chạm vào "Điểm đến" (Phải) để ghép.</span>
           )}
        </div>

        <div className="grid grid-cols-2 w-full gap-3 md:gap-8 items-start">
        
        {/* CỘT TRÁI: DANH SÁCH DỮ KIỆN CẦN CHỌN */}
        <div className="w-full p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-xl border" style={{ background: '#0f3460', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h3 className="text-center font-black mb-4 md:mb-6 text-amber-400 uppercase tracking-widest border-b pb-2 md:pb-4 flex items-center justify-center gap-2 drop-shadow-sm text-sm md:text-base" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <Package size={24} /> Dữ kiện chờ ghép
          </h3>
          
          <div className="flex flex-col gap-4">
              {leftItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setSelectedLeftItem(item)}
                    className={`flex flex-col xl:flex-row items-center gap-2 xl:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg font-bold text-center xl:text-left transition-all duration-300 transform border outline-none ${
                        selectedLeftItem?.id === item.id 
                        ? 'bg-amber-600 text-white scale-[1.03] shadow-2xl ring-2 md:ring-4 ring-amber-400/50 z-10' 
                        : 'bg-[#16213e] text-white hover:bg-white/10 hover:scale-[1.01]'
                    }`}
                    style={{ borderColor: selectedLeftItem?.id === item.id ? 'transparent' : 'rgba(255,255,255,0.1)' }}
                >
                    {item.image && (
                      <div className="w-12 h-12 md:w-20 md:h-20 shrink-0 rounded-lg md:rounded-xl overflow-hidden border border-white/20 shadow-md">
                        <img src={item.image} alt="Dữ kiện" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="flex-1 text-sm md:text-base leading-snug md:leading-relaxed">{item.content}</span>
                </button>
              ))}
              {leftItems.length === 0 && (
                  <div className="text-center font-bold italic py-8 text-green-400 drop-shadow-md text-lg">Đã ghép hết dữ kiện!</div>
              )}
          </div>
        </div>

        {/* CỘT PHẢI: CÁC Ô ĐÍCH ĐỂ NHẬN DỮ KIỆN */}
        <div className="w-full flex flex-col gap-4 md:gap-5">
          <h3 className="text-center font-black mb-1 text-green-400 uppercase tracking-widest border-b pb-2 md:pb-4 flex items-center justify-center gap-2 drop-shadow-sm text-sm md:text-base" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <Target size={24} className="hidden md:block" /> Điểm đến
          </h3>
          
          {rightItems.map((rightBox) => {
              const isMatched = results[rightBox.id];
              
              return (
                  <button
                    key={rightBox.id}
                    onClick={() => handleRightItemClick(rightBox)}
                    disabled={isMatched}
                    className={`relative p-3 md:p-6 rounded-xl md:rounded-2xl transition-all flex flex-col items-center justify-center min-h-[80px] md:min-h-[120px] w-full text-center outline-none border-2 shadow-lg backdrop-blur-sm overflow-hidden ${
                        isMatched 
                        ? 'bg-green-900/40 border-green-500 cursor-default opacity-100' 
                        : selectedLeftItem 
                            ? 'bg-indigo-900/40 border-indigo-400 border-dashed hover:bg-indigo-800/60 hover:scale-[1.02] cursor-pointer ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#1a1a2e]' 
                            : 'bg-[#16213e] border-gray-500 border-dashed hover:bg-white/5 cursor-pointer'
                    }`}
                  >
                    {isMatched ? (
                      <div className="animate-bounce-in w-full flex flex-col items-center gap-2 md:gap-3">
                        <div className="flex flex-col xl:flex-row items-center justify-center gap-2 md:gap-4 w-full">
                          {isMatched.image && (
                            <img src={isMatched.image} alt="Dữ kiện" className="w-10 h-10 md:w-16 md:h-16 rounded-md md:rounded-lg object-cover border border-white/20 shadow-md" />
                          )}
                          <span className="font-bold text-white text-xs md:text-base">{isMatched.content}</span>
                        </div>
                        <div className="w-full h-[1px] bg-white/20 my-1 md:my-0"></div>
                        <span className="font-bold text-amber-200 text-[10px] md:text-sm">{rightBox.content}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-white/80 text-sm md:text-lg">{rightBox.content}</span>
                    )}
                  </button>
              );
          })}
        </div>
      </div>

      {isFinished && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4 animate-fade-in" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border relative overflow-hidden animate-bounce-in" style={{ background: '#16213e', borderColor: 'rgba(212,160,83,0.3)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            <Trophy size={80} className="text-amber-400 mb-6 mx-auto drop-shadow-lg" />
            <h2 className="text-3xl md:text-4xl font-black text-green-400 mb-2 uppercase drop-shadow-md relative z-10">Thông suốt!</h2>
            <p className="text-white font-bold mb-8 italic relative z-10">Bạn đã ghi được <span className="text-amber-400 font-black text-xl mx-1">{score}</span> XP vào sử sách.</p>
            <div className="flex gap-4 relative z-10">
                <button onClick={() => window.location.reload()} className="btn-primary flex-1 py-4 text-sm font-bold bg-green-600 hover:bg-green-500 text-white rounded-xl transition">
                    Chơi lại
                </button>
                <button onClick={() => navigate('/modes')} className="btn-primary flex-1 py-4 text-sm font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition">
                    Thoát
                </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}