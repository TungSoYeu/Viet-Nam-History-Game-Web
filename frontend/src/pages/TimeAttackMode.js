import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Questions from '../components/Questions';
import PeriodSelector from '../components/PeriodSelector';
import API_BASE_URL from '../config/api';

export default function TimeAttackMode() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (!selectedPeriod) return;

    setLoading(true);
    const endpoint = selectedPeriod === 'all' 
        ? '/api/questions/all' 
        : `/api/questions/${selectedPeriod}`;

    fetch(`${API_BASE_URL}${endpoint}`)
      .then(res => res.json())
      .then(data => {
        // Shuffle and take only 10 questions for Time Attack Mode
        const sampledQuestions = data
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
        setQuestions(sampledQuestions);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải câu hỏi:", err);
        setLoading(false);
      });
  }, [selectedPeriod]);

  useEffect(() => {
    if (loading || isGameOver || timeLeft <= 0 || !selectedPeriod) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isGameOver, timeLeft, selectedPeriod]);

  // Save accumulated score as XP when game ends
  useEffect(() => {
    if (!isGameOver || score <= 0) return;
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`${API_BASE_URL}/api/user/add-xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, xp: score })
      }).catch(err => console.error("Error saving XP:", err));
    }
  }, [isGameOver, score]);

  const handleAnswer = (userAnswer) => {
    const question = questions[currentIndex];
    const userId = localStorage.getItem('userId');

    fetch(`${API_BASE_URL}/api/submit-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        questionId: question._id, 
        userAnswer, 
        userId, 
        mode: 'timeAttack' 
      })
    })
    .then(res => res.json())
    .then(data => {
      setFeedback(data);
      if (data.correct) {
        setScore(prev => prev + 20 + (combo * 5));
        setCombo(prev => prev + 1);
        // Cộng thêm thời gian cho mỗi câu đúng (3s) + combo bonus
        setTimeLeft(prev => Math.min(120, prev + 3 + Math.floor(combo / 2)));
      } else {
        setCombo(0);
        // Trừ thời gian nếu sai (5s)
        setTimeLeft(prev => Math.max(0, prev - 5));
      }
    });
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsGameOver(true);
    }
  };

  if (!selectedPeriod) {
    return (
      <PeriodSelector 
        title="Thử Thách Nén Nhang"
        description="Hãy chọn thời kỳ bạn am hiểu nhất để chạy đua với thời gian!"
        onSelect={(id) => setSelectedPeriod(id)}
        onBack={() => navigate('/modes')}
      />
    );
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}><div className="text-xl font-bold text-amber-400 animate-pulse">Đang mồi lửa nén nhang...</div></div>;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <p className="text-red-400 mb-4 font-bold">Chưa có dữ liệu câu hỏi cho thử thách này!</p>
        <button onClick={() => navigate('/modes')} className="btn-primary px-6 py-3 text-sm">Quay lại Sa Bàn</button>
      </div>
    );
  }

  if (isGameOver || timeLeft <= 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(239,68,68,0.08) 0%, #1a1a2e 70%)' }}>
        <div className="animate-shake mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.3)' }}>
            <span className="text-4xl">🕯️</span>
          </div>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black mb-3 uppercase text-center" style={{ background: 'linear-gradient(135deg, #fca5a5, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NHANG ĐÃ TÀN!</h2>
        <p className="text-lg sm:text-2xl mb-2 font-bold text-white text-center">Điểm số: <span className="text-amber-400">{score} XP</span></p>
        <p className="text-sm sm:text-base mb-8 italic text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>Vận tốc lật mở sử sách thật đáng nể!</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => window.location.reload()} className="px-8 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}>🔄 Châm Nhang Lại</button>
          <button onClick={() => navigate('/modes')} className="px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>← Về Sa Bàn</button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  // Tính % chiều dài nén nhang (60s mặc định ban đầu là 100%)
  const incenseHeight = (timeLeft / 60) * 100;

  return (
    <div className="p-4 md:p-6 min-h-screen bg-slate-900 text-white relative overflow-hidden flex items-center justify-center">
      {/* Live Wallpaper / Background Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,165,0,0.1)_0%,transparent_70%)] animate-pulse"></div>
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-amber-500/20 blur-xl animate-float"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          ></div>
        ))}
        {/* Time Warp Lines */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[150%] h-[150%] border-[40px] border-amber-600/5 rounded-full animate-spin-slow opacity-30"></div>
            <div className="w-[120%] h-[120%] border-[20px] border-orange-600/5 rounded-full animate-reverse-spin opacity-20"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-center">
        {/* Cột trái: Nén nhang (Incense burning) */}
        <div className="w-full md:w-32 flex flex-row md:flex-col items-center justify-center gap-4 bg-slate-800/50 p-6 rounded-3xl border-2 border-slate-700 shadow-2xl backdrop-blur-sm">
          <div className="text-xs md:text-sm font-black text-amber-500 uppercase md:vertical-text tracking-widest text-center">Nén Nhang Thời Gian</div>
          <div className="w-48 md:w-8 h-8 md:h-96 bg-slate-700 rounded-full overflow-hidden flex flex-row md:flex-col justify-end border-2 border-amber-900/50 p-0.5 relative shadow-inner">
            <div 
              className="h-full md:w-full bg-gradient-to-r md:bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-full transition-all duration-1000 relative shadow-[0_0_15px_rgba(239,68,68,0.5)]"
              style={{ 
                width: window.innerWidth < 768 ? `${Math.min(100, incenseHeight)}%` : '100%',
                height: window.innerWidth >= 768 ? `${Math.min(100, incenseHeight)}%` : '100%' 
              }}
            >
              {/* Đốm lửa đang cháy */}
              <div className="absolute top-0 right-0 md:top-0 md:left-0 w-2 md:w-full h-full md:h-2 bg-white animate-pulse shadow-[0_0_20px_rgba(255,255,255,1)] z-10"></div>
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-black text-red-500 tabular-nums drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">{timeLeft}s</div>
        </div>

        {/* Cột phải: Game Play */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button onClick={() => navigate('/modes')} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold flex items-center gap-2 transition-all border-2 border-slate-700 active:scale-95 shadow-lg">
              <ArrowLeft size={20} /> Thoát (Lấy {score} XP)
            </button>
            <div className="flex gap-4 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none bg-orange-600/20 px-6 py-3 rounded-2xl border-2 border-orange-500/50 backdrop-blur-sm">
                 <span className="text-xs text-orange-400 font-black uppercase tracking-widest block mb-1">Combo Thần Tốc</span>
                 <span className="text-2xl font-black text-orange-500 ml-1">{combo}x</span>
              </div>
              <div className="flex-1 sm:flex-none bg-amber-600/20 px-6 py-3 rounded-2xl border-2 border-amber-500/50 backdrop-blur-sm">
                 <span className="text-xs text-amber-400 font-black uppercase tracking-widest block mb-1">Điểm Tích Lũy</span>
                 <span className="text-2xl font-black text-amber-500 ml-1">{score} XP</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border-4 border-amber-600/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
            
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-12 leading-relaxed italic z-10 px-4 drop-shadow-lg">
              "{currentQuestion.content}"
            </h2>
            
            <div className="w-full z-10">
              <Questions question={currentQuestion} onAnswer={handleAnswer} feedback={feedback} />
            </div>

            {feedback && (
              <div className={`mt-10 p-8 rounded-2xl w-full border-4 animate-bounce-in z-20 backdrop-blur-xl ${feedback.correct ? 'bg-green-600/20 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : 'bg-red-600/20 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]'}`}>
                <p className="font-black text-3xl mb-3 uppercase tracking-wider">{feedback.message}</p>
                {feedback.correct ? (
                  <div className="flex flex-col items-center">
                    <p className="text-green-400 font-black text-xl mb-4 flex items-center gap-2">
                       <span className="animate-ping">🔥</span> +3 GIÂY LINH NGHIỆM!
                    </p>
                    {feedback.explanation && (
                      <p className="text-slate-300 italic mb-6 leading-relaxed max-w-2xl">
                        "Sử ký chép rằng: {feedback.explanation}"
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-red-400 font-black text-xl mb-6 flex items-center gap-2">
                    <span className="animate-shake">⚠️</span> -5 GIÂY TÀN NHANG!
                  </p>
                )}
                <button onClick={nextQuestion} className="px-16 py-4 bg-amber-600 text-white rounded-xl font-black text-xl hover:bg-amber-500 transition-all shadow-[0_10px_20px_rgba(217,119,6,0.3)] flex items-center gap-3 mx-auto justify-center active:scale-95 group">
                  TIẾP THEO <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
