import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUp, ArrowDown, Trophy, History } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

export default function ChronologicalMode() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/chronological/random`);
        // Trộn ngẫu nhiên các sự kiện để người chơi sắp xếp
        const shuffled = [...res.data.events].sort(() => Math.random() - 0.5);
        setEvents(shuffled);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chronological events:", err);
        alert("Lỗi tải dữ liệu!");
        navigate('/modes');
      }
    };
    fetchEvents();
  }, [navigate]);

  const saveXP = async (xpGained) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      await axios.post(`${API_BASE_URL}/api/user/add-xp`, { userId, xp: xpGained });
    } catch (err) {
      console.error("Error saving XP:", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="text-xl font-bold text-amber-400 animate-pulse">Đang tải thử thách...</div>
    </div>
  );

  const moveUp = (index) => {
    if (index === 0) return;
    const newEvents = [...events];
    const temp = newEvents[index - 1];
    newEvents[index - 1] = newEvents[index];
    newEvents[index] = temp;
    setEvents(newEvents);
  };

  const moveDown = (index) => {
    if (index === events.length - 1) return;
    const newEvents = [...events];
    const temp = newEvents[index + 1];
    newEvents[index + 1] = newEvents[index];
    newEvents[index] = temp;
    setEvents(newEvents);
  };

  const checkOrder = () => {
    let isCorrect = true;
    for (let i = 0; i < events.length; i++) {
      // Vì order bắt đầu từ 1, index bắt đầu từ 0
      if (events[i].order !== i + 1) {
        isCorrect = false;
        break;
      }
    }
    
    if (isCorrect) {
      const xpGained = 50;
      setScore(xpGained);
      setIsFinished(true);
      saveXP(xpGained);
    } else {
      alert("Sai thứ tự rồi! Hãy đọc kỹ lại các cột mốc nhé.");
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen max-w-3xl mx-auto flex flex-col items-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      {/* Header */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3 mb-6 sm:mb-8 p-4 rounded-xl shadow" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex justify-center sm:justify-start">
          <button onClick={() => navigate('/modes')} className="font-bold flex items-center gap-2 transition-colors text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
             <ArrowLeft size={18} /> Thoát
          </button>
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-widest text-center flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <History size={24} className="text-amber-500 hidden sm:block" /> Dòng Chảy Lịch Sử
        </h2>
        <div className="hidden sm:flex justify-end"></div>
      </div>

      {/* Instructions */}
      <div className="p-3 sm:p-4 rounded-xl w-full mb-6 text-center font-bold flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm" style={{ background: 'rgba(212,160,83,0.1)', border: '1px solid rgba(212,160,83,0.2)', color: '#f0d48a' }}>
         Sử dụng nút <ArrowUp size={16} /> <ArrowDown size={16} /> để sắp xếp từ Xưa nhất (Trên) đến Gần nhất (Dưới).
      </div>

      {/* Event list */}
      <div className="w-full flex flex-col gap-3">
        {events.map((ev, index) => (
          <div key={ev._id || index} className="flex rounded-xl sm:rounded-2xl overflow-hidden shadow-lg animate-fade-in" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="w-10 sm:w-12 flex items-center justify-center text-white font-black text-base sm:text-xl shrink-0" style={{ background: 'rgba(212,160,83,0.15)', borderRight: '1px solid rgba(212,160,83,0.2)' }}>
                {index + 1}
            </div>
            <div className="flex-1 p-3 sm:p-4 font-bold text-white text-sm sm:text-base flex items-center leading-snug">
                {ev.text}
            </div>
            <div className="flex flex-col shrink-0" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                <button 
                  onClick={() => moveUp(index)} 
                  disabled={index === 0} 
                  className="px-3 sm:px-4 py-2 sm:py-3 disabled:opacity-20 flex items-center justify-center text-amber-400 transition-colors"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  onMouseEnter={(e) => { if(index !== 0) e.target.style.background = 'rgba(212,160,83,0.15)'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
                >
                    <ArrowUp size={16} />
                </button>
                <button 
                  onClick={() => moveDown(index)} 
                  disabled={index === events.length - 1} 
                  className="px-3 sm:px-4 py-2 sm:py-3 disabled:opacity-20 flex items-center justify-center text-amber-400 transition-colors"
                  onMouseEnter={(e) => { if(index !== events.length - 1) e.target.style.background = 'rgba(212,160,83,0.15)'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
                >
                    <ArrowDown size={16} />
                </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={checkOrder} className="mt-8 btn-primary py-3.5 sm:py-4 px-8 sm:px-12 text-base sm:text-lg w-full sm:w-auto rounded-xl font-bold">
         Xác Nhận Dòng Lịch Sử
      </button>

      {/* Victory Modal */}
      {isFinished && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl text-center animate-bounce-in flex flex-col items-center max-w-md w-full" style={{ background: '#16213e', border: '1px solid rgba(212,160,83,0.3)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
            <Trophy size={64} className="text-amber-400 mb-4 drop-shadow-lg" />
            <h2 className="text-2xl sm:text-3xl font-black text-green-400 mb-2 uppercase">Lịch Sử Thông Suốt!</h2>
            <p className="font-bold mb-6 italic" style={{ color: 'rgba(255,255,255,0.5)' }}>Bạn được cộng {score} XP.</p>
            <div className="flex gap-3 sm:gap-4 w-full">
                <button onClick={() => window.location.reload()} className="flex-1 py-3 rounded-xl font-bold text-white text-sm transition" style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
                    Chơi ván mới
                </button>
                <button onClick={() => navigate('/modes')} className="flex-1 py-3 rounded-xl font-bold text-sm transition" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                    Tuyệt vời
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
