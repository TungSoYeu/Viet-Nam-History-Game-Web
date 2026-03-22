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

  if (loading) return <div className="min-h-screen bg-amber-50 text-amber-900 flex items-center justify-center text-2xl font-bold">Đang tải thử thách...</div>;

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
    <div className="p-4 md:p-6 min-h-screen max-w-3xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow border-2 border-amber-200">
        <button onClick={() => navigate('/modes')} className="font-bold text-amber-900 hover:text-red-600 flex items-center gap-2 transition-colors">
           <ArrowLeft size={20} /> Thoát
        </button>
        <h2 className="text-xl md:text-3xl font-black text-amber-900 uppercase tracking-widest text-center flex items-center gap-2">
          <History size={28} /> Dòng Chảy Lịch Sử
        </h2>
      </div>

      <div className="bg-amber-100 p-4 rounded-xl border border-amber-300 w-full mb-6 text-center text-amber-900 font-bold flex items-center justify-center gap-2 text-sm md:text-base">
         Sử dụng nút <ArrowUp size={18} /> <ArrowDown size={18} /> để sắp xếp các sự kiện từ Xưa nhất (Trên) đến Gần nhất (Dưới).
      </div>

      <div className="w-full flex flex-col gap-3">
        {events.map((ev, index) => (
          <div key={ev._id || index} className="flex bg-white rounded-xl shadow border-2 border-amber-700 overflow-hidden">
            <div className="w-12 bg-amber-800 flex items-center justify-center text-white font-black text-xl border-r-2 border-amber-900">
                {index + 1}
            </div>
            <div className="flex-1 p-4 font-bold text-gray-800 flex items-center">
                {ev.text}
            </div>
            <div className="flex flex-col border-l-2 border-amber-200 bg-amber-50">
                <button onClick={() => moveUp(index)} disabled={index === 0} className="px-4 py-2 hover:bg-amber-200 disabled:opacity-30 border-b border-amber-200 flex items-center justify-center">
                    <ArrowUp size={18} />
                </button>
                <button onClick={() => moveDown(index)} disabled={index === events.length - 1} className="px-4 py-2 hover:bg-amber-200 disabled:opacity-30 flex items-center justify-center">
                    <ArrowDown size={18} />
                </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={checkOrder} className="mt-8 btn-historical py-4 px-12 text-xl bg-amber-700 text-white w-full md:w-auto rounded-xl">
         Xác Nhận Dòng Lịch Sử
      </button>

      {isFinished && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center border-4 border-amber-600 animate-bounce-in flex flex-col items-center">
            <Trophy size={80} className="text-amber-500 mb-4" />
            <h2 className="text-3xl font-black text-green-600 mb-2 uppercase">Lịch Sử Thông Suốt!</h2>
            <p className="text-gray-600 font-bold mb-6 italic">Bạn được cộng {score} XP.</p>
            <div className="flex gap-4">
                <button onClick={() => window.location.reload()} className="btn-historical flex-1 py-3 bg-green-700 text-white rounded-xl">
                    Chơi ván mới
                </button>
                <button onClick={() => navigate('/modes')} className="btn-historical flex-1 py-3 bg-amber-900 text-white rounded-xl">
                    Tuyệt vời
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
