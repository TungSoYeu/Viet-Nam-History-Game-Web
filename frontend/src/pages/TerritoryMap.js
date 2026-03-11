import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapBackground from '../assets/ban-do-viet-nam.jpg'; 

export default function TerritoryMap() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  
  // DỮ LIỆU TỌA ĐỘ
  const regions = [
    { id: 'DienBienPhu', name: 'Điện Biên Phủ', top: '13.55%', left: '20.18%' },
    { id: 'ChiLang', name: 'Ải Chi Lăng', top: '13.36%', left: '41.75%' },
    { id: 'ThangLong', name: 'Thăng Long', top: '17.74%', left: '37.12%' },
    { id: 'BachDang', name: 'Sông Bạch Đằng', top: '19.04%', left: '44.87%' },
    { id: 'LamSon', name: 'Lam Sơn', top: '25.66%', left: '35.00%' },
    { id: 'PhuXuan', name: 'Phú Xuân', top: '48.73%', left: '48.50%' },
    { id: 'DaNang', name: 'Đà Nẵng', top: '75.81%', left: '49.00%' },
    { id: 'ThiNai', name: 'Thị Nại', top: '63.16%', left: '57.87%' },
    { id: 'GiaDinh', name: 'Gia Định', top: '85.00%', left: '43.00%' },
    { id: 'RachGam', name: 'Rạch Gầm', top: '87.16%', left: '39.87%' },
    { id: 'ConDao', name: 'Côn Đảo', top: '98.52%', left: '38.87%' }
  ];

  const [unlockedTerritories, setUnlockedTerritories] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [devCoords, setDevCoords] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/leaderboard')
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
    fetch(`http://localhost:5000/api/territory/questions/${selectedRegion.id}`)
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
    if (selectedOption === currentQ.correctAnswer) {
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
    fetch('http://localhost:5000/api/territory/unlock', {
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

  const handleGetCoordinates = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDevCoords({ top: y.toFixed(2), left: x.toFixed(2) });
  };

  const copyToClipboard = () => {
    if (devCoords) {
      const codeStr = `top: '${devCoords.top}%', left: '${devCoords.left}%'`;
      navigator.clipboard.writeText(codeStr);
      alert('Đã copy: ' + codeStr);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center relative">
      <div className="responsive-container py-8 w-full max-w-7xl px-4">
        <h1 className="text-4xl font-black text-amber-900 mb-8 text-center uppercase tracking-widest">🗺️ Sa Bàn Lãnh Thổ</h1>
        
        {!isPlaying ? (
          <div className="flex flex-col lg:flex-row w-full gap-8 items-start">
            
            {/* CỘT TRÁI: BẢN ĐỒ */}
            <div className="w-full lg:w-2/3 bg-blue-50 border-2 border-amber-800 rounded-2xl shadow-xl flex justify-center items-center p-2 sm:p-4 bg-opacity-50">
              
              {/* ĐÃ SỬA LỖI Ở ĐÂY: Dùng inline-block để cái div này ôm khít rịt vào bức ảnh */}
              <div className="relative inline-block leading-none">
                  
                  <img 
                      src={MapBackground} 
                      alt="Bản đồ Việt Nam" 
                      // Đảm bảo ảnh giữ đúng tỉ lệ gốc
                      className="max-w-full max-h-[75vh] w-auto h-auto block opacity-95 cursor-crosshair rounded-lg shadow-inner"
                      onClick={handleGetCoordinates}
                  />

                  {/* Chấm đỏ của Tool đo tọa độ */}
                  {devCoords && (
                    <div 
                      className="absolute w-4 h-4 bg-red-600 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none shadow-lg animate-pulse"
                      style={{ top: `${devCoords.top}%`, left: `${devCoords.left}%` }}
                    />
                  )}

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
                        <div className="absolute top-full mt-1 bg-amber-900 text-white text-[10px] sm:text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity font-bold border border-amber-500 z-50">
                            {region.name}
                        </div>
                      </div>
                  )
                  })}
              </div>

            </div>

            {/* CỘT PHẢI: THÔNG TIN CHIẾN DỊCH */}
            <div className="w-full lg:w-1/3 lg:sticky lg:top-8">
               <div className="bg-white border-2 border-amber-300 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
                {selectedRegion ? (
                  <div className="animate-fade-in w-full">
                    <h2 className="text-2xl font-black text-amber-900 mb-4 border-b-2 border-amber-200 pb-2 uppercase">
                      Chiến dịch: {selectedRegion.name}
                    </h2>
                    <p className="text-gray-600 mb-8 italic leading-relaxed">
                      "Hào khí ngút trời, quân ta đã sẵn sàng chiếm lĩnh cứ điểm này. Hãy dùng trí tuệ để dẫn lối!"
                    </p>
                    <button onClick={startConquest} className="w-full py-4 text-xl bg-red-800 hover:bg-red-900 text-white font-bold rounded-lg shadow-md transition-colors">
                      ⚔️ Xuất Quân
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-400 italic">
                    <span className="text-6xl block mb-6 opacity-50">☝️</span>
                    <p className="mb-2 font-bold text-lg text-amber-800">Chọn Cứ Điểm</p>
                    <p className="text-sm">Nhấn vào một chiếc khiên trên bản đồ để bắt đầu cuộc chinh phạt của bạn.</p>
                  </div>
                )}
               </div>
            </div>
          </div>
        ) : (
          /* GIAO DIỆN TRẢ LỜI CÂU HỎI */
          <div className="max-w-3xl mx-auto mt-4 w-full">
            <div className="bg-white p-8 rounded-xl shadow-2xl border-t-8 border-red-800">
              <div className="mb-8 text-xs font-black text-amber-700 flex justify-between uppercase tracking-widest border-b border-amber-100 pb-4">
                <span>📍 {selectedRegion.name}</span>
                <span>Thử thách: {currentQIndex + 1} / {questions.length}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-10 text-gray-800 leading-snug text-center italic">
                "{questions[currentQIndex].content}"
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                {questions[currentQIndex].options.map((opt, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleAnswer(opt)}
                    className="p-5 bg-white border-2 border-amber-200 rounded-xl hover:border-amber-600 hover:bg-amber-50 font-bold text-left transition-all text-lg active:scale-95 shadow-sm hover:shadow-md"
                  >
                    <span className="text-amber-700 mr-4 font-black">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="w-full flex justify-center mt-12">
          <button onClick={() => navigate('/modes')} className="text-amber-900 font-bold uppercase tracking-widest hover:text-red-800 transition-colors flex items-center gap-2">
            « Quay lại sảnh chính
          </button>
        </div>
      </div>

      {/* PANEL TOOL ĐO TỌA ĐỘ TRÔI NỔI */}
      {devCoords && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-green-400 p-5 rounded-lg shadow-2xl z-[100] border border-green-500 font-mono text-sm min-w-[250px] animate-fade-in">
          <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
            <p className="font-bold text-white flex items-center gap-2"><span>🎯</span> Tool Lấy Tọa Độ</p>
            <button onClick={() => setDevCoords(null)} className="text-gray-400 hover:text-red-400 font-bold">✕</button>
          </div>
          <div className="bg-black p-3 rounded mb-3">
             <p>top: <span className="text-yellow-300">'{devCoords.top}%'</span>,</p>
             <p>left: <span className="text-yellow-300">'{devCoords.left}%'</span></p>
          </div>
          <button
            onClick={copyToClipboard}
            className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-2 rounded transition-colors"
          >
            📋 Copy Code Này
          </button>
        </div>
      )}

    </div>
  );
}