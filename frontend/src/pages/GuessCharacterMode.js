import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserSearch, PlusCircle, Trophy, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

export default function GuessCharacterMode() {
  const navigate = useNavigate();
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleClues, setVisibleClues] = useState(1);
  const [guess, setGuess] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(50);
  const [resultMsg, setResultMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/guess-character/random`);
        setCharacterData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching guess character:", err);
        alert("Lỗi tải dữ liệu!");
        navigate('/modes');
      }
    };
    fetchData();
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

  const handleOpenClue = () => {
      if (visibleClues < 5) {
          setVisibleClues(prev => prev + 1);
          setScore(prev => prev - 10);
      }
  };

  const handleGuess = () => {
      if (!guess.trim() || !characterData) return;
      
      const normalizedGuess = guess.toLowerCase().trim();
      const namesToMatch = [characterData.name, ...(characterData.aliases || [])];
      const isCorrect = namesToMatch.some(name => 
          normalizedGuess.includes(name.toLowerCase()) || name.toLowerCase().includes(normalizedGuess)
      );

      setIsFinished(true);
      if (isCorrect) {
          setResultMsg("Chính xác! Bạn nhận được " + score + " XP.");
          saveXP(score);
      } else {
          setScore(0);
          setResultMsg("Sai rồi! Đáp án đúng là: " + characterData.name);
      }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-amber-500" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>Đang tìm kiếm dấu vết ẩn tích...</div>;
  if (!characterData || !characterData.clues) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-amber-500" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>Không tìm thấy dữ liệu nhân vật.</div>;

  return (
    <div className="p-4 md:p-6 min-h-screen max-w-2xl mx-auto flex flex-col items-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center mb-8 p-4 rounded-xl shadow gap-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex justify-start">
          <button onClick={() => navigate('/modes')} className="font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
             <ArrowLeft size={20} /> <span className="hidden sm:inline">Thoát</span>
          </button>
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-widest text-center flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <UserSearch size={24} className="text-amber-500" /> Danh Nhân Ẩn Tích
        </h2>
        <div className="flex justify-end"></div>
      </div>

      <div className="w-full flex justify-between items-center mb-4 px-2">
          <span className="font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>Manh mối: {visibleClues}/5</span>
          <span className="font-black text-green-400 text-xl px-4 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
              Phần thưởng: {score} XP
          </span>
      </div>

      {/* Hiển thị các manh mối */}
      <div className="w-full flex flex-col gap-4 mb-8">
          {characterData.clues.slice(0, visibleClues).map((clue, idx) => (
              <div key={idx} className="p-6 rounded-xl border-l-4 shadow-md animate-fade-in text-lg font-bold text-white" style={{ background: 'rgba(255,255,255,0.04)', borderLeftColor: 'rgba(212,160,83,0.8)' }}>
                  <span className="text-amber-500 mr-2">#{idx + 1}:</span> {clue}
              </div>
          ))}
          
          {visibleClues < 5 && !isFinished && (
              <button onClick={handleOpenClue} className="p-4 border-2 border-dashed rounded-xl hover:bg-white/5 transition font-bold flex items-center justify-center gap-2 w-full" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}>
                  <PlusCircle size={20} /> Mở thêm manh mối (Trừ 10 XP)
              </button>
          )}
      </div>

      {/* Form đoán tên */}
      {!isFinished && (
          <div className="w-full flex flex-col md:flex-row gap-4">
              <input 
                  type="text" 
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                  placeholder="Nhập tên nhân vật lịch sử..."
                  className="flex-1 p-4 rounded-xl outline-none text-xl font-bold text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,160,83,0.3)' }}
              />
              <button onClick={handleGuess} className="btn-primary py-4 px-8 rounded-xl whitespace-nowrap">
                  Trả lời
              </button>
          </div>
      )}

      {/* Popup kết quả */}
      {isFinished && (
        <div className="w-full p-8 rounded-2xl shadow-xl text-center animate-bounce-in mt-4 flex flex-col items-center" style={{ background: '#16213e', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
            <div className="mb-4">
                {score > 0 ? <CheckCircle size={64} className="text-green-400" /> : <XCircle size={64} className="text-red-400" />}
            </div>
            <h2 className={`text-3xl font-black mb-2 uppercase ${score > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {score > 0 ? 'Tuyệt vời!' : 'Đáng tiếc!'}
            </h2>
            <p className="text-white font-bold mb-6 text-xl">{resultMsg}</p>
            <div className="text-center mb-6">
                <span className="block text-sm uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Chân dung anh hùng</span>
                <span className="text-4xl font-black uppercase flex items-center justify-center gap-3" style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                   <Trophy size={32} className="text-amber-500" /> {characterData.name}
                </span>
            </div>
            <div className="flex gap-4 w-full">
                <button onClick={() => window.location.reload()} className="flex-1 py-3 rounded-xl font-bold text-white transition" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    Đoán người khác
                </button>
                <button onClick={() => navigate('/modes')} className="btn-primary flex-1 py-3 rounded-xl">
                    Hoàn tất
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
