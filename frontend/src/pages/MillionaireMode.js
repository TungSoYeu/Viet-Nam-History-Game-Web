import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Frown, ArrowLeft, Trophy } from 'lucide-react';

export default function MillionaireMode() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [errorMsg, setErrorMsg] = useState(""); // State mới để báo lỗi ra màn hình

  const [lifelines, setLifelines] = useState({
    fiftyFifty: true,
    skip: true,
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/millionaire/random')
      .then(res => {
          if (!res.ok) throw new Error("Mất kết nối với máy chủ API!");
          return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
            const formatted = data.map(q => ({
                // Phòng trường hợp Schema của bạn dùng 'question' thay vì 'content'
                question: q.content || q.question || "Câu hỏi bị lỗi định dạng",
                options: Array.isArray(q.options) ? q.options : ["A", "B", "C", "D"],
                answer: Array.isArray(q.options) ? q.options.indexOf(q.correctAnswer) : 0
            }));
            setQuestions(formatted);
        } else {
            setErrorMsg("Chưa có câu hỏi Khoa Cử nào trong Database. Bạn đã chạy file seed chưa?");
        }
      })
      .catch(err => {
          console.error("Lỗi fetch:", err);
          setErrorMsg(err.message);
      });
  }, []);

  const saveXP = (xpGained) => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch('http://localhost:5000/api/user/add-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, xp: xpGained })
      }).catch(err => console.log("Lỗi lưu điểm:", err));
    }
  };

  const handleAnswer = (selectedIndex) => {
    // Thêm dấu ? để chống sập nếu questions[currentQ] bị undefined
    const isCorrect = selectedIndex === questions[currentQ]?.answer;

    if (isCorrect) {
      const newScore = score + (currentQ + 1) * 10;
      setScore(newScore);
      setHiddenOptions([]); 
      
      if (currentQ === questions.length - 1) {
        saveXP(newScore + 100); 
        setWon(true);
      } else {
        setCurrentQ(prev => prev + 1);
      }
    } else {
      saveXP(score); 
      setGameOver(true);
    }
  };

  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty || questions.length === 0) return;
    const correctIdx = questions[currentQ]?.answer || 0;
    let wrongOptions = [0, 1, 2, 3].filter(idx => idx !== correctIdx);
    wrongOptions = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
    setHiddenOptions(wrongOptions);
    setLifelines({ ...lifelines, fiftyFifty: false });
  };

  const useSkip = () => {
    if (!lifelines.skip || questions.length === 0) return;
    setHiddenOptions([]);
    setLifelines({ ...lifelines, skip: false });
    if (currentQ === questions.length - 1) {
      saveXP(score);
      setWon(true);
    } else {
      setCurrentQ(prev => prev + 1);
    }
  };

  // 1. NẾU CÓ LỖI (Báo thẳng ra màn hình thay vì trắng bóc)
  if (errorMsg) {
      return (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
              <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full border-4 border-red-600">
                  <h2 className="text-2xl font-black text-red-600 mb-4">Lỗi Hệ Thống</h2>
                  <p className="text-gray-800 font-bold mb-6">{errorMsg}</p>
                  <button onClick={() => navigate('/modes')} className="btn-historical py-3 px-8 w-full">Quay lại</button>
              </div>
          </div>
      );
  }

  // 2. NẾU ĐANG TẢI DỮ LIỆU
  if (questions.length === 0) {
      return (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
              <div className="text-amber-500 font-bold text-2xl animate-pulse">Đang chuẩn bị Đề Thi Khoa Cử...</div>
          </div>
      );
  }

  // 3. NẾU THẮNG HOẶC THUA
  if (won || gameOver) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl border-4 border-amber-600 text-center max-w-md w-full animate-bounce-in flex flex-col items-center">
          <div className="mb-4">
            {won ? <GraduationCap size={80} className="text-green-500" /> : <Frown size={80} className="text-red-500" />}
          </div>
          <h2 className={`text-3xl font-black uppercase mb-2 ${won ? 'text-green-500' : 'text-red-500'}`}>
            {won ? 'Trạng Nguyên Xuất Chúng!' : 'Thi Trượt Khoa Này'}
          </h2>
          <p className="text-gray-300 font-bold mb-6 text-xl">Điểm tổng kết được lưu: <span className="text-amber-400">{score} XP</span></p>
          <div className="flex gap-4">
            <button onClick={() => window.location.reload()} className="flex-1 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700">Thi Lại</button>
            <button onClick={() => navigate('/modes')} className="flex-1 py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700">Thoát</button>
          </div>
        </div>
      </div>
    );
  }

  // 4. MÀN HÌNH CHƠI GAME CHÍNH
  const qData = questions[currentQ];
  // Chống sập nếu qData bị undefined đột ngột
  if (!qData) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Đang tải câu hỏi...</div>;

  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <button onClick={() => { saveXP(score); navigate('/modes'); }} className="text-slate-400 hover:text-white font-bold text-lg flex items-center gap-2 transition-colors">
          <ArrowLeft size={20} /> Thoát (Lấy {score} XP)
        </button>
        <h1 className="text-xl md:text-3xl font-black text-amber-500 uppercase tracking-widest flex items-center gap-3">
            <GraduationCap size={32} /> Khoa Cử Đình Nguyên
        </h1>
      </div>

      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <div className="bg-slate-800 px-4 py-2 rounded-lg border border-amber-700 font-bold text-amber-400 text-xl">
          {score} XP
        </div>
      </div>

      <div className="w-full max-w-3xl mb-8 flex justify-center gap-4">
        <button onClick={useFiftyFifty} disabled={!lifelines.fiftyFifty} className={`px-6 py-3 rounded-full font-black text-lg border-2 ${lifelines.fiftyFifty ? 'bg-blue-600 border-blue-400 hover:bg-blue-700' : 'bg-slate-700 border-slate-600 text-slate-500 line-through'}`}>50:50</button>
        <button onClick={useSkip} disabled={!lifelines.skip} className={`px-6 py-3 rounded-full font-black text-lg border-2 ${lifelines.skip ? 'bg-green-600 border-green-400 hover:bg-green-700' : 'bg-slate-700 border-slate-600 text-slate-500 line-through'}`}>Bỏ Qua</button>
      </div>

      <div className="w-full max-w-3xl bg-slate-800 rounded-3xl p-6 md:p-10 border-4 border-amber-600 shadow-[0_0_30px_rgba(217,119,6,0.3)] relative">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-amber-600 px-6 py-2 rounded-full font-black border-4 border-slate-900 text-white text-lg tracking-widest">
          CÂU HỎI {currentQ + 1}/{questions.length}
        </div>
        <h2 className="text-xl md:text-3xl font-bold text-center mt-6 mb-10 leading-relaxed min-h-[100px] flex items-center justify-center">
          {qData.question}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {qData.options?.map((opt, idx) => (
            <button key={idx} onClick={() => handleAnswer(idx)} disabled={hiddenOptions.includes(idx)} className={`relative p-4 md:p-6 text-left rounded-xl border-2 font-bold text-lg md:text-xl transition-all duration-300 ${hiddenOptions.includes(idx) ? 'opacity-0 invisible' : 'bg-slate-700 border-amber-500/50 hover:bg-amber-600 hover:border-amber-400 text-white shadow-lg active:scale-95'}`}>
              <span className="text-amber-400 mr-3 font-black">{labels[idx]}:</span>{opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}