import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import MapBackground from '../assets/ban-do-viet-nam.jpg'; 
import API_BASE_URL from '../config/api';

export default function TerritoryMap() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  
  // DỮ LIỆU TỌA ĐỘ
  const regions = [
    { id: 'HatMon', name: 'Hát Môn', top: '16.50%', left: '35.50%' },
    { id: 'ChiLang', name: 'Ải Chi Lăng', top: '13.36%', left: '41.75%' },
    { id: 'ThangLong', name: 'Thăng Long', top: '17.74%', left: '37.12%' },
    { id: 'YenThe', name: 'Yên Thế', top: '15.36%', left: '40.75%' },
    { id: 'BachDang', name: 'Sông Bạch Đằng', top: '19.04%', left: '44.87%' },
    { id: 'LamSon', name: 'Lam Sơn', top: '25.66%', left: '35.00%' },
    { id: 'NganNua', name: 'Ngàn Nưa', top: '27.50%', left: '34.00%' },
    { id: 'HuongKhe', name: 'Hương Khê', top: '32.16%', left: '39.87%' },
    { id: 'VamCoDong', name: 'Vàm Cỏ Đông', top: '84.50%', left: '41.50%' },
    { id: 'GiaDinh', name: 'Gò Công (Gia Định)', top: '85.00%', left: '43.00%' },
    { id: 'RachGia', name: 'Rạch Giá', top: '89.00%', left: '35.00%' }
  ];

  const [unlockedTerritories, setUnlockedTerritories] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/leaderboard`)
      .then(res => res.json())
      .then(data => {
        const currentUser = data.find(u => u._id === userId);
        if (currentUser && currentUser.unlockedTerritories) {
          setUnlockedTerritories(currentUser.unlockedTerritories);
        }
      });
  }, [userId]);

  const handleRegionClick = (region) => {
    if (unlockedTerritories.includes(region.id)) {
      alert(`Bạn đã làm chủ vùng đất ${region.name}!`);
      return;
    }
    setSelectedRegion(region);
  };

  const startConquest = () => {
    fetch(`${API_BASE_URL}/api/territory/questions/${selectedRegion.id}`)
      .then(res => res.json())
      .then(data => {
        if (!data || data.length === 0) {
          alert("Chưa có câu hỏi cho vùng đất này!");
          setSelectedRegion(null);
          return;
        }
        setQuestions(data);
        setCurrentQIndex(0);
        setIsPlaying(true);
      })
      .catch(err => console.error("Lỗi:", err));
  };

  const handleAnswer = (selectedOption) => {
    const currentQ = questions[currentQIndex];
    if (!currentQ) return;
    
    const userStr = String(selectedOption || "").toLowerCase().trim();
    const correctStr = String(currentQ.correctAnswer || "").toLowerCase().trim();

    if (userStr === correctStr) {
      if (currentQIndex + 1 < questions.length) {
        setCurrentQIndex(currentQIndex + 1);
      } else {
        handleUnlock(); 
      }
    } else {
      alert(`Sai rồi! Đáp án đúng là: ${currentQ.correctAnswer}. Đạo quân của bạn đã rút lui.`);
      setIsPlaying(false);
      setSelectedRegion(null);
    }
  };

  const handleUnlock = () => {
    fetch(`${API_BASE_URL}/api/territory/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, location: selectedRegion.id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setUnlockedTerritories(data.unlockedTerritories);
        alert(`🎉 Chúc mừng! Bạn đã cắm cờ thành công tại ${selectedRegion.name}!`);
        setIsPlaying(false);
        setSelectedRegion(null);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="responsive-container py-8 w-full max-w-7xl px-4">
        <h1 className="text-4xl font-black mb-8 text-center uppercase tracking-widest" style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🗺️ Sa Bàn Lãnh Thổ</h1>
        
        {!isPlaying ? (
          <div className="flex flex-col lg:flex-row w-full gap-8 items-start">
            
            {/* CỘT TRÁI: BẢN ĐỒ */}
            <div className="w-full lg:w-2/3 rounded-2xl shadow-xl flex justify-center items-center p-2 sm:p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              
              <div className="relative inline-block leading-none">
                  
                  <img 
                      src={MapBackground} 
                      alt="Bản đồ Việt Nam" 
                      className="max-w-full max-h-[75vh] w-auto h-auto block opacity-95 rounded-lg shadow-inner"
                  />

                  {/* Render Khiên/Cờ */}
                  {regions.map(region => {
                  const isUnlocked = unlockedTerritories.includes(region.id);
                  const isSelected = selectedRegion?.id === region.id;
                  
                  return (
                      <div 
                      key={region.id}
                      onClick={(e) => {
                          e.stopPropagation(); 
                          handleRegionClick(region);
                      }}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center group transition-all duration-300 ${isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-10'}`}
                      style={{ top: region.top, left: region.left }}
                      >
                        <div className={`text-xl sm:text-2xl filter drop-shadow-lg ${!isUnlocked && !isSelected && 'animate-bounce'}`}>
                            {isUnlocked ? '🚩' : isSelected ? '⚔️' : '🛡️'}
                        </div>
                        <div className="absolute top-full mt-1 text-white text-[10px] sm:text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity font-bold z-50" style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(212,160,83,0.5)' }}>
                            {region.name}
                        </div>
                      </div>
                  )
                  })}
              </div>

            </div>

            {/* CỘT PHẢI: THÔNG TIN CHIẾN DỊCH */}
            <div className="w-full lg:w-1/3 lg:sticky lg:top-8">
               <div className="rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center min-h-[300px]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {selectedRegion ? (
                  <div className="animate-fade-in w-full">
                    <h2 className="text-2xl font-black mb-4 pb-2 uppercase" style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      Chiến dịch: {selectedRegion.name}
                    </h2>
                    <p className="mb-8 italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      "Hào khí ngút trời, quân ta đã sẵn sàng chiếm lĩnh cứ điểm này. Hãy dùng trí tuệ để dẫn lối!"
                    </p>
                    <button onClick={startConquest} className="w-full py-4 text-xl text-white font-bold rounded-lg shadow-md transition-colors" style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}>
                      ⚔️ Xuất Quân
                    </button>
                  </div>
                ) : (
                  <div style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <p className="mb-2 font-bold text-lg" style={{ color: 'rgba(212,160,83,0.8)' }}>Chọn Cứ Điểm</p>
                    <p className="text-sm">Nhấn vào một chiếc khiên trên bản đồ để bắt đầu cuộc chinh phạt của bạn.</p>
                  </div>
                )}
               </div>
            </div>
          </div>
        ) : (
          /* GIAO DIỆN TRẢ LỜI CÂU HỎI */
          <div className="max-w-3xl mx-auto mt-4 w-full">
            <div className="p-8 rounded-xl shadow-2xl" style={{ background: '#16213e', border: '1px solid rgba(255,255,255,0.1)', borderTop: '4px solid rgba(220,38,38,0.8)' }}>
              <div className="mb-8 text-xs font-black flex justify-between uppercase tracking-widest pb-4" style={{ color: 'rgba(212,160,83,0.8)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span>📍 {selectedRegion.name}</span>
                <span>Thử thách: {currentQIndex + 1} / {questions.length}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-10 text-white leading-snug text-center italic">
                "{questions[currentQIndex].content}"
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                {questions[currentQIndex].options.map((opt, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleAnswer(opt)}
                    className="p-5 rounded-xl font-bold text-left transition-all text-lg text-white active:scale-95 shadow-sm hover:shadow-md"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                    onMouseEnter={(e) => { e.target.style.background = 'rgba(212,160,83,0.15)'; e.target.style.borderColor = 'rgba(212,160,83,0.5)'; }}
                    onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  >
                    <span className="text-amber-500 mr-4 font-black">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="w-full flex justify-center mt-12">
          <button onClick={() => navigate('/modes')} className="font-bold uppercase tracking-widest flex items-center gap-2 transition-colors" style={{ color: 'rgba(212,160,83,0.7)' }}>
            « Quay lại sảnh chính
          </button>
        </div>
      </div>
    </div>
  );
}