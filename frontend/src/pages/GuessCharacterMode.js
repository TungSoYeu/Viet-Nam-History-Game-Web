import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserSearch, PlusCircle, Trophy, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

export default function GuessCharacterMode() {
  const navigate = useNavigate();
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleClues, setVisibleClues] = useState(1);
  const [guess, setGuess] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(50); // Mở 1 manh mối là 50 điểm
  const [resultMsg, setResultMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/guess-character/random');
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
      await axios.post('http://localhost:5000/api/user/add-xp', { userId, xp: xpGained });
    } catch (err) {
      console.error("Error saving XP:", err);
    }
  };

  const handleOpenClue = () => {
      if (visibleClues < 5) {
          setVisibleClues(prev => prev + 1);
          setScore(prev => prev - 10); // Trừ 10 điểm mỗi lần mở gợi ý
      }
  };

  const handleGuess = () => {
      if (!guess.trim() || !characterData) return;
      
      const normalizedGuess = guess.toLowerCase().trim();
      // Kiểm tra xem tên chính thức hoặc bất kỳ bí danh nào có khớp không
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

  if (loading) return <div className="min-h-screen history-bg flex items-center justify-center text-amber-900 font-bold text-2xl">Đang tìm kiếm dấu vết ẩn tích...</div>;
  if (!characterData || !characterData.clues) return <div className="min-h-screen history-bg flex items-center justify-center text-amber-900 font-bold text-2xl">Không tìm thấy dữ liệu nhân vật.</div>;

  return (
    <div className="p-4 md:p-6 min-h-screen history-bg max-w-2xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow border-2 border-amber-200">
        <button onClick={() => navigate('/modes')} className="font-bold text-amber-900 hover:text-red-600 flex items-center gap-2 transition-colors">
           <ArrowLeft size={20} /> Thoát
        </button>
        <h2 className="text-xl md:text-3xl font-black text-amber-900 uppercase tracking-widest text-center flex items-center gap-2">
          <UserSearch size={28} /> Danh Nhân Ẩn Tích
        </h2>
      </div>

      <div className="w-full flex justify-between items-center mb-4 px-2">
          <span className="font-bold text-gray-600">Manh mối: {visibleClues}/5</span>
          <span className="font-black text-green-600 text-xl bg-green-100 px-4 py-1 rounded-full border border-green-300">
              Phần thưởng: {score} XP
          </span>
      </div>

      {/* Hiển thị các manh mối */}
      <div className="w-full flex flex-col gap-4 mb-8">
          {characterData.clues.slice(0, visibleClues).map((clue, idx) => (
              <div key={idx} className="bg-amber-50 p-6 rounded-xl border-l-4 border-amber-600 shadow-md animate-fade-in text-lg font-bold text-gray-800">
                  <span className="text-amber-600 mr-2">#{idx + 1}:</span> {clue}
              </div>
          ))}
          
          {visibleClues < 5 && !isFinished && (
              <button onClick={handleOpenClue} className="p-4 border-2 border-dashed border-gray-400 text-gray-500 rounded-xl hover:bg-gray-100 transition font-bold flex items-center justify-center gap-2 w-full">
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
                  className="flex-1 p-4 rounded-xl border-2 border-amber-700 outline-none text-xl font-bold focus:ring-4 focus:ring-amber-200"
              />
              <button onClick={handleGuess} className="btn-historical py-4 px-8 bg-amber-900 text-white rounded-xl whitespace-nowrap">
                  Trả lời
              </button>
          </div>
      )}

      {/* Popup kết quả */}
      {isFinished && (
        <div className="w-full bg-white p-8 rounded-2xl shadow-xl text-center border-4 border-amber-600 animate-bounce-in mt-4 flex flex-col items-center">
            <div className="mb-4">
                {score > 0 ? <CheckCircle size={64} className="text-green-600" /> : <XCircle size={64} className="text-red-600" />}
            </div>
            <h2 className={`text-3xl font-black mb-2 uppercase ${score > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {score > 0 ? 'Tuyệt vời!' : 'Đáng tiếc!'}
            </h2>
            <p className="text-gray-800 font-bold mb-6 text-xl">{resultMsg}</p>
            <div className="text-center mb-6">
                <span className="block text-sm text-gray-500 mb-1 uppercase tracking-widest">Chân dung anh hùng</span>
                <span className="text-4xl font-black text-amber-900 uppercase flex items-center justify-center gap-3">
                   <Trophy size={32} className="text-amber-500" /> {characterData.name}
                </span>
            </div>
            <div className="flex gap-4">
                <button onClick={() => window.location.reload()} className="btn-historical flex-1 py-3 bg-green-700 text-white rounded-xl">
                    Đoán người khác
                </button>
                <button onClick={() => navigate('/modes')} className="btn-historical flex-1 py-3 bg-amber-900 text-white rounded-xl">
                    Hoàn tất
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
